/**
 * 顶部导航 https://v2.vuepress.vuejs.org/zh/reference/default-theme/config.html#navbar
 */
 const navbar = [
  {
    text: '前端',
    children: [
      {
        text: 'CSS',
        link: '/css/center.md'
      },
      {
        text: 'JavaScript',
        link: '/javascript/event-loop.md'
      },
      {
        text: 'Vue',
        link: '/vue/vue-component.md'
      },
      {
        text: '工程化',
        link: '/engineering/webpack-study.md'
      },
      {
        text: '源码',
        link: '/source-code/vue-diff.md'
      },
    ],
  },
  {
    text: '设计模式与算法',
    children: [
      {
        text: '设计模式',
        link: '/design-patterns/design-principles.md'
      },
      {
        text: '算法学习',
        link: '/algorithm/sort.md'
      },
      {
        text: '算法题',
        link: 'https://github.com/OUDUIDUI/leet-code'
      }
    ],
  },
  {
    text: '其他',
    children: [
      {
        text: 'Git',
        link: '/tools/git/git.md'
      }
    ],
  },
  {
    text: '推荐网站',
    link: '/website/README.md'
  },
];

module.exports = navbar;