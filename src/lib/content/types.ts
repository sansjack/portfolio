import type { AssetPath } from '$app/types';

// To add a section: add its id to SECTION_IDS, then define it in `sectionsById` (sections.ts)
// and give its cards a place on the canvas (layout.ts). TypeScript fails the build until all three agree.
export const SECTION_IDS = [
	'about',
	'experience',
	'projects',
	'live',
	'archived',
	'skills',
	'writeups'
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export type ViewId = SectionId | 'lost';

export type SocialIconName = 'email' | 'github' | 'linkedin' | 'x';

export type SocialLink = { label: string; href: string; icon: SocialIconName };

export type Role = {
	company: string;
	role: string;
	period: string;
	url: string;
	logo?: AssetPath;
};

export type Skill = {
	name: string;
	learning?: boolean;
};

export type Writeup = {
	slug: string;
	title: string;
	date: string;
	summary: string;
	repo?: string;
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
	image?: AssetPath;
	imageAlt?: string;
};

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
	repo?: GitRepo;
	image?: AssetPath;
	imageAlt?: string;
	icon?: AssetPath;
	accent?: string;
	postMortem?: PostMortem;
};

export type LiveCard = CardBase & {
	kind: 'live';
	title: string;
	href: string;
	tagline: string;
	logo: AssetPath;
	accent: string;
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
	text: string;
};

export type WriteupsCard = CardBase & {
	kind: 'writeups';
	items: Writeup[];
};

export type LostCard = CardBase & { kind: 'lost' };

export type Card =
	| AboutCard
	| LiveCard
	| ProjectCard
	| SkillsCard
	| ExperienceCard
	| NoteCard
	| WriteupsCard
	| LostCard;

export type Section = {
	id: ViewId;
	label: string;
	description: string;
	path: string;
	cards: Card[];
	tag?: string;
	fill?: number;
	focusCardId?: string;
	stacked?: boolean;
	// Sits under this stacked section's pile. Its position and its animation timing both follow from this:
	// it moves down as the pile opens, and waits for the pile to finish collapsing before moving back up.
	below?: SectionId;
};
