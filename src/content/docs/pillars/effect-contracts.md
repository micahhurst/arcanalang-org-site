---
title: Effect Contracts & Capability Discipline
description: Effects aren't just a purity device — they're operational contracts that travel from authoring through checking to deployment, drawn from an admission-controlled vocabulary.
---

Effect contracts are Arcana's operational boundary: signatures declare what code may do, the compiler verifies it, and deployment artifacts preserve it for audit. [Compile-Time Safety](/pillars/compile-time-safety/) covers the *mechanism* — the effect system as a type-system feature. This page covers what that mechanism *means operationally*: effects as contracts that travel from the moment a function is written, through the compiler's verification, into the deployment artifact a downstream evaluator can inspect.

Where compile-time-safety says "effects are typed," this view says "and the typing means something specific, governed, and cross-stage."

## Effects as operational contracts, not a purity device

Most effect systems exist to enforce purity — to mark which functions can't do `IO` so the compiler can reorder, inline, or memoize them. Arcana's effect system exists for a different reason: to give an external evaluator (a human reviewing AI-generated code, an AI reviewing AI-generated code, a deployment manifest auditing what's about to ship) confidence about *what a unit of code is permitted to do* without reading its body.

:::note[Code samples below are the human view]
Arcana has two representations: the **canonical S-expression form** that AI emits and the compiler parses, and the **human view** that `arcana view` renders for human readability. The samples below are the human view. See [Known Issues §9](/honest-scope/known-issues/#9-code-samples-on-this-site--human-view-not-the-canonical-form) for a side-by-side reference and the planned dual-view toggle.
:::

```arcana
fn delete_user(id: UserId) -> {Database(server), Audit} Result<Unit, Error> {
  // The signature is the contract. Whatever this body does, it cannot:
  //   - send email (no {Email} declared)
  //   - call out to the network (no {Network} declared)
  //   - write to the filesystem (no {FileSystem} declared)
  //   - perform any other effect not listed above
  // {Audit} is the audit-trail effect (D231, v1.4) — the deletion is
  // recorded in the audit trail; {Monitor} (observability) would be
  // separate if telemetry were also needed.
}
```

The evaluator gets to reason from the signature. The compiler enforces the body matches.

## An admission-controlled effect vocabulary

The set of effect names is a **closed, governed vocabulary**, not a free-for-all. Effects are added, retired, or rejected through a documented process with explicit admission criteria. The current set includes `{Email}`, `{SMS}`, `{CRM}`, `{Network}`, `{Database(local)}` / `{Database(server)}` / `{Database(synced)}`, `{ObjectStore(read)}` / `{ObjectStore(write)}`, `{FileSystem}`, `{Monitor}`, `{Render}` — among others (see the language specification for the full normative inventory; the Arcana repository publishes publicly alongside the v1.x complete release).

Separately, the codegen-target dimensions (Web · iOS · Android · Server · Edge) are tracked through an effect-availability matrix rather than as effects themselves — `{iOS}` is not an effect; iOS is a target that constrains which effects compile to it.

What this admission discipline produces in practice:

- **Effects get rejected**, with documented rationale. `{Notify}` and `{Search}` were proposed and rejected — the project does not invent generic effects to cover everything; it requires concrete justification.
- **Effects get retired**. `{Log}` was retired in favor of a unified `{Monitor}` effect.
- **Effect *parameterization* is constrained**. Object storage splits into `{ObjectStore(read)}` and `{ObjectStore(write)}` because the difference between reading customer data and writing customer data is too important to collapse into one effect name.

The point: a generator (human or AI) cannot just *invent* an effect named `{Whatever}` to silence the compiler. The vocabulary is closed. The check holds.

## Contracts travel: authoring → checking → deployment

The same effect contract appears at three stages of the pipeline:

1. **Authoring** — the function signature declares its effects. This is what the writer (often an AI) commits to.
2. **Checking** — the compiler verifies the body matches the signature. Effect contagion propagates: if function `A` calls function `B` declaring `{Database}`, then `A` must also declare `{Database}` (or contain the effect within a scope the type system permits).
3. **Deployment** — the compiled artifact emits a machine-readable capability manifest *(today: effect-row overflow detection on exported functions; the full manifest payload — effect row per exported function, work-package range, compiler version, configuration content hash, dependency versions — is roadmap, not yet shipped)* describing what every exported function can do, so a deployment manifest auditor (or another piece of software) can verify the binary against the declared shape *without re-running the compiler*. The mechanism exists; the content is filling in.

## The AI-Repair-Loop spoke (machine-readable diagnostics)

Compiler output as a **protocol, not prose**. Every error code carries a stable identifier (E####), a structured message format (`expected X, found Y at location`), and an explicit work-package reference for further reading. The error-code registry is normative — every E/W code follows the same shape.

```
E2020: XSS marker '<script' detected in render output —
  expected sanitized output (use `safe_html` or `@sanitizer`-annotated function),
  found unsanitized string interpolation at templates/profile.arcana:42:18.
  See WP-34 §7.1.9.
```

The intent: turn an AI generator's "the compiler rejected my code" loop from *parse the prose, guess at the fix* into *read the structured payload, apply the named pattern*. The format flag (machine-readable JSON output) ships today. The full agent-grade payload — suggested-fix-as-diff, confidence levels, causal-chain linking between related diagnostics — is a roadmap layer, not yet shipped.

This spoke is what makes Arcana navigable by AI agents rather than just compilable.

## Where this pillar stops (honest hedges)

- **Capability manifest** (`D286`): overflow-detection mechanism shipped; full manifest content is partial. Don't read "machine-readable capability manifest" as "all manifest fields populated today."
- **Structured diagnostics** (`D284`): format and error-code registry shipped; agent-grade fix-as-diff + confidence + causal chains land in a later release.
- **`@hermetic` annotation** (`D285`, as amended by D285a): checker-enforced today — functions annotated `@hermetic` ARE rejected by the compiler if their effect row includes any of the denied effects `{Network, FileSystem, Database, Process}`. Lowering- and emission-level determinism are deferred; this is checker-enforcement of a contract, not a codegen-level determinism guarantee.
- **Effect intersection / policy** (`D219`): the general `[[effect_policy]]` mechanism for SDK-declared intersection rules is approved for a later release; not shipped.

See [Honest Scope](/honest-scope/) for the canonical per-mechanism status table.

## What this pillar gives every other pillar

- **[Compile-Time Safety](/pillars/compile-time-safety/)** is the *mechanism*; this pillar is the *governance and cross-stage propagation* of that mechanism. Read together they describe the full effect-system story.
- **[Batteries-Included](/pillars/batteries-included/)** depends on the admission-controlled vocabulary — the first-class capabilities `{Email}/{SMS}/{CRM}/{Network}/{ObjectStore}/{Monitor}` are governed effects, not arbitrary library calls.
- **[Governance & Honest Scope](/pillars/governance-honest-scope/)** uses the same governance machinery to admission-control the *marketing claims*. The discipline is shared.
