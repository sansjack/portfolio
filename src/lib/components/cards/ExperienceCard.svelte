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
</script>

<div class="h-full rounded-xl border border-line bg-surface p-6 pb-3 shadow-md shadow-black/5">
	<div class="mb-4 flex items-baseline justify-between gap-4">
		<h2 class="text-2xl text-foreground">Experience</h2>
		<button
			class="text-accent link-underline"
			aria-expanded={experience.showOlder}
			onclick={() => experience.toggle()}
		>
			{experience.showOlder ? 'Show less' : 'Show all'}
		</button>
	</div>
	{#key experience.opened}
		<ol class="flex flex-col">
			{#each recentRoles as role, index (role.company)}
				<RoleRow {role} {index} animationDelayMs={index * ROW_STAGGER_MS} />
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
						<RoleRow
							{role}
							index={RECENT_ROLE_COUNT + index}
							animationDelayMs={index * ROW_STAGGER_MS}
						/>
					{/each}
				</ol>
			</li>
		</ol>
	{/key}
</div>
