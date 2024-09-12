<script>
import "../app.css";
import { Github, Twitter, Linkedin } from "lucide-svelte";
import { cubicInOut, quintOut } from "svelte/easing";
import { fly, slide } from "svelte/transition";

const { children, data } = $props();
</script>

{#key data.url}
<section class="flex flex-col h-full animate-fade" in:fly={{ delay: 0, duration: 400, x: -1000, opacity: 0.2, easing: cubicInOut }} out:fly={{ delay: 0, duration: 400, x: -1000, opacity: 0.0, easing: cubicInOut }}>  

<div class="h-full w-full overflow-y-scroll" >
    {@render children()}
</div>



<footer class="footer px-2">

    <ul class="flex flex-row-reverse gap-2 items-center w-full my-1 ">
        <li class="link link-primary group ">
            <a href="https://www.linkedin.com/in/jacksansom" target="_blank"><Linkedin class="size-7 group-hover:stroke-[#0072b1]"/></a>
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