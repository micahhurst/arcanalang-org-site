// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://arcanalang.org',
	// The decay-modes essay's filename slug differs from its title; humans and AI agents
	// who slugify the page title land on a non-existent URL. Bounce them to the real page.
	redirects: {
		'/writing/decay-modes-arcana-cannot-solve-at-the-language-layer/':
			'/writing/decay-modes-arcana-cannot-solve/',
	},
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
				// Sidebar order is PEDAGOGICAL, not alphabetical. Pillars are explicitly enumerated
				// in concrete → abstract → meta order so a first-time reader following the sidebar
				// hits accessible content first. Don't switch back to autogenerate without rethinking
				// the read order.
				{ label: 'Reading Arcana', link: '/reading-arcana/' },
				{ label: 'When to Use Arcana', link: '/when-to-use-arcana/' },
				{ label: 'Glossary', link: '/glossary/' },
				{
					label: 'Pillars',
					items: [
						{ label: 'Batteries-Included, Closed-World by Design', link: '/pillars/batteries-included/' },
						{ label: 'Effect Contracts & Capability Discipline', link: '/pillars/effect-contracts/' },
						{ label: 'Compile-Time Safety', link: '/pillars/compile-time-safety/' },
						{ label: 'Portable Runtime & Execution', link: '/pillars/runtime/' },
						{ label: 'Self-Hosting & Determinism', link: '/pillars/self-hosting/' },
						{ label: 'Governance & Honest Scope', link: '/pillars/governance-honest-scope/' },
					],
				},
				{ label: 'Writing', items: [{ autogenerate: { directory: 'writing' } }] },
				{ label: 'Cookbook', link: '/cookbook/', badge: { text: 'Soon', variant: 'note' } },
				{ label: 'Honest Scope', items: [{ autogenerate: { directory: 'honest-scope' } }] },
				{ label: 'Governance', items: [{ autogenerate: { directory: 'governance' } }] },
			],
		}),
	],
});
