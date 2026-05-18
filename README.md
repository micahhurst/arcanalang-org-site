# arcanalang.org — website source

The source for the public **Arcana Lang** website at **arcanalang.org** (the language is "Arcana Lang" as the brand / formal name; "Arcana" is used in body prose once context is established).

Built with [Astro](https://astro.build/) + [Starlight](https://starlight.astro.build/).
Deploys to [Cloudflare Pages](https://pages.cloudflare.com/).

## What's here

This repository contains the *presentation* of Arcana for public readers, AI agents, and external evaluators. The canonical *content* — language specification, design decisions, governance record, marketing-claims ledger — lives in the Arcana repository (which publishes alongside the v1.x complete release). This site renders / curates / cross-references that content into a navigable public surface.

## Status

**Spec-first publication, v1 — live.** Language specification, design decisions, governance record, marketing-claims ledger, six pillar pages, and the first two launch articles ship at the initial public release. The compiler source and binary follow in a later complete-release phase under FSL-1.1-Apache-2.0.

Pages currently live:

- Home (`/`)
- Six pillar pages (`/pillars/{compile-time-safety, effect-contracts, batteries-included, runtime, self-hosting, governance-honest-scope}/`)
- Honest scope (`/honest-scope/` + `/honest-scope/open-intentions/`)
- Marketing-claims ledger (`/governance/claims-ledger/`)
- Day-1 launch article (`/writing/we-didnt-build-a-language-for-humans-to-write/`)
- Decay-modes essay (`/writing/decay-modes-arcana-cannot-solve/`)
- KNOWN-ISSUES disclosure (`/honest-scope/known-issues/`)

Week-1 fill-ins: glossary, origin, for-AI-agents. Additional writing-cadence articles follow. The consolidated `/honest-scope/non-promises/` page and `/writing/generating-arcana/` guide are tracked as open intentions, not as launch surfaces — they ship alongside the v1.x complete release rather than at the spec-first publication.

## Commands

All commands run from the project root:

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview the production build locally |

## Project structure

```
.
├── astro.config.mjs        # Starlight + site config
├── public/                 # Static assets (favicon, etc.)
├── src/
│   ├── assets/             # Images embedded in content
│   ├── content/
│   │   └── docs/           # Markdown / MDX pages — file path = URL path
│   └── content.config.ts   # Content collection config
├── package.json
└── tsconfig.json
```

## Editorial discipline

Content on this site is subject to the Arcana marketing-claims ledger discipline (R-class rejected phrasings + A-class approved framings). Before any page goes live, it runs through the pre-tag grep regex defined in `governance/marketing-claims-v1.7.10.md` (in the Arcana repo). Hedge-adjacency rule (A7): scope hedges on safety claims must be same-sentence or same-line as the claim, never in a footnote.

## License

The site source (this repo) is published as part of the Arcana project. Content licensing follows the Arcana repository's license stack:

- Language spec, council decisions, governance content → CC BY 4.0
- Examples → CC0 1.0
- (The compiler source and binary, when published, follow under FSL-1.1-Apache-2.0 — in the Arcana repo, not this one.)
