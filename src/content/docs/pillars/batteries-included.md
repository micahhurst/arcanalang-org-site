---
title: Batteries-Included, Closed-World by Design
description: The capabilities an AI most often reaches for are first-class language features under a closed-world model — simultaneously a productivity property and a structural anti-supply-chain safety property.
---

The capabilities an AI generator most often reaches for — sending email, sending SMS, syncing a CRM, talking to a database, reading and writing object storage, scheduling work, emitting metrics, declaring data schemas — are **first-class language features** in Arcana, not arbitrary packages to wire up.

This isn't a packaging convenience. It's two simultaneous properties:

- A **productivity property**: the AI writes *intent*, not integration glue. There is no SDK to download, configure, version-pin, mock for tests, and re-pin when it deprecates. The code expresses what it wants to do; the runtime expresses how.
- A **safety property**: a closed world with no arbitrary package-pull is a structural reduction of the supply-chain surface available to AI-generated code *within the safe code path* (Arcana retains an opt-in `Unsafe` FFI escape hatch covered below; the closed-world property applies to the default code path, not as an absolute constraint on what's possible). The 2025-era pattern of an AI generator confidently `npm install`-ing a typosquat or a maintainer-compromised package isn't something the default Arcana surface can do, because the resolution surface that allows it doesn't exist.

These properties reinforce each other: the productivity gain *comes from* the closed-world model. They aren't two separate design moves that happen to coexist.

## First-class effect capabilities

```arcana
fn welcome(user: User) -> {Email, Monitor} Result<Unit, Error> {
  log_info("welcome path", user_id = user.id)        // {Monitor}
  email.send(user.address,
             template = "welcome",
             vars = { name: user.name })             // {Email}
  Ok(())
}
```

No SendGrid SDK. No configured API key threaded through dependency injection. No `.env` to remember. The `{Email}` effect is the contract; the SDK (configured at the deployment boundary) is the implementation. The AI writes *the contract*. The platform supplies *the implementation*. The same applies for `{SMS}`, `{CRM}`, `{Network}`, `{ObjectStore(read/write)}`, `{Monitor}`, scheduled work, and other capabilities (see [Pillar 2](/pillars/effect-contracts/) for the admission-controlled vocabulary).

## Schema-as-types

One declaration becomes types, SQL, and validation:

```arcana
schema User {
  id:    UserId        // refinement-typed, validated
  name:  Username      // String where len ≤ 32
  email: Email
  joined: DateTime
}
```

This single declaration produces:
- The Arcana type (used in function signatures)
- The SQL `CREATE TABLE` (and migrations)
- The input validation at every boundary (form submission, API ingestion)
- The serialization shape

Because there's no drift surface — one declaration, multiple derivatives — there's no opportunity for a generator to get the Arcana type right while accidentally producing a SQL schema that allows null where the type forbids it. This is covered in detail in [Pillar 1](/pillars/compile-time-safety/) as the "schema-as-types" mechanism; it appears in this pillar because the *practical* effect is "batteries included for data modeling," not just a type-system convenience.

## The closed-world stdlib

Arcana ships with a curated standard library and a blessed-library tier rather than an open package ecosystem. This is intentional:

- **Generators don't choose packages.** The capability is reached for by effect (`{Email}`), not by package name (`sendgrid` vs `mailgun` vs `ses-sdk`). The platform decides which implementation backs the effect at deploy time.
- **The supply-chain surface is bounded by construction.** There is no `arcana install <arbitrary>`. An AI generator confidently calling for a fictional or compromised package returns nothing to call.
- **The package-resolution failure mode reverses.** Where mainstream languages fail open (`npm install left-pad` → it just works → security risk), Arcana fails closed (capability not in the closed world → compile error → human decision).

This is the closed-world-assumption-for-AI-safety property: when a generator's training data contains a malicious or hallucinated package, the language doesn't have a surface that lets the package be summoned.

## The "Generating Arcana" guide (an open intention)

The companion to this pillar is a guide for AI agents on how to actually *generate* Arcana competently — idiomatic patterns, common anti-patterns, the contract between generator and reviewer. The guide is currently named in [Open Intentions](/honest-scope/open-intentions/) as a wanted-but-uncommitted artifact, not a shipped one.

## Where this pillar stops (honest hedges)

- **The effect set shipped today** covers the common-case capabilities (the canonical list is documented in the language specification, which publishes alongside the v1.x complete release). Specific effects with limited current coverage — for example, scheduled work, certain `{Monitor}` instrumentation patterns, file-system traversal cases — are honestly documented in the spec rather than hidden.
- **Modules** as first-class language constructs (Folio for blog/CMS, marketplace primitives) are a later-release deliverable. The current closed-world layer is the stdlib + blessed libs; the *modules-as-marketplace* tier follows.
- **Closed-world doesn't mean closed-language.** Arcana has an `Unsafe` escape hatch for FFI to native code when truly needed — but `Unsafe` is opt-in, explicit, and the compiler warns at every use site. The closed-world property holds for the safe surface, not as an absolute constraint on what's possible.

See [Honest Scope](/honest-scope/) for the canonical per-mechanism status.

## What this pillar gives every other pillar

- **[Compile-Time Safety](/pillars/compile-time-safety/)** has more to enforce because first-class effects are typed — there's nothing for safety to "miss" by being routed through an untyped SDK.
- **[Effect Contracts & Capability Discipline](/pillars/effect-contracts/)** is what governs *which* batteries get included. The admission-controlled vocabulary is the discipline behind the closed world.
- **[Governance & Honest Scope](/pillars/governance-honest-scope/)** is what keeps the closed world *honest* — the marketing-claims ledger forbids overclaiming the scope of safety properties, so "no supply-chain surface" is named precisely (within the safe code path, not across `Unsafe`).
