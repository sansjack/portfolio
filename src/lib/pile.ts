export const PILE_STEP = 6;
export const PILE_DURATION_MS = 600;
export const PILE_EASING = 'cubic-bezier(0.34, 1.4, 0.64, 1)';
export const PILE_START_DELAY_MS = 250;
export const PILE_STAGGER_MS = 70;

const PILE_REFERENCE_PX = 350;
const PILE_MIN_MS = 350;
const PILE_MAX_MS = 900;

// When card `index` of a pile starts moving and how long it takes to cover `distance` px.
// Anything that moves because a pile opened or closed must take its timing from here, so it can never
// drift out of step: a card under a pile rides the pile's last card (see CardStack).
export const pileMotion = (
	index: number,
	distance: number
): { delay: number; duration: number } => ({
	delay: PILE_START_DELAY_MS + index * PILE_STAGGER_MS,
	duration: Math.round(
		Math.min(PILE_MAX_MS, Math.max(PILE_MIN_MS, (distance / PILE_REFERENCE_PX) * PILE_DURATION_MS))
	)
});

export const PANEL_OUT_MS = 180;
export const PUSH_GLIDE_MS = 450;
