import type { Rect } from '#lib/camera/index.ts';
import { archivedProjects, getSection, liveCards, liveProjects } from './sections.ts';
import type { SectionId, ViewId } from './types.ts';

export const EXPERIENCE_HEIGHT = { collapsed: 332, expanded: 648 };

const PROJECT_SIZE = { width: 300, height: 340 };
const NOTE_SIZE = { width: 260, height: 150 };
const LOST_SIZE = { width: 320, height: 340 };
const LOST_GAP = 260;
const SPREAD_GAP = 24;
const BLOCK_GAP = 40;
const SKILLS_HEIGHT = 380;
const LIVE_HEIGHT = 180;
const WRITEUPS_HEIGHT = EXPERIENCE_HEIGHT.expanded;

const CLUSTER_WIDTH = PROJECT_SIZE.width * 2 + SPREAD_GAP;
const HUB_WIDTH = 600;

export const POST_MORTEM_PANEL_ID = 'post-mortem-panel';

// The canvas (desktop) layout is a hand-placed map from card id to position. Skills, the About hub and
// Experience share one centre column (x 460-1060), BLOCK_GAP clear above and below. The live projects sit
// to its left and the archived ones to its right, mirrored: same card size, same gap to the hub, and
// each cluster's first card (where its pile forms until opened) nearest the hub, with its sticky note above.
export const buildLayout = (
	experienceHeight: number,
	openPostMortemId: string | null,
	activeId: ViewId
): Record<string, Rect> => {
	const hub = { x: 460, y: 285, width: HUB_WIDTH, height: 340 };
	const clusterY = hub.y;
	const columnStep = PROJECT_SIZE.width + SPREAD_GAP;
	const liveX = hub.x - BLOCK_GAP - PROJECT_SIZE.width;
	const archivedX = hub.x + hub.width + BLOCK_GAP;
	const noteY = clusterY - NOTE_SIZE.height - BLOCK_GAP;

	const layout: Record<string, Rect> = {
		about: hub,
		skills: {
			x: hub.x,
			y: hub.y - BLOCK_GAP - SKILLS_HEIGHT,
			width: hub.width,
			height: SKILLS_HEIGHT
		},
		experience: {
			x: hub.x,
			y: hub.y + hub.height + BLOCK_GAP,
			width: hub.width,
			height: experienceHeight
		},
		lost: {
			x: hub.x + (hub.width - LOST_SIZE.width) / 2,
			y: hub.y + hub.height + BLOCK_GAP + EXPERIENCE_HEIGHT.expanded + LOST_GAP,
			...LOST_SIZE
		},
		'note-0': { x: liveX, y: noteY, ...NOTE_SIZE },
		'note-1': { x: archivedX, y: noteY, ...NOTE_SIZE }
	};

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
			const isPushed = openIndex !== -1 && row === openRow && index > openIndex;
			layout[card.id] = cellRect(row, (index % 2) + (isPushed ? 1 : 0));
		});
		if (openIndex !== -1) layout[POST_MORTEM_PANEL_ID] = cellRect(openRow, (openIndex % 2) + 1);
	};
	placeGrid(liveProjects, liveX, -1);
	placeGrid(archivedProjects, archivedX, 1);

	// A pile only deals out into its grid while its section is open; closed, it is one card tall, so the
	// cards below it sit right under the pile instead of leaving a gap where the grid would be
	// Which pile a section sits under is declared on the section (`below`), which also drives its animation timing
	const yUnderPileOf = (sectionId: SectionId): number => {
		const pileId = getSection(sectionId).below;
		if (!pileId) throw new Error(`Section "${sectionId}" does not sit under a pile`);

		const pileSize = getSection(pileId).cards.filter((card) => card.kind === 'project').length;
		const rows = activeId === pileId ? Math.ceil(pileSize / 2) : 1;
		return clusterY + rows * (PROJECT_SIZE.height + SPREAD_GAP) - SPREAD_GAP + BLOCK_GAP;
	};

	liveCards.forEach((card, index) => {
		layout[card.id] = {
			x: liveX - columnStep,
			y: yUnderPileOf('live') + index * (LIVE_HEIGHT + SPREAD_GAP),
			width: CLUSTER_WIDTH,
			height: LIVE_HEIGHT
		};
	});

	layout.writeups = {
		x: archivedX,
		y: yUnderPileOf('writeups'),
		width: hub.width + 260,
		height: WRITEUPS_HEIGHT
	};

	return layout;
};
