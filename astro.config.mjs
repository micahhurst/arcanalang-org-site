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
			favicon: '/favicon.svg',
			expressiveCode: {
				// Arcana doesn't have a Shiki grammar of its own. Use Rust as the
				// nearest visual approximation — Arcana shares Rust's fn/let/mut/->/generics
				// surface enough that Rust's highlighter gives correct keyword + type +
				// comment + string colouring for ~all the code samples on the site.
				// The brand-mark `arcana` lang tag is preserved (no source-file changes).
				shiki: {
					langAlias: { arcana: 'rust' },
				},
			},
			head: [
				// Note: SVG favicon is injected by Starlight's `favicon` option above.
				// Below are PNG fallbacks for browsers without SVG favicon support + apple-touch-icon + OG meta.
				{ tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' } },
				{ tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' } },
				{ tag: 'link', attrs: { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' } },
				{ tag: 'meta', attrs: { property: 'og:image', content: 'https://arcanalang.org/og-image.png' } },
				{ tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
				{ tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
				{ tag: 'meta', attrs: { property: 'og:image:alt', content: 'Arcana Lang — The language AI writes. Compile-time safety for AI-authored automation.' } },
				{ tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
				{ tag: 'meta', attrs: { property: 'og:site_name', content: 'Arcana Lang' } },
				{ tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
				{ tag: 'meta', attrs: { name: 'twitter:image', content: 'https://arcanalang.org/og-image.png' } },
				{ tag: 'meta', attrs: { name: 'twitter:image:alt', content: 'Arcana Lang — The language AI writes. Compile-time safety for AI-authored automation.' } },
			],
			// GitHub social link will be added once the repo is pushed to GitHub.
			components: {
				// Site-wide footer override (TM, copyright, content licensing, scope pointers).
				Footer: './src/components/Footer.astro',
			},
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
