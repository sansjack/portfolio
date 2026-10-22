import { sections, siteUrl, writeups } from '#lib/content/index.ts';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () => {
	const lastModified = new Date().toISOString().slice(0, 10);
	const pages = [
		...sections.map((section) => ({ path: section.path, lastModified })),
		...writeups.map((writeup) => ({
			path: `/writeups/${writeup.slug}`,
			lastModified: writeup.date
		}))
	];
	const urls = pages
		.map(
			(page) =>
				`	<url>\n		<loc>${siteUrl}${page.path}</loc>\n		<lastmod>${page.lastModified}</lastmod>\n	</url>`
		)
		.join('\n');

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
		{ headers: { 'Content-Type': 'application/xml' } }
	);
};
