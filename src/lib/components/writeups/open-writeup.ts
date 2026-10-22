import { goto, preloadData, pushState } from '$app/navigation';
import { resolve } from '$app/paths';

// Writeup styles are a separate chunk, fetched when the Writeups section is focused (see +layout.svelte)
export const loadWriteupStyles = () => import('./writeup.css');

// Shallow routing: the URL changes to the writeup's own page, but the canvas stays and the card turns to it.
// Modified clicks fall through so "open in new tab" still loads the real page. A click the canvas already
// handled (a card that is not focused yet) is left alone too.
export const openWriteup = async (event: MouseEvent, slug: string) => {
	if (
		event.defaultPrevented ||
		event.button !== 0 ||
		event.metaKey ||
		event.ctrlKey ||
		event.shiftKey ||
		event.altKey
	)
		return;

	event.preventDefault();
	const href = resolve('/writeups/[slug]', { slug });
	// Both are normally ready already (preloaded on focus and by the anchor); this is the safety net
	await loadWriteupStyles();
	const result = await preloadData(href);

	if (result.type === 'loaded' && result.status === 200) pushState(href, { writeup: slug });
	else await goto(href);
};
