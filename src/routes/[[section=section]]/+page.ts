import {
	findSectionByParam,
	sectionParam,
	sections,
	sectionTitle,
	siteUrl
} from '#lib/content/index.ts';
import type { EntryGenerator, PageLoad } from './$types';

// Every section is prerendered at its own URL
export const entries: EntryGenerator = () =>
	sections.map((section) => ({ section: sectionParam(section) }));

export const load: PageLoad = ({ params }) => {
	const section = findSectionByParam(params.section)!;

	return {
		title: sectionTitle(section),
		description: section.description,
		canonicalUrl: `${siteUrl}${section.path}`
	};
};
