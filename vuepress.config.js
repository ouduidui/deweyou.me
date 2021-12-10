const BASE_PATH = '/blogs/';

const generatePath = (path) => {
    if(path[0] === '/') path = path.slice(1);
    return BASE_PATH + path;
}

/**
 * 顶部导航 https://v2.vuepress.vuejs.org/zh/reference/default-theme/config.html#navbar
 */
const navbar = [];

/**
 * 侧边栏 https://v2.vuepress.vuejs.org/zh/reference/default-theme/config.html#sidebar
 */
const sidebar = [];

module.exports = {
    base: BASE_PATH,
    lang: 'zh-CN',
    title: 'OUDUIDUI',
    description: "OUDUIDUI's Blog | 分享我的编程学习笔记",
    head: [
        ['link', { rel: 'icon', href: generatePath('/images/logo/favicon.ico') }]
    ],

    themeConfig: {
        logo: '/images/logo/logo.png',
        logoDark: '/images/logo/logo_dark.png',
        navbar,
        sidebar,
        repo: 'OUDUIDUI/blogs',
        editLinkText: '在 GitHub 上编辑此页',
        docsBranch: 'master',
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
    ],
}