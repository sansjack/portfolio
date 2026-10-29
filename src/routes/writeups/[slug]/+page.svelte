<script lang="ts">
	import { CopyLinkButton, WriteupArticle } from '#lib/components/writeups/index.ts';
	import writeupStyles from '#lib/components/writeups/writeup.css?url';
	import { siteName } from '#lib/content/index.ts';
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const imageUrl = $derived(`${data.canonicalUrl}/og.png`);
</script>

<svelte:head>
	<!-- By URL, not imported, so preloading this route from the canvas does not pull the styles in early -->
	<link rel="stylesheet" href={writeupStyles} />
	<title>{data.title}</title>
	<meta name="description" content={data.writeup.summary} />
	<link rel="canonical" href={data.canonicalUrl} />
	<meta property="og:type" content="article" />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:locale" content="en_GB" />
	<meta property="og:title" content={data.writeup.title} />
	<meta property="og:description" content={data.writeup.summary} />
	<meta property="og:url" content={data.canonicalUrl} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="630" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={data.writeup.title} />
	<meta property="article:published_time" content={data.writeup.date} />
	<meta property="article:author" content={siteName} />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={data.writeup.title} />
	<meta name="twitter:description" content={data.writeup.summary} />
	<meta name="twitter:image" content={imageUrl} />
</svelte:head>

<main
	class="flex min-h-svh flex-col items-center overflow-x-clip px-4"
	style:background-image="radial-gradient(circle, var(--color-line) 1.5px, transparent 1.5px)"
	style:background-size="32px 32px"
>
	<div
		class="relative isolate flex w-full max-w-2xl flex-1 flex-col gap-8 py-12 [--fade:4rem] md:[--fade:10rem]"
	>
		<div
			class="absolute -inset-x-(--fade) inset-y-0 -z-10 [mask-image:linear-gradient(to_right,transparent,black_var(--fade),black_calc(100%-var(--fade)),transparent)] backdrop-blur-lg"
			aria-hidden="true"
		></div>
		<div
			class="absolute -inset-x-(--fade) inset-y-0 -z-10 bg-background [mask-image:linear-gradient(to_right,transparent,rgb(0_0_0/0.35)_calc(var(--fade)*0.5),black_var(--fade),black_calc(100%-var(--fade)),rgb(0_0_0/0.35)_calc(100%-var(--fade)*0.5),transparent)]"
			aria-hidden="true"
		></div>
		<div class="flex items-center justify-between gap-6">
			<a
				href={resolve('/[[section=section]]', { section: 'writeups' })}
				class="w-fit text-base text-accent link-underline"
			>
				← All writeups
			</a>
			<CopyLinkButton url={data.canonicalUrl} />
		</div>
		<WriteupArticle writeup={data.writeup} canonicalUrl={data.canonicalUrl} />
	</div>
</main>
