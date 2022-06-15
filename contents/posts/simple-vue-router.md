---
title: 简单实现 Vue Router
description: 简单实现 Vue Router
date: 2021-04-09T08:00:00.000+00:00
author: Dewey Ou
---

[[toc]]

> [github](https://github.com/ouduidui/mini-vue-router3)

## vue-router

`Vue-router`是`Vue.js`官方的路由管理器。

它和`Vue.js`的核心深度集成，让构建单页面应用变得易如反掌。

### 安装

```shell script
vue add router
```

### 核心步骤

- 步骤一：使用`vue-router`插件

```javascript
//router.js
import Router from 'vue-router'

/*
 * VueRouter是一个插件
 *   1）实现并声明两个组件router-view router-link
 *   2）install: this.$router.push()
 * */
Vue.use(Router) // 引入插件
```

- 步骤二：创建 Router 实例

```javascript
// router.js
export default new Router({...})   // 导出Router实例
```

- 步骤三：在根组件添加该实例

```javascript
// main.js
import router from './router'
new Vue({
  router, // 添加到配置项
}).$mount('#app')
```

- 步骤四：添加路由视图

```vue
<!--  App.vue  -->
<router-view></router-view>
```

- 步骤五：导航

```vue
<router-link to="/">Home</router-link>
<router-link to="/about">About</router-link>
```

```javascript
this.$router.push('/')
this.$router.push('/about')
```

## vue-router 简单实现

### 需求分析

- 单页面应用程序中，`url`发生变化时候，不能刷新，显示对应视图
  - hash：`#/about`
  - History api：`/about`
- 根据`url`显示对应的内容
  - `router-view`
  - 数据响应式：`current`变量持有`url`地址，一旦变化，动态执行`render`

### 任务

- 实现一个插件
  - 实现`VueRouter`类
    - 处理路由选项
    - 监控`url`变化
    - 响应变化
  - 实现`install`方法
    - `$router`注册
    - 两个全局组件

### 实现

#### 创建新的插件

在`Vue2.x`项目中的`src`路径下，复制一份`router`文件，重命名为`ou-router`。

然后在`ou-router`路径下新建一个`ou-vue-router.js`文件，并将`index.js`文件中的`VueRouter`引入改为`ou-vue-router.js`。

```javascript
import VueRouter from './ou-vue-router'
```

同时将`main.js`中的`router`引入也修改一下。

```javascript
import router from './ou-router'
```

#### 创建 Vue 插件

关于 Vue 插件的创建：

- 可以使用`function`实现，也可以使用`object`或`class`实现；
- 要求必须有一个`install`方法，将来会被`Vue.use()`使用

```javascript
let Vue // 保存Vue的构造函数，插件中需要用到

class VueRouter {}

/*
 * 插件：实现install方法，注册$router
 *   参数1是Vue.use()一定会传入
 * */
VueRouter.install = function (_Vue) {
  Vue = _Vue // 引用构造函数，VueRouter中要使用
}

export default VueRouter
```

#### 挂载`$router`

当我们发现`vue-router`引入`vue`的时候，第一次是在`router/index.js`中使用了`Vue.use(Router)`，在这个时候也就会调用了`vue-router`的`install`方法；而第二次则是在`main.js`中，创建根组件实例的时候引入`router`,即`new Vue({router}).$mount("#app")`。

也就是说，当调用`vue-router`的`install`方法的时候，项目还没有创建`Vue`的根组件实例。因此我们需要在`vue-router`的`install`方法使用全局混入，延迟到`router`创建完毕才执行挂载`$router`。

```javascript
let Vue // 保存Vue的构造函数，插件中需要用到

class VueRouter {}

/*
 * 插件：实现install方法，注册$router
 *   参数1是Vue.use()一定会传入
 * */
VueRouter.install = function (_Vue) {
  Vue = _Vue // 引用构造函数，VueRouter中要使用

  /* 挂载$router */
  /*
   * 全局混入
   *   全局混入的目的是为了延迟下面逻辑到router创建完毕并且附加到选项上时才执行
   * */
  Vue.mixin({
    beforeCreate() {
      // 此钩子在每个组件创建实例时都会调用
      /* this.$options即创建Vue实例的第一个参数 */
      if (this.$options.router) {
        // 只在根组件拥有router选项
        Vue.prototype.$router = this.$options.router // vm.$router
      }
    },
  })
}

export default VueRouter
```

#### 注册全局组件`router-link`和`router-view`

首先我们可以新建两个文件：`ou-router-link.js`和`ou-router-view.js`。

```javascript
// ou-router-link.js 和 ou-router-view.js
export default {
  render(createElement) {
    return createElement('div', 'router-view') // 返回虚拟Dom
  },
}
```

然后引入进来，在`install`方法中注册两个全局组件。

```javascript
import ouRouterLink from "./ou-router-link";
import ouRouterView from "./ou-router-view";

let Vue;

class VueRouter {}

VueRouter.install = function (_Vue) {
  Vue = _Vue;

  Vue.mixin({
    ...
  })

  /* 注册全局组件router-link和router-view */
  Vue.component('router-link', ouRouterLink);
  Vue.component('router-view', ouRouterView);
}

export default VueRouter;
```

##### 实现`router-link`

- `router-view`是一个`a`标签
- 将`router-view`的`to`属性设置到`a`标签的`herf`属性（先默认使用`hash`方法）
- 获取`router-view`的插槽内容，插入`a`标签中

```javascript
export default {
  props: {
    to: {
      type: String,
      required: true,
    },
  },

  render(createElement) {
    // 返回虚拟Dom
    return createElement(
      'a',
      {
        attrs: { href: '#' + this.to }, // 设置a标签的href属性
      },
      this.$slots.default // 获取标签插槽内容
    )
  },
}
```

##### 实现`router-view`

`router-view`实质上根据`url`的变化，实时响应渲染对应的组件，而`createElement`函数是可以传入一个组件参数的。

因此，我们不进行渲染任何内容，后面实现监听`url`变化后，从映射表获取到组件后，再来实现`router-view`。

```javascript
export default {
  render(createElement) {
    let component = null
    return createElement(component) // 返回虚拟Dom
  },
}
```

#### 监听`url`变化

我们在`VueRouter`类的`constructor`函数中监听`url`的变化，这里我们默认使用`hash`方式。

而且，我们需要将存入`url`的变量设置为**响应式**数据，这样子当其发生变化的时候，`router-view`的`render`函数才能够再次执行。

```javascript
class VueRouter {
  /*
   * options:
   *   mode: 'hash'
   *   base: process.env.BASE_URL
   *   routes
   * */
  constructor(options) {
    this.$options = options

    // 将current设置为响应式数据，即current变化时router-view的render函数能够再次执行
    const initial = window.location.hash.slice(1) || '/'
    Vue.util.defineReactive(this, 'current', initial)

    // 监听hash变化
    window.addEventListener('hashchange', () => {
      this.current = window.location.hash.slice(1)
    })
  }
}
```

同时，我们可以再创建一个路由映射表，便于组件获取到路由信息。

```javascript
class VueRouter {
  constructor(options) {

    ...

    // 创建一个路由映射表
    this.routeMap = {}
    options.routes.forEach(route => {
      this.routeMap[route.path] = route
    })
  }
}
```

因此，我们可以来实现`router-view`组件。

在`render`函数中，`this.$router`指向的是`VueRouter`创建的实例，因此我们可以通过`this.$router.$option.routes`获取路由映射表，`this.$router.current`获取当前路由，然后通过遍历匹配获取组件。

```javascript
export default {
  render(createElement) {
    //获取path对应的component
    const { routeMap, current } = this.$router

    const component = routeMap[current].component || null
    return createElement(component)
  },
}
```

#### 实现`history`模式

前面的实现都默认为`hash`模式，接下来简单实现一下`history`模式。

首先将监听`url`的代码优化一下，并判别`mode`的值来设置`current`的初始值，而`history`模式下初始值为`window.location.pathname`。

```javascript
class VueRouter {
  /*
   * options:
   *   mode: 'hash'
   *   base: process.env.BASE_URL
   *   routes
   * */
  constructor(options) {
    this.$options = options

    switch (options.mode) {
      case 'hash':
        this.hashModeHandle()
        break
      case 'history':
        this.historyModeHandle()
    }

    this.routeMap = {}
    options.routes.forEach((route) => {
      this.routeMap[route.path] = route
    })
  }

  // Hash模式处理
  hashModeHandle() {
    // 将current设置为响应式数据，即current变化时router-view的render函数能够再次执行
    const initial = window.location.hash.slice(1) || '/'
    Vue.util.defineReactive(this, 'current', initial)

    // 监听hash变化
    window.addEventListener('hashchange', () => {
      this.current = window.location.hash.slice(1)
    })
  }

  // History模式处理
  historyModeHandle() {
    const initial = window.location.pathname || '/'
    Vue.util.defineReactive(this, 'current', initial)
  }
}
```

然后我们来实现`history`模式下的`router-link`组件。

在`history`模式下，当我们点击`router-link`时，即点下`a`标签时，页面会重新刷新。所以我们需要设置一下其点击事件，取消默认事件，然后通过`history.pushState`去修改`url`，然后重设`current`的值。

```javascript
export default {
  render(createElement) {
    // 返回虚拟Dom
    const self = this
    const route = this.$router.$options.routes.find((route) => route.path === this.to)
    return createElement(
      'a',
      {
        attrs: { href: this.to }, // 设置a标签的href属性
        on: {
          click(e) {
            e.preventDefault() // 取消a标签的默认事件，即刷新页面
            history.pushState({}, route.name, self.to) // 通过history.pushState来改变url
            self.$router.current = self.to
          },
        },
      },
      this.$slots.default // 获取标签插槽内容
    )
  },
}
```

最后我们将两种模式的`router-link`组件进行一个合并。

```javascript
export default {
  props: {
    to: {
      type: String,
      required: true,
    },
  },
  render(createElement) {
    // 返回虚拟Dom
    if (this.$router.$options.mode === 'hash') {
      return createElement(
        'a',
        {
          attrs: { href: '#' + this.to }, // 设置a标签的href属性
        },
        this.$slots.default // 获取标签插槽内容
      )
    } else {
      const self = this
      const route = this.$router.$options.routes.find((route) => route.path === this.to)
      return createElement(
        'a',
        {
          attrs: { href: this.to }, // 设置a标签的href属性
          on: {
            click(e) {
              e.preventDefault() // 取消a标签的默认事件，即刷新页面
              history.pushState({}, route.name, self.to) // 通过history.pushState来改变url
              self.$router.current = self.to
            },
          },
        },
        this.$slots.default // 获取标签插槽内容
      )
    }
  },
}
```

#### 实现嵌套路由

`vue-router`实际上是可以实现路由嵌套的。

我们在路由配置中，在`About`页面添加一个子路由，即`/about/info`。

```javascript
import Vue from 'vue'
import VueRouter from './ou-vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    // 添加一个子路由
    children: [
      {
        path: '/about/info',
        component: {
          render(h) {
            return h('div', 'info page')
          },
        },
      },
    ],
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
```

然后在`About.vue`中插入`router-view`组件。

```vue
<template>
  <div class="about">
    <h1>This is an about page</h1>
    <router-view></router-view>
  </div>
</template>
```

这时候运行的话，来到`About`页面的时候，后台就会报错，而来到`Info`页面，则不会显示内容。

这是因为在`About`页面中，存在一个`router-view`组件，而这个`router-view`会一直返回`About`页面的虚拟 Dom，而虚拟 Dom 中又有一个`router-view`组件，因此形成一个死循环。

因此我们需要在`router-view`组件中，设置一个变量来保存页面的深度值，即判定是否返回对应页面的虚拟 Dom。

其次，我们还需要处理路由里的`children`属性，获取里面的嵌套路由信息，否则的话`/about/info`是无法渲染出来的。

因此我们重构一下前面`url`监听的代码，使用一个`matched`响应式数组存放当前路径下的所有路由信息，可通过页面深度去获取到对应的路由信息。

因此，我们就需要完成这两个任务：

- `router-view`深度标记；

- 路由匹配时获取代表深度层级的 matched 数组

首先，我们不再用`routeMap`存路由映射表了，也不用`current`作为响应式属性了，使用一个`matched`数组来作为响应式属性。

而这个`matched`属性，里面存放的是当前路径下的所有路由信息，比如`/about`路径，`matched`数组就存放着`about`路由的信息，如果是`/about/info`路径，`matched`存放的是`about`路由和`info`路由的信息，因此我们也可以通过页面深度去获取到对应的路由信息。

而`matched`数组的赋值动作，我们单独写一个`match`方法来实现。

然后每一次路由的变化，我们都需要清空`matched`数组，并调用一次`match`办法。

```javascript
class VueRouter {
  constructor(options) {
    this.$options = options

    switch (options.mode) {
      case 'hash':
        this.hashModeHandle()
        break
      case 'history':
        this.historyModeHandle()
        break
    }
  }

  // Hash模式处理
  hashModeHandle() {
    // 将current设置为响应式数据，即current变化时router-view的render函数能够再次执行
    this.current = window.location.hash.slice(1) || '/'
    Vue.util.defineReactive(this, 'matched', [])
    // match方法可以递归遍历路由表，获得匹配关系的数组
    this.match()

    // 监听hash变化
    window.addEventListener('hashchange', () => {
      this.current = window.location.hash.slice(1)
      this.matched = []
      this.match()
    })
  }

  // History模式处理
  historyModeHandle() {
    this.current = window.location.pathname || '/'
    Vue.util.defineReactive(this, 'matched', [])
    this.match()
  }

  match(routes) {
    // TODO
  }
}
```

在`router-link`组件也需要做一下修改：

```javascript
export default {
  props: {
    to: {
      type: String,
      required: true,
    },
  },
  render(createElement) {
    if (this.$router.$options.mode === 'hash') {
      return createElement(
        'a',
        {
          attrs: { href: '#' + this.to },
        },
        this.$slots.default
      )
    } else {
      const self = this
      const route = this.$router.$options.routes.find((route) => route.path === this.to)
      return createElement(
        'a',
        {
          attrs: { href: this.to },
          on: {
            click(e) {
              e.preventDefault()
              history.pushState({}, route.name, self.to)
              self.$router.current = self.to
              self.$router.matched = [] // 清空matched数组
              self.$router.match() // 调用match方法
            },
          },
        },
        this.$slots.default
      )
    }
  },
}
```

接下来我们来完善一下`match`方法。

首先`match`方法接收一个`routes`参数，如果未传入参数的话，默认为`this.$options.routes`路由表。

然后遍历理由表，如果当前路径是根路径的话，就将根路径的路由信息`push`到`matched`数组中，因为一般不会根路径下创建嵌套路由，因此我们就可以结束遍历，直接`return`。

如果不是根路径的话，就将与当前路径匹配的路由信息，存入`matched`数组中，并且判断该路由信息是否有`chilren`属性，有的话自调用`match`方法，并传入`route.chilren`作为参数。

```javascript
match(routes) {
  routes = routes || this.$options.routes;

  // 递归遍历
  for (const route of routes) {
    if (route.path === '/' && this.current === '/') {
      this.matched.push(route);
      return;
    }

    // 不是根路径
    if (route.path !== '/' && this.current.indexOf(route.path) !== -1) {
      this.matched.push(route);
      // 判断是否有嵌套页面
      if (route.children && route.children.length) {
        this.match(route.children);
      }
      return;
    }
  }
}
```

最后，我们来完善一下`router-view`。

首先我们需要一个对当前虚拟 Dom 贴个标签，即在它的 data 中新建一个`routerView`的变量，设置为`true`。

其次，我们设置一个深度变量`depth`，初始值为 0；然后获取该虚拟 Dom 的父级组件。如果父级组件存在的话，我们判断该父级组件的`data`中是否存在`routerView`的变量并且为`true`，如果存在的话，`depth`加一。

接着就继续检测该父组件的父组件，直至找不到为止。

最后我们获取到了当前`router-view`的路由嵌套深度，就匹配一下`matched`数组，获取对应的路由信息，并返回出去。如果匹配不到的话，就返回`null`。

```javascript
export default {
  render(createElement) {
    // 标记当前router-view的深度
    this.$vnode.data.routerView = true // 当前虚拟DOM的data，添加一个routerView属性

    let depth = 0
    let parent = this.$parent

    while (parent) {
      if (parent.$vnode && parent.$vnode.data && parent.$vnode.data.routerView) {
        // 说明当前parent是一个router-view
        depth++
      }
      parent = parent.$parent
    }

    //获取path对应的component
    let component = null
    const route = this.$router.matched[depth]
    if (route) {
      component = route.component
    }

    console.log(component)
    return createElement(component)
  },
}
```
