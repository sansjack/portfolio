<script lang="ts">
	import type { Role } from '#lib/content/index.ts';
	import { useExperienceState } from '#lib/state/index.ts';
	import RoleRow from './RoleRow.svelte';

	const RECENT_ROLE_COUNT = 3;
	const ROW_STAGGER_MS = 80;

	let { roles }: { roles: Role[] } = $props();

	const experience = useExperienceState();
	const recentRoles = $derived(roles.slice(0, RECENT_ROLE_COUNT));
	const olderRoles = $derived(roles.slice(RECENT_ROLE_COUNT));
	const earliestYear = $derived(roles.at(-1)?.period.match(/\d{4}/)?.[0]);
</script>

<div
	class="flex h-full flex-col rounded-xl border border-line bg-surface p-6 pb-2 shadow-md shadow-black/5"
>
	<h2 class="mb-4 text-2xl text-foreground">Experience</h2>
	{#key experience.opened}
		<ol class="flex flex-col">
			{#each recentRoles as role, index (role.company)}
				<RoleRow {role} animationDelayMs={index * ROW_STAGGER_MS} />
			{/each}
			<!-- Older roles sit in a row that grows from 0 to its content height, so they fold away smoothly -->
			<li
				class="grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none {experience.showOlder
					? 'grid-rows-[1fr]'
					: 'grid-rows-[0fr]'}"
				inert={!experience.showOlder}
			>
				<ol class="min-h-0 overflow-hidden">
					{#each olderRoles as role, index (role.company)}
						<RoleRow {role} animationDelayMs={index * ROW_STAGGER_MS} />
					{/each}
				</ol>
			</li>
		</ol>
	{/key}
	<button
		class="mt-auto pt-2 text-left text-accent hover:underline"
		aria-expanded={experience.showOlder}
		onclick={() => experience.toggle()}
	>
		{experience.showOlder ? 'Show less' : `Show older · back to ${earliestYear}`}
	</button>
</div>
