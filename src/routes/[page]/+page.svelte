<script lang="ts">
	import { ArrowLeft, Link } from 'lucide-svelte'
	import dayjs from 'dayjs'
	import { MarkdownComponent } from '$lib/components'

	const { data } = $props()
	const { writeup } = data
</script>

<svelte:head>
	<title>{writeup.title} | jacksansom.com</title>
	<meta name="title" content="{writeup.title} | jacksansom.com" />
	<meta
		name="description"
		content="Jack Sansom's Portfolio, Featuring My Projects And Writeups." />
	<meta
		name="keywords"
		content="javascript, typescript, monitoring, SRE, reliability, javascript monitoring, Jack Sansom, sveltekit developer, UK svelte developer, svelte developer, svelte, backend developer, frontend developer, frontend engineer, backend engineer, software engineer, software developer, devops engineer, devops developer, devops, monitoring, discord monitoring, slack monitoring, telegram monitoring, monitors, javascript log monitor" />
	<meta content="text/html; charset=utf-8" />
	<meta name="author" content="sansjack" />

	<meta name="robots" content="index, follow" />
	<meta name="og:type" content="article" />
	<meta name="og:description" content={writeup.description} />
	<meta name="og:title" content="{writeup.title} | jacksansom.dev" />
	<meta
		name="article:published_time"
		content={dayjs.unix(writeup.date).toISOString()} />
	<meta name="article:author" content="sansjack" />
	<meta name="article:section" content="software development" />
	<!-- <meta name="article:tag" content="/images/og-text.png" /> -->
</svelte:head>
<div class="absolute top-0 left-0 !bg-transparent">
	<a href="/" class="relative !bg-transparent">
		<ArrowLeft class="size-7 m-1" />
	</a>
</div>
<div class="flex flex-col items-center w-full h-full mt-4">
	<div
		class="w-full m-8 p-4 md:p-2 md:m-1 md:w-[80%] lg:[70%] md:mt-[5rem] lg:max-w-[1440px]">
		<h1 class="text-4xl text-primary">{writeup.title}</h1>

		<p class="mt-4">
			{writeup.description}
		</p>

		{#if writeup.external_ref}
			<div class="flex justify-end items-end mt-2">
				<a
					href={writeup.external_ref}
					target="_blank"
					class="btn btn-sm text-sm btn-primary self-end"
					>Check it out! <Link class="size-4" /></a>
			</div>
		{/if}
		<!-- svelte-ignore element_invalid_self_closing_tag -->
		<div class="divider mt-2" />
		<div
			class="flex flex-col prose [&>*]:mb-1 [&>*]:pl-0 [&>pre]:p-3 [&>ul]:mt-3 min-w-full h-full !overflow-x-hidden overflow-y-scroll">
			<MarkdownComponent content={writeup.data} />
		</div>
	</div>
</div>
