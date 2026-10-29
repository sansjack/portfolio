<script lang="ts">
	import { asset } from '$app/paths';
	import type { Role } from '#lib/content/index.ts';
	import { playNote } from '#lib/state/index.ts';

	type Props = { role: Role; index: number; animationDelayMs: number };

	let { role, index, animationDelayMs }: Props = $props();
</script>

<li
	class="flex animate-rise items-center gap-4 py-2.5 motion-reduce:animate-none"
	style:animation-delay="{animationDelayMs}ms"
>
	<a
		href={role.url}
		rel="external"
		aria-label="{role.company} website"
		class="group shrink-0 rounded-full hover:scale-105"
		onpointerenter={(event) => event.pointerType !== 'touch' && playNote(index)}
	>
		{#if role.logo}
			<img
				src={asset(role.logo)}
				alt=""
				width="44"
				height="44"
				class="size-11 rounded-full border border-line bg-white object-contain p-1.5 group-hover:border-accent"
				loading="lazy"
				draggable="false"
			/>
		{:else}
			<span
				class="grid size-11 place-items-center rounded-full border border-line bg-line/40 text-lg text-dim group-hover:border-accent"
				aria-hidden="true"
			>
				{role.company[0]}
			</span>
		{/if}
	</a>
	<div class="min-w-0 flex-1">
		<p class="text-xl text-foreground">{role.company}</p>
		<p class="text-sm text-dim">{role.role}</p>
	</div>
	<p class="shrink-0 text-sm {role.period.endsWith('Current') ? 'text-accent' : 'text-dim'}">
		{role.period}
	</p>
</li>
