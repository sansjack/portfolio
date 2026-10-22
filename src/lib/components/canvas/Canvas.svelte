<script lang="ts">
	import { untrack } from 'svelte';
	import {
		Camera,
		constrainView,
		fitView,
		type Size,
		worldBounds,
		zoomViewAt
	} from '#lib/camera/index.ts';
	import {
		buildLayout,
		EXPERIENCE_HEIGHT,
		getSection,
		POST_MORTEM_PANEL_ID,
		type ViewId,
		lostSection,
		sections
	} from '#lib/content/index.ts';
	import { useExperienceState, usePostMortemState } from '#lib/state/index.ts';
	import CardStack from './CardStack.svelte';

	const GRID_SIZE = 32;
	// The tightest the dense dot layer may get on screen, in px, before it has fully faded out
	const MIN_GRID_SCREEN_PX = 10;
	// Empty canvas the visitor can pan into beyond the outermost cards, in canvas px
	const WORLD_MARGIN = 500;
	// No man's land is a big empty void around the lost card, so the visitor can drift but never finds an edge quickly
	const LOST_WORLD_MARGIN = 1500;
	// Wheel zoom speed; a trackpad pinch arrives as a ctrl+wheel with much smaller deltas
	const WHEEL_ZOOM_SPEED = 0.0015;
	const PINCH_ZOOM_SPEED = 0.01;
	const WHEEL_LINE_PIXELS = 16;
	// The fade is the page colour, so it suits both themes
	const FOG_BLUR_MASK = 'radial-gradient(ellipse at center, transparent 62%, black 100%)';
	const FOG_FADE =
		'radial-gradient(ellipse at center, transparent 55%, color-mix(in srgb, var(--color-background) 70%, transparent) 100%)';

	let { activeId }: { activeId: ViewId } = $props();

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
	let dragging = $state(false);

	const layout = $derived(
		buildLayout(
			experience.showOlder ? EXPERIENCE_HEIGHT.expanded : EXPERIENCE_HEIGHT.collapsed,
			postMortems.openId,
			viewportWidth
		)
	);

	// The dots are locked to the canvas, so their gap is GRID_SIZE x zoom. Zooming out would pack them into a moire,
	// so past MIN_GRID_SCREEN_PX the gap doubles. Two layers make that seamless: the sparse one (every other dot)
	// is always fully visible, and the dense one fades out as it nears the limit, so no dot ever pops.
	const grid = $derived.by(() => {
		const gap = GRID_SIZE * camera.view.zoom;
		const doublings = Math.max(0, Math.ceil(Math.log2(MIN_GRID_SCREEN_PX / gap)));
		const dense = gap * 2 ** doublings;
		const denseOpacity = Math.min(1, (dense - MIN_GRID_SCREEN_PX) / MIN_GRID_SCREEN_PX);
		return { dense, sparse: dense * 2, denseOpacity };
	});

	// A missing URL sends the visitor to no man's land: the real cards fade out and only the lost card remains
	const lostActive = $derived(activeId === 'lost');

	const framingKey = (): string => `${activeId}:${experience.showOlder}:${postMortems.openId}`;

	// Is the pointer over something that scrolls up and down, like a long post-mortem? Then the wheel is its, not the camera's
	const isOverScrollableArea = (target: Element, canvas: Element): boolean => {
		for (
			let element: Element | null = target;
			element && element !== canvas;
			element = element.parentElement
		) {
			const { overflowY } = getComputedStyle(element);
			const scrolls = overflowY === 'auto' || overflowY === 'scroll';
			if (scrolls && element.scrollHeight > element.clientHeight) return true;
		}
		return false;
	};

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
			// The intro zoom is for arriving at the site; a missing URL shows its card straight away
			if (!lostActive) camera.flyIn(sizeOf(node));

			const resizeObserver = new ResizeObserver(() => {
				if (node.clientWidth === lastWidth) return;
				lastWidth = node.clientWidth;
				viewportWidth = lastWidth;
				frameActiveSection(false);
			});
			resizeObserver.observe(node);

			const bounds = () => {
				if (lostActive) return worldBounds([layout.lost], LOST_WORLD_MARGIN);

				const realCards = Object.entries(layout)
					.filter(([id]) => id !== 'lost')
					.map(([, rect]) => rect);
				return worldBounds(realCards, WORLD_MARGIN);
			};

			// Wheel zooms towards the cursor; any hand movement takes over from a camera flight
			const onWheel = (event: WheelEvent) => {
				// A pinch (ctrl + wheel) still zooms; a plain wheel over a scrollable area scrolls it natively
				if (!event.ctrlKey && isOverScrollableArea(event.target as Element, node)) return;

				event.preventDefault();
				const pixels =
					event.deltaMode === WheelEvent.DOM_DELTA_LINE
						? event.deltaY * WHEEL_LINE_PIXELS
						: event.deltaY;
				const factor = Math.exp(-pixels * (event.ctrlKey ? PINCH_ZOOM_SPEED : WHEEL_ZOOM_SPEED));
				const box = node.getBoundingClientRect();
				const anchor = { x: event.clientX - box.left, y: event.clientY - box.top };
				camera.jumpTo(zoomViewAt(camera.view, factor, anchor, sizeOf(node), bounds()));
			};

			// Dragging pans, but only from empty canvas: on a card the press belongs to the card
			const onPointerDown = (event: PointerEvent) => {
				if (event.button !== 0) return;
				if ((event.target as Element).closest('section, aside, a, button')) return;

				dragging = true;
				camera.stop();
				node.setPointerCapture(event.pointerId);
			};
			const onPointerMove = (event: PointerEvent) => {
				if (!dragging) return;

				const moved = {
					...camera.view,
					x: camera.view.x + event.movementX,
					y: camera.view.y + event.movementY
				};
				camera.jumpTo(constrainView(moved, sizeOf(node), bounds()));
			};
			const stopDragging = () => (dragging = false);

			// Clicking the card of the section you are already on brings the camera back to it after you have panned
			// or zoomed away. Links, buttons and a text selection are left alone.
			const onClick = (event: MouseEvent) => {
				const target = event.target as Element;
				if (target.closest('a, button')) return;
				if (!target.closest('section[data-active]')) return;
				if (!getSelection()?.isCollapsed) return;

				frameActiveSection(true);
			};

			// Not passive: the wheel must not also scroll or zoom the browser page
			node.addEventListener('wheel', onWheel, { passive: false });
			node.addEventListener('pointerdown', onPointerDown);
			node.addEventListener('pointermove', onPointerMove);
			node.addEventListener('pointerup', stopDragging);
			node.addEventListener('pointercancel', stopDragging);
			node.addEventListener('click', onClick);

			return () => {
				camera.stop();
				resizeObserver.disconnect();
				node.removeEventListener('wheel', onWheel);
				node.removeEventListener('pointerdown', onPointerDown);
				node.removeEventListener('pointermove', onPointerMove);
				node.removeEventListener('pointerup', stopDragging);
				node.removeEventListener('pointercancel', stopDragging);
				node.removeEventListener('click', onClick);
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
	class="fixed inset-0 hidden touch-none overflow-hidden md:block {dragging
		? 'cursor-grabbing select-none'
		: 'cursor-grab'}"
	style:--dots={lostActive
		? 'color-mix(in srgb, var(--color-line) 45%, transparent)'
		: 'var(--color-line)'}
	style:background-image="radial-gradient(circle, var(--dots) 1.5px, transparent 1.5px),
	radial-gradient(circle, color-mix(in srgb, var(--dots) {grid.denseOpacity * 100}%, transparent)
	1.5px, transparent 1.5px)"
	style:background-size="{grid.sparse}px {grid.sparse}px, {grid.dense}px {grid.dense}px"
	style:background-position="{camera.view.x}px {camera.view.y}px, {camera.view.x}px {camera.view
		.y}px"
>
	<div
		class="absolute top-0 left-0 origin-top-left transition-opacity duration-300 {ready
			? 'opacity-100'
			: 'opacity-0'}"
		style:transform="translate({camera.view.x}px, {camera.view.y}px) scale({camera.view.zoom})"
	>
		<!-- The real world. It fades out in no man's land and back in when the visitor returns home -->
		<div
			class="transition-opacity duration-700 motion-reduce:transition-none {lostActive
				? 'pointer-events-none opacity-0'
				: ''}"
			inert={lostActive}
		>
			{#each sections as section (section.id)}
				<CardStack
					{section}
					{layout}
					active={section.id === activeId}
					animating={camera.animating}
				/>
			{/each}
		</div>
		<!-- No man's land: only there when the visitor is -->
		<div
			class="transition-opacity duration-700 motion-reduce:transition-none {lostActive
				? ''
				: 'pointer-events-none opacity-0'}"
			inert={!lostActive}
		>
			<CardStack section={lostSection} {layout} active={lostActive} animating={camera.animating} />
		</div>
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
