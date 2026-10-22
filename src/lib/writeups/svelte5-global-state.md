---
title: Global state in Svelte 5 is almost suspiciously easy
date: 2024-11-26
summary: Runes turn a plain .svelte.ts file into shared reactive state.
---

Sharing state between components used to mean reaching for stores and a pile of ceremony. Then Svelte 5 shipped [runes](https://svelte.dev/blog/runes), and most of that ceremony quietly disappeared.

I won't walk through every rune here. The point is to show what they make possible once you step outside `.svelte` files and into plain TypeScript.

## What I mean by global state

A centralised pool of data that any component, anywhere in the app, can read and change. Think the logged-in user, a shopping cart, or the little popups that tell you something worked.

## The trick

Put a `$state()` rune inside a `.svelte.ts` or `.svelte.js` file and the compiler makes it reactive, even though it isn't a component.

```ts
let count = $state(0);
```

There's a catch, because there always is. You can't just `export` a reassigned `$state` variable and import it somewhere else, since Svelte refuses to compile it. The fix is to wrap the state in an object and expose it through a getter.

---

## Start small: a counter

```ts
let count = $state(0);

export const getCounter = () => {
	const increment = () => {
		count += 1;
	};

	return {
		get count() {
			return count;
		},
		increment
	};
};
```

`getCounter()` hands back a tiny API: read the value, bump the value. The getter is what keeps things reactive, because every read goes back to the live `$state`.

Using it in a component is a few lines:

```svelte
<script lang="ts">
	import { getCounter } from '$lib/state';

	const counter = getCounter();
</script>

<button onclick={counter.increment}>
	{counter.count}
</button>
```

> One thing to know: that `count` lives at module level, so everyone on the server shares it. That's harmless in the browser, but for anything per-user you want context, which is exactly what the next example uses.

---

## Level up: a toast system

A counter is cute. Toasts are real. We want to fire a message from any component and have it appear, then vanish on its own, with zero leaked timers.

```ts
import { getContext, onDestroy, setContext } from 'svelte';

type ToastLevel = 'info' | 'success' | 'warn' | 'error';

interface Toast {
	id: string;
	message: string;
	level: ToastLevel;
}

export class ToastState {
	toasts = $state<Toast[]>([]);
	toastMap = new Map<string, number>();

	constructor() {
		onDestroy(() => {
			for (const timeout of this.toastMap.values()) {
				clearTimeout(timeout);
			}
			this.toastMap.clear();
		});
	}

	add(message: string, level: ToastLevel, showDuration = 5000) {
		const id = crypto.randomUUID();

		this.toasts.push({
			id,
			message,
			level
		});

		this.toastMap.set(
			id,
			window.setTimeout(() => {
				this.delete(id);
			}, showDuration) as number
		);
	}

	delete(id: string) {
		const timeout = this.toastMap.get(id);

		if (timeout) {
			window.clearTimeout(timeout);
		}

		this.toasts = this.toasts.filter((toast) => toast.id !== id);
	}
}

export const setToastState = () => {
	return setContext('TOAST', new ToastState());
};

export const getToastState = () => {
	return getContext<ReturnType<typeof setToastState>>('TOAST');
};
```

A few things are quietly doing the heavy lifting here:

- **`$state` inside a class** makes `toasts` reactive, so pushing to it is enough to update the UI.
- **Context** scopes the state to one app instance, so nothing leaks between users.
- **`onDestroy`** clears every pending timer, so a toast can't fire after its page is gone.

## Rendering them

The display component is almost boring, which is the whole idea. Whenever a toast lands in the array, it shows up.

```svelte
<script lang="ts">
	const toastState = getToastState();
</script>

<div class="absolute right-2 bottom-2 z-20 flex flex-col gap-2">
	{#each toastState.toasts as toast}
		<div transition:fly={{ x: 100, duration: 500 }}>
			<Toast {toast} />
		</div>
	{/each}
</div>
```

---

## The takeaway

Reactive state in a plain TypeScript class, shared through context, rendered with a one-line loop. No store subscriptions, no boilerplate. That's the part of Svelte 5 I enjoy most, and I'd rather you go and try it than read me describe every detail.
