<script lang="ts">
  import Markdown from '@magidoc/plugin-svelte-marked'
  import { ArrowLeft, Link } from 'lucide-svelte'

  import '../../code.css'
  import hljs from 'highlight.js'

  import { browser } from '$app/environment'
  import { onMount } from 'svelte'

  const { data } = $props()
  const { writeup } = data

  onMount(() => {
    if (browser) {
      hljs.highlightAll()
    }
  })
</script>

<div class="absolute top-0 left-0">
  <a href="/" class="relative w-full h-full">
    <ArrowLeft class="size-7 m-1" />
  </a>
</div>
<div class="flex flex-col items-center w-full h-full mt-4">
  <div class="w-full m-8 p-8 md:p-2 md:m-1 md:w-3/4 lg:w-[60%]">
    <h1 class="text-4xl text-primary">{writeup.title}</h1>

    <p>
      {writeup.description}
    </p>
    <div class="flex justify-end items-end mt-2">
      <a
        href={writeup.external_ref}
        target="_blank"
        class="btn btn-sm text-sm btn-primary self-end"
        >Check it out! <Link class="size-4" /></a
      >
    </div>
    <div class="divider mt-1" />
    <div
      class="flex flex-col prose [&>*]:mb-1 [&>*]:pl-0 [&>pre]:p-3 min-w-full h-full overflow-y-scroll"
    >
      <Markdown source={writeup.data} />
    </div>
  </div>
</div>
