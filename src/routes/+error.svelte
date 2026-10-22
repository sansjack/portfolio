<script lang="ts">
	import { page } from '$app/state';
	import { ErrorScreen } from '#lib/components/error/index.ts';
</script>

<svelte:head>
	<title>{page.status} · Jack Sansom</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<!-- A 404 is the lost card on the canvas (see +layout.svelte); anything else is a standalone failure screen -->
{#if page.status !== 404}
	<ErrorScreen
		status={page.status}
		message={page.error?.message ?? 'An unexpected error occurred.'}
	/>
{/if}
