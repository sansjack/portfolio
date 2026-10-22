<script lang="ts">
	let { url }: { url: string } = $props();

	let status = $state<'idle' | 'copied' | 'failed'>('idle');

	const copyLink = async () => {
		try {
			await navigator.clipboard.writeText(url);
			status = 'copied';
		} catch (error) {
			console.error('Could not copy the writeup link', error);
			status = 'failed';
		}
		setTimeout(() => (status = 'idle'), 2000);
	};
</script>

<button type="button" class="cursor-pointer text-xl text-accent link-underline" onclick={copyLink}>
	{status === 'copied'
		? 'Link copied ✓'
		: status === 'failed'
			? 'Copy failed'
			: 'Copy link to clipboard'}
	<span class="sr-only" aria-live="polite">
		{status === 'copied' ? 'Link copied to the clipboard' : ''}
	</span>
</button>
