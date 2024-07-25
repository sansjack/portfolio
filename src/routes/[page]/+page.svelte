<script lang="ts">
  import Markdown from '@magidoc/plugin-svelte-marked'
  const { data } = $props()
  const { writeup } = data
</script>

<div class="absolute top-0 left-0">
  <a href="/" class="relative w-full h-full"> back </a>
</div>
<div class="flex flex-col items-center w-full h-full">
  <div class="w-full m-8 p-8 md:p-2 md:m-1 md:w-3/4 lg:w-[60%]">
    <div class="my-6 gap-2">
      <h1 class="text-4xl text-primary">{writeup.title}</h1>
      <p>
        {writeup.description}
      </p>
    </div>
    <div
      class="flex flex-col prose [&>*]:mb-1 [&>*]:pl-0 [&>pre]:p-3 min-w-full h-full overflow-y-scroll"
    >
      <Markdown source={writeup.data} />
    </div>
  </div>
</div>
