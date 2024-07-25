<script>
import "../app.css";
import { Github, Twitter, Linkedin } from "lucide-svelte";
import { cubicInOut, quintOut } from "svelte/easing";
import { fly, slide } from "svelte/transition";

const { children, data } = $props();

const url = $state(data.url);
</script>
{#key data.url}
<section class="flex flex-col h-full" in:fly={{ delay: 300, duration: 500, x: -700, opacity: 0.5, easing: cubicInOut }} out:fly={{ delay: 100, duration: 500, x: -700, opacity: 0.5, easing: cubicInOut }}>  

<div class="h-full w-full overflow-y-scroll" >
    {@render children()}
</div>



<footer class="footer">

    <ul class="flex flex-row-reverse gap-1 items-center w-full my-1">
        <li class="link link-primary group ">
            <a href="https://www.linkedin.com/in/sansjack/" target="_blank"><Linkedin class="size-7 group-hover:stroke-[#0072b1]"/></a>
        </li>
        <li class="link link-primary group">
            <a href="https://github.com/sansjack" target="_blank"><Github class="size-7 group-hover:stroke-[#2dba4e]"/></a>
        </li>
        <li class="link link-primary group">
            <a href="https://twitter.com/sansjackdev" target="_blank"><Twitter class="size-7 group-hover:stroke-[#1DA1F2]"/></a>
        </li>
        <code class="self-end mx-2">contact@sansjack.dev</code>
    
    </ul>
    
    </footer>
</section>
{/key}