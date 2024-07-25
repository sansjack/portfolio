import { MonitroIcon, PortfoloIcon } from '$lib/icons'
import { LayoutTemplate } from 'lucide-svelte'

export const writeups = [
  {
    id: 12342,
    title: 'Telegram Forwarder',
    description: 'A telegram bot that forwards messages to a telegram channel',
    link: '/telegram-forwarder',
    data: '123',
    date: 1721058406,
  },
  {
    id: 319741,
    title: 'Discord Bot Comment Creation For Shortcut.com',
    description:
      'An automation using shortcut.com to create comments on discord',
    link: 'https://github.com/sansjack/telegram-forwarder',
    date: 1721058406,
  },
]

export const projects = [
  {
    id: 2,
    title: 'portfolo.app',
    icon: PortfoloIcon,
    description: 'Create A Portfolio And Add Projects Using Markdown',
    link: 'https://portfolo.app',
    date: 'beta',
  },
  {
    id: 1,
    title: 'monitro.dev',
    icon: MonitroIcon,
    description: 'Simple & Cheap Log Monitoring',
    link: 'https://monitro.dev',
    date: 1718121600,
  },
  {
    id: 0,
    title: 'boilermate.site',
    icon: LayoutTemplate,
    description:
      'Share your code boilerplates to help everyone learn and deploy faster!',
    link: 'https://boilermate.site',
    date: 1714147200,
  },
]
