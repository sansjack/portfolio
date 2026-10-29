import { getContext, setContext } from 'svelte';
import type { ViewId } from '#lib/content/index.ts';

const EXPERIENCE_KEY = Symbol('experience');

export class ExperienceState {
	showOlder = $state(false);
	opened = $state(0);
	#isOpen: boolean;

	constructor(activeId: ViewId) {
		this.#isOpen = activeId === 'experience';
		this.showOlder = this.#isOpen;
	}

	toggle() {
		this.showOlder = !this.showOlder;
	}

	follow(activeId: ViewId) {
		const isOpen = activeId === 'experience';
		if (isOpen === this.#isOpen) return;

		this.#isOpen = isOpen;
		this.showOlder = isOpen;
		if (isOpen) this.opened++;
	}
}

export const provideExperienceState = (activeId: ViewId): ExperienceState =>
	setContext(EXPERIENCE_KEY, new ExperienceState(activeId));

export const useExperienceState = (): ExperienceState =>
	getContext<ExperienceState>(EXPERIENCE_KEY);
