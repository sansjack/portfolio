<script lang="ts">
	import { asset } from '$app/paths';
	import type { ProjectCard } from '#lib/content/index.ts';
	import { usePostMortemState } from '#lib/state/index.ts';
	import GitBanner from './GitBanner.svelte';
	import IconBanner from './IconBanner.svelte';
	import PostMortemPanel from './PostMortemPanel.svelte';

	type Props = Pick<
		ProjectCard,
		| 'id'
		| 'title'
		| 'status'
		| 'href'
		| 'repo'
		| 'image'
		| 'imageAlt'
		| 'icon'
		| 'accent'
		| 'postMortem'
	>;

	let { id, title, status, href, repo, image, imageAlt, icon, accent, postMortem }: Props =
		$props();

	const postMortems = usePostMortemState();
	const open = $derived(postMortems.openId === id);

	const cardClass =
		'flex h-full flex-col overflow-hidden rounded-lg border border-line bg-panel transition duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:shadow-black/10';
</script>

{#snippet banner()}
	{#if repo}
		<GitBanner {repo} />
	{:else if icon && accent}
		<IconBanner {icon} {accent} />
	{:else if image}
		<img
			src={asset(image as Parameters<typeof asset>[0])}
			alt={imageAlt ?? ''}
			class="h-0 min-h-28 w-full flex-1 object-cover"
			loading="lazy"
			draggable="false"
		/>
	{:else}
		<div class="min-h-28 w-full flex-1 bg-line/40"></div>
	{/if}
{/snippet}

<div class="relative h-full">
	{#if postMortem}
		<!-- Not a link: only the toggle opens the panel, which holds the link out -->
		<div class="relative {cardClass}">
			{@render banner()}
			<div class="flex flex-col gap-2 p-5">
				<h2 class="text-2xl leading-none text-foreground">{title}</h2>
				<button
					type="button"
					class="cursor-pointer pt-2 text-left text-sm text-dim hover:text-accent"
					data-post-mortem
					aria-expanded={open}
					onclick={() => postMortems.toggle(id)}
				>
					{status} · Why it failed {open ? '◂' : '▸'}
				</button>
			</div>
		</div>

		<!-- Phones get a bottom sheet; on the canvas the panel is a grid cell drawn by CardStack -->
		{#if open}
			<PostMortemPanel
				{title}
				{href}
				{postMortem}
				onclose={() => postMortems.close()}
				class="fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] animate-rise rounded-t-2xl pb-[max(1.25rem,env(safe-area-inset-bottom))] motion-reduce:animate-none md:hidden"
			/>
		{/if}
	{:else}
		<a {href} target="_blank" rel="external noopener noreferrer" class={cardClass}>
			{@render banner()}
			<div class="flex flex-col gap-2 p-5">
				<h2 class="text-2xl leading-none text-foreground">
					{title}
					<span class="sr-only">(opens in a new tab)</span>
				</h2>
				{#if repo}
					<p class="line-clamp-3 text-dim">{repo.description}</p>
					<p class="flex items-center gap-3 pt-2 text-sm text-dim">
						<span>{repo.language}</span>
						{#if repo.stars > 0}<span>★ {repo.stars}</span>{/if}
						<span class="ml-auto" aria-hidden="true">↗</span>
					</p>
				{:else}
					<p class="pt-2 text-sm text-dim">{status}</p>
				{/if}
			</div>
		</a>
	{/if}
</div>
