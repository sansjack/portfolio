<script lang="ts">
	import { skillIcons } from '#lib/components/icons/index.ts';
	import type { Skill } from '#lib/content/index.ts';

	let { name, learning = false }: Skill = $props();

	const Icon = $derived(skillIcons[name]);
</script>

{#if Icon}
	<span
		class="group relative grid size-12 place-items-center rounded-lg border text-foreground transition duration-200 hover:border-accent {learning
			? 'border-dashed border-line opacity-50 grayscale hover:opacity-100 hover:grayscale-0'
			: 'border-line'}"
		role="img"
		aria-label={learning ? `${name} (learning)` : name}
	>
		<Icon class="size-8" />
		<span
			class="pointer-events-none absolute -top-10 left-1/2 z-10 -translate-x-1/2 translate-y-1 rounded-md border border-line bg-surface px-2.5 py-0.5 text-sm whitespace-nowrap text-foreground opacity-0 shadow-md shadow-black/10 transition duration-150 group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none"
			aria-hidden="true"
		>
			{name}{learning ? ' · learning' : ''}
		</span>
	</span>
{:else}
	<span class="rounded-full border border-line px-3 py-0.5 {learning ? 'opacity-50' : ''}">
		{name}
	</span>
{/if}
