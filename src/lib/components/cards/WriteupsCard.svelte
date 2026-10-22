<script lang="ts">
	import { resolve } from '$app/paths';
	import { formatWriteupDate, type Writeup } from '#lib/content/index.ts';

	let { items }: { items: Writeup[] } = $props();
</script>

<div
	class="relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-md shadow-black/5 max-md:min-h-[32rem]"
>
	<div class="flex flex-1 flex-col p-6 md:p-9">
		<h2
			class="flex -rotate-1 items-baseline gap-3 text-4xl leading-none text-foreground md:text-7xl"
		>
			<span class=" pb-1 font-bold tracking-tight">Rants</span>
			<span class="text-dim">/</span>
			<span class="font-normal">writeups</span>
		</h2>
		<ul class="mt-5 flex flex-1 flex-col justify-between">
			{#each items as item (item.slug)}
				<li class="border-t border-line first:border-t-0">
					<a
						href={resolve('/writeups/[slug]', { slug: item.slug })}
						data-sveltekit-preload-data="eager"
						class="group flex items-baseline gap-4 py-3 md:py-4"
					>
						<span
							class="min-w-0 flex-1 transition-transform duration-200 group-hover:translate-x-1"
						>
							<span
								class="block truncate text-xl text-foreground group-hover:text-accent md:text-3xl"
							>
								{item.title}
							</span>
							<span class="block truncate text-base text-dim md:text-xl">{item.summary}</span>
						</span>
						<time datetime={item.date} class="shrink-0 text-sm text-dim md:text-lg">
							{formatWriteupDate(item.date)}
						</time>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</div>
