<script lang="ts">
	import { playSound, setVolume, sound, toggleMute } from '#lib/state/index.ts';

	// Silent either way, so the icon shows it
	const silent = $derived(sound.muted || sound.volume === 0);
</script>

<!-- Phones: the slider always sits inline beside the button, tucked into the corner. From sm up it slides out on hover or focus instead, so it stays out of the way until wanted -->
<div
	class="group fixed top-[max(0.25rem,env(safe-area-inset-top))] left-1 z-40 flex items-center opacity-60 transition-opacity focus-within:opacity-100 hover:opacity-100 sm:top-[max(0.75rem,env(safe-area-inset-top))] sm:left-4"
>
	<button
		type="button"
		class="p-2 text-dim group-hover:text-foreground"
		aria-label={silent ? 'Unmute sounds' : 'Mute sounds'}
		aria-pressed={silent}
		onclick={toggleMute}
	>
		<svg
			viewBox="0 0 24 24"
			class="size-5"
			fill="none"
			stroke="currentColor"
			stroke-width="1.75"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="M11 5 6 9H2v6h4l5 4V5z" />
			{#if silent}
				<path d="m23 9-6 6M17 9l6 6" />
			{:else}
				<path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
			{/if}
		</svg>
	</button>
	<input
		type="range"
		min="0"
		max="1"
		step="0.05"
		value={sound.muted ? 0 : sound.volume}
		aria-label="Sound volume"
		class="h-1 w-20 cursor-pointer accent-accent transition-[width,opacity] duration-200 motion-reduce:transition-none sm:w-0 sm:opacity-0 sm:group-focus-within:w-24 sm:group-focus-within:opacity-100 sm:group-hover:w-24 sm:group-hover:opacity-100"
		oninput={(event) => setVolume(Number(event.currentTarget.value))}
		onchange={() => playSound('toggle')}
	/>
</div>
