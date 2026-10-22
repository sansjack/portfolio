<script lang="ts">
	import { untrack } from 'svelte';
	import { Camera, fitView, type Size } from '#lib/camera/index.ts';
	import {
		buildLayout,
		EXPERIENCE_HEIGHT,
		POST_MORTEM_PANEL_ID,
		getSection,
		sections,
		type SectionId
	} from '#lib/content/index.ts';
	import { useExperienceState, usePostMortemState } from '#lib/state/index.ts';
	import CardStack from './CardStack.svelte';

	const GRID_SIZE = 32;
	// The fade is the page colour, so it suits both themes
	const FOG_BLUR_MASK = 'radial-gradient(ellipse at center, transparent 62%, black 100%)';
	const FOG_FADE =
		'radial-gradient(ellipse at center, transparent 55%, color-mix(in srgb, var(--color-background) 70%, transparent) 100%)';

	let { activeId }: { activeId: SectionId } = $props();

	const camera = new Camera();
	const experience = useExperienceState();
	const postMortems = usePostMortemState();

	let ready = $state(false);
	let viewport: HTMLElement | null = null;
	let lastWidth = 0;
	// Drives the layout's spacing; 0 until the canvas is measured (it is hidden on phones)
	let viewportWidth = $state(0);
	// What the camera last framed, so the effect only moves it when the framing changes
	let framedKey = '';

	const layout = $derived(
		buildLayout(
			experience.showOlder ? EXPERIENCE_HEIGHT.expanded : EXPERIENCE_HEIGHT.collapsed,
			postMortems.openId,
			viewportWidth
		)
	);

	const framingKey = (): string => `${activeId}:${experience.showOlder}:${postMortems.openId}`;

	const sizeOf = (node: HTMLElement): Size => ({
		width: node.clientWidth,
		height: node.clientHeight
	});

	const frameActiveSection = (animate: boolean) => {
		// A hidden canvas (phone layout) has no size to fit to
		if (!viewport || viewport.clientWidth === 0) return;

		const section = getSection(activeId);
		// Notes are scraps beside the content, not part of what a section frames
		const framedCards = section.cards.filter((card) => card.kind !== 'note');
		const size = sizeOf(viewport);
		const rects = framedCards.map((card) => layout[card.id]);
		if (layout[POST_MORTEM_PANEL_ID]) rects.push(layout[POST_MORTEM_PANEL_ID]);
		const target = fitView(
			rects,
			size,
			section.focusCardId ? layout[section.focusCardId] : undefined,
			section.fill
		);

		framedKey = framingKey();
		if (animate) camera.flyTo(target, size);
		else camera.jumpTo(target);
	};

	// untrack: only the framing key should trigger a move, not everything the move reads
	$effect(() => {
		const key = framingKey();
		untrack(() => {
			if (key !== framedKey) frameActiveSection(true);
		});
	});

	// untrack: an attachment re-runs (and tears down) whenever state it reads changes, so reading
	// activeId/layout here would re-fit instantly on every section change and cancel the camera flight
	const attachViewport = (node: HTMLElement) =>
		untrack(() => {
			viewport = node;
			lastWidth = node.clientWidth;
			viewportWidth = lastWidth;
			frameActiveSection(false);
			ready = true;
			camera.flyIn(sizeOf(node));

			const resizeObserver = new ResizeObserver(() => {
				if (node.clientWidth === lastWidth) return;
				lastWidth = node.clientWidth;
				viewportWidth = lastWidth;
				frameActiveSection(false);
			});
			resizeObserver.observe(node);

			return () => {
				camera.stop();
				resizeObserver.disconnect();
				viewport = null;
			};
		});
</script>

<svelte:head>
	<noscript
		><style>
			main > div {
				opacity: 1 !important;
			}
		</style></noscript
	>
</svelte:head>

<main
	{@attach attachViewport}
	class="fixed inset-0 hidden overflow-hidden md:block"
	style:background-image="radial-gradient(circle, var(--color-line) 1.5px, transparent 1.5px)"
	style:background-size="{GRID_SIZE * camera.view.zoom}px {GRID_SIZE * camera.view.zoom}px"
	style:background-position="{camera.view.x}px {camera.view.y}px"
>
	<div
		class="absolute top-0 left-0 origin-top-left transition-opacity duration-300 {ready
			? 'opacity-100'
			: 'opacity-0'}"
		style:transform="translate({camera.view.x}px, {camera.view.y}px) scale({camera.view.zoom})"
	>
		{#each sections as section (section.id)}
			<CardStack {section} {layout} active={section.id === activeId} animating={camera.animating} />
		{/each}
	</div>

	<div
		class="pointer-events-none absolute inset-0 backdrop-blur-[2px]"
		style:mask-image={FOG_BLUR_MASK}
		aria-hidden="true"
	></div>
	<div
		class="pointer-events-none absolute inset-0"
		style:background={FOG_FADE}
		aria-hidden="true"
	></div>
</main>
