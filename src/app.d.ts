import '@poppanator/sveltekit-svg/dist/svg'
declare global {
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
