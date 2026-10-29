<script lang="ts">
	import { Marked } from 'marked';
	import { replaceState } from '$app/navigation';
	import { formatWriteupDate, type Writeup } from '#lib/content/index.ts';

	let { writeup, canonicalUrl }: { writeup: Writeup; canonicalUrl: string } = $props();

	const renderMarkdown = (markdown: string) => {
		const seenIds: Record<string, number> = {};
		const markdownParser = new Marked({
			renderer: {
				heading({ tokens, depth, text }) {
					const inner = this.parser.parseInline(tokens);
					if (depth === 1) return `<h1>${inner}</h1>\n`;

					const baseId =
						text
							.toLowerCase()
							.replace(/[^a-z0-9]+/g, '-')
							.replace(/^-|-$/g, '') || 'section';
					const count = seenIds[baseId] ?? 0;
					seenIds[baseId] = count + 1;
					const id = count === 0 ? baseId : `${baseId}-${count + 1}`;
					return `<h${depth} id="${id}">${inner}<a class="heading-anchor" href="#${id}" aria-label="Copy link to this section">#</a></h${depth}>\n`;
				}
			}
		});
		// The markdown is written by the site author, so its HTML is trusted
		return markdownParser.parse(markdown, { async: false });
	};

	const html = $derived(renderMarkdown(writeup.body));

	let article: HTMLElement;
	let announcement = $state('');

	const copyHeadingLink = async (event: MouseEvent) => {
		const anchor = (event.target as Element).closest<HTMLAnchorElement>('.heading-anchor');
		if (!anchor) return;

		event.preventDefault();
		const hash = anchor.getAttribute('href')!;
		const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
		// eslint-disable-next-line svelte/no-navigation-without-resolve -- only changes the #hash of this page
		replaceState(hash, {});
		article.querySelector(hash)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });

		try {
			await navigator.clipboard.writeText(`${canonicalUrl}${hash}`);
			announcement = 'Link to this section copied to the clipboard';
			anchor.textContent = '✓';
		} catch (error) {
			console.error('Could not copy the section link', error);
			announcement = 'Copy failed';
			anchor.textContent = '✗';
		}
		setTimeout(() => {
			anchor.textContent = '#';
			announcement = '';
		}, 2000);
	};

	$effect(() => {
		void html;
		import('./highlight-code.ts').then(({ highlightCodeBlocks }) => highlightCodeBlocks(article));
	});
</script>

<article bind:this={article} class="flex flex-col gap-6">
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
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	<div class="writeup" onclick={copyHeadingLink}>{@html html}</div>
	<span class="sr-only" aria-live="polite">{announcement}</span>
</article>
