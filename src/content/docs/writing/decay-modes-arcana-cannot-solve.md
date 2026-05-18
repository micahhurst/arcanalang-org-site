---
title: Four decay modes Arcana cannot solve at the language layer
description: How safety gates fail over time — and what categories of failure the language can name but cannot prevent. Extends Jason Iannazzo's Equifax/Target framework with two AI-era additions.
---

A language can refuse to compile unsafe code. A language cannot prevent the *organizational* shapes that let unsafe code reach production anyway. There are categories of gate-failure that no compile-time discipline can solve — and the honest move, when you can name a failure mode you cannot prevent, is to *name it explicitly*. Arcana names four.

The framework starts with a piece of work by [Jason Iannazzo](https://www.linkedin.com/in/jason-iannazzo/) — his observation that the two best-known data-breach failures of the 2010s, **Equifax** and **Target**, failed through structurally different mechanisms even though both had "the right gate technology in place." Arcana extends that observation into a four-mode taxonomy. Two of the four are Jason's; two are Arcana-era additions.

## Equifax-mode — the gate fires, nobody reads

In the 2017 Equifax breach, the vulnerability scanner *did fire*. It produced an alert. The alert went into a queue of alerts that nobody read in time, because the team was buried under alerts that mostly didn't matter, and the one that did mattered didn't have anything making it stand out. The gate worked. The reading-the-gate-output didn't.

This is **Equifax-mode**: the technical detection layer functions correctly, but the organizational layer that's supposed to act on the detection has been overloaded, deprioritized, or simply broken. The signal is there. The reception is not.

**What Arcana can do about it**: nothing at the language layer. The compiler's job ends when it emits the diagnostic. The organizational responsibility to *read the diagnostic* is outside the language's reach. We can make the diagnostic structured rather than prose, machine-readable rather than ANSI-coded — and we do (see the AI-Repair-Loop spoke under [Pillar 2](/pillars/effect-contracts/)). But "make the alert better" doesn't fix "nobody is empowered to act on the alert in time."

Naming Equifax-mode is the language's honest move: yes, we emit signals; no, we do not guarantee they're acted on; that's outside our scope.

## Target-mode — the gate is bypassed for incentive reasons

The 2013 Target breach was different. There wasn't a missed alert. The system was *routed around* — third-party access was given for legitimate reasons (an HVAC vendor needed network access for monitoring), the access was overly broad for incentive reasons (granting tightly-scoped access is more friction than granting broad access, and the friction has no direct line item), and the attacker leveraged the overly-broad access path that nobody had bothered to narrow.

This is **Target-mode**: the gate exists, but the organization has *routed around* it because routing around it has lower friction or higher local reward than going through it. The mechanism may even be invisible from the gate's perspective — the bypass doesn't show up as a gate failure because nothing went through the gate.

**What Arcana can do about it**: even less than Equifax-mode. Target-mode is *fundamentally unobservable at the language layer*. The language cannot tell that someone made an organizational decision elsewhere to avoid the language entirely. If a team uses Arcana for the parts where the type system helps and uses something else for the parts where it would be friction, the language has no visibility into that second category.

Arcana's non-promises include this explicitly: we do not claim to detect or prevent organizational route-arounds. That work belongs to the audit + governance + supply-chain layer, not to the type system.

## Mirror-mode — the new AI-era failure

Jason's framework was written before the AI-code-generation era was fully visible. What's clear now is that AI-mediated code review has a structural failure pattern of its own. Call it **Mirror-mode**:

> An AI generator and an AI reviewer (or two AI reviewers) trained on overlapping corpora close the review loop with hallucinated consensus, missing shared blind spots that a human or off-corpus reviewer would catch.

The mechanism: training data is not random across the model population — many models share substantial training-data lineage. Two models reviewing each other's output are not, in general, independent reviewers. When the same blind spot exists in both models' training, neither will catch the issue the other made. The review *appears* to converge. The convergence is hallucinated.

We discovered this empirically while developing Arcana's own governance process. The council format includes a step where a hard-isolated, framing-stripped review pass is executed by multiple model families to derive identity-level conclusions independent of the project's own framing. The first time we ran that probe (with three independent model families reading the project's behavior record rather than its declared positioning), all three independently flagged a positioning gap the four framed reviews had missed. The structural failure mode is real and it is *operating* in the current AI-mediated review economy.

**What Arcana can do about it**: not solve it at the language layer. Mirror-mode cannot be solved at the language layer *by definition* — the corpus IS the shared-blind-spot mechanism. What the project *can* do:

- Disclose the failure mode explicitly (this essay; the [Pillar 6](/pillars/governance-honest-scope/) self-disclosure).
- Run cross-model-family probes as a mitigation methodology when high-stakes decisions land, even though that's an organizational mitigation, not a language one.
- Publish the spec, decisions, and governance record so external readers and AI agents from *different* corpora can review.

The hedges on Arcana's safety claims are not removable without external review from outside the project's training-corpus reach. That posture is a Mirror-mode mitigation, made structural.

## MH-D5-mode — silent self-regression in a self-hosting compiler

The fourth mode is Arcana-specific: a category of failure observable in self-hosting compilers where the compiler regresses against itself in a way no test surfaces. The name is internal (the bug-incident that surfaced it is logged as MH-D5); the *category* generalizes.

The mechanism: in a self-hosting compiler, the compiler-builds-itself loop can carry forward a regression that the new compiler then *consistently fails to detect*. Each iteration of the bootstrap loop reads the regression as "the expected behavior" because the verifying compiler embodies the regression itself. The bug propagates silently across versions until something *outside the bootstrap loop* — a different compiler reading the output, a different verification method, a human comparing against an older snapshot — exposes the drift.

MH-D5 was a 47-version silent regression. The bug existed; the test didn't fail; the verification path was the bug-carrier.

**What Arcana can do about it**: name the mode, document the mechanism, and structure the verification path to include at least one verification that is *outside the bootstrap loop*. Stage1=stage2 byte-identical verification is one such check. The full mitigation is a research problem — what set of verifications, executed how, escapes the self-hosting echo chamber? — and is honest open work, not solved.

## The shape of the framework

Four modes, two failing where the gate isn't applied (Equifax, Target) and two failing where the gate IS applied but the apparatus that's supposed to verify the gate is itself compromised (Mirror, MH-D5).

| Mode | Where the gate stands | Why it fails |
|---|---|---|
| **Equifax** | Fires | Signal not read in time |
| **Target** | Bypassed | Organizational route-around for incentive reasons |
| **Mirror** | Fires + reviewed | Reviewer shares the generator's blind spots (training-corpus overlap) |
| **MH-D5** | Fires + reviewed | The reviewer *is* the regression (self-hosting echo chamber) |

The fourth-column move — *Arcana cannot solve this at the language layer; here is what we can do* — is the only honest move available. The first move is to name the modes. The second is to disclose, in every release, which mitigations are operational (the AI-Repair-Loop signal quality is the Equifax-mode mitigation; the public release + external review is the Mirror-mode mitigation) and which are not.

## Why this taxonomy matters

A language's safety claims have lifespans. The day after release, every claim about the language is checked once. A year later, the *structural conditions* around the claim have changed — different teams use the language, different review processes, different AI models read it, different threats have emerged. A safety claim that doesn't include a *failure-mode taxonomy of its own* is one that ages poorly: when the next failure happens, the language has no language for explaining how the failure fits into its own design.

Arcana names the four modes because we can. It would be more comfortable to leave them implicit. *Comfortable is not honest.*

This essay sits alongside Arcana's non-promises, the [marketing-claims ledger](/governance/claims-ledger/), and [Open Intentions](/honest-scope/open-intentions/). They're four surfaces of the same discipline: name what we can and cannot do, name how the system fails before someone else has to.

---

*With thanks to Jason Iannazzo, whose original Equifax/Target framing is the intellectual ancestor of this work. The Mirror-mode and MH-D5-mode extensions are Arcana's; the responsibility for any error in extending the original framework is ours, not his.*
