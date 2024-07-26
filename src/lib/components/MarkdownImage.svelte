<script lang="ts">
  const { token }: MarkdownImageRenderProps = $props()
</script>

<img
  src={token.href}
  title={token.title}
  alt={token.text}
  class="custom-image"
/>

<style>
  .custom-image {
    max-width: 50%;
  }
</style>
