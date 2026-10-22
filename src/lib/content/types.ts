import type { AssetPath } from '$app/types';

// To add a section: add its id to SECTION_IDS, then define it in `sectionsById` (sections.ts)
// and give its cards a place on the canvas (layout.ts). TypeScript fails the build until all three agree.
export const SECTION_IDS = [
	'about',
	'experience',
	'projects',
	'archived',
	'skills',
	'writeups'
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export type SocialIconName = 'email' | 'github' | 'linkedin' | 'x';

export type SocialLink = { label: string; href: string; icon: SocialIconName };

export type Role = {
	company: string;
	role: string;
	period: string;
	url: string;
	// Company mark, relative to /static (e.g. 'images/companies/persona-ai.webp')
	logo?: AssetPath;
};

export type Skill = {
	name: string;
	// Still being picked up: shown dimmed and listed after the skills I know well
	learning?: boolean;
};

export type Writeup = {
	slug: string;
	title: string;
	// ISO date (YYYY-MM-DD)
	date: string;
	summary: string;
	// GitHub repo the writeup is about, shown as a button
	repo?: string;
	// Markdown
	body: string;
};

export type SkillGroup = { name: string; items: Skill[] };

type CardBase = {
	id: string;
};

export type AboutCard = CardBase & {
	kind: 'about';
	heading: string;
	tagline: string;
	location: string;
	links: SocialLink[];
	// Photo shown in the hub's polaroid, relative to /static (e.g. 'images/me.webp'); a placeholder shows until set
	image?: AssetPath;
	imageAlt?: string;
};

// A git repo link renders a generated banner; add hosts here as more kinds of git link are needed
export type GitRepo = {
	host: 'github';
	owner: string;
	name: string;
	language: string;
	stars: number;
	description: string;
};

export type PostMortem = { whatItWas: string; whyItFailed: string };

export type ProjectCard = CardBase & {
	kind: 'project';
	title: string;
	status: string;
	href: string;
	// Set for git links, which get a generated banner instead of an image
	repo?: GitRepo;
	image?: AssetPath;
	imageAlt?: string;
	// App icon relative to /static, shown on a banner tinted with `accent` (any CSS colour)
	icon?: AssetPath;
	accent?: string;
	postMortem?: PostMortem;
};

export type SkillsCard = CardBase & {
	kind: 'skills';
	groups: SkillGroup[];
};

export type ExperienceCard = CardBase & {
	kind: 'experience';
	roles: Role[];
};

export type NoteCard = CardBase & {
	kind: 'note';
	title: string;
	// Line breaks in the text are kept
	text: string;
};

export type WriteupsCard = CardBase & {
	kind: 'writeups';
	items: Writeup[];
};

export type Card = AboutCard | ProjectCard | SkillsCard | ExperienceCard | NoteCard | WriteupsCard;

export type Section = {
	id: SectionId;
	label: string;
	// Meta description for search results and link previews
	description: string;
	// Where the section lives in the URL; the About section is the home page
	path: string;
	cards: Card[];
	// Small label above the section's cards on the canvas
	tag?: string;
	// Share of the screen (0-1) the framed cards should fill, instead of the default loose fit
	fill?: number;
	// Card the camera centres on instead of the middle of the whole section
	focusCardId?: string;
	// Project cards pile up on the first one until the section is open
	stacked?: boolean;
};
