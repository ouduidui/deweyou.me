const navbar = require('./config/navbar');
const sidebar = require('./config/sidebar');
const {path} = require('@vuepress/utils');

const BASE_PATH = '/';

const generatePath = (path) => {
  if (path[0] === '/') path = path.slice(1);
  return BASE_PATH + path;
}


module.exports = {
  base: BASE_PATH,
  lang: 'zh-CN',
  title: 'OUDUIDUI',
  description: "OUDUIDUI's Blog | 分享我的编程学习笔记",
  head: [
    ['link', {rel: 'icon', href: generatePath('/images/logo/favicon.ico')}]
  ],

  themeConfig: {
    logo: '/images/logo/logo.png',
    logoDark: '/images/logo/logo_dark.png',
    navbar,
    sidebar,
    repo: 'OUDUIDUI',
    editLinkText: '在 GitHub 上编辑此页',
    docsRepo: 'https://github.com/OUDUIDUI',
    docsBranch: 'master',
    docsDir: 'docs',
    editLinkPattern: ':repo/edit/:branch/:path',
    lastUpdatedText: '上次更新',
    contributorsText: '贡献者'
  },
  bundler: '@vuepress/vite',
  plugins: [
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
          }
        },
      },
    ],
    [
      '@vuepress/plugin-shiki'
    ],
    [
      '@vuepress/register-components',
      {
        componentsDir: path.resolve(__dirname, './components')
      },
    ],
  ],
}