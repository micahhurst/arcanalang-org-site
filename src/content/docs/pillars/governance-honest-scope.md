---
title: Governance & Honest Scope
description: The trust mechanisms that ground Arcana's other five pillars. Three parts — non-promises, the current honest state, open intentions (not commitments) — backed by a public marketing-claims ledger, numbered decision provenance, a multi-party council process, and an explicit Mirror-mode self-disclosure.
---

**The other five pillars are the language. This pillar is what makes the claims about that language trustworthy** — a public marketing-claims ledger, numbered decision provenance, a documented multi-party council process, and an explicit Mirror-mode self-disclosure. Without it, the rest is specification without warrant.

## The honesty triad

Honest scope at Arcana is *three* surfaces that have to be read together, not one:

### 1. What Arcana will *not* do

Explicit non-promises — capabilities deliberately kept out of the language layer, design directions rejected with documented rationale, scope boundaries we won't cross. The non-promises are *the same kind of artifact* as the approved features: numbered, citable, durable.

Examples: Arcana does not annotate effect reversibility at the language layer (rejected by council — reversibility lives at SDK + policy layer instead); Arcana does not detect "rubber-stamping" of effect-widening reviews at the language layer (rejected as a noun-phrase product feature); Arcana does not promise PII-handling verification before deployment (the claim is moot — no shipped surface ever made it).

The non-promises page lists these explicitly, with the decision-record pointer for each. See [Non-Promises](/honest-scope/non-promises/).

### 2. The current honest state

A maintained [`KNOWN-ISSUES`](/honest-scope/known-issues/) disclosure: scoped capabilities, partial layers, where our own process has limits. This is the document we surface first for any serious evaluator — what's known to be partial or limited, before any other claim is read. The disclosure includes:

- Taint analysis coverage gaps (per WP-34 §7.1).
- Per-layer maturity of the four-layer safety stack (Layer 1 shipped; Layers 2-4 partial, named by mechanism).
- Mirror-mode risk in the council governance cycle itself (AI-only review at present; honest disclosure).
- Self-hosting state — codegen output production-quality, verification-harness migration in progress (see [Self-Hosting](/pillars/self-hosting/)).

### 3. Open intentions, not commitments

[Open Intentions](/honest-scope/open-intentions/) is the inverse-polarity counterpart of the non-promises. Where non-promises name *what we deliberately won't do*, open intentions name *what we want, don't yet have, and explicitly will not promise*.

The discipline here is precise: **intent-without-commitment language only**. Any phrasing along the lines of "will ship," "coming in," "planned for vY," "by date," "next release" is a hard violation. The whole point of the section is the *absence* of commitment.

Triple function (not just trust signal):

- **Credibility signal** for human readers — "we want this, we'll be honest that we don't have it."
- **Guardrail for AI code generation** — tells generators which capabilities exist on the wish-list but NOT to generate code against them as if they were shipped.
- **Boundary-setting for future training data** — ensures the next generation of AI tools sees these capabilities labeled correctly in their training corpus.

## What backs the triad

### A public marketing-claims ledger

Every claim Arcana makes externally is **either explicitly approved** (an A-class claim with a documented scope hedge) **or explicitly rejected** (an R-class entry the project commits to never using, even in negation). Approved claims pin to specific shipped mechanisms; rejected claims describe shapes that overclaim scope.

The ledger isn't a thought experiment — it's enforced by a pre-tag grep that fails the release build if a rejected phrasing slips into a release-candidate surface. See [Claims Ledger](/governance/claims-ledger/) for the canonical A-class / R-class list.

### Decision provenance

A numbered record (D-prefixed entries — `D001`, `D002`, …) of every architectural decision the project has made, with full rationale, debate records when applicable, and amendment history. The record is searchable, citable, and durable. When a downstream evaluator asks "why does Arcana do X this way," the answer points at a numbered decision rather than an oral history.

### A documented multi-party council process

Major design decisions go through a structured council process — multiple perspectives, explicit convergence criteria, archived round notes. The process is *itself a documented artifact* (`COUNCIL-PROCESS.md`) rather than implicit practice. The current council format is a 16-perspective unbundled review for substantive decisions, with founder ratification recording the binding choice.

Council process limitations are themselves disclosed (see Mirror-mode below).

### An in-progress move toward release discipline that is *verifiable*

The current release-gate is a multi-mechanism gate (`make release-gate`) that checks for substantive items — spec ambiguity sweep, effect-soundness fuzzing, codegen golden tests, security review, messaging calibration, the `KNOWN-ISSUES.md` disclosure, response readiness. Moving the gate from *attestation-of-presence* to *re-executable evidence* (gate items running their stated checks at release time, not just signing off they ran) is a ratified roadmap item. Honest framing: the discipline exists; the *automation of the discipline* is filling in. See [Claims Ledger](/governance/claims-ledger/) for the current state.

### Synthetic-violation test corpus + meta-process gate audit

The discipline above is backed by a structural mechanism: **every blocking error code carries a synthetic-violation regression test** that runs on every compiler change. A canary-of-canary sentinel fails the runner if the runner ever no-ops — so the project doesn't just trust that "the gate fires"; the gate's continued firing is itself audited. This is the same kind of compile-time-checked discipline Arcana applies to user code, applied recursively to its own release-gate. It's an approved A-class claim in the marketing-claims ledger because the mechanism is shipped and the meta-process is operational, not aspirational.

## Mirror-mode self-disclosure

Arcana's own taxonomy includes a failure mode it names **Mirror-mode** — when an AI generator and an AI reviewer (both trained on overlapping corpora) close a review loop with hallucinated consensus, missing shared blind spots a human or off-corpus reviewer would catch.

The honest disclosure: **the current Arcana council process is staffed by AI from a single model family.** By Arcana's own framework, this exhibits the structural conditions of Mirror-mode failure. The primary mitigation for this release is *the public release itself* — external human readers, security researchers, and AI agents from different model families evaluating the spec, the decision record, and the governance archive provide exactly the off-corpus review that Mirror-mode requires.

We are releasing specifically to get that review. We are *not* claiming the AI-only governance is "fine"; we are saying it exhibits a structural risk our own framework names, and the path to reducing the risk is publication + external review.

## On formal external security review

Review during current development is AI-only; **no formal external security review is in place.** Our safety claims are deliberately hedged today — qualifying their scope, their gaps, and where they don't apply. Those qualifiers stay until a formal external security review independently confirms that broader claims are defensible. We are not committing to when, or whether, such a review will take place — only that the hedges stay until then.

## What this pillar gives every other pillar

Every claim in [Compile-Time Safety](/pillars/compile-time-safety/), [Effect Contracts](/pillars/effect-contracts/), [Batteries-Included](/pillars/batteries-included/), [Runtime](/pillars/runtime/), and [Self-Hosting](/pillars/self-hosting/) is *grounded by* this pillar's discipline. The hedges aren't decoration; they're the contract that lets the unhedged parts hold.
