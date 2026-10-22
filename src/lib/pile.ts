// Shared by the canvas CardStack and the phone ProjectPile
export const PILE_STEP = 6;
export const PILE_DURATION_MS = 600;
export const PILE_EASING = 'cubic-bezier(0.34, 1.4, 0.64, 1)';
export const PILE_START_DELAY_MS = 250;
export const PILE_STAGGER_MS = 70;

// Opening or switching a post-mortem on the canvas runs in order, all on the two-column grid:
// the old panel fades out, the cards glide into the reflowed cells, then the new panel rises into its cell
export const PANEL_OUT_MS = 180;
export const PUSH_GLIDE_MS = 450;
