/**
 * 侧边栏 https://v2.vuepress.vuejs.org/zh/reference/default-theme/config.html#sidebar
 */
const sidebar = {
  '/front-end/': [
    {
      text: 'CSS',
      children: [
        '/front-end/css/clipping-and-masking.md'
      ]
    },
    {
      text: 'JavaScript',
      children: [
        '/front-end/javascript/event-loop.md',
        '/front-end/javascript/handwriting-promise.md',
        '/front-end/javascript/required-and-import.md'
      ]
    },
    {
      text: 'Vue',
      children: [
        '/front-end/vue/vue-diff.md',
        '/front-end/vue/vue2-and-vue3-component-communication.md',
        '/front-end/vue/vue-components-communication.md',
        '/front-end/vue/simple-vue2.md',
        '/front-end/vue/simple-vue-router.md',
        '/front-end/vue/simple-vuex.md',
      ]
    },
    {
      text: '前端工程化',
      children: [
        '/front-end/engineering/webpack-study.md',
        '/front-end/engineering/publish-npm-by-github-actions.md'
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