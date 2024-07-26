<script>
import "../app.css";
import { Github, Twitter, Linkedin } from "lucide-svelte";
import { cubicInOut, quintOut } from "svelte/easing";
import { fly, slide } from "svelte/transition";

const { children, data } = $props();
</script>
<svelte:head>
  <!-- Primary Meta Tags -->
  <title>sansjack.dev | Portfolio</title>
  <meta name="title" content="sansjack.dev | Portfolio" />
  <meta
    name="description"
    content="Jack Sansom's Portfolio, Featuring My Projects And Writeups."
  />

  <meta
    name="keywords"
    content="javascript, typescript, monitoring, SRE, reliability, javascript monitoring, sansjack dev, Jack Sansom, sveltekit developer, UK svelte developer, svelte developer, svelte, backend developer, frontend developer, frontend engineer, backend engineer, software engineer, software developer, devops engineer, devops developer, devops, monitoring, discord monitoring, slack monitoring, telegram monitoring, monitors, javascript log monitor"
  />
  <meta name="robots" content="index, follow" />
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="language" content="English" />
  <meta name="author" content="sansjack" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="profile" />
  <meta property="og:site_name" content="sansjack.dev" />
  <meta property="profile:first_name" content="Jack" />
  <meta property="profile:last_name" content="Sansom" />
  <meta property="profile:username" content="sansjack" />
  <meta property="og:url" content="https://sansjack.dev" />
  <meta
    property="og:title"
    content="sansjack.dev | Portfolio"
  />
  <meta
    property="og:description"
    content="Jack Sansom's Portfolio, Featuring My Projects And Writeups."
  />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://sansjack.dev" />
  <meta
    property="twitter:title"
    content="Jack Sansom's Portfolio, Featuring My Projects And Writeups."
  />
  <meta
    property="twitter:description"
    content="The easy way monitor you code and receive logs to Slack, Discord & Telegram"
  />
  <!-- <meta
    property="twitter:image"
    content="https://monitro.dev/images/og-text.png"
  /> -->

</svelte:head>
{#key data.url}
<section class="flex flex-col h-full" in:fly={{ delay: 300, duration: 500, x: -700, opacity: 0.5, easing: cubicInOut }} out:fly={{ delay: 100, duration: 500, x: -700, opacity: 0.5, easing: cubicInOut }}>  

<div class="h-full w-full overflow-y-scroll" >
    {@render children()}
</div>



<footer class="footer px-2">

    <ul class="flex flex-row-reverse gap-2 items-center w-full my-1 ">
        <li class="link link-primary group ">
            <a href="https://www.linkedin.com/in/sansjack/" target="_blank"><Linkedin class="size-7 group-hover:stroke-[#0072b1]"/></a>
        </li>
        <li class="link link-primary group">
            <a href="https://github.com/sansjack" target="_blank"><Github class="size-7 group-hover:stroke-[#2dba4e]"/></a>
        </li>
        <li class="link link-primary group">
            <a href="https://twitter.com/sansjackdev" target="_blank"><Twitter class="size-7 group-hover:stroke-[#1DA1F2]"/></a>
        </li>
        <div class="mx-2">
            open for freelance work, drop me an email:
        <code class="self-end link font-bold"> <a href="mailto:contact@sansjack.dev">contact@sansjack.dev</a></code>
    </div>
    
    </ul>
    
    </footer>
</section>
{/key}