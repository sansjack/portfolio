<script lang="ts">
	import type { NoteCard } from '#lib/content/index.ts';

	let { title, text }: Pick<NoteCard, 'title' | 'text'> = $props();
</script>

<div
	class="flex size-full rotate-[-2deg] flex-col gap-2 bg-note p-4 text-note-ink shadow-md shadow-black/15 transition-transform duration-200 hover:rotate-0"
>
	<h2 class="w-fit border-b-2 border-note-ink/30 text-xl leading-none font-semibold">{title}</h2>
	<p class="text-lg leading-snug whitespace-pre-line">{text}</p>
</div>
