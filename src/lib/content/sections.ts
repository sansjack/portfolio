// Image paths are relative to /static (e.g. static/images/projects/one.webp -> 'images/projects/one.webp')
import profile from '../profile.json';
import { SECTION_PATHS } from './paths.ts';
import {
	SECTION_IDS,
	type AboutCard,
	type GitRepo,
	type ProjectCard,
	type Role,
	type Section,
	type SectionId,
	type SkillGroup,
	type SocialLink,
	type Writeup
} from './types.ts';

export const siteName: string = profile.name;
export const siteUrl: string = profile.url;

const aboutCard: AboutCard = {
	id: 'about',
	kind: 'about',
	heading: profile.name,
	tagline: profile.tagline,
	location: profile.location,
	links: profile.socials as SocialLink[],
	image: 'images/me.webp',
	imageAlt: `Photo of ${profile.name}`
};

type ProjectEntry = Pick<ProjectCard, 'status' | 'icon' | 'accent' | 'postMortem'> & {
	name: string;
	url: string;
	repo?: GitRepo;
};

const projectCards: (ProjectCard & { archived: boolean })[] = (
	profile.projects as ProjectEntry[]
).map((project) => ({
	id: `project-${project.name}`,
	kind: 'project',
	title: project.name,
	status: project.status,
	href: project.url,
	repo: project.repo,
	icon: project.icon,
	accent: project.accent,
	postMortem: project.postMortem,
	archived: project.status === 'Archived'
}));
export const liveProjects = projectCards.filter((card) => !card.archived);
export const archivedProjects = projectCards.filter((card) => card.archived);

// Array.sort is stable, so skills still being learned move to the back of their group and the rest keep their order
const skillGroups: SkillGroup[] = (profile.skills as SkillGroup[]).map((group) => ({
	name: group.name,
	items: [...group.items].sort(
		(first, second) => Number(first.learning ?? false) - Number(second.learning ?? false)
	)
}));

// Each writeup is a markdown file in src/lib/writeups with title, date and summary in its frontmatter
const writeupFiles = import.meta.glob<string>('../writeups/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
});

const parseWriteup = (path: string, source: string): Writeup => {
	const [, header, body] = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)!;
	const fields = Object.fromEntries(
		header.split('\n').map((line) => {
			const separator = line.indexOf(':');
			return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
		})
	);
	const slug = path.split('/').at(-1)!.replace(/\.md$/, '');
	return {
		slug,
		title: fields.title,
		date: fields.date,
		summary: fields.summary,
		repo: fields.repo,
		body
	};
};

// Newest first
export const writeups: Writeup[] = Object.entries(writeupFiles)
	.map(([path, source]) => parseWriteup(path, source))
	.sort((first, second) => second.date.localeCompare(first.date));

export const findWriteup = (slug: string | undefined): Writeup | undefined =>
	writeups.find((writeup) => writeup.slug === slug);

export const formatWriteupDate = (date: string): string =>
	new Date(date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' });

const sectionsById: Record<SectionId, Section> = {
	about: {
		id: 'about',
		label: 'About',
		description: `${profile.name} is a ${profile.tagline.toLowerCase()} based in ${profile.location}. ${profile.availability}.`,
		path: SECTION_PATHS.about,
		focusCardId: aboutCard.id,
		cards: [aboutCard]
	},
	experience: {
		id: 'experience',
		label: 'Experience',
		description: `Roles ${profile.name} has held as a backend, full stack and site reliability engineer, from ${profile.experience.at(-1)!.company} to ${profile.experience[0].company}.`,
		path: SECTION_PATHS.experience,
		cards: [{ id: 'experience', kind: 'experience', roles: profile.experience as Role[] }]
	},
	projects: {
		id: 'projects',
		label: 'Projects',
		description: `Open source projects by ${profile.name}: ${liveProjects.map((project) => project.title).join(', ')}.`,
		path: SECTION_PATHS.projects,
		stacked: true,
		cards: [...liveProjects, { id: 'note-0', kind: 'note', ...profile.notes[0] }]
	},
	archived: {
		id: 'archived',
		label: 'Archived',
		description: `Older products and side projects by ${profile.name} that are no longer maintained.`,
		path: SECTION_PATHS.archived,
		stacked: true,
		cards: [...archivedProjects, { id: 'note-1', kind: 'note', ...profile.notes[1] }]
	},
	skills: {
		id: 'skills',
		label: 'Skills',
		description: `The languages, frameworks and infrastructure ${profile.name} works with, including ${skillGroups[0].items
			.slice(0, 3)
			.map((skill) => skill.name)
			.join(', ')}.`,
		path: SECTION_PATHS.skills,
		cards: [{ id: 'skills', kind: 'skills', groups: skillGroups }]
	},
	writeups: {
		id: 'writeups',
		label: 'Writeups',
		description: `Rants and writeups by ${profile.name} on software, side projects and things that went wrong.`,
		path: SECTION_PATHS.writeups,
		fill: 0.75,
		cards: [{ id: 'writeups', kind: 'writeups', items: writeups }]
	}
};

export const sections: Section[] = SECTION_IDS.map((id) => sectionsById[id]);

export const getSection = (id: SectionId): Section => sectionsById[id];

export const findSectionByParam = (param: string | undefined): Section | undefined =>
	sections.find((section) => section.path === `/${param ?? ''}`);

export const sectionParam = (section: Section): string => section.path.slice(1);

export const sectionTitle = (section: Section): string =>
	section.id === 'about'
		? `${profile.name} · ${profile.tagline}`
		: `${section.label} · ${profile.name}`;
