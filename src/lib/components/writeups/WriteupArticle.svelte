<script lang="ts">
	import { marked } from 'marked';
	import { formatWriteupDate, type Writeup } from '#lib/content/index.ts';

	let { writeup }: { writeup: Writeup } = $props();

	// The markdown is written by the site author, so its HTML is trusted
	const html = $derived(marked.parse(writeup.body, { async: false }));
</script>

<article class="flex flex-col gap-6">
	<header class="flex flex-col gap-3">
		<time datetime={writeup.date} class="text-sm text-dim">{formatWriteupDate(writeup.date)}</time>
		<h1 class="text-3xl leading-tight text-foreground md:text-4xl">{writeup.title}</h1>
		<p class="text-base text-dim md:text-lg">{writeup.summary}</p>
		{#if writeup.repo}
			<a
				href={writeup.repo}
				target="_blank"
				rel="external noopener noreferrer"
				class="mt-1 w-fit rounded-full bg-accent px-4 py-1 text-sm text-white transition hover:brightness-110"
			>
				View on GitHub ↗ <span class="sr-only">(opens in a new tab)</span>
			</a>
		{/if}
	</header>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	<div class="writeup">{@html html}</div>
</article>
