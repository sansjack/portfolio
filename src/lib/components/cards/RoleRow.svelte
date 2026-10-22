<script lang="ts">
	import { asset } from '$app/paths';
	import type { Role } from '#lib/content/index.ts';

	type Props = { role: Role; animationDelayMs: number };

	let { role, animationDelayMs }: Props = $props();
</script>

<li
	class="flex animate-rise items-center gap-4 py-2.5 motion-reduce:animate-none"
	style:animation-delay="{animationDelayMs}ms"
>
	<!-- White badge so dark marks stay visible in dark mode -->
	{#if role.logo}
		<img
			src={asset(role.logo as Parameters<typeof asset>[0])}
			alt=""
			class="size-11 shrink-0 rounded-full border border-line bg-white object-contain p-1.5"
			loading="lazy"
			draggable="false"
		/>
	{:else}
		<span
			class="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-line/40 text-lg text-dim"
			aria-hidden="true"
		>
			{role.company[0]}
		</span>
	{/if}
	<div class="min-w-0 flex-1">
		<a href={role.url} rel="external" class="text-xl text-foreground hover:text-accent"
			>{role.company}</a
		>
		<p class="text-dim">{role.role}</p>
	</div>
	<p class="shrink-0 text-sm {role.period.endsWith('Current') ? 'text-accent' : 'text-dim'}">
		{role.period}
	</p>
</li>
