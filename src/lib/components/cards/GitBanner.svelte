<script lang="ts">
	import type { GitRepo } from '#lib/content/index.ts';
	import SocialIcon from './SocialIcon.svelte';

	let { repo }: { repo: GitRepo } = $props();

	const LANGUAGE_COLORS: Record<string, string> = {
		Rust: '#dea584',
		TypeScript: '#3178c6',
		JavaScript: '#f1e05a',
		Go: '#00add8',
		Python: '#3572a5',
		Svelte: '#ff3e00'
	};
	const FALLBACK_COLOR = '#8b949e';

	const color = $derived(LANGUAGE_COLORS[repo.language] ?? FALLBACK_COLOR);
</script>

<div
	class="relative flex min-h-28 flex-1 flex-col justify-end overflow-hidden bg-surface p-4"
	style:background-image="radial-gradient(circle at 100% 0%, {color}33, transparent 60%)"
>
	<span class="absolute top-3 right-3 text-foreground"><SocialIcon name="github" /></span>
	<p class="relative text-lg leading-none text-foreground">
		<span class="text-dim">{repo.owner}/</span>{repo.name}
	</p>
</div>
