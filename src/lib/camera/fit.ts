import type { Rect, Size, View } from './types.ts';

const MIN_ZOOM = 0.15;
const MAX_ZOOM = 0.8;
const FIT_PADDING = { vertical: 96, side: 24 };
const FIT_SCALE = 0.85;
const VIEW_LIFT = 12;
export const MAX_FIT_ZOOM = MAX_ZOOM * FIT_SCALE;

export const fitView = (rects: Rect[], size: Size, focusRect?: Rect, fill?: number): View => {
	const left = Math.min(...rects.map((rect) => rect.x));
	const top = Math.min(...rects.map((rect) => rect.y));
	const right = Math.max(...rects.map((rect) => rect.x + rect.width));
	const bottom = Math.max(...rects.map((rect) => rect.y + rect.height));

	const focus = focusRect
		? { x: focusRect.x + focusRect.width / 2, y: focusRect.y + focusRect.height / 2 }
		: { x: (left + right) / 2, y: (top + bottom) / 2 };

	const halfWidth = Math.max(focus.x - left, right - focus.x);
	const halfHeight = Math.max(focus.y - top, bottom - focus.y);
	const availableWidth = size.width - FIT_PADDING.side * 2;
	const availableHeight = size.height - FIT_PADDING.vertical * 2;
	const fitZoom = Math.min(
		MAX_ZOOM,
		Math.max(
			MIN_ZOOM,
			Math.min(MAX_ZOOM, availableWidth / (halfWidth * 2), availableHeight / (halfHeight * 2))
		)
	);
	const zoom = fill
		? Math.max(
				MIN_ZOOM,
				Math.min((size.width * fill) / (halfWidth * 2), (size.height * fill) / (halfHeight * 2))
			)
		: fitZoom * FIT_SCALE;

	return {
		zoom,
		x: size.width / 2 - focus.x * zoom,
		y: size.height / 2 - focus.y * zoom - VIEW_LIFT
	};
};
