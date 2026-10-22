<script lang="ts">
	import { asset } from '$app/paths';

	type Props = { name: string; image?: string; imageAlt?: string };

	let { name, image, imageAlt }: Props = $props();
</script>

<figure
	class="relative shrink-0 rotate-[-3deg] border border-line bg-surface p-2.5 pb-9 shadow-lg shadow-black/15 select-none"
>
	<span class="absolute -top-3 left-1/2 h-5 w-14 -translate-x-1/2 rotate-2 bg-note/80"></span>
	{#if image}
		<img
			src={asset(image as Parameters<typeof asset>[0])}
			alt={imageAlt ?? ''}
			class="size-40 object-cover"
			draggable="false"
		/>
	{:else}
		<div class="grid size-40 place-items-center bg-line/40 text-5xl text-dim">
			{name
				.split(' ')
				.map((word) => word[0])
				.join('')}
		</div>
	{/if}
	<figcaption class="absolute inset-x-0 bottom-2 text-center text-sm text-dim">Me</figcaption>
</figure>
