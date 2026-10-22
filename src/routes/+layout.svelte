<script lang="ts">
	import './layout.css';
	import { page } from '$app/state';
	import favicon from '#lib/assets/favicon.svg';
	import { ErrorScreen } from '#lib/components/error/index.ts';
	import { Canvas } from '#lib/components/canvas/index.ts';
	import { MobileFeed } from '#lib/components/mobile/index.ts';
	import { SectionNav } from '#lib/components/nav/index.ts';
	import { PullCord } from '#lib/components/theme/index.ts';
	import { loadWriteupStyles } from '#lib/components/writeups/index.ts';
	import { findSectionByParam, siteUrl } from '#lib/content/index.ts';
	import profile from '#lib/profile.json';
	import { provideExperienceState, providePostMortemState } from '#lib/state/index.ts';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	const activeId = $derived(findSectionByParam(page.params.section)?.id ?? 'about');

	// svelte-ignore state_referenced_locally
	const experience = provideExperienceState(activeId);
	// Before the DOM updates, so the camera frames Experience at the height it is about to have
	$effect.pre(() => experience.follow(activeId));

	// The error screen and a writeup's own page stand alone instead of drawing the canvas
	const isStandalone = $derived(Boolean(page.error) || page.route.id === '/writeups/[slug]');

	// Preload the writeup styles as soon as the Writeups section is focused, before a writeup is opened
	$effect(() => {
		if (activeId === 'writeups') loadWriteupStyles();
	});

	const postMortems = providePostMortemState();
	$effect.pre(() => {
		// Read so the panel closes whenever the section changes
		void activeId;
		postMortems.close();
	});

	const personJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: profile.name,
		jobTitle: profile.tagline,
		url: siteUrl,
		image: `${siteUrl}/images/me.jpeg`,
		email: profile.email,
		address: { '@type': 'PostalAddress', addressLocality: profile.location },
		sameAs: profile.socials.filter(({ icon }) => icon !== 'email').map(({ href }) => href)
	}).replaceAll('<', '\\u003c');
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
	<meta name="theme-color" content="#121214" media="(prefers-color-scheme: dark)" />
	<meta name="author" content={profile.name} />
	<!-- eslint-disable-next-line svelte/no-at-html-tags, no-useless-escape -- static data with `<` escaped; `<\/script>` would otherwise end this block -->
	{@html `<script type="application/ld+json">${personJsonLd}<\/script>`}
</svelte:head>

<svelte:window
	onclick={(event) => {
		if (!(event.target as Element).closest('[data-post-mortem]')) postMortems.close();
	}}
	onkeydown={(event) => {
		if (event.key === 'Escape') postMortems.close();
	}}
/>

{#if isStandalone}
	{@render children()}
{:else}
	<!-- A render error anywhere below falls back to a 500 screen instead of a blank page -->
	<svelte:boundary onerror={(error) => console.error(error)}>
		<!-- The canvas lives here, not in the page, so it persists between routes and the camera can fly -->
		<Canvas {activeId} />
		<MobileFeed {activeId} />
		<SectionNav {activeId} />
		{@render children()}

		<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -- reset is the second argument -->
		{#snippet failed(_error, reset)}
			<ErrorScreen
				status={500}
				message="The page failed to render. Reloading usually fixes it."
				onretry={reset}
			/>
		{/snippet}
	</svelte:boundary>
{/if}
<PullCord />
