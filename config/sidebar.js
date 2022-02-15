/**
 * 侧边栏 https://v2.vuepress.vuejs.org/zh/reference/default-theme/config.html#sidebar
 */
const sidebar = {
  '/css/': [
    {
      text: 'CSS',
      children: [
        '/css/center.md',
        '/css/stacking-context.md',
        '/css/clip-and-mask.md'
      ]
    }
  ],
  '/javascript/': [
    {
      text: 'JavaScript',
      children: [
        '/javascript/event-loop.md',
        '/javascript/wheels.md',
        '/javascript/hw-promise.md',
        '/javascript/js-module.md'
      ]
    }
  ],
  '/vue/': [
    {
      text: 'Vue',
      children: [
        '/vue/vue-component.md',
        '/vue/vue2-component.md'
      ]
    }
  ],
  '/engineering/': [
    {
      text: '前端工程化',
      children: [
        '/engineering/webpack-study.md',
        '/engineering/publish-npm.md'
      ]
    }
  ],
  '/source-code/': [
    {
      text: '源码',
      children: [
        '/source-code/vue-diff.md',
        '/source-code/simple-vue2.md',
        '/source-code/simple-vue-router.md',
        '/source-code/simple-vuex.md',
        '/source-code/mini-axios.md',
      ]
    }
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
  ],
  '/design-patterns/': [
    {
      text: '设计模式',
      children: [
        '/design-patterns/design-principles.md',
        '/design-patterns/singleton.md',
        '/design-patterns/factory.md',
        '/design-patterns/abstract-factory.md',
      ]
    }
  ],
  '/algorithm/': [
    {
      text: '算法学习',
      children: [
        '/algorithm/sort.md'
      ]
    }
  ]
};

module.exports = sidebar