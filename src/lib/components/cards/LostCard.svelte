<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	const missingPath = $derived(page.status === 404 ? page.url.pathname : undefined);
</script>

<div
	class="flex size-full flex-col items-center justify-center gap-3 card-surface border-dashed text-center"
>
	<p class="text-7xl leading-none text-accent">404</p>
	<h2 class="text-2xl text-foreground">No man's land</h2>
	<p class="text-lg leading-snug text-dim">
		{#if missingPath}
			<span class="text-foreground">{missingPath}</span> isn't on the map.
		{:else}
			This isn't on the map.
		{/if}
	</p>
	<a
		href={resolve('/[[section=section]]', { section: '' })}
		class="mt-1 rounded-full bg-accent px-5 py-1.5 text-lg text-white hover:brightness-110"
	>
		Head back home
	</a>
</div>
