# arcanalang.org — website source

The source for the public Arcana language website at **arcanalang.org**.

Built with [Astro](https://astro.build/) + [Starlight](https://starlight.astro.build/).
Deploys to [Cloudflare Pages](https://pages.cloudflare.com/).

## What's here

This repository contains the *presentation* of Arcana for public readers, AI agents, and external evaluators. The canonical *content* — language specification, design decisions, governance record, marketing-claims ledger — lives in the [Arcana repository](https://github.com/) (link pending). This site renders / curates / cross-references that content into a navigable public surface.

## Status

**Initial scaffold.** Stack and content architecture are locked; pages are landing in subsequent commits. The 12-page MVP target:

- Home (`/`)
- Six pillar pages (`/pillars/{compile-time-safety, effect-contracts, batteries-included, runtime, self-hosting, governance-honest-scope}`)
- Day-1 launch article (`/writing/we-didnt-build-a-language-for-humans-to-write`)
- Honest-scope summary (`/honest-scope/`)
- Claims ledger (`/governance/claims-ledger`)
- Decay-modes essay (`/writing/decay-modes-arcana-cannot-solve`)
- Open Intentions, Not Commitments (`/honest-scope/open-intentions`)

Subsequent pages (glossary, origin, for-AI-agents, additional articles) fill in over the launch week.

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
