<script lang="ts">
  import { projects, writeups } from '$lib'
  import dayjs from 'dayjs'
  import {
    SvelteIcon,
    PostgresIcon,
    SupabaseIcon,
    VercelIcon,
    CloudflareIcon,
    MongoIcon,
    AWSIcon,
  } from '$lib/icons'
  import relativeTime from 'dayjs/plugin/relativeTime'
  dayjs.extend(relativeTime)
</script>

<div
  class="flex flex-col w-full h-full overflow-auto sm:flex items-center justify-center"
>
  <div
    class="py-4 px-4 max-w-4xl flex flex-col items-center space-y-0 leading-tight gap-2"
  >
    <div class="flex flex-col items-center justify-center">
      <div class="flex flex-row items-center gap-4">
        <h1 class="text-4xl text-start">Jack Sansom</h1>

        <div class="avatar mb-2">
          <div class="w-16 rounded-full">
            <img src="/images/me.jpg" />
          </div>
        </div>
      </div>
      <p class="text-md opacity-80 text-center">
        site reliability enginer / software engineer
      </p>
    </div>
  </div>
  <div id="tech-list" class="tech-list flex flex-row items-center gap-4 mb-4">
    <div><SvelteIcon class="size-10" /></div>
    <div><PostgresIcon class="size-10" /></div>
    <div><MongoIcon class="size-10" /></div>
    <div><SupabaseIcon class="size-10" /></div>
    <div><CloudflareIcon class="size-10" /></div>
    <div><AWSIcon class="size-10" /></div>
    <div><VercelIcon class="size-12" /></div>
  </div>
  <div class="flex flex-col items-center justify-center m-8 md:m-1">
    <ul class="w-full space-y-2 sm:space-y-0">
      <h3>Writeups 🖊️</h3>
      <div class="divider !my-1" />
      {#each writeups as writeup}
        <li
          class="flex flex-row justify-between hover:bg-text -mx-2 px-2 space-x-5 text-sm md:text-base"
        >
          <div
            class="tooltip items-start text-start"
            data-tip={writeup.description}
          >
            <a href={writeup.link} class="link link-primary font-bold"
              >{writeup.title}</a
            >
          </div>
          <p>{dayjs.unix(writeup.date).fromNow()}</p>
        </li>
      {/each}
    </ul>
    <div class="w-full my-4">
      <ul class="w-full space-y-4 gap-8 sm:space-y-0 my-2">
        <h3>Projects 🏗️</h3>
        <div class="divider !my-1" />
        {#each projects as project}
          <li
            class="flex flex-row justify-between hover:bg-text -mx-2 px-2 space-x-5"
          >
            <div
              class="tooltip flex flex-row gap-2 my-1 group"
              data-tip={project.description}
            >
              <svelte:component
                this={project.icon}
                class="size-7 grayscale group-hover:grayscale-0 "
              />
              <a
                target="_blank"
                href={project.link}
                class="link hover:link-primary font-bold"
              >
                {project.title}</a
              >
            </div>
            <p>
              {#if typeof project.date === 'number'}
                {dayjs.unix(project.date).fromNow()}
              {:else}
                <span class="badge badge-accent"> {project.date}</span>
              {/if}
            </p>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</div>

<style>
  .tech-list > * {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.6s ease-in-out forwards;
    animation-delay: calc(var(--i) * 0.3s);
    --i: 0;
  }

  .tech-list > *:nth-child(1) {
    --i: 1;
  }
  .tech-list > *:nth-child(2) {
    --i: 2;
  }
  .tech-list > *:nth-child(3) {
    --i: 3;
  }
  .tech-list > *:nth-child(4) {
    --i: 4;
  }
  .tech-list > *:nth-child(5) {
    --i: 5;
  }
  .tech-list > *:nth-child(6) {
    --i: 6;
  }
  .tech-list > *:nth-child(7) {
    --i: 7;
  }

  @keyframes fadeInUp {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
