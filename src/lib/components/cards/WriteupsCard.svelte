<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { cubicOut } from 'svelte/easing';
	import { prefersReducedMotion } from '#lib/camera/index.ts';
	import { CopyLinkButton, WriteupArticle, openWriteup } from '#lib/components/writeups/index.ts';
	import { findWriteup, formatWriteupDate, siteUrl, type Writeup } from '#lib/content/index.ts';

	const DROP_MS = 700;
	let { items }: { items: Writeup[] } = $props();

	// The open writeup lives in the URL (shallow routing), so Back walks the history entry
	const selected = $derived(findWriteup(page.state.writeup));

	// The page drops down from above the binding onto the list, and lifts back up on Back
	// eslint-disable-next-line @typescript-eslint/no-unused-vars -- transitions are always called with the node
	const drop = (_node: Element) => ({
		duration: prefersReducedMotion() ? 0 : DROP_MS,
		easing: cubicOut,
		css: (progress: number) => `transform: translateY(${(1 - progress) * -100}%)`
	});
</script>

<div
	class="relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-md shadow-black/5 max-md:min-h-[32rem]"
>
	<div class="flex flex-1 flex-col p-6 md:p-9">
		<h2
			class="flex -rotate-1 items-baseline gap-3 text-4xl leading-none text-foreground md:text-7xl"
		>
			<span class=" pb-1 font-bold tracking-tight">Rants</span>
			<span class="text-dim">/</span>
			<span class="font-normal">writeups</span>
		</h2>
		<ul class="mt-5 flex flex-1 flex-col justify-between">
			{#each items as item (item.slug)}
				<li class="border-t border-line first:border-t-0">
					<a
						href={resolve('/writeups/[slug]', { slug: item.slug })}
						data-sveltekit-preload-data="eager"
						onclick={(event) => openWriteup(event, item.slug)}
						class="group flex items-baseline gap-4 py-3 md:py-4"
					>
						<span class="min-w-0 flex-1">
							<span
								class="block truncate text-xl text-foreground group-hover:text-accent md:text-3xl"
							>
								{item.title}
							</span>
							<span class="block truncate text-base text-dim md:text-xl">{item.summary}</span>
						</span>
						<time datetime={item.date} class="shrink-0 text-sm text-dim md:text-lg">
							{formatWriteupDate(item.date)}
						</time>
					</a>
				</li>
			{/each}
		</ul>
	</div>

	{#if selected}
		<div
			in:drop
			out:drop
			class="absolute inset-0 flex flex-col gap-6 overflow-y-auto border-t border-line bg-surface p-6 shadow-[0_8px_24px_-8px_rgb(0_0_0/0.3)] md:p-9"
		>
			<div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
				<button
					type="button"
					class="w-fit cursor-pointer text-xl text-accent hover:underline"
					onclick={() => history.back()}
				>
					← Back to list
				</button>
				<div class="flex items-center gap-6">
					<CopyLinkButton url="{siteUrl}/writeups/{selected.slug}" />
					<!-- The writeup's own page, as it looks when you land on it from a link -->
					<a
						href={resolve('/writeups/[slug]', { slug: selected.slug })}
						class="text-xl text-accent hover:underline"
					>
						Open fullscreen ⤢
					</a>
				</div>
			</div>
			<WriteupArticle writeup={selected} headingTag="h3" />
		</div>
	{/if}
</div>
