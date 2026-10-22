# Portfolio

Personal portfolio for Jack Sansom, live at [jacksansom.com](https://jacksansom.com). A fully prerendered static site, with no server code at runtime.

I wanted to make this as fast and small a possible while feeling like a different feeling website. I didn't want to be a claude cannon so i decided to take a step back from my normal work and be creative with all the items i have learnt over the years on optimizing websites and optimal hosting choices.

I know the data / content approach is lazy but its fast, I could of used a KV Cache (Redis) and fetch the data from there and have a seperate service hydrating it from a persistent storage but its overkill..

## Stack

| Area      | Choice                                                                                    |
| --------- | ----------------------------------------------------------------------------------------- |
| Framework | [SvelteKit](https://svelte.dev/docs/kit) with [Svelte 5](https://svelte.dev) (runes mode) |
| Language  | TypeScript                                                                                |
| Styling   | [Tailwind CSS 4](https://tailwindcss.com) via `@tailwindcss/vite`                         |
| Build     | Vite, with `@sveltejs/adapter-static` (every route is prerendered)                        |
| Content   | `src/lib/profile.json` plus Markdown writeups rendered with `marked`                      |
| Tooling   | Bun, ESLint, Prettier, `svelte-check`                                                     |
| Hosting   | Cloudflare Workers (static assets)                                                        |

## Project layout

```
src/
  lib/
    profile.json        Profile, experience, projects, skills and socials
    writeups/           Markdown writeups, one file per post
    content/            Typed content model, sections and canvas layout
    camera/             Pan and zoom camera for the canvas
    state/              Shared Svelte 5 state
    components/         Canvas, cards, nav, theme, writeups, mobile, icons
  routes/
    [[section]]/        Section pages (home, projects, experience, skills, ...)
    writeups/[slug]/    Individual writeup pages
    sitemap.xml/        Sitemap generated at build time
static/                 Fonts, images, og-image.png, robots.txt
wrangler.jsonc          Cloudflare deploy config
```

## Development

Requires [Bun](https://bun.sh).

```sh
bun install
bun run dev        # start the dev server
bun run check      # type check with svelte-check
bun run lint       # prettier --check and eslint
bun run format     # prettier --write
```

## Building

```sh
bun run build      # outputs the static site to ./build
bun run preview    # serve the production build locally
```

## Content changes

- Edit `src/lib/profile.json` to update profile details, experience, projects and skills.
- Add a Markdown file to `src/lib/writeups/` to publish a new writeup. It is picked up by the writeup routes and the sitemap.
- The canonical site URL (`siteUrl`) comes from `profile.json`. It feeds the canonical link, Open Graph tags and sitemap, so change it there if the domain changes.

## Deploying

The site is deployed to Cloudflare Workers as static assets. `wrangler.jsonc` serves `./build` and falls back to the generated `404.html` for unknown routes.

```sh
bunx wrangler login          # first time only
bun run build && bunx wrangler deploy
```

The site is then live at `portfolio.<account-subdomain>.workers.dev`. To use the custom domain, add `jacksansom.com` under **Workers → portfolio → Settings → Domains & Routes** in the Cloudflare dashboard. The domain's DNS must be on Cloudflare.
