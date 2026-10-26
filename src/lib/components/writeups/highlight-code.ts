import { createHighlighterCore, type HighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

// Only the languages the writeups use, each its own chunk, fetched when a post actually contains one
const languageLoaders: Record<string, () => Promise<unknown>> = {
	bash: () => import('shiki/langs/bash.mjs'),
	python: () => import('shiki/langs/python.mjs'),
	svelte: () => import('shiki/langs/svelte.mjs'),
	ts: () => import('shiki/langs/typescript.mjs')
};

let highlighter: Promise<HighlighterCore> | undefined;

const getHighlighter = () =>
	(highlighter ??= createHighlighterCore({
		themes: [import('shiki/themes/github-light.mjs'), import('shiki/themes/github-dark.mjs')],
		langs: [],
		engine: createJavaScriptRegexEngine()
	}));

// Colours the code blocks in place after the plain text is already on screen, so reading never waits on this
export const highlightCodeBlocks = async (root: HTMLElement): Promise<void> => {
	const blocks = [...root.querySelectorAll<HTMLElement>('pre > code[class*="language-"]')].flatMap(
		(code) => {
			const language = code.className.match(/language-(\S+)/)?.[1] ?? '';
			return language in languageLoaders ? [{ code, language }] : [];
		}
	);
	if (blocks.length === 0) return;

	const shiki = await getHighlighter();
	for (const language of new Set(blocks.map((block) => block.language))) {
		await shiki.loadLanguage(languageLoaders[language]() as Promise<never>);
	}

	for (const { code, language } of blocks) {
		const template = document.createElement('template');
		template.innerHTML = shiki.codeToHtml(code.textContent, {
			lang: language,
			themes: { light: 'github-light', dark: 'github-dark' },
			defaultColor: false
		});
		code.innerHTML = template.content.querySelector('code')!.innerHTML;
	}
};
