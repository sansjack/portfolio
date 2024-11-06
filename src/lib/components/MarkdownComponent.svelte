<script lang="ts">
  import { onMount } from 'svelte'
  import { marked } from 'marked'
  import prism from 'prismjs'
  import { markedHighlight } from 'marked-highlight'
  import 'prismjs/themes/prism-okaidia.css'
  import 'prismjs/components/prism-javascript'
  import 'prismjs/components/prism-css'
  import 'prismjs/components/prism-python'

  interface MarkdownComponentProps {
    content: string
  }

  const { content }: MarkdownComponentProps = $props()
  let htmlContent = $state<string>('')

  // Configure marked options once, before rendering
  marked.setOptions({
    breaks: true,
    gfm: true,
    async: false, // Important: This makes marked.parse return a string instead of a Promise
  })

  marked.use(
    markedHighlight({
      highlight: (code: string, lang: string) => {
        if (prism.languages[lang]) {
          return prism.highlight(code, prism.languages[lang], lang)
        }
        return code
      },
    })
  )

  $effect(() => {
    if (content) {
      // Remove any leading/trailing backticks if they exist
      const cleanContent = content.replace(/^```|```$/g, '')
      htmlContent = marked.parse(cleanContent) as string
    }
  })
</script>

<div
  class="markdown-content flex flex-col prose [&>*]:mb-1 [&>*]:pl-0 [&>pre]:p-3 [&>ul]:mt-3 min-w-full h-full !overflow-x-hidden overflow-y-scroll"
>
  {@html htmlContent}
</div>

<style>
  :global(.markdown-content pre) {
    margin: 1em 0;
    padding: 1em;
    border-radius: 1rem;
    background: #282c34;
    overflow-x: auto;
  }

  :global(.markdown-content pre > code) {
    background: transparent;
    border: none;
  }

  :global(.markdown-content code) {
    background: #333;
    padding: 0.2em 0.4em;
    border-radius: 0.25rem;
    border: 1px solid #353935;
    color: #f4f4f4;
  }

  :global(.markdown-content a) {
    color: oklch(var(--p));
    text-decoration: underline;
  }

  :global(.markdown-content ul) {
    list-style-type: disc;
    padding-left: 1.5em;
  }

  :global(.markdown-content ul li) {
    display: list-item;
  }

  :global(.markdown-content ul li::marker) {
    color: currentColor;
  }
</style>
