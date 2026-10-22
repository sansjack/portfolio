<script lang="ts">
	import writeupStyles from '#lib/components/writeups/writeup.css?url';
	import { resolve } from '$app/paths';
	import { CopyLinkButton, WriteupArticle } from '#lib/components/writeups/index.ts';
	import { siteName, siteUrl } from '#lib/content/index.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const imageUrl = `${siteUrl}/og-image.png`;
</script>

<svelte:head>
	<!-- By URL, not imported, so preloading this route from the canvas does not pull the styles in early -->
	<link rel="stylesheet" href={writeupStyles} />
	<title>{data.title}</title>
	<meta name="description" content={data.writeup.summary} />
	<link rel="canonical" href={data.canonicalUrl} />
	<meta property="og:type" content="article" />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:title" content={data.title} />
	<meta property="og:description" content={data.writeup.summary} />
	<meta property="og:url" content={data.canonicalUrl} />
	<meta property="og:image" content={imageUrl} />
	<meta property="article:published_time" content={data.writeup.date} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.title} />
	<meta name="twitter:description" content={data.writeup.summary} />
	<meta name="twitter:image" content={imageUrl} />
</svelte:head>

<main
	class="flex min-h-svh flex-col items-center overflow-x-clip px-4"
	style:background-image="radial-gradient(circle, var(--color-line) 1.5px, transparent 1.5px)"
	style:background-size="32px 32px"
>
	<div
		class="relative isolate flex w-full max-w-3xl flex-1 flex-col gap-8 py-16 [--fade:2.5rem] md:[--fade:6rem]"
	>
		<!-- Solid behind the reading column only; it blurs and fades out sideways so the dots show either side -->
		<div
			class="absolute -inset-x-(--fade) inset-y-0 -z-10 bg-background [mask-image:linear-gradient(to_right,transparent,black_var(--fade),black_calc(100%-var(--fade)),transparent)] backdrop-blur-md"
			aria-hidden="true"
		></div>
		<div class="flex items-center justify-between gap-6">
			<a
				href={resolve('/[[section=section]]', { section: 'writeups' })}
				class="w-fit text-xl text-accent link-underline"
			>
				← All writeups
			</a>
			<CopyLinkButton url={data.canonicalUrl} />
		</div>
		<WriteupArticle writeup={data.writeup} />
	</div>
</main>
