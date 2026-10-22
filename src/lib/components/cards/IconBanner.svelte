<script lang="ts">
	import { asset } from '$app/paths';

	let { icon, accent }: { icon: string; accent: string } = $props();
</script>

<div
	class="relative grid min-h-28 flex-1 place-items-center overflow-hidden bg-surface"
	style:background-image="radial-gradient(circle at 50% 120%, {accent}55, transparent 70%),
	linear-gradient(135deg, {accent}22, transparent)"
>
	<img
		src={asset(icon as Parameters<typeof asset>[0])}
		alt=""
		class="size-16 rounded-2xl shadow-lg ring-1 shadow-black/20 ring-black/10"
		draggable="false"
	/>
</div>
