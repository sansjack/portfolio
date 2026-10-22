import type { Size, View } from './types.ts';

// Camera moves follow van Wijk's "smooth and efficient zooming and panning": long trips pull back
// then dive in, like a camera flying over the canvas. RHO is how much it pulls back.
const RHO = 1.4;
const MS_PER_UNIT = 900;
const MIN_MS = 800;
const MAX_MS = 1700;
// With reduced motion the camera still pans (a snap is disorienting) but as one short, plain glide
const REDUCED_MS = 450;

// The flight maths describes a view by the canvas point at screen centre and how much canvas
// it sees across the screen (span), not by pan and zoom.
type Lens = { x: number; y: number; span: number };

export type Flight = {
	duration: number;
	// The view part-way through the flight, with time running from 0 to 1
	at: (time: number) => View;
};

export const prefersReducedMotion = (): boolean =>
	matchMedia('(prefers-reduced-motion: reduce)').matches;

const toLens = (view: View, size: Size): Lens => ({
	x: (size.width / 2 - view.x) / view.zoom,
	y: (size.height / 2 - view.y) / view.zoom,
	span: size.width / view.zoom
});

export const planFlight = (from: View, to: View, size: Size, reducedMotion: boolean): Flight => {
	const start = toLens(from, size);
	const end = toLens(to, size);
	const deltaX = end.x - start.x;
	const deltaY = end.y - start.y;
	const distance = Math.hypot(deltaX, deltaY);

	let length: number;
	let lensAt: (along: number) => Lens;

	if (reducedMotion) {
		length = 1;
		lensAt = (along) => ({
			x: start.x + deltaX * along,
			y: start.y + deltaY * along,
			span: start.span * (end.span / start.span) ** along
		});
	} else if (distance < 1) {
		length = Math.log(end.span / start.span) / RHO;
		lensAt = (along) => ({ x: end.x, y: end.y, span: start.span * Math.exp(RHO * along) });
	} else {
		const startBend =
			(end.span ** 2 - start.span ** 2 + RHO ** 4 * distance ** 2) /
			(2 * start.span * RHO ** 2 * distance);
		const endBend =
			(end.span ** 2 - start.span ** 2 - RHO ** 4 * distance ** 2) /
			(2 * end.span * RHO ** 2 * distance);
		const startR = Math.log(Math.sqrt(startBend ** 2 + 1) - startBend);
		const endR = Math.log(Math.sqrt(endBend ** 2 + 1) - endBend);
		length = (endR - startR) / RHO;
		lensAt = (along) => {
			const progress =
				((start.span / RHO ** 2) *
					(Math.cosh(startR) * Math.tanh(RHO * along + startR) - Math.sinh(startR))) /
				distance;
			return {
				x: start.x + deltaX * progress,
				y: start.y + deltaY * progress,
				span: (start.span * Math.cosh(startR)) / Math.cosh(RHO * along + startR)
			};
		};
	}

	const duration = reducedMotion
		? REDUCED_MS
		: Math.min(MAX_MS, Math.max(MIN_MS, Math.abs(length) * MS_PER_UNIT));

	return {
		duration,
		at: (time) => {
			const eased = time < 0.5 ? 4 * time ** 3 : 1 - (-2 * time + 2) ** 3 / 2;
			const lens = lensAt(eased * length);
			const zoom = size.width / lens.span;
			return { zoom, x: size.width / 2 - lens.x * zoom, y: size.height / 2 - lens.y * zoom };
		}
	};
};
