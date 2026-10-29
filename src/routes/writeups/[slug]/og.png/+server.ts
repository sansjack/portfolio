import { readFile } from 'node:fs/promises';
import { Resvg } from '@resvg/resvg-js';
import { error } from '@sveltejs/kit';
import satori from 'satori';
import { findWriteup, formatWriteupDate, siteName, writeups } from '#lib/content/index.ts';
import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => writeups.map(({ slug }) => ({ slug }));

const SIZE = 630;

const readFont = (file: string) => readFile(`node_modules/@fontsource/${file}`);

export const GET: RequestHandler = async ({ params }) => {
	const writeup = findWriteup(params.slug);
	if (!writeup) error(404, 'Writeup not found');

	const [bodyFont, titleFont] = await Promise.all([
		readFont('rajdhani/files/rajdhani-latin-400-normal.woff'),
		readFont('ubuntu-mono/files/ubuntu-mono-latin-700-normal.woff')
	]);

	const text = (children: string, style: Record<string, string | number>) => ({
		type: 'div',
		props: { children, style }
	});

	const card = {
		type: 'div',
		props: {
			style: {
				width: SIZE,
				height: SIZE,
				display: 'flex',
				boxSizing: 'border-box',
				flexDirection: 'column',
				justifyContent: 'space-between',
				padding: 56,
				background: '#121214',
				color: '#e8e8ec'
			},
			children: [
				text(`WRITEUP · ${formatWriteupDate(writeup.date)}`, {
					fontFamily: 'Rajdhani',
					fontSize: 30,
					color: '#7c78f0',
					letterSpacing: 2
				}),
				text(writeup.title, {
					fontFamily: 'Ubuntu Mono',
					fontWeight: 700,
					fontSize: 58,
					lineHeight: 1.15
				}),
				text(siteName, { fontFamily: 'Rajdhani', fontSize: 32, color: '#9a9aa6' })
			]
		}
	};

	const svg = await satori(card, {
		width: SIZE,
		height: SIZE,
		fonts: [
			{ name: 'Rajdhani', data: bodyFont, weight: 400 },
			{ name: 'Ubuntu Mono', data: titleFont, weight: 700 }
		]
	});

	return new Response(new Uint8Array(new Resvg(svg).render().asPng()), {
		headers: { 'Content-Type': 'image/png' }
	});
};
