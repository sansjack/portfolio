<script lang="ts">
	import { prefersReducedMotion } from '#lib/camera/index.ts';
	import { type ViewId, sectionParam, sections } from '#lib/content/index.ts';
	import { resolve } from '$app/paths';

	let { activeId, hintActive = false }: { activeId: ViewId; hintActive?: boolean } = $props();

	let nav = $state<HTMLElement>();

	$effect(() => {
		void activeId;
		nav?.querySelector('[aria-current="page"]')?.scrollIntoView({
			behavior: prefersReducedMotion() ? 'auto' : 'smooth',
			block: 'nearest',
			inline: 'center'
		});
	});
</script>

<nav
	bind:this={nav}
	aria-label="Sections"
	class="fixed bottom-[max(0.375rem,env(safe-area-inset-bottom))] left-1/2 z-20 flex w-fit max-w-[calc(100%-1rem)] -translate-x-1/2 snap-x [scrollbar-width:none] gap-0.5 overflow-x-auto overscroll-x-contain rounded-full border border-line bg-panel/80 p-0.5 text-sm shadow-md shadow-black/5 backdrop-blur-xl backdrop-saturate-150 [&::-webkit-scrollbar]:hidden {hintActive
		? 'md:pointer-events-none md:opacity-0'
		: ''} transition-opacity duration-300"
>
	{#each sections as section (section.id)}
		<a
			href={resolve('/[[section=section]]', { section: sectionParam(section) })}
			data-sveltekit-reset="false"
			aria-current={section.id === activeId ? 'page' : undefined}
			class="shrink-0 snap-center rounded-full px-3 py-1.5 whitespace-nowrap md:py-1 {section.id ===
			activeId
				? 'bg-accent text-white'
				: 'text-foreground hover:bg-line'}"
		>
			{section.label}
		</a>
	{/each}
</nav>
