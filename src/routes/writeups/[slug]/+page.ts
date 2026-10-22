import { error } from '@sveltejs/kit';
import { findWriteup, siteName, siteUrl, writeups } from '#lib/content/index.ts';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => writeups.map(({ slug }) => ({ slug }));

export const load: PageLoad = ({ params }) => {
	const writeup = findWriteup(params.slug);
	if (!writeup) error(404, 'Writeup not found');

	return {
		writeup,
		title: `${writeup.title} · ${siteName}`,
		canonicalUrl: `${siteUrl}/writeups/${writeup.slug}`
	};
};
