<script lang="ts">
	import type { PostMortem } from '#lib/content/index.ts';

	type Props = {
		title: string;
		href: string;
		postMortem: PostMortem;
		onclose: () => void;
		class: string;
	};

	let { title, href, postMortem, onclose, class: className }: Props = $props();
</script>

<aside
	data-post-mortem
	aria-label="{title} post-mortem"
	class="flex flex-col gap-3 border border-line bg-surface p-5 shadow-lg shadow-black/10 {className}"
>
	<div class="flex items-start justify-between gap-4">
		<h3 class="text-2xl leading-none text-foreground">{title}</h3>
		<button
			type="button"
			class="-m-2 cursor-pointer p-2 text-dim hover:text-foreground"
			aria-label="Close post-mortem"
			onclick={onclose}
		>
			✕
		</button>
	</div>
	<div class="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain">
		<div>
			<p class="text-sm tracking-widest text-dim uppercase">Why it failed</p>
			<p class="text-base leading-snug text-foreground">{postMortem.whyItFailed}</p>
		</div>
		<div>
			<p class="text-sm tracking-widest text-dim uppercase">What it was</p>
			<p class="text-base leading-snug text-dim">{postMortem.whatItWas}</p>
		</div>
	</div>
	<a
		{href}
		target="_blank"
		rel="external noopener noreferrer"
		class="shrink-0 rounded-full bg-accent px-5 py-1.5 text-center text-lg text-white transition hover:brightness-110"
	>
		Visit site ↗ <span class="sr-only">(opens in a new tab)</span>
	</a>
</aside>
