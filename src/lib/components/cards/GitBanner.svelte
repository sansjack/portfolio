<script lang="ts">
	import type { GitRepo } from '#lib/content/index.ts';

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
	const LANE_Y = [16, 40];
	const COLUMN_GAP = 20;
	const COLUMNS = 8;

	const color = $derived(LANGUAGE_COLORS[repo.language] ?? FALLBACK_COLOR);

	// A small git-log-style graph, different for every repo but always the same for one repo:
	// a branch splits off the main lane and merges back, with a commit dot at each step
	const seed = $derived(
		[...`${repo.owner}/${repo.name}`].reduce(
			(hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0,
			7
		)
	);
	const branchAt = $derived(1 + (seed % 3));
	const mergeAt = $derived(Math.min(COLUMNS - 1, branchAt + 2 + ((seed >> 3) % 3)));
	const columns = $derived(
		Array.from({ length: COLUMNS }, (_, column) => column * COLUMN_GAP + 10)
	);
</script>

<div
	class="relative flex min-h-28 flex-1 flex-col justify-between overflow-hidden bg-surface p-4 text-dim"
	style:background-image="radial-gradient(circle at 100% 0%, {color}33, transparent 60%)"
>
	<svg viewBox="0 0 160 56" class="absolute top-3 right-3 w-36" fill="none" aria-hidden="true">
		<line x1={columns[0]} y1={LANE_Y[0]} x2={columns[COLUMNS - 1]} y2={LANE_Y[0]} stroke={color} />
		<path
			d="M{columns[branchAt - 1]} {LANE_Y[0]} L{columns[branchAt]} {LANE_Y[1]} L{columns[
				mergeAt - 1
			]} {LANE_Y[1]} L{columns[mergeAt]} {LANE_Y[0]}"
			stroke="var(--color-accent)"
		/>
		{#each columns as x, column (column)}
			<circle
				cx={x}
				cy={LANE_Y[0]}
				r="3"
				fill="var(--color-surface)"
				stroke={color}
				stroke-width="1.5"
			/>
			{#if column >= branchAt && column < mergeAt}
				<circle
					cx={x}
					cy={LANE_Y[1]}
					r="3"
					fill="var(--color-surface)"
					stroke="var(--color-accent)"
					stroke-width="1.5"
				/>
			{/if}
		{/each}
	</svg>
	<p class="text-sm">⎇ main</p>
	<p class="relative text-lg leading-none text-foreground">
		<span class="text-dim">{repo.owner}/</span>{repo.name}
	</p>
</div>
