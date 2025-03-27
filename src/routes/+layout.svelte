<script>
	import '../app.css'
	import { Github, Twitter, Linkedin } from 'lucide-svelte'
	import { cubicInOut, quintOut } from 'svelte/easing'
	import { fly, slide } from 'svelte/transition'

	const { children, data } = $props()
</script>

<svelte:head>
	
	<meta name="title" content="jacksansom.dev | Portfolio" />
	<meta
		name="description"
		content="Jack Sansom's Portfolio, Featuring My Projects And Writeups." />

	<meta
		name="keywords"
		content="jacksansom.com, javascript, typescript, monitoring, SRE, reliability, javascript monitoring, sansjack dev, Jack Sansom, sveltekit developer, UK svelte developer, svelte developer, svelte, backend developer, frontend developer, frontend engineer, backend engineer, software engineer, software developer, devops engineer, devops developer, devops, monitoring, discord monitoring, slack monitoring, telegram monitoring, monitors, javascript log monitor" />
	<meta name="robots" content="index, follow" />
	<meta content="text/html; charset=utf-8" />
	<meta name="language" content="English" />
	<meta name="author" content="jacksansom" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="profile" />
	<meta property="og:site_name" content="jacksansom.com" />
	<meta property="profile:first_name" content="Jack" />
	<meta property="profile:last_name" content="Sansom" />
	<meta property="profile:username" content="sansjack" />
	<meta property="og:url" content="https://jacksansom.com" />
	<meta property="og:title" content="jacksansom.com | Portfolio" />
	<meta
		property="og:description"
		content="Jack Sansom's Portfolio - Featuring My Projects And Writeups." />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://jacksansom.com" />
	<meta
		property="twitter:title"
		content="Jack Sansom's Portfolio - Featuring My Projects And Writeups." />
	<meta
		property="twitter:description"
		content="The easy way monitor you code and receive logs to Slack, Discord & Telegram" />
</svelte:head>

{#key data.url}
	<section
		class="flex flex-col h-full animate-fade"
		in:fly={{
			delay: 0,
			duration: 400,
			x: -1000,
			opacity: 0.2,
			easing: cubicInOut,
		}}
		out:fly={{
			delay: 0,
			duration: 400,
			x: -1000,
			opacity: 0.0,
			easing: cubicInOut,
		}}>
		<div class="h-full w-full overflow-y-scroll">
			{@render children()}
		</div>

		<footer class="footer px-2">
			<ul class="flex flex-row-reverse gap-2 items-center w-full my-1">
				<li class="link link-primary group">
					<a href="https://www.linkedin.com/in/jacksansom" target="_blank"
						><Linkedin class="size-7 group-hover:stroke-[#0072b1]" /></a>
				</li>
				<li class="link link-primary group">
					<a href="https://github.com/sansjack" target="_blank"
						><Github class="size-7 group-hover:stroke-[#2dba4e]" /></a>
				</li>
				<li class="link link-primary group">
					<a href="https://twitter.com/sansjackdev" target="_blank"
						><Twitter class="size-7 group-hover:stroke-[#1DA1F2]" /></a>
				</li>
				<div class="mx-2">
					open for freelance work:
					<code class="self-end link font-bold">
						<a href="mailto:contact@sansjack.dev">contact@jacksansom.com</a
						></code>
				</div>
			</ul>
		</footer>
	</section>
{/key}
