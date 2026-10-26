<script lang="ts">
	import { onMount } from 'svelte';
	import { prefersReducedMotion } from '#lib/camera/index.ts';

	// Hover the ball this long and the page flickers
	const FLICKER_AFTER_MS = 600;
	// Opacity of a dark veil over the page; each step snaps to the next, so the light stutters
	const FLICKER_STEPS = [0, 0.35, 0, 0.5, 0.1, 0.4, 0, 0.25, 0];
	const FLICKER_DURATION_MS = 700;

	let theme = $state<'light' | 'dark'>('light');
	// Bumped on every pull so the swing animation restarts
	let pulls = $state(0);
	let veil: HTMLElement;
	let flickerTimer: ReturnType<typeof setTimeout> | undefined;

	onMount(() => {
		theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
		return () => clearTimeout(flickerTimer);
	});

	const pull = () => {
		theme = theme === 'dark' ? 'light' : 'dark';
		pulls++;
		document.documentElement.dataset.theme = theme;
		try {
			localStorage.setItem('theme', theme);
		} catch {
			// Private mode or blocked storage: the choice only lasts for this visit
		}
	};

	const startFlickerTimer = (event: PointerEvent) => {
		// A tap on touch screens is a pull, not a hover
		if (event.pointerType !== 'mouse' || prefersReducedMotion()) return;

		flickerTimer = setTimeout(() => {
			// The step easing is per keyframe, so each opacity holds until the next one snaps in
			veil.animate(
				FLICKER_STEPS.map((opacity) => ({ opacity, easing: 'steps(1, end)' })),
				{ duration: FLICKER_DURATION_MS }
			);
		}, FLICKER_AFTER_MS);
	};
</script>

<div
	bind:this={veil}
	class="pointer-events-none fixed inset-0 z-30 bg-black opacity-0"
	aria-hidden="true"
></div>

<!-- Warm glow around the ball while the light is on (dark theme); the cord only exists from sm up -->
<div
	class="pointer-events-none fixed top-[0.7rem] -right-[1.4rem] z-30 hidden size-40 rounded-full bg-[radial-gradient(circle,rgb(255_190_90/0.18),rgb(255_190_90/0.06)_40%,transparent_70%)] mix-blend-screen transition-opacity duration-700 sm:block {theme ===
	'dark'
		? 'opacity-100'
		: 'opacity-0'}"
	aria-hidden="true"
></div>

<button
	class="fixed top-0 right-8 z-40 hidden cursor-pointer px-3 text-foreground sm:block"
	aria-label="Switch to {theme === 'dark' ? 'light' : 'dark'} mode"
	aria-pressed={theme === 'dark'}
	onclick={pull}
	onpointerenter={startFlickerTimer}
	onpointerleave={() => clearTimeout(flickerTimer)}
>
	{#key pulls}
		<svg
			viewBox="0 0 20 110"
			class="swing h-28 w-7 overflow-visible"
			class:swinging={pulls > 0}
			fill="none"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			aria-hidden="true"
		>
			<line x1="10" y1="-24" x2="10" y2="84" />
			<circle
				cx="10"
				cy="90"
				r="6"
				stroke="none"
				fill={theme === 'dark' ? '#ffd36b' : 'var(--color-line)'}
				style:filter={theme === 'dark' ? 'drop-shadow(0 0 8px rgb(255 190 90 / 0.9))' : 'none'}
				class="transition-[fill] duration-500"
			/>
		</svg>
	{/key}
</button>

<!-- Phones: a wall light switch along the top instead of a cord. On means the lights are on (light theme). -->
<button
	class="fixed top-[max(0.25rem,env(safe-area-inset-top))] right-1 z-40 cursor-pointer p-2 sm:hidden"
	role="switch"
	aria-checked={theme === 'light'}
	aria-label="Light mode"
	onclick={pull}
>
	<span
		class="block h-5 w-9 rounded-md border border-line bg-surface p-0.5 shadow-sm inset-shadow-xs shadow-black/10"
	>
		<span
			class="flex h-full w-1/2 items-center justify-center gap-0.5 rounded-sm border border-line bg-panel shadow-sm transition-transform duration-200 motion-reduce:transition-none {theme ===
			'light'
				? 'translate-x-full'
				: ''}"
		>
			<!-- Grip ridges on the rocker -->
			<span class="h-2 w-px bg-dim/60"></span>
			<span class="h-2 w-px bg-dim/60"></span>
		</span>
	</span>
</button>

<style>
	.swing {
		transform-origin: 50% 0;
	}

	.swinging {
		animation: swing 1.8s ease-out;
	}

	@keyframes swing {
		0% {
			rotate: 0deg;
		}
		20% {
			rotate: -9deg;
		}
		40% {
			rotate: 6deg;
		}
		60% {
			rotate: -3.5deg;
		}
		80% {
			rotate: 1.5deg;
		}
		100% {
			rotate: 0deg;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.swinging {
			animation: none;
		}
	}
</style>
