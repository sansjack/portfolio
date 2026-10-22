import { getContext, setContext } from 'svelte';
import type { ViewId } from '#lib/content/index.ts';

const EXPERIENCE_KEY = Symbol('experience');

export class ExperienceState {
	showOlder = $state(false);
	// Bumped on each open so the rows animate in again
	opened = $state(0);
	#isOpen: boolean;

	constructor(activeId: ViewId) {
		this.#isOpen = activeId === 'experience';
		this.showOlder = this.#isOpen;
	}

	toggle() {
		this.showOlder = !this.showOlder;
	}

	// Opening Experience shows every role; leaving it folds the older ones away
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
