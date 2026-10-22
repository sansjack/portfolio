<script lang="ts">
	import type { SkillGroup } from '#lib/content/index.ts';
	import SkillBadge from './SkillBadge.svelte';

	let { groups }: { groups: SkillGroup[] } = $props();
</script>

<div
	class="flex h-full flex-col rounded-xl border border-line bg-surface p-6 shadow-md shadow-black/5"
>
	<h2 class="text-2xl text-foreground">Skills</h2>
	<!-- One row per group from sm up, so the height is groups x badge size and does not depend on how many badges wrap -->
	<dl class="mt-4 flex flex-1 flex-col justify-center gap-3">
		{#each groups as group (group.name)}
			<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
				<dt class="text-sm tracking-widest text-dim uppercase sm:w-32 sm:shrink-0">
					{group.name}
				</dt>
				<dd class="flex flex-wrap gap-2">
					{#each group.items as skill (skill.name)}
						<SkillBadge name={skill.name} learning={skill.learning} />
					{/each}
				</dd>
			</div>
		{/each}
	</dl>
</div>
