import { MAX_FIT_ZOOM, type Rect } from '#lib/camera/index.ts';
import { archivedProjects, liveProjects } from './sections.ts';

// Experience grows downward, so its height depends on whether older roles are showing
export const EXPERIENCE_HEIGHT = { collapsed: 350, expanded: 640 };

// Live and archived projects share one size, as tall as the About hub
const PROJECT_SIZE = { width: 300, height: 340 };
const NOTE_SIZE = { width: 260, height: 150 };
const SPREAD_GAP = 24;
const NOTE_GAP = 30;
const SKILLS_HEIGHT = 380;
const WRITEUPS_HEIGHT = 640;
// Space between the archived grid and the writeups card below it
const WRITEUPS_GAP = 34;

// Clear space between the hub and the projects on its left, and the archived cards on its right, in canvas px
const HUB_GAP = { min: 40, max: 400 };
// How much of the screen's half-width the outer edge of the project columns may reach when the hub is centred
const CLUSTER_REACH = 0.78;
// Cards across one cluster: two columns of project cards and the gap between them
const CLUSTER_WIDTH = PROJECT_SIZE.width * 2 + SPREAD_GAP;
const HUB_WIDTH = 600;

// The gap between the hub and the project clusters grows with the screen, so the clusters sit near the
// edges of a wide screen instead of leaving it empty, and tuck in closer on a narrow one
const hubGapFor = (viewportWidth: number): number => {
	const visibleHalfWidth = viewportWidth / 2 / MAX_FIT_ZOOM;
	const gap = visibleHalfWidth * CLUSTER_REACH - HUB_WIDTH / 2 - CLUSTER_WIDTH;
	return Math.round(Math.min(HUB_GAP.max, Math.max(HUB_GAP.min, gap)));
};

// Rect key of the open post-mortem panel; it sits in the row right after the card that opened it
export const POST_MORTEM_PANEL_ID = 'post-mortem-panel';

// The canvas (desktop) layout is a hand-placed map from card id to position. Skills, the About hub and
// Experience share one centre column (x 460-1060), 50px clear above and below. The live projects sit
// to its left and the archived ones to its right, mirrored: same card size, same gap to the hub, and
// each cluster's first card (where its pile forms until opened) nearest the hub, with its sticky note above.
export const buildLayout = (
	experienceHeight: number,
	openPostMortemId: string | null,
	viewportWidth: number
): Record<string, Rect> => {
	const hub = { x: 460, y: 285, width: HUB_WIDTH, height: 340 };
	const hubGap = hubGapFor(viewportWidth);
	const clusterY = hub.y;
	const columnStep = PROJECT_SIZE.width + SPREAD_GAP;
	const liveX = hub.x - hubGap - PROJECT_SIZE.width;
	const archivedX = hub.x + hub.width + hubGap;
	const noteY = clusterY - NOTE_SIZE.height - NOTE_GAP;

	const layout: Record<string, Rect> = {
		about: hub,
		skills: { x: hub.x, y: hub.y - 50 - SKILLS_HEIGHT, width: hub.width, height: SKILLS_HEIGHT },
		experience: {
			x: hub.x,
			y: hub.y + hub.height + 50,
			width: hub.width,
			height: experienceHeight
		},
		'note-0': { x: liveX, y: noteY, ...NOTE_SIZE },
		'note-1': { x: archivedX, y: noteY, ...NOTE_SIZE }
	};

	// 2-column grids filled row by row, spilling away from the hub
	const placeGrid = (cards: { id: string }[], firstX: number, direction: 1 | -1) => {
		const cellRect = (row: number, column: number): Rect => ({
			x: firstX + direction * column * columnStep,
			y: clusterY + row * (PROJECT_SIZE.height + SPREAD_GAP),
			...PROJECT_SIZE
		});
		const openIndex = cards.findIndex((card) => card.id === openPostMortemId);
		const openRow = Math.floor(openIndex / 2);

		cards.forEach((card, index) => {
			const row = Math.floor(index / 2);
			// The open card's panel takes the cell after it, pushing the cards further along its row
			const isPushed = openIndex !== -1 && row === openRow && index > openIndex;
			layout[card.id] = cellRect(row, (index % 2) + (isPushed ? 1 : 0));
		});
		if (openIndex !== -1) layout[POST_MORTEM_PANEL_ID] = cellRect(openRow, (openIndex % 2) + 1);
	};
	placeGrid(liveProjects, liveX, -1);
	placeGrid(archivedProjects, archivedX, 1);

	// Bottom right: under the archived grid, a little wider than the hub
	const archivedRows = Math.ceil(archivedProjects.length / 2);
	layout.writeups = {
		x: archivedX,
		y: clusterY + archivedRows * (PROJECT_SIZE.height + SPREAD_GAP) - SPREAD_GAP + WRITEUPS_GAP,
		width: hub.width + 260,
		height: WRITEUPS_HEIGHT
	};

	return layout;
};
