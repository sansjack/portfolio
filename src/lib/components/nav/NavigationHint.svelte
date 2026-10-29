<script lang="ts">
	import { onMount } from 'svelte';

	const HINT_MS = 8000;

	let { visible, ondismiss }: { visible: boolean; ondismiss: () => void } = $props();

	onMount(() => {
		const timer = setTimeout(ondismiss, HINT_MS);
		return () => clearTimeout(timer);
	});
</script>

<svelte:head>
	<noscript
		><style>
			nav[aria-label='Sections'] {
				opacity: 1 !important;
				pointer-events: auto !important;
			}
			[data-navigation-hint] {
				display: none !important;
			}
		</style></noscript
	>
</svelte:head>

<svelte:window onpointerdown={ondismiss} onwheel={ondismiss} onkeydown={ondismiss} />

<p
	data-navigation-hint
	role="status"
	aria-hidden={!visible}
	class="pointer-events-none fixed bottom-[max(0.375rem,env(safe-area-inset-bottom))] left-1/2 z-20 hidden -translate-x-1/2 animate-rise rounded-full border border-line bg-panel/80 px-4 py-1 text-sm whitespace-nowrap text-dim shadow-md shadow-black/5 backdrop-blur-xl backdrop-saturate-150 transition-opacity duration-300 motion-reduce:animate-none md:block {visible
		? 'opacity-100'
		: 'opacity-0'}"
>
	Click a section to explore, or drag the canvas with your mouse (middle button works too)
</p>
