---
title: Marketing-Claims Ledger
description: Every claim Arcana makes externally is explicitly approved (A-class) or explicitly rejected (R-class). The pre-tag grep enforces the rejections at every release.
---

This is the canonical public record of what Arcana **can** and **cannot** be said to do. Every claim that appears on this site, in articles, in conversations, or in social posts is either explicitly *approved* (an A-class claim that carries a scope hedge) or explicitly *rejected* (an R-class entry the project commits to never using, even in negation).

Enforcement is structural: a pre-tag grep runs over every release-candidate surface and fails the release build if any rejected phrasing appears. The ledger is the boundary; the grep is the check.

The canonical ledger source lives in the Arcana governance record (which publishes alongside the v1.x complete release). What follows is the public-facing summary.

## Approved claims (A-class)

Each A-class claim names *what specific shipped mechanism* backs the claim, the scope hedge that must travel with it, and the surfaces where it's appropriate.

### A1 — Synthetic-violation test corpus discipline

> *"Arcana is one of a small number of production languages whose safety gates carry a synthetic-violation test corpus enforced at every release-gate, with a meta-process auditing whether gates still fire."*

Backed by: the CI gate corpus + the canary-of-canary mechanism (a sentinel test that fails the runner if the runner ever no-ops). Three integrity layers: binary-boundary, source-tree CI corpus, and `make verify` + SHA256SUMS. Safe to cite on technical surfaces (deep-dives, spec-context articles, SecOps-audience material).

### A4 — Effect-widening detection framework

> *"Arcana's spec defines an effect-widening detection framework via the `@widening_acknowledged` annotation and the `arcana audit-effects --diff` CLI; the binary implementation lands in a later release."*

Spec-level reservation is shipped (annotation parser-accepts-but-doesn't-yet-enforce; warning code reserved; baseline schema specified). Binary walker is a later-release deliverable. The version anchor *must* travel with the claim — never "soon" or "coming."

### A6 — Reversibility lives at SDK + policy layer (not language)

> *"Reversibility for `Elemental.*` effects is captured by per-SDK reversibility classification (D160); project-level reversibility policy is declared via `arcana.toml [[effect_policy.reversibility]]` (D219)."*

Backed by: the council decision rejecting reversibility-at-language-layer (P4, unanimous). The R-class equivalents (R8 / R9 / R10) describe shapes the language deliberately does not implement.

### A7 — Hedge-adjacency discipline (meta-claim)

This isn't a claim about Arcana; it's a claim about how Arcana's claims are written. **Every safety claim's scope hedge must be same-sentence or same-line as the claim, never in a footnote.** A claim with a footnote-mounted hedge is flagged as A7-non-compliant and fails the release gate.

This page itself is subject to A7. Every approved claim above carries its scope hedge in the same paragraph.

## Rejected claims (R-class)

Every R-class entry describes a *shape of claim* the project commits to never using — *even in negation*. The pre-tag grep matches these patterns and fails the release build.

### R1–R10 — Rubber-stamp, sentry, reversibility-at-language family

These were ratified by the Cluster A council. Listed as patterns rather than verbatim quotes so the discipline is durable:

- **R1 / R2** — Verb-phrase *detection-or-solution* claims: "Arcana detects effect-widening" (R1) and "Arcana solves the rubber-stamp problem" (R2) are rejected because the v1.7.10 spec carries the framework but the binary walker ships in a later release (per A4 above); no detection-or-solution claim is appropriate until the binary lands. The current honest phrasing is the spec-defines-the-framework framing in A4.
- **R3 / R7** — Noun-phrase *product framings*: "Effect-widening sentry" (R3) and "rubber-stamp prevention" (R7) are rejected because a sentry is a *role*, not a *mechanism*; Arcana provides mechanisms (effect declarations, capability manifests, A1's gate corpus), not roles.
- **R4** — "Arcana monitors bypass behavior." It does not; runtime behavior is outside the language layer.
- **R5** — "Arcana prevents AI-generated unsafe code." The compiler rejects code that violates declared constraints; this is a mechanism description, not the agent-prevention claim.
- **R6** — "Arcana is safe even when reviewers are tired." Operational claims about reviewers' state are outside what a language can support.
- **R8 / R9 / R10** — Anything framing reversibility as a language-layer feature (`reversibility classification`, `detects irreversible operations at compile time`, `annotates effect reversibility`). Per A6 above, reversibility lives at SDK + policy.

### R11 — "PII handling verified before deployment" — moot

This phrasing was proposed for the rejected list but the *target claim never actually existed* on any shipped surface — there was nothing to reject. It remains catalogued so a future generator that hallucinates the phrase is still caught by the grep, but no R11 ledger entry exists in the active rejection record.

### R12 — Unscoped "leaks are impossible" / "no resource leaks" / "structurally impossible to leak"

The approved scoped phrasing names *for what scope*: **"Double-use is a compile error; for Arcana-typed code paths, resource leaks are structurally prevented. Scoped to Arcana-typed paths — does not extend across `Unsafe` FFI boundaries or to native resources owned by the host."** Anything that drops the scope is R12-territory.

### R13 — "If it compiles, it's safe" as declarative fact

The approved framing names it as a **design aspiration that scopes precisely**, with an inline parenthetical listing what's covered (declared effects, affine resources, schema-as-types at compile time; taint coverage scoped per WP-34 §7.1, layered safety per-pillar maturity, `@hermetic` checker-only). Used as a flat statement of fact, R13.

### R14 — Spec §8.2 "Always (no raw strings)" for SQL/XSS — "Arcana statically eliminates XSS and SQL injection"

The approved framing: **"Scoped — common AI-generated patterns are caught at compile time. Sophisticated variants still require explicit `@sanitizer` annotations or runtime sanitization. See WP-34 §7.1."** "Always" or "statically eliminates" overstate coverage — R14.

## How the ledger is enforced

A `git grep` pattern (the **pre-tag grep**) covers every R-class entry and runs on every release-candidate. If any R-class phrasing appears in a release-candidate surface, the release build fails. The pattern includes the canonical phrasings for R1 through R14 — adding new R-class entries requires updating the regex *in the same commit* that ratifies the rejection.

This is what makes the ledger discipline structural rather than aspirational. The grep is the gate.

## Why the discipline matters

Marketing claims that drift past their mechanism's actual scope are the most reliable way for a project's credibility to erode. The pattern is well-attested across the industry: small overclaims accumulate, eventually one of them is exposed, and the *whole* set of claims has to be re-examined. Arcana applies the same discipline to itself that compile-time enforcement applies to AI-generated code — *check at the boundary, refuse to admit drift*.

The ledger is the boundary. The grep is the check.

## See also

- [Honest Scope](/honest-scope/) — per-mechanism status table.
- [Open Intentions (Not Commitments)](/honest-scope/open-intentions/) — wanted but not committed; subject to the strictest of this same discipline.
- [Pillar 6 — Governance & Honest Scope](/pillars/governance-honest-scope/) — the trust mechanisms this ledger lives inside.
