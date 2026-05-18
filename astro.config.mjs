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
				// Sidebar is intentionally minimal for the initial scaffold.
				// Will be replaced with the locked 12-page MVP structure as pages land:
				//   Pillars (6) — /pillars/{compile-time-safety,effect-contracts,batteries-included,runtime,self-hosting,governance-honest-scope}/
				//   Writing — /writing/* (article archive — Day-1 launch piece + cadence)
				//   Honest Scope — /honest-scope/{known-issues,open-intentions,non-promises,decay-modes}/
				//   Governance — /governance/{claims-ledger,council-process,decisions}/
				//   Glossary, Origin, For AI Agents — top-level pages
				{
					label: 'Scaffold (will be replaced)',
					items: [
						{ autogenerate: { directory: 'guides' } },
						{ autogenerate: { directory: 'reference' } },
					],
				},
			],
		}),
	],
});
