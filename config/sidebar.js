/**
 * 侧边栏 https://v2.vuepress.vuejs.org/zh/reference/default-theme/config.html#sidebar
 */
const sidebar = {
  '/front-end/': [
    {
      text: 'CSS',
      children: [
        '/front-end/css/clip-and-mask.md'
      ]
    },
    {
      text: 'JavaScript',
      children: [
        '/front-end/javascript/event-loop.md',
        '/front-end/javascript/hw-promise.md',
        '/front-end/javascript/js-module.md'
      ]
    },
    {
      text: 'Vue',
      children: [
        '/front-end/vue/vue-diff.md',
        '/front-end/vue/vue-component.md',
        '/front-end/vue/vue2-component.md',
        '/front-end/vue/simple-vue2.md',
        '/front-end/vue/simple-vue-router.md',
        '/front-end/vue/simple-vuex.md',
      ]
    },
    {
      text: '前端工程化',
      children: [
        '/front-end/engineering/webpack-study.md',
        '/front-end/engineering/publish-npm.md'
      ]
    },
  ],
  '/tools/': [
    {
      text: 'Git',
      children: [
        '/tools/git/git.md',
        '/tools/git/git-commit-message.md',
        '/tools/git/git-flow.md'
      ]
    }
  ]
};

module.exports = sidebar