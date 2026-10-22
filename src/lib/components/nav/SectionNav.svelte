<script lang="ts">
	import { resolve } from '$app/paths';
	import { sectionParam, sections, type SectionId } from '#lib/content/index.ts';

	let { activeId }: { activeId: SectionId } = $props();
</script>

<div
	class="group fixed bottom-0 left-1/2 z-20 flex h-20 w-[min(100%,44rem)] -translate-x-1/2 items-end justify-center"
>
	<span
		class="mb-2 h-1 w-12 rounded-full bg-dim/40 transition-opacity duration-300 group-focus-within:opacity-0 group-hover:opacity-0"
		aria-hidden="true"
	></span>
	<nav
		aria-label="Sections"
		class="pointer-events-none absolute bottom-[max(1rem,env(safe-area-inset-bottom))] flex w-fit max-w-[calc(100%-2rem)] translate-y-4 gap-1 overflow-x-auto rounded-full border border-white/20 bg-panel/30 p-1 opacity-0 shadow-lg shadow-black/10 backdrop-blur-xl backdrop-saturate-150 transition duration-300 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none"
	>
		{#each sections as section (section.id)}
			<a
				href={resolve('/[[section=section]]', { section: sectionParam(section) })}
				data-sveltekit-reset="false"
				aria-current={section.id === activeId ? 'page' : undefined}
				class="rounded-full px-4 py-1.5 whitespace-nowrap {section.id === activeId
					? 'bg-accent text-white'
					: 'text-foreground hover:bg-line'}"
			>
				{section.label}
			</a>
		{/each}
	</nav>
</div>
