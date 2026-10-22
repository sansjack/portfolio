<script lang="ts">
	import type { ProjectCard } from '#lib/content/index.ts';
	import { CardBody } from '#lib/components/cards/index.ts';
	import { PILE_STAGGER_MS, PILE_STEP } from '#lib/pile.ts';

	// Every card is the same height so the pile and list heights are simple sums
	const CARD_HEIGHT = 260;
	const CARD_GAP = 16;

	type Props = { projects: ProjectCard[]; expanded: boolean };

	let { projects, expanded = $bindable() }: Props = $props();

	const pileHeight = $derived(CARD_HEIGHT + (projects.length - 1) * PILE_STEP + 16);
	const listHeight = $derived(projects.length * CARD_HEIGHT + (projects.length - 1) * CARD_GAP);
</script>

<!-- All projects in one pile; a tap deals them out into a list. While piled, taps open the pile instead of a link. -->
<section class="flex w-full max-w-md flex-col items-center gap-3">
	<div
		class="relative w-full transition-[height] duration-500 ease-out motion-reduce:transition-none {expanded
			? ''
			: 'cursor-pointer'}"
		style:height="{expanded ? listHeight : pileHeight}px"
		onclickcapture={(event) => {
			if (expanded) return;
			event.preventDefault();
			event.stopPropagation();
			expanded = true;
		}}
	>
		{#each projects as project, index (project.id)}
			<div
				id="mobile-{project.id}"
				class="absolute inset-x-0 scroll-mt-6 transition-[top,transform] duration-[600ms] ease-[cubic-bezier(0.34,1.4,0.64,1)] motion-reduce:transition-none"
				style:height="{CARD_HEIGHT}px"
				style:top="{expanded ? index * (CARD_HEIGHT + CARD_GAP) : index * PILE_STEP}px"
				style:transition-delay="{index * PILE_STAGGER_MS}ms"
			>
				<CardBody card={project} />
			</div>
		{/each}
	</div>
	{#if expanded}
		<button class="text-accent hover:underline" onclick={() => (expanded = false)}>
			Stack projects
		</button>
	{/if}
</section>
