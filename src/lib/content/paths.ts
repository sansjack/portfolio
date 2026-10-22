import type { SectionId } from './types.ts';

// Kept free of imports beyond types: the route matcher in src/params loads this file directly in Node
export const SECTION_PATHS: Record<SectionId, string> = {
	about: '/',
	experience: '/experience',
	projects: '/projects',
	archived: '/archived',
	skills: '/skills',
	writeups: '/writeups'
};

export const isSectionParam = (param: string | undefined): boolean =>
	Object.values(SECTION_PATHS).includes(`/${param ?? ''}`);
