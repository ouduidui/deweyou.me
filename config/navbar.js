/**
 * 顶部导航 https://v2.vuepress.vuejs.org/zh/reference/default-theme/config.html#navbar
 */
 const navbar = [
  {
    text: '前端',
    children: [
      {
        text: 'CSS',
        link: '/front-end/css/clipping-and-masking.md'
      },
      {
        text: 'JavaScript',
        link: '/front-end/javascript/event-loop.md'
      },
      {
        text: 'Vue',
        link: '/front-end/vue/vue-diff.md'
      },
      {
        text: '工程化',
        link: '/front-end/engineering/webpack-study.md'
      },
    ],
  },
  {
    text: '编程工具',
    children: [
      {
        text: 'Git',
        link: '/tools/git/git.md'
      }
    ],
  },
];

module.exports = navbar;