<script lang="ts">
	import { asset } from '$app/paths';
	import type { AssetPath } from '$app/types';

	let { icon, accent }: { icon: AssetPath; accent: string } = $props();
</script>

<div
	class="relative grid min-h-28 flex-1 place-items-center overflow-hidden bg-surface"
	style:background-image="radial-gradient(circle at 50% 120%, {accent}55, transparent 70%),
	linear-gradient(135deg, {accent}22, transparent)"
>
	<img
		src={asset(icon)}
		alt=""
		width="64"
		height="64"
		loading="lazy"
		class="size-16 rounded-2xl shadow-lg ring-1 shadow-black/20 ring-black/10"
		draggable="false"
	/>
</div>
