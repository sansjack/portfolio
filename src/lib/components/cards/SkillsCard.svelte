<script lang="ts">
	import type { SkillGroup } from '#lib/content/index.ts';
	import SkillBadge from './SkillBadge.svelte';

	let { groups }: { groups: SkillGroup[] } = $props();
</script>

<div
	class="flex h-full flex-col rounded-xl border border-line bg-surface p-6 shadow-md shadow-black/5"
>
	<h2 class="text-2xl text-foreground">Skills</h2>
	<dl class="mt-4 grid flex-1 content-start gap-x-10 gap-y-4 sm:grid-cols-2">
		{#each groups as group (group.name)}
			<div class="flex flex-col gap-2">
				<dt class="text-sm tracking-widest text-dim uppercase">{group.name}</dt>
				<dd class="flex flex-wrap gap-2">
					{#each group.items as skill (skill.name)}
						<SkillBadge name={skill.name} learning={skill.learning} />
					{/each}
				</dd>
			</div>
		{/each}
	</dl>
</div>
