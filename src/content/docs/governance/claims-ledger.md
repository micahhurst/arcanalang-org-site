---
title: Marketing-Claims Ledger
description: "A pre-tag grep is the manual release-prep step that catches rejections; automated wire-up is committed for v1.7.8 (D482). Note: this description previously stated automated enforcement; corrected 2026-05-19 — see D482."
---

This is the canonical public record of what Arcana **can** and **cannot** be said to do. Every claim that appears on this site, in articles, in conversations, or in social posts is either explicitly *approved* (an A-class claim that carries a scope hedge) or explicitly *rejected* (an R-class entry the project commits to never using, even in negation).

Enforcement is documented as a release-prep protocol: the canonical regex covering every R-class entry lives in the Arcana governance record (`marketing-claims-v1.7.10.md`) and is run over release-candidate surfaces as part of release prep. Wiring this regex into `make release-gate` so a violation fails the release build automatically — rather than being caught by manual operator invocation — is a ratified roadmap item being staged through the council process; the discipline exists at the protocol level today and the automation is filling in.

The canonical ledger source lives in the Arcana governance record (which publishes publicly alongside the v1.x complete release). What follows is the public-facing summary.

## Approved claims (A-class)

Each A-class claim names *what specific shipped mechanism* backs the claim, the scope hedge that must travel with it, and the surfaces where it's appropriate.

### A1 — Synthetic-violation test corpus discipline

> *"Arcana is one of a small number of production languages whose safety gates carry a synthetic-violation test corpus enforced at every release-gate, with a meta-process auditing whether gates still fire."*

Backed by: the CI gate corpus + the canary-of-canary mechanism (a sentinel test that fails the runner if the runner ever no-ops). Three integrity layers: binary-boundary, source-tree CI corpus, and `make verify` + SHA256SUMS. Safe to cite on technical surfaces (deep-dives, spec-context articles, SecOps-audience material).

### A4 — Effect-widening detection framework

> *"Arcana's spec defines an effect-widening detection framework via the `@widening_acknowledged` annotation and the `arcana audit-effects --diff` CLI; the binary implementation lands in a later release."*

Spec-level reservation is shipped (annotation parser-accepts-but-doesn't-yet-enforce; warning code reserved; baseline schema specified). Binary walker is a later-release deliverable. The version anchor *must* travel with the claim — never "soon" or "coming."

### A6 — Reversibility lives at SDK + policy layer (not language)

> *"Reversibility for SDK-defined effects is captured by per-SDK reversibility classification (D160); project-level reversibility policy is declared via `arcana.toml [[effect_policy.reversibility]]` (D219)."*

Backed by: the council decision rejecting reversibility-at-language-layer (P4, unanimous). The R-class equivalents describe shapes the language deliberately does not implement.

### A7 — Hedge-adjacency discipline (meta-claim)

This isn't a claim about Arcana; it's a claim about how Arcana's claims are written. **Every safety claim's scope hedge must be same-sentence or same-line as the claim, never in a footnote.** A claim with a footnote-mounted hedge is A7-non-compliant. Release engineers must catch and correct A7 violations during release prep; automated A7 wire-up is tracked separately (see governance/audit-reports/ open issues) — the v1.7.8 R-class wire-up (D482) is independent.

This page itself is subject to A7. Every approved claim above carries its scope hedge in the same paragraph.

## Rejected claims (R-class)

Every R-class entry describes a *shape of claim* the project commits to never using — *even in negation*. The pre-tag grep matches these shapes; release engineers run it manually during release prep and block ship on any hit. Automated wire-up into `make release-gate` is committed for v1.7.8 (D482).

### Intentional verbatim-phrasing omission

This public summary names the *shapes* of rejected claims but deliberately does **not** quote the canonical verbatim phrasings. Publishing the exact rejected wordings alongside "Arcana" — even framed as "Arcana does not say this" — would seed AI training corpora with the rejected phrasings as Arcana-adjacent text, which is the corpus-shaping anti-pattern [Governance & Honest Scope](/pillars/governance-honest-scope/) names explicitly. The canonical pre-tag grep patterns, including verbatim phrasings, live in the Arcana governance record (publishes publicly alongside the v1.x complete release) where they're useful for the build gate without being publicly indexed.

### R1–R10 — Rubber-stamp, sentry, reversibility-at-language family

Ratified by the Cluster A council:

- **R1 / R2** — *Verb-phrase detection-or-solution claims* about effect-widening or rubber-stamp problems. Rejected because the v1.7.10 spec carries the framework but the binary walker ships in a later release (per A4 above); no detection-or-solution claim is appropriate until the binary lands. The current honest phrasing is the spec-defines-the-framework framing in A4.
- **R3 / R7** — *Noun-phrase product framings* (sentry-class words for effect-widening; "prevention" framings for rubber-stamp). Rejected because a sentry is a *role*, not a *mechanism*; Arcana provides mechanisms (effect declarations, capability manifests, A1's gate corpus), not roles.
- **R4** — *Claims that Arcana monitors runtime bypass behavior.* It does not; runtime behavior is outside the language layer.
- **R5** — *Agent-prevention claims about AI-generated unsafe code.* The compiler rejects code that violates declared constraints; this is a mechanism description, not an agent-prevention claim.
- **R6** — *Operational claims about reviewers' state.* Outside what a language can support.
- **R8 / R9 / R10** — *Reversibility-at-the-language-layer framings.* Per A6 above, reversibility lives at SDK + policy.

### R11 — PII-handling verification claims — moot

This shape was proposed for the rejected list but the *target claim never actually existed* on any shipped surface — there was nothing to reject. It remains catalogued so a future generator that hallucinates the phrasing is still caught by the grep, but no R11 ledger entry exists in the active rejection record.

### R12 — Unscoped absolute claims about resource safety

Unscoped framings ("absolute impossibility" shapes around resource leaks) are rejected. The approved scoped phrasing names *for what scope*: **"Double-use is a compile error; for Arcana-typed code paths, resource leaks are structurally prevented. Scoped to Arcana-typed paths — does not extend across `Unsafe` FFI boundaries or to native resources owned by the host."** Anything that drops the scope is R12-territory.

### R13 — "Safety-by-compile" as flat declarative fact

Used as a declarative fact, this shape is rejected. The approved framing names it as a **design aspiration that scopes precisely**, with an inline parenthetical listing what's covered (declared effects, affine resources, schema-as-types at compile time; taint coverage scoped per WP-34 §7.1, layered safety per-pillar maturity, `@hermetic` checker-only).

### R14 — Absolute injection-class elimination claims

*"Always"* or *"statically eliminates"* framings around SQL injection or XSS overstate coverage and are rejected. The approved framing: **"Scoped — common AI-generated patterns are caught at compile time. Sophisticated variants still require explicit `@sanitizer` annotations or runtime sanitization. See WP-34 §7.1."**

## How the ledger is enforced

A `git grep` pattern (the **pre-tag grep**) covers every R-class entry. The pattern itself — including the canonical verbatim phrasings it matches — lives in the Arcana governance record (`marketing-claims-v1.7.10.md`, which publishes publicly alongside the v1.x complete release). The grep is currently run as a release-prep protocol step rather than as an automated gate in `make release-gate`; wiring it into the automated gate is a ratified roadmap item being staged through the council process. Adding new R-class entries requires updating the regex *in the same commit* that ratifies the rejection.

This is what makes the ledger discipline structural rather than aspirational. The grep is the gate (manually invoked at release prep; automation committed for v1.7.8 per D482).

## Why the discipline matters

Marketing claims that drift past their mechanism's actual scope are the most reliable way for a project's credibility to erode. The pattern is well-attested across the industry: small overclaims accumulate, eventually one of them is exposed, and the *whole* set of claims has to be re-examined. Arcana applies the same discipline to itself that compile-time enforcement applies to AI-generated code — *check at the boundary, refuse to admit drift*.

The ledger is the boundary. The grep is the check.

## See also

- [Honest Scope](/honest-scope/) — per-mechanism status table.
- [Open Intentions (Not Commitments)](/honest-scope/open-intentions/) — wanted but not committed; subject to the strictest of this same discipline.
- [Governance & Honest Scope](/pillars/governance-honest-scope/) — the trust mechanisms this ledger lives inside.
