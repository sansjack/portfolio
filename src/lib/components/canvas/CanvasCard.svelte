<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { Rect } from '#lib/camera/index.ts';
	import type { Card } from '#lib/content/index.ts';
	import { CardBody } from '#lib/components/cards/index.ts';

	type Props = {
		card: Card;
		rect: Rect;
		active: boolean;
		sectionParam: string;
		transform?: string;
		transition: string;
	};

	let { card, rect, active, sectionParam, transform, transition }: Props = $props();

	// Projects and Experience hold links and buttons that stay inert until their section is focused
	const needsFocusFirst = $derived(
		card.kind === 'project' || card.kind === 'experience' || card.kind === 'writeups'
	);

	// Real links and buttons inside still work, except on cards that need focus first
	const onclick = (event: MouseEvent) => {
		const control = (event.target as Element).closest('a, button');
		if (control && !(needsFocusFirst && !active)) return;

		event.preventDefault();
		if (!active) goto(resolve('/[[section=section]]', { section: sectionParam }), { reset: false });
	};
</script>

<section
	class="absolute {active ? '' : 'cursor-pointer'}"
	onclickcapture={onclick}
	style:transform
	style:transition
	style:left="{rect.x}px"
	style:top="{rect.y}px"
	style:width="{rect.width}px"
	style:height="{rect.height}px"
>
	<CardBody {card} />
</section>
