<script lang="ts">
  import { projects } from '$lib'
  import dayjs from 'dayjs'
  import relativeTime from 'dayjs/plugin/relativeTime'
  dayjs.extend(relativeTime)
</script>

<div
  class="flex flex-col w-full h-full overflow-auto sm:flex items-center justify-center"
>
  <div
    class="py-8 px-4 max-w-4xl flex flex-col items-center space-y-0 leading-tight gap-2"
  >
    <h1 class="text-3xl text-start">sansjack</h1>
    <p class="text-md">site reliability enginer / software engineer</p>
  </div>
  <div class="flex flex-col items-center justify-center">
    <ul class="w-full space-y-2 sm:space-y-0">
      {#each projects as project}
        <li
          class="flex flex-row justify-between hover:bg-text -mx-2 px-2 space-x-5"
        >
          <div class="tooltip" data-tip={project.description}>
            <a href={project.link} class="link link-primary font-bold"
              >{project.title}</a
            >
          </div>
          <p>{dayjs.unix(project.date).fromNow()}</p>
        </li>
      {/each}
    </ul>
  </div>
</div>
