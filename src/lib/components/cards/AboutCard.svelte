<script lang="ts">
	import type { AboutCard } from '#lib/content/index.ts';
	import Polaroid from './Polaroid.svelte';
	import SocialLinks from './SocialLinks.svelte';

	type Props = Pick<
		AboutCard,
		'heading' | 'tagline' | 'location' | 'availability' | 'links' | 'image' | 'imageAlt'
	>;

	let { heading, tagline, location, availability, links, image, imageAlt }: Props = $props();
</script>

<!-- Container queries restack the photo above the text when the card is narrow, as on phones -->
<div class="@container relative h-full">
	<span class="absolute -top-6 left-1 text-sm text-dim">About</span>
	<div
		class="flex h-full flex-col items-center gap-6 rounded-xl border border-line bg-surface p-8 shadow-md shadow-black/5 @lg:flex-row @lg:gap-8"
	>
		<Polaroid name={heading} {image} {imageAlt} />

		<div class="flex flex-col items-center gap-3 text-center @lg:items-start @lg:text-left">
			<h1 class="text-5xl leading-none text-foreground">{heading}</h1>
			<p class="text-xl text-foreground">{tagline}</p>
			<div class="flex flex-col gap-1 text-base text-dim">
				<p>📍 {location}</p>

				<p>💼 {availability}</p>
			</div>
			<SocialLinks {links} />
		</div>
	</div>
</div>
