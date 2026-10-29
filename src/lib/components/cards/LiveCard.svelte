<script lang="ts">
	import type { LiveCard } from '#lib/content/index.ts';
	import { asset } from '$app/paths';

	type Props = Pick<LiveCard, 'title' | 'href' | 'tagline' | 'logo' | 'accent'>;

	let { title, href, tagline, logo, accent }: Props = $props();
</script>

<a
	{href}
	target="_blank"
	rel="external noopener noreferrer"
	class="flex h-full items-center gap-6 rounded-lg border border-line bg-panel p-6 transition duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:shadow-black/10"
>
	<img
		src={asset(logo)}
		alt=""
		width="64"
		height="64"
		class="size-16 shrink-0 rounded-2xl bg-[#0d1117] p-2 ring-1 ring-black/10"
		draggable="false"
	/>
	<div class="flex flex-col gap-2">
		<h2 class="flex items-center gap-3 text-2xl leading-none text-foreground">
			{title}
			<span class="flex items-center gap-2 text-sm leading-none tracking-widest text-dim uppercase">
				<span class="relative flex size-2" aria-hidden="true">
					<span
						class="absolute inline-flex size-full rounded-full opacity-75 motion-safe:animate-ping"
						style:background-color={accent}
					></span>
					<span class="relative inline-flex size-2 rounded-full" style:background-color={accent}
					></span>
				</span>
				Live
			</span>
			<span class="sr-only">(opens in a new tab)</span>
		</h2>
		<p class="text-dim">{tagline}</p>
	</div>
	<span class="ml-auto self-start text-dim" aria-hidden="true">↗</span>
</a>
