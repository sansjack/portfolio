<script lang="ts">
	import { prefersReducedMotion } from '#lib/camera/index.ts';
	import { CardBody } from '#lib/components/cards/index.ts';
	import { getSection, lostSection, type ViewId, sections } from '#lib/content/index.ts';
	import ProjectPile from './ProjectPile.svelte';

	// Matches Tailwind's `md`, where the canvas takes over
	const CANVAS_MIN_WIDTH = 768;

	let { activeId }: { activeId: ViewId } = $props();

	const stackedIds = sections.filter((section) => section.stacked).map((section) => section.id);
	let expanded = $state<Record<string, boolean>>(
		Object.fromEntries(stackedIds.map((id) => [id, false]))
	);

	$effect(() => {
		if (matchMedia(`(min-width: ${CANVAS_MIN_WIDTH}px)`).matches) return;

		const firstCard = getSection(activeId).cards[0];
		if (firstCard.kind === 'project') expanded[activeId] = true;
		document
			.getElementById(`mobile-${firstCard.id}`)
			?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
	});
</script>

{#snippet feed()}
	{#each sections as section (section.id)}
		{#if section.stacked}
			<div class="flex w-full max-w-md flex-col gap-6">
				{#each section.cards.filter((card) => card.kind === 'note') as note (note.id)}
					<div class="w-full self-start md:h-36 md:w-64">
						<CardBody card={note} />
					</div>
				{/each}
				<ProjectPile
					projects={section.cards.filter((card) => card.kind === 'project')}
					bind:expanded={expanded[section.id]}
				/>
			</div>
		{:else}
			{#each section.cards as card (card.id)}
				<section id="mobile-{card.id}" class="w-full max-w-md scroll-mt-14">
					<CardBody {card} />
				</section>
			{/each}
		{/if}
	{/each}
{/snippet}

<main
	class="flex min-h-svh flex-col items-center gap-12 px-4 pt-14 pb-28 md:hidden {activeId === 'lost'
		? 'justify-center'
		: ''}"
	style:background-image="radial-gradient(circle, var(--color-line) 1px, transparent 1px)"
	style:background-size="20px 20px"
>
	{#if activeId === 'lost'}
		<section id="mobile-lost" class="h-80 w-full max-w-md scroll-mt-14">
			<CardBody card={lostSection.cards[0]} />
		</section>
	{:else}
		{@render feed()}
	{/if}
</main>
