<script lang="ts">
	import type { Rect } from '#lib/camera/index.ts';
	import {
		POST_MORTEM_PANEL_ID,
		sectionParam,
		type Card,
		type Section
	} from '#lib/content/index.ts';
	import {
		PILE_DURATION_MS,
		PILE_EASING,
		PILE_STAGGER_MS,
		PILE_START_DELAY_MS,
		PILE_STEP
	} from '#lib/pile.ts';
	import { prefersReducedMotion } from '#lib/camera/index.ts';
	import { PostMortemPanel } from '#lib/components/cards/index.ts';
	import { playSound, usePostMortemState } from '#lib/state/index.ts';
	import CanvasCard from './CanvasCard.svelte';

	type Props = {
		section: Section;
		layout: Record<string, Rect>;
		active: boolean;
		animating: boolean;
	};

	let { section, layout, active, animating }: Props = $props();

	const postMortems = usePostMortemState();
	const openProject = $derived(
		section.cards.find((card) => card.kind === 'project' && card.id === postMortems.openId)
	);

	const tagPosition = $derived.by(() => {
		const note = section.cards.find((card) => card.kind === 'note');
		if (note) return layout[note.id];

		const cards = section.cards.map((card) => layout[card.id]);
		return {
			x: Math.min(...cards.map((rect) => rect.x)),
			y: Math.min(...cards.map((rect) => rect.y))
		};
	});

	const pileIds = $derived(
		section.stacked
			? section.cards.filter((card) => card.kind === 'project').map((card) => card.id)
			: []
	);

	// As the pile deals out, each card gets a soft cue as it lands, on the same stagger as the animation
	$effect(() => {
		if (!active || pileIds.length === 0 || prefersReducedMotion()) return;

		const timers = pileIds.map((_, index) =>
			setTimeout(
				() => playSound('select'),
				PILE_START_DELAY_MS + index * PILE_STAGGER_MS + PILE_DURATION_MS / 2
			)
		);
		return () => timers.forEach(clearTimeout);
	});

	const pileTransform = (card: Card): string | undefined => {
		const index = pileIds.indexOf(card.id);
		if (index === -1 || active) return undefined;

		const anchor = layout[pileIds[0]];
		const rect = layout[card.id];
		const offsetX = anchor.x - rect.x + index * PILE_STEP;
		const offsetY = anchor.y - rect.y + index * PILE_STEP;
		return `translate(${offsetX}px, ${offsetY}px)`;
	};

	const cardTransition = (card: Card): string => {
		// Experience grows and shrinks with its older roles; the card height follows the same easing
		if (card.kind === 'experience') return animating ? 'height 500ms ease-out' : 'none';

		const index = pileIds.indexOf(card.id);
		if (index === -1) return 'none';
		// Cards pushed along by an open post-mortem panel glide to their new cell
		if (!animating) return 'left 300ms ease-out, top 300ms ease-out';

		const delay = PILE_START_DELAY_MS + index * PILE_STAGGER_MS;
		return `transform ${PILE_DURATION_MS}ms ${PILE_EASING} ${delay}ms`;
	};
</script>

{#if section.tag}
	<span
		class="absolute text-sm text-dim"
		style:left="{tagPosition.x}px"
		style:top="{tagPosition.y - 28}px"
	>
		{section.tag}
	</span>
{/if}

{#each section.cards as card (card.id)}
	<CanvasCard
		{card}
		rect={layout[card.id]}
		{active}
		sectionParam={sectionParam(section)}
		transform={pileTransform(card)}
		transition={cardTransition(card)}
	/>
{/each}

{#if openProject?.kind === 'project' && openProject.postMortem && layout[POST_MORTEM_PANEL_ID]}
	{@const rect = layout[POST_MORTEM_PANEL_ID]}
	<div
		class="absolute animate-rise motion-reduce:animate-none"
		style:left="{rect.x}px"
		style:top="{rect.y}px"
		style:width="{rect.width}px"
		style:height="{rect.height}px"
	>
		<PostMortemPanel
			title={openProject.title}
			href={openProject.href}
			postMortem={openProject.postMortem}
			onclose={() => postMortems.close()}
			class="size-full rounded-lg"
		/>
	</div>
{/if}
