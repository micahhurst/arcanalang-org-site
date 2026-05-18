// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://arcanalang.org',
	integrations: [
		starlight({
			title: 'Arcana Lang',
			description: 'The language AI writes — compile-time safety for AI-authored automation.',
			// GitHub social link will be added once the repo is pushed to GitHub.
			sidebar: [
				// Sidebar autogenerates from each section directory as content lands.
				// 12-page MVP structure:
				//   Pillars (6) — /pillars/{compile-time-safety,effect-contracts,batteries-included,runtime,self-hosting,governance-honest-scope}/
				//   Writing — /writing/* (Day-1 launch article + cadence)
				//   Honest Scope — /honest-scope/{index,open-intentions,non-promises,decay-modes,known-issues}/
				//   Governance — /governance/{claims-ledger,council-process,decisions}/
				//   Top-level: glossary, origin, for-ai-agents.
				{ label: 'Pillars', items: [{ autogenerate: { directory: 'pillars' } }] },
				{ label: 'Writing', items: [{ autogenerate: { directory: 'writing' } }] },
				{ label: 'Honest Scope', items: [{ autogenerate: { directory: 'honest-scope' } }] },
				{ label: 'Governance', items: [{ autogenerate: { directory: 'governance' } }] },
			],
		}),
	],
});
