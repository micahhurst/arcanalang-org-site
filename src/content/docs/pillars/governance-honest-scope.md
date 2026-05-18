---
title: Governance & Honest Scope
description: The credibility substrate. Three parts — non-promises, the current honest state, open intentions (not commitments) — backed by a public marketing-claims ledger, decision provenance, a multi-party council process, and an explicit Mirror-mode self-disclosure.
---

This pillar is load-bearing, not decorative. **The other five pillars are the language; this pillar is what makes the language's claims about itself trustworthy.** A project that can enumerate its own scope boundaries is more credible than one that cannot — and the discipline that does the enumerating sits here.

## The honesty triad

Honest scope at Arcana is *three* surfaces that have to be read together, not one:

### 1. What Arcana will *not* do

Explicit non-promises — capabilities deliberately kept out of the language layer, design directions rejected with documented rationale, scope boundaries we won't cross. The non-promises are *the same kind of artifact* as the approved features: numbered, citable, durable.

Examples: Arcana does not annotate effect reversibility at the language layer (rejected by council — reversibility lives at SDK + policy layer instead); Arcana does not detect "rubber-stamping" of effect-widening reviews at the language layer (rejected as a noun-phrase product feature); Arcana does not promise PII-handling verification before deployment (the claim is moot — no shipped surface ever made it).

The non-promises page lists these explicitly, with the decision-record pointer for each. See [Non-Promises](/honest-scope/non-promises/).

### 2. The current honest state

A maintained [`KNOWN-ISSUES`](/honest-scope/known-issues/) disclosure: scoped capabilities, partial layers, where our own process has limits. This is the document an adversarial reader is *meant* to find first — and it's the document we point them at on purpose. The disclosure includes:

- Taint analysis coverage gaps (per WP-34 §7.1).
- Per-layer maturity of the four-layer safety stack (Layer 1 shipped; Layers 2-4 partial, named by mechanism).
- Mirror-mode risk in the council governance cycle itself (AI-only review at present; honest disclosure).
- Self-hosting state — codegen output production-quality, verification-harness migration in progress (see [Self-Hosting](/pillars/self-hosting/)).

### 3. Open intentions, not commitments

[Open Intentions](/honest-scope/open-intentions/) is the inverse-polarity counterpart of the non-promises. Where non-promises name *what we deliberately won't do*, open intentions name *what we want, don't yet have, and explicitly will not promise*.

The discipline here is the strictest on the site: **intent-without-commitment language only**. Any phrasing along the lines of "will ship," "coming in," "planned for vY," "by date," "next release" is a hard violation. The whole point of the section is the *absence* of commitment.

Triple function (not just trust signal):

- **Credibility signal** for human readers — "we want this, we'll be honest that we don't have it."
- **Functional anti-hallucination guardrail** for AI agents — tells generators which capabilities NOT to generate code against.
- **Corpus-shaping** — teaches future AI tools the boundaries.

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

## Mirror-mode self-disclosure

Arcana's own taxonomy includes a failure mode it names **Mirror-mode** — when an AI generator and an AI reviewer (both trained on overlapping corpora) close a review loop with hallucinated consensus, missing shared blind spots a human or off-corpus reviewer would catch.

The honest disclosure: **the current Arcana council process is staffed by AI from a single model family.** By Arcana's own framework, this exhibits the structural conditions of Mirror-mode failure. The primary mitigation for this release is *the public release itself* — external human readers, security researchers, and AI agents from different model families evaluating the spec, the decision record, and the governance archive provide exactly the off-corpus review that Mirror-mode requires.

We are releasing specifically to get that review. We are *not* claiming the AI-only governance is "fine"; we are saying it exhibits a structural risk our own framework names, and the path to reducing the risk is publication + external review.

This is the strongest piece of trust content on the site. We commit to not softening it.

## On formal external security review

Review during current development is AI-only; **no formal external security review is in place.** Our safety claims are deliberately hedged today — qualifying their scope, their gaps, and where they don't apply. Those qualifiers stay until a formal external security review independently confirms that broader claims are defensible. We are not committing to when, or whether, such a review will take place — only that the hedges stay until then.

## What this pillar gives every other pillar

Every claim in [Compile-Time Safety](/pillars/compile-time-safety/), [Effect Contracts](/pillars/effect-contracts/), [Batteries-Included](/pillars/batteries-included/), [Runtime](/pillars/runtime/), and [Self-Hosting](/pillars/self-hosting/) is *grounded by* this pillar's discipline. The hedges aren't decoration; they're the contract that lets the unhedged parts hold.

The credibility substrate is what makes the rest of the language's claims worth reading.
