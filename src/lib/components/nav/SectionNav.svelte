<script lang="ts">
	import { resolve } from '$app/paths';
	import { sectionParam, sections, type SectionId } from '#lib/content/index.ts';

	let { activeId }: { activeId: SectionId } = $props();
</script>

<nav
	aria-label="Sections"
	class="fixed bottom-[max(0.375rem,env(safe-area-inset-bottom))] left-1/2 z-20 flex w-fit max-w-[calc(100%-1rem)] -translate-x-1/2 gap-0.5 overflow-x-auto rounded-full border border-line bg-panel/80 p-0.5 text-sm shadow-md shadow-black/5 backdrop-blur-xl backdrop-saturate-150"
>
	{#each sections as section (section.id)}
		<a
			href={resolve('/[[section=section]]', { section: sectionParam(section) })}
			data-sveltekit-reset="false"
			aria-current={section.id === activeId ? 'page' : undefined}
			class="rounded-full px-3 py-1 whitespace-nowrap {section.id === activeId
				? 'bg-accent text-white'
				: 'text-foreground hover:bg-line'}"
		>
			{section.label}
		</a>
	{/each}
</nav>
