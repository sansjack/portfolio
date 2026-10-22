import type { Rect, Size, View } from './types.ts';

// How far the visitor can zoom out and in by hand; section framing (fit.ts) stays within this
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 1.25;

const clamp = (value: number, min: number, max: number): number =>
	Math.min(max, Math.max(min, value));

// The area the visitor may look at: every card, plus a margin of empty canvas around them
export const worldBounds = (rects: Rect[], margin: number): Rect => {
	const left = Math.min(...rects.map((rect) => rect.x)) - margin;
	const top = Math.min(...rects.map((rect) => rect.y)) - margin;
	const right = Math.max(...rects.map((rect) => rect.x + rect.width)) + margin;
	const bottom = Math.max(...rects.map((rect) => rect.y + rect.height)) + margin;
	return { x: left, y: top, width: right - left, height: bottom - top };
};

// Where the screen centre may sit along one axis: inside the bounds, or on their middle once zoomed out far enough to see all of them
const clampCentre = (centre: number, visible: number, start: number, length: number): number =>
	visible >= length
		? start + length / 2
		: clamp(centre, start + visible / 2, start + length - visible / 2);

// Clamps the zoom, then keeps the visible area inside the bounds: the boundary of the canvas
export const constrainView = (view: View, size: Size, bounds: Rect): View => {
	const zoom = clamp(view.zoom, MIN_ZOOM, MAX_ZOOM);
	const centreX = clampCentre(
		(size.width / 2 - view.x) / view.zoom,
		size.width / zoom,
		bounds.x,
		bounds.width
	);
	const centreY = clampCentre(
		(size.height / 2 - view.y) / view.zoom,
		size.height / zoom,
		bounds.y,
		bounds.height
	);
	return { zoom, x: size.width / 2 - centreX * zoom, y: size.height / 2 - centreY * zoom };
};

// Zooms by `factor` keeping the canvas point under `anchor` (a screen point, e.g. the cursor) where it is
export const zoomViewAt = (
	view: View,
	factor: number,
	anchor: { x: number; y: number },
	size: Size,
	bounds: Rect
): View => {
	const zoom = clamp(view.zoom * factor, MIN_ZOOM, MAX_ZOOM);
	const ratio = zoom / view.zoom;
	return constrainView(
		{
			zoom,
			x: anchor.x - (anchor.x - view.x) * ratio,
			y: anchor.y - (anchor.y - view.y) * ratio
		},
		size,
		bounds
	);
};
