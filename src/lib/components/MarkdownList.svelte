<script lang="ts">
const { token }: MarkdownListRenderProps = $props();
</script>

{#if token.ordered}
  <ol class="list-decimal list-inside">
    {#each token.items as item}

      <li class="list-item">

        {#each item.tokens as token}
          {token.raw}
        {/each}
      </li>
    {/each}
  </ol>
{:else}
  <ul class="list-disc list-inside">
    {#each token.items as item}
      <li class="list-item">
    
       {item.text}
      </li>
    {/each}
  </ul>
{/if}

