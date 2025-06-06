import type { NavMenu, NavMenuItems } from '~/types/nav'

export const navMenu: NavMenu[] = [
  {
    heading: 'General',
    items: [
      {
        title: 'Dashboard',
        icon: 'i-lucide-home',
        link: '/',
      },
      {
        title: 'Devices',
        icon: 'i-lucide-washing-machine',
        link: '/devices',
      },
      {
        title: 'Items',
        icon: 'i-lucide-boxes',
        link: '/items',
      },
    ],
  },
  {
    heading: 'Settings',
    icon: 'i-lucide-settings',
    items: [
      {
        title: 'Settings',
        icon: 'i-lucide-settings',
        new: true,
        children: [
          {
            title: 'Profile',
            icon: 'i-lucide-circle',
            link: '/settings/profile',
          },
          {
            title: 'Account',
            icon: 'i-lucide-circle',
            link: '/settings/account',
          },
          {
            title: 'Appearance',
            icon: 'i-lucide-circle',
            link: '/settings/appearance',
          },
          {
            title: 'Notifications',
            icon: 'i-lucide-circle',
            link: '/settings/notifications',
          },
          {
            title: 'Display',
            icon: 'i-lucide-circle',
            link: '/settings/display',
          },
        ],
      },
    ],
  },
]

export const navMenuBottom: NavMenuItems = [
  // {
  //   title: 'Help & Support',
  //   icon: 'i-lucide-circle-help',
  //   link: 'https://github.com/dianprata/nuxt-shadcn-dashboard',
  // },
  // {
  //   title: 'Feedback',
  //   icon: 'i-lucide-send',
  //   link: 'https://github.com/dianprata/nuxt-shadcn-dashboard',
  // },
]
