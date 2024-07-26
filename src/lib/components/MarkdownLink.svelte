<script lang="ts">
  const { token }: MarkdownLinkRenderProps = $props()
</script>

<a href={token.href} class="tooltip link link-primary" data-tip={token.href}>
  {token.text}
</a>
