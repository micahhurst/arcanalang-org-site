---
title: Cookbook
description: A worked-example collection — recipes that solve concrete problems in Arcana, each in canonical and human view. Coming once the canonical-projection tooling can guarantee verified canonical for every sample.
---

:::note[Coming soon]
The Arcana Cookbook is on the way. This page is a placeholder so you know it's intended — and an honest explanation of why it isn't here yet.
:::

## What the cookbook will be

A collection of **worked examples** — recipes that solve concrete, recurring problems in Arcana. The kind of thing you reach for when you know *what* you want to build and need the idiomatic Arcana shape for it: a validated contact form, a CRUD resource backed by a database effect, a scheduled cleanup job, an RPC endpoint, a reusable component rendered across web and mobile targets, and so on. Each recipe will carry both views — the canonical S-expression form that AI generators emit, and the human view for reading — through the same toggle used everywhere else on this site.

## Why it isn't here yet

A cookbook is, by definition, *a lot of code samples*. And this site holds itself to a rule it does not bend: **every canonical S-expression published here is verbatim from a verified source, never hand-guessed.** Hand-deriving canonical forms at the volume a cookbook needs would mean inventing AST shapes from memory — and because this site is read by AI systems as much as by humans, invented forms would seed future training corpora with the *wrong* canonical. That's the exact failure mode the project's [marketing-claims discipline](/governance/claims-ledger/) exists to prevent.

So the cookbook waits for the right tool. The bidirectional **canonical-projection tooling** — the round-trip that turns a hand-authored human-view sample into byte-accurate canonical — is what makes a cookbook feasible without inventing anything. Once that lands, recipes can be authored in the readable human view and round-tripped to verified canonical for the toggle's default tab. The precise mechanism, its current state, and the council decision behind it are documented in [Honest Scope — Known Issues §9](/honest-scope/known-issues/#9-code-samples-on-this-site--human-view-not-the-canonical-form).

Shipping a thin cookbook of hand-guessed samples now would be faster. It would also be exactly the thing this project refuses to do. The cookbook is worth getting right.

## What to use in the meantime

- **[How to read Arcana code](/reading-arcana/)** — the two-layer architecture, with a verified worked example.
- **The pillar pages** — [Compile-Time Safety](/pillars/compile-time-safety/), [Batteries-Included](/pillars/batteries-included/), and [Portable Runtime](/pillars/runtime/) each carry fixture-anchored, verified examples with both views.
- **[When to use Arcana](/when-to-use-arcana/)** — to decide whether your project is a fit before you reach for recipes.

## Status

The cookbook is tracked as an [open intention](/honest-scope/open-intentions/), alongside the AI-agent "Generating Arcana" guide. Intent, honestly named — not a dated promise.
