<script lang="ts">
	import type { Card } from '#lib/content/index.ts';
	import AboutCard from './AboutCard.svelte';
	import ExperienceCard from './ExperienceCard.svelte';
	import LostCard from './LostCard.svelte';
	import NoteCard from './NoteCard.svelte';
	import ProjectCard from './ProjectCard.svelte';
	import SkillsCard from './SkillsCard.svelte';
	import WriteupsCard from './WriteupsCard.svelte';

	let { card }: { card: Card } = $props();
</script>

{#if card.kind === 'about'}
	<AboutCard
		heading={card.heading}
		tagline={card.tagline}
		location={card.location}
		links={card.links}
		image={card.image}
		imageAlt={card.imageAlt}
	/>
{:else if card.kind === 'project'}
	<ProjectCard
		id={card.id}
		title={card.title}
		status={card.status}
		href={card.href}
		repo={card.repo}
		image={card.image}
		imageAlt={card.imageAlt}
		icon={card.icon}
		accent={card.accent}
		postMortem={card.postMortem}
	/>
{:else if card.kind === 'skills'}
	<SkillsCard groups={card.groups} />
{:else if card.kind === 'writeups'}
	<WriteupsCard items={card.items} />
{:else if card.kind === 'lost'}
	<LostCard />
{:else if card.kind === 'experience'}
	<ExperienceCard roles={card.roles} />
{:else}
	<NoteCard title={card.title} text={card.text} />
{/if}
