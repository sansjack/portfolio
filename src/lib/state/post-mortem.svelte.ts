import { getContext, setContext } from 'svelte';

const POST_MORTEM_KEY = Symbol('post-mortem');

// At most one post-mortem panel is open; on the canvas it takes a slot in the card grid
export class PostMortemState {
	openId = $state<string | null>(null);

	toggle(cardId: string) {
		this.openId = this.openId === cardId ? null : cardId;
	}

	close() {
		this.openId = null;
	}
}

export const providePostMortemState = (): PostMortemState =>
	setContext(POST_MORTEM_KEY, new PostMortemState());

export const usePostMortemState = (): PostMortemState =>
	getContext<PostMortemState>(POST_MORTEM_KEY);
