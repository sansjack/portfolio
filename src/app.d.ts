import '@poppanator/sveltekit-svg/dist/svg'
import type { MarkdownOptions, Renderers } from '@magidoc/plugin-svelte-marked'
import type { Tokens } from 'marked'

declare global {
  type MarkdownImageRenderProps = {
    token: Tokens.Image
    options: MarkdownOptions | undefined
    renderers: Renderers | undefined
  }
  type MarkdownLinkRenderProps = {
    token: Tokens.Link
    options: MarkdownOptions | undefined
    renderers: Renderers | undefined
  }
  type MarkdownListRenderProps = {
    token: Tokens.List
    options: MarkdownOptions | undefined
    renderers: Renderers | undefined
  }
  
  interface Writeup {
    title: string
    description: string
    link: string
    external_ref?: string
    data: string
    date: number
  }
  interface Project {
    id: number
    title: string
    icon: any
    description: string
    link: string
    date: string
  }
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {}
