<script lang="ts">
	import type { SocialLink } from '#lib/content/index.ts';
	import SocialIcon from './SocialIcon.svelte';

	let { links }: { links: SocialLink[] } = $props();
</script>

<div class="flex items-center gap-2 @lg:-ml-2">
	{#each links as link (link.label)}
		<a
			href={link.href}
			rel="external"
			aria-label={link.label}
			class="p-2 text-dim hover:-translate-y-0.5 hover:text-foreground"
		>
			<SocialIcon name={link.icon} />
		</a>
	{/each}
</div>
