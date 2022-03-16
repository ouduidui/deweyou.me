const { path } = require('@vuepress/utils')
const navbar = require('./config/navbar')
const sidebar = require('./config/sidebar')

const BASE_PATH = '/'

const generatePath = (path) => {
  if (path[0] === '/') path = path.slice(1)
  return BASE_PATH + path
}

module.exports = {
  onPrepared: async(app) => {
    const data = app.pages.map(page => ({
      key: page.key,
      path: page.path,
      title: page.title,
      date: page.date,
      frontmatter: page.frontmatter,
    }))
    await app.writeTemp('data.js', `export const posts = ${JSON.stringify(data)}`)
  },
  base: BASE_PATH,
  lang: 'zh-CN',
  title: 'Dewey Ou',
  description: 'Dewey Ou\'s Blogs website',
  keywords: ['blog'],
  head: [
    ['meta', { name: 'keywords', content: '欧怼怼,博客,ouduidui,blogs,dewey,前端,front-end,掘金' }],
    ['meta', { name: 'author', content: 'Dewey Ou' }],
    ['link', { rel: 'manifest', href: generatePath('/manifest.webmanifest') }],
    ['link', { rel: 'icon', href: generatePath('/images/logo/favicon.ico') }],
  ],

  themeConfig: {
    logo: '/images/logo/logo.svg',
    logoDark: '/images/logo/logo-dark.svg',
    navbar,
    sidebar,
    repo: 'ouduidui',
    editLink: false,
    lastUpdated: false,
    contributors: false,
  },
  bundler: '@vuepress/vite',
  plugins: [
    [
      '@vuepress/pwa',
      {
        skipWaiting: true,
      },
    ],
    [
      '@vuepress/plugin-google-analytics',
      {
        id: 'G-DXMVT8JDNK',
      },
    ],
    [
      '@vuepress/plugin-search',
      {
        locales: {
          '/': {
            placeholder: '搜索',
          },
        },
      },
    ],
    [
      '@vuepress/plugin-shiki',
    ],
    [
      '@vuepress/register-components',
      {
        componentsDir: path.resolve(__dirname, './components'),
      },
    ],
  ],
}
