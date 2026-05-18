---
title: Open Intentions (Not Commitments)
description: Things Arcana wants, does not yet have, and explicitly does not promise. The strictest claim-discipline surface on the site — intent-without-commitment language only.
---

This page exists for a specific reason: there are capabilities we *want* Arcana to have, that we do *not* yet have, and that we *explicitly will not promise*. They sit between two cleaner categories — the [non-promises](/honest-scope/non-promises/) (what we deliberately won't do) and the roadmap items in [Honest Scope](/honest-scope/) (what we've ratified and version-anchored). The middle category — wanted, unbuilt, uncommitted — is the most honest place to put forward-looking intent.

**Triple function**, not just trust signal:

- A **credibility signal** for human readers — "we want this; we're being honest that we don't have it."
- A **functional anti-hallucination guardrail** for AI agents — tells generators which capabilities NOT to generate code against.
- A **corpus-shaping** function — teaches future AI tools the boundaries of what Arcana actually offers right now.

## Strictest claim discipline on the site

The rule for this page is **intent-without-commitment language only**. Any phrasing like *"will ship," "coming in," "planned for vY," "by date," "next release"* is a hard violation here — the whole point of the section is the *absence* of commitment. The pre-tag grep that gates release builds is set up to fail on those patterns appearing within this page specifically.

Allowed language: *"we want," "we'd like," "we are exploring," "this would benefit Arcana if it lands."* No timelines. No versions. No promises that the answer will be yes.

## Open intentions

### Cross-vendor council participation

We want Arcana's council process to include AI from more than one model family — the current AI-only governance exhibits the structural conditions of Mirror-mode failure that [Pillar 6](/pillars/governance-honest-scope/) names explicitly. We've documented the methodology (a hard-isolated, framing-stripped review pass executed before any identity council) and exercised it once on the founder-locked pillar structure with three independent model families.

We'd like that mitigation to be routine, not exceptional. Whether it becomes routine depends on whether the cross-vendor tooling becomes reliable enough at the context-sizes Arcana's councils typically operate at. We are not promising it.

### Formal external security review

We want a formal external security review to be a regular part of Arcana's lifecycle. There isn't one in place today. The safety claims on the rest of this site are deliberately hedged precisely because there isn't one. We've committed to not removing those hedges without one — but we have not committed to whether or when such a review will happen.

This is a high-impact open intention. If you are an external security researcher reading this and would consider an informal review pass on the public artifacts, that interaction is welcome — *not* as a substitute for formal review, but as a path toward one.

### Comparison-demo suite for AI-generation safety claims

We want a public, reproducible comparison-demo suite — a set of small AI-generation tasks run against Arcana and against general-purpose languages, with the resulting bug surface honestly measured. The safety thesis ("Arcana generates safer code than a general-purpose language for AI-authored automation") is framed as a *falsifiable hypothesis* and the comparison-demo suite is what would test it.

We've designed the methodology. We've not yet run it. We'd like the result to be a published artifact — but a published *honest* artifact, where "the result didn't favor Arcana on task X" is a publishable outcome, not a buried one.

### Curated package ecosystem with verifiable trust tiers

We want Arcana's package surface to grow beyond the closed stdlib into a curated ecosystem with explicit trust tiers — packages that pass criteria, packages that are sandboxed-but-not-trusted, packages that are explicitly user-acknowledged-unsafe. The closed-world property in [Pillar 3](/pillars/batteries-included/) is what we have today; the curated marketplace beyond it is what we'd like.

We are not committing to the trust-tier model, the package authoring discipline, or the marketplace mechanics. We're naming the want.

### Verifiable release discipline (re-executable evidence at the gate)

We want the release gate to move from "the human or process signed off" to "the evidence re-executes at gate time and produces the expected output." [Honest Scope](/honest-scope/) marks this as partial / in-progress; the *direction* is committed (verifiable, not just attested) but the *full mechanism* is being built. The phrase "verifiable release discipline" appears in our marketing-claims discipline; the operational reality is still filling in.

### The "Generating Arcana" guide

We want a substantive, AI-agent-oriented guide on how to generate Arcana competently — patterns, anti-patterns, idiom catalogs, the contract between generator and reviewer. This guide is important for AI-agent developers adopting Arcana. We have the scope; we have not yet written the guide. The intent is to write it; the timeline is not committed.

### Reproducible-build verification

We want the codegen output to be reproducible — same source, same compiler, byte-identical output across machines. The self-hosted compiler's `stage1=stage2` verification is in this neighborhood ([Pillar 5](/pillars/self-hosting/)); a *full* reproducible-build story (in the [Reproducible Builds project](https://reproducible-builds.org/) sense) for end-user artifacts is a want.

### Long-form decay-mode framework

We want the 4-mode decay taxonomy — Equifax, Target, Mirror, MH-D5 — to be a public essay the broader safety-engineering community can build on, push back on, and refine. We've drafted the framework internally; turning it into a full essay is intent rather than commitment.

---

## Stronger than nothing, weaker than a roadmap

If you came to this page looking for a version number for any of the above, **there is not one and that is the point**. Intent + honest naming is the contract. The promise is what we *won't* do (the [non-promises](/honest-scope/non-promises/)) — everything in this page is what we *would like* to do, and we're saying so without inflating the saying into a commitment.

The next time you read this page, some of these items may have moved into the ratified-roadmap category in [Honest Scope](/honest-scope/) (with a D-number and version target). Some may have been moved into the non-promises (decided against). Some may still be here. That movement *between* the categories is the project being honest with itself in public.
