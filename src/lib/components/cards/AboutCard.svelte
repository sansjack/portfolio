<script lang="ts">
	import type { AboutCard } from '#lib/content/index.ts';
	import profile from '#lib/profile.json';
	import Polaroid from './Polaroid.svelte';
	import SocialLinks from './SocialLinks.svelte';

	type Props = Pick<AboutCard, 'heading' | 'tagline' | 'location' | 'links' | 'image' | 'imageAlt'>;

	let { heading, tagline, location, links, image, imageAlt }: Props = $props();

	const emailHref = $derived(links.find(({ icon }) => icon === 'email')?.href);
</script>

<!-- Container queries restack the photo above the text when the card is narrow, as on phones -->
<div class="@container relative h-full">
	<div
		class="flex h-full flex-col items-center gap-6 rounded-xl border border-line bg-surface p-8 shadow-md shadow-black/5 @lg:flex-row @lg:gap-8"
	>
		<Polaroid name={heading} {image} {imageAlt} />

		<div class="flex flex-col items-center gap-3 text-center @lg:items-start @lg:text-left">
			<h1 class="text-5xl leading-none text-foreground">{heading}</h1>
			<p class="text-xl text-foreground">{tagline}</p>
			<p class="text-base text-dim">📍 {location}</p>
			{#if emailHref}
				<!-- The hiring note: a sticky note like the ones on the canvas, tilted, that straightens on hover -->
				<a
					href={emailHref}
					rel="external"
					class="w-fit -rotate-2 bg-note px-3 py-1 text-lg text-note-ink shadow-md shadow-black/15 hover:-translate-y-0.5 hover:rotate-0"
				>
					Hire me?
					<!-- Every phrase is in the prerendered HTML; the script in app.html shows a random one (see layout.css) -->
					<span class="phrases font-semibold">
						{#each profile.hirePhrases as phrase (phrase)}
							<span class="phrase">{phrase}</span>
						{/each}
					</span>
				</a>
			{/if}
			<SocialLinks {links} />
		</div>
	</div>
</div>
