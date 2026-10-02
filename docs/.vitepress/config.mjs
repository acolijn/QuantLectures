import { defineConfig } from 'vitepress';

// Served by the app's nginx at /docs (see Dockerfile and nginx.conf), so every
// page and asset lives under that base.
export default defineConfig({
  base: '/docs/',
  lang: 'en',
  title: 'MiniLectures Help',
  description: 'How to use MiniLectures — for students, teachers and administrators.',
  cleanUrls: true,
  lastUpdated: false,

  themeConfig: {
    siteTitle: 'MiniLectures Help',
    nav: [
      { text: 'Getting started', link: '/getting-started' },
      { text: 'Students', link: '/students/' },
      { text: 'Teachers', link: '/teachers/quick-start' },
      { text: 'Administrators', link: '/admin' },
      { text: 'Open the app', link: 'https://minilectures.app/', target: '_self' },
    ],

    sidebar: [
      {
        text: 'Getting started',
        items: [{ text: 'Accounts and signing in', link: '/getting-started' }],
      },
      {
        text: 'For students',
        items: [{ text: 'Using a course', link: '/students/' }],
      },
      {
        text: 'For teachers',
        items: [
          { text: 'Quick start', link: '/teachers/quick-start' },
          { text: 'Writing and editing chapters', link: '/teachers/writing' },
          { text: 'AI import and export', link: '/teachers/ai-import' },
          { text: 'Organising a course', link: '/teachers/organising' },
          { text: 'Sharing and access', link: '/teachers/sharing' },
          { text: 'Printing and PDF', link: '/teachers/printing' },
          { text: 'FAQ', link: '/teachers/faq' },
        ],
      },
      {
        text: 'For administrators',
        items: [{ text: 'Teacher accounts', link: '/admin' }],
      },
    ],

    search: { provider: 'local' },
    outline: { level: [2, 3] },
    footer: { message: 'MiniLectures · minilectures.app' },
  },
});
