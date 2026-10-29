<script lang="ts">
	import type { Rect } from '#lib/camera/index.ts';
	import {
		getSection,
		POST_MORTEM_PANEL_ID,
		sectionParam,
		type Card,
		type Section
	} from '#lib/content/index.ts';
	import { fade } from 'svelte/transition';
	import {
		PANEL_OUT_MS,
		PILE_DURATION_MS,
		PILE_EASING,
		PILE_STAGGER_MS,
		PILE_START_DELAY_MS,
		PILE_STEP,
		PUSH_GLIDE_MS,
		pileMotion
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

	const distanceFromAnchor = (cardId: string, anchorId: string): number => {
		const anchor = layout[anchorId];
		const rect = layout[cardId];
		return Math.hypot(anchor.x - rect.x, anchor.y - rect.y);
	};

	const PUSH_GLIDE = `left ${PUSH_GLIDE_MS}ms ease-out, top ${PUSH_GLIDE_MS}ms ease-out`;

	const cardTransition = (card: Card): string => {
		if (card.kind === 'experience') return animating ? 'height 500ms ease-out' : 'none';
		// A card under a pile rides the pile's last card: same delay, duration and easing, over the same distance,
		// so it trails that card at a constant gap whether the pile is opening or closing
		if (section.below) {
			if (!animating) return 'none';
			const pile = getSection(section.below).cards.filter((card) => card.kind === 'project');
			const lastIndex = pile.length - 1;
			const { delay, duration } = pileMotion(
				lastIndex,
				distanceFromAnchor(pile[lastIndex].id, pile[0].id)
			);
			return `top ${duration}ms ${PILE_EASING} ${delay}ms`;
		}

		const index = pileIds.indexOf(card.id);
		if (index === -1) return 'none';
		// Cards pushed along by an open post-mortem panel glide to their new cell. Always on, because opening a
		// panel also flies the camera, and that must not turn the glide off.
		if (!animating) return PUSH_GLIDE;

		const { delay, duration } = pileMotion(index, distanceFromAnchor(card.id, pileIds[0]));
		return `transform ${duration}ms ${PILE_EASING} ${delay}ms, ${PUSH_GLIDE}`;
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
	{#key openProject.id}
		<div
			class="absolute animate-rise motion-reduce:animate-none"
			out:fade|global={{ duration: prefersReducedMotion() ? 0 : PANEL_OUT_MS }}
			style:animation-delay="{PUSH_GLIDE_MS}ms"
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
	{/key}
{/if}
