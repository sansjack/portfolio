<script lang="ts">
	import { page } from '$app/state';
	import { ErrorScreen } from '#lib/components/error/index.ts';
</script>

<svelte:head>
	<title>{page.status} · Jack Sansom</title>
	<meta name="robots" content="noindex" />
</svelte:head>

{#if page.status !== 404}
	<ErrorScreen
		status={page.status}
		message={page.error?.message ?? 'An unexpected error occurred.'}
	/>
{/if}
