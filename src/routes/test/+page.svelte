<script lang="ts">
  import { MarkdownComponent } from '$lib/components'
  const markdownContent = `
# Welcome to My Markdown Example

Here's a JavaScript code block:

\`\`\`typescript
function greeting(name) {
    return \`Hello, \${name}!\`;
}

console.log(greeting('World'));
\`\`\`

And here's some Python:

\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
\`\`\`

Some CSS styling:

\`\`\`css
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}
\`\`\`
`
</script>

<MarkdownComponent content={markdownContent} />
