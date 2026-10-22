import { planFlight, prefersReducedMotion } from './flight.ts';
import type { Size, View } from './types.ts';

// The page opens with the camera at this fraction of the final zoom, then flies in
const INTRO_ZOOM = 0.6;

export class Camera {
	view = $state<View>({ x: 0, y: 0, zoom: 1 });
	// Also lets stacked cards deal out smoothly
	animating = $state(false);
	#frame = 0;

	jumpTo(target: View) {
		this.stop();
		this.animating = false;
		this.view = target;
	}

	flyTo(target: View, size: Size) {
		const reducedMotion = prefersReducedMotion();
		this.animating = !reducedMotion;
		this.#fly(target, size, reducedMotion);
	}

	// Intro: pull back from the current view, then fly in to it
	flyIn(size: Size) {
		// A hidden canvas (phone layout) has no size
		if (prefersReducedMotion() || size.width === 0) return;

		const target = this.view;
		const centreX = (size.width / 2 - target.x) / target.zoom;
		const centreY = (size.height / 2 - target.y) / target.zoom;
		const zoom = target.zoom * INTRO_ZOOM;
		this.view = { zoom, x: size.width / 2 - centreX * zoom, y: size.height / 2 - centreY * zoom };
		this.animating = true;
		this.#fly(target, size, false);
	}

	stop() {
		cancelAnimationFrame(this.#frame);
	}

	#fly(target: View, size: Size, reducedMotion: boolean) {
		this.stop();
		const flight = planFlight(this.view, target, size, reducedMotion);
		// The first frame's own timestamp is the start, so the clock matches rAF's (performance.now() can run ahead of it)
		let startedAt: number | undefined;

		const frame = (now: number) => {
			startedAt ??= now;
			const time = Math.min(1, (now - startedAt) / flight.duration);
			this.view = flight.at(time);

			if (time < 1) this.#frame = requestAnimationFrame(frame);
			else this.view = target;
		};
		this.#frame = requestAnimationFrame(frame);
	}
}
