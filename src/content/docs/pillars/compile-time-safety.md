---
title: Compile-Time Safety
description: The irreducible pillar — effect system, affine resource types, refinement types, and scoped data-flow analysis. The foundation every other pillar rests on.
---

Compile-time safety is Arcana's irreducible core. Every other pillar — effect contracts, batteries-included capabilities, the portable runtime, self-hosting, governance — rests on what the type system can statically prove *before code runs*.

The premise: side effects and resource discipline are enforced by the type system, not by convention. If a generator (human or AI) writes code that would violate a declared safety constraint, the compiler rejects it before the code reaches the runtime.

## What the compiler enforces today

### Effect system

Every function declares the side effects it performs. Effects are first-class citizens of the type system — they appear in function signatures, they propagate through call chains, and they're drawn from a closed, governed vocabulary (effects are added, retired, or rejected through a documented process, not invented ad-hoc).

:::note[Code samples below are the human view]
Arcana has two representations: the **canonical S-expression form** that AI emits and the compiler parses, and the **human view** that `arcana view` renders for human readability. The samples below are the human view. See [Known Issues §9](/honest-scope/known-issues/#9-code-samples-on-this-site--human-view-not-the-canonical-form) for a side-by-side reference and the planned dual-view toggle.
:::

```arcana
// From the spec: Database + observability effects declared in signature
fn getUser(id: UserId) -> {Database, Monitor} Option<User> {
  log("Fetching user #{id}")                  // {Monitor}
  query User where id == id |> first          // {Database}
}

// Pure function — no effects declared. Calling an effectful function
// from here is a compile error: the declared effect row is empty.
fn add(a: Int, b: Int) -> Int { a + b }
```

This is what gives an evaluator — a human reader, an AI reviewer, a deployment manifest — confidence about *what a unit of generated code is permitted to do* without reading its body. The effect row is the contract.

### Affine resource types

A resource handle — a database connection, a file handle, an open HTTP response, an API session — must be consumed exactly once. **Double-use of a resource handle is a compile error. Undeclared drop is a compile error.** The check operates on Arcana-typed values and does not extend across `Unsafe` FFI boundaries or to native resources owned by the host runtime — those remain the host's responsibility.

```arcana
// From the spec: affine consume-then-drop pattern
fn process_order(conn: DbConnection) -> {Database} Order {
  let tx = conn.begin()      // conn consumed, tx created
  let order = tx.insert(Order { ... })
  tx.commit()                // tx consumed — cannot use again
  order
}
// conn and tx are automatically cleaned up — compiler enforces affine Drop at scope exit.
// Attempting `tx.insert(...)` after `tx.commit()` is an E6010 [AFFINE-USE-AFTER-MOVE] error.
```

The affine discipline catches a class of bugs that no amount of testing reliably catches in mainstream languages: forgotten close, double-close, leaked connection on an error path. The compiler refuses to emit the program.

### Refinement types (scoped)

Refinement types narrow a base type with a predicate that must hold at every use site. A `Username = String where len ≤ 32` is a `String` that *cannot* hold a 40-character value — the compiler enforces the predicate everywhere a `Username` is consumed, *scoped to the predicate forms currently supported by the implementation* (general-predicate refinement remains roadmap, not uniformly shipped). This catches a class of input-validation bugs at the type level rather than at runtime.

The current predicate subset is documented in the language specification (which publishes publicly alongside the v1.x complete release).

### Compile-time data-flow / taint analysis (scoped)

Interprocedural taint analysis tracks how untrusted input flows through the program toward sinks — SQL queries, HTML templates, system calls. Common AI-generated injection patterns (direct interpolation of user input into a SQL string, unsanitised rendering into HTML) are caught at compile time *within the coverage map documented in the spec* — sophisticated variants (encoding-encoded injection, ORM-bypass, JSX-style attribute injection, and the rest of the named gap list below) still require explicit `@sanitizer` annotations or runtime sanitization at the boundary. (Throughout this page, **WP-#** refers to a numbered Work Package in the Arcana language specification; **D#** to a numbered design decision in the project's public decision record.)

```arcana
// From the spec gate-corpus: synthetic-violation that MUST emit E2020
@should_not_compile(tier: SEMANTICS, code: E2020)
pub fn render_user_name(name: String) -> Html {
    html"<div>{name}</div>"  // unescaped interpolation — XSS surface
}
// → E2020: XSS marker detected in render output
// (Scoped: substring match against canonical markers; HTML-entity-encoded
//  and other sophisticated variants are NOT caught at this layer — see
//  WP-34 §7.1 for the current coverage map and disclosed gaps.)
```

This coverage is **explicitly scoped**, not comprehensive. The gap list is named in the specification rather than hidden:

- Struct-field aliasing (`s.field = user_input`)
- Container / array-element aliasing
- `mut` re-assignment + dataflow on mutation
- Closure capture across non-resolvable indirect calls (currently conservative `FULL_TAINT`)
- Higher-order-function taint propagation
- HTML-entity encoding variants, case variants (`<ScRiPt>`), JSX-style attribute interpolation, event-handler attribute injection
- SQL concat-build patterns without typed-binding, ORM-bypass patterns

Sophisticated variants still require explicit `@sanitizer` annotations on the code path, or runtime sanitization at the boundary. The compile-time check catches what's reproducibly catchable; the remainder is named explicitly so it's not assumed.

### Schema-as-types

One schema declaration becomes types + SQL + validation. A `schema User { name: Username, email: Email, ... }` declaration generates the Arcana type, the SQL `CREATE TABLE`, and the input-validation code — any drift between them is a compile error rather than a runtime mystery, because there is no drift surface: one declaration, three derivatives.

## "If it compiles, it's safe" — what it means here

This phrase is Arcana's design aspiration, and it scopes precisely. It means: **compile-time enforcement of declared effects, affine resource tracking, schema-as-type checks, and the common-pattern subset of taint analysis named above (per WP-34 §7.1).** It does *not* mean coverage the implementation has not yet uniformly provided. The aspiration is not a blanket guarantee; the [Honest Scope](/honest-scope/) section names what's covered and what isn't.

## On the roadmap (not yet implemented)

- **Effect intersection / policy** (D219) — the general `[[effect_policy]]` mechanism for SDK-declared intersection rules. Approved for a later release; not yet shipped.
- **Full interprocedural dataflow** beyond the named gaps above — per-gap roadmap in WP-34 §7.1.
- **Refinement-type general predicates** — broader predicate forms beyond the currently-shipped constructor subset.

These are intent, not commitment. See the *Planned ≠ committed* note in [Honest Scope](/honest-scope/).

## What this pillar gives every other pillar

- **[Effect Contracts & Capability Discipline](/pillars/effect-contracts/)** rests on the effect system above — the contracts that travel from authoring through checking to deployment are typed using this layer.
- **[Batteries-Included](/pillars/batteries-included/)** is safer because the first-class effect capabilities `{Email}/{SMS}/{CRM}/{Network}/{ObjectStore}/{Monitor}` are enforced through the effect system, not bolted onto an untyped surface.
- **[Governance & Honest Scope](/pillars/governance-honest-scope/)** is honest because *this* layer carries the actually-shipped guarantees — the marketing-claims ledger's approved claims pin to mechanisms named on this page; the rejected claims are the over-aggregating shapes this layer cannot honestly support.

See [Honest Scope](/honest-scope/) for the canonical disclosure of what's bounded, what's gapped, and where the boundaries currently are.
