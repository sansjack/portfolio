<script lang="ts">
	import { marked } from 'marked';
	import { formatWriteupDate, type Writeup } from '#lib/content/index.ts';

	type Props = { writeup: Writeup; headingTag: 'h1' | 'h3' };

	let { writeup, headingTag }: Props = $props();

	// The markdown is written by the site author, so its HTML is trusted
	const html = $derived(marked.parse(writeup.body, { async: false }));
</script>

<article class="flex flex-col gap-6">
	<header class="flex flex-col gap-3">
		<time datetime={writeup.date} class="text-lg text-dim">{formatWriteupDate(writeup.date)}</time>
		<svelte:element this={headingTag} class="text-4xl leading-none text-foreground md:text-6xl">
			{writeup.title}
		</svelte:element>
		<p class="text-xl text-dim md:text-2xl">{writeup.summary}</p>
		{#if writeup.repo}
			<a
				href={writeup.repo}
				target="_blank"
				rel="external noopener noreferrer"
				class="mt-1 w-fit rounded-full bg-accent px-5 py-1.5 text-lg text-white transition hover:brightness-110"
			>
				View on GitHub ↗ <span class="sr-only">(opens in a new tab)</span>
			</a>
		{/if}
	</header>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	<div class="writeup">{@html html}</div>
</article>
