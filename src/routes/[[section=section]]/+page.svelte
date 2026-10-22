<script lang="ts">
	import { siteName, siteUrl } from '#lib/content/index.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const imageUrl = `${siteUrl}/og-image.png`;
</script>

<!-- The section itself is drawn by the layout's canvas; this route owns its URL and metadata -->
<svelte:head>
	<title>{data.title}</title>
	<meta name="description" content={data.description} />
	<link rel="canonical" href={data.canonicalUrl} />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:locale" content="en_GB" />
	<meta property="og:title" content={data.title} />
	<meta property="og:description" content={data.description} />
	<meta property="og:url" content={data.canonicalUrl} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta
		property="og:image:alt"
		content="{siteName}, full stack software engineer, with their main technologies"
	/>

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.title} />
	<meta name="twitter:description" content={data.description} />
	<meta name="twitter:image" content={imageUrl} />
</svelte:head>
