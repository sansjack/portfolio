<script lang="ts">
	import { resolve } from '$app/paths';

	type Props = { status: number; message: string; onretry?: () => void };

	let { status, message, onretry }: Props = $props();

	const actionClass =
		'rounded-full bg-accent px-6 py-2 text-lg text-white transition hover:brightness-110';
</script>

<main
	class="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center"
	style:background-image="radial-gradient(circle, var(--color-line) 1.5px, transparent 1.5px)"
	style:background-size="32px 32px"
>
	<p class="text-8xl leading-none text-accent">{status}</p>
	<h1 class="text-4xl text-foreground">{status === 404 ? 'Page not found' : 'Something broke'}</h1>
	<p class="max-w-md text-xl text-dim">{message}</p>
	{#if status === 404}
		<a href={resolve('/[[section=section]]', { section: '' })} class={actionClass}>
			Back to home
		</a>
	{:else if onretry}
		<button class="{actionClass} cursor-pointer" onclick={onretry}>Try again</button>
	{/if}
</main>
