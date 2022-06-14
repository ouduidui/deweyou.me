---
lang: zh-CN 
title: 简单实现Vuex 
description: 简单实现VuexT08:00:00.000+00:00
author: Dewey Ou
---

# 简单实现Vuex

> [github](https://github.com/ouduidui/mini-vuex3)

## Vuex

`Vuex`**集中式**存储管理应用的所有组件的状态，并以相应的规则保证状态以**可预测**的方式发生变化。

![vuex](https://vuex.vuejs.org/vuex.png)

### 安装Vuex

```shell
vue add vuex
```

### 核心概念

- **state**：状态、数据
- **mutations**：更改状态的函数
- **action**：异步操作
- **store**：包含以上概念的容器

#### 状态 - state

`state`保存应用状态

```javascript
export default new Vuex.Store({
  state: {
    counter: 0
  }
})
```

```vue
<h1>
  {{$store.state.counter}}
</h1>
```

#### 状态变更 - mutations

`mutations`用于修改状态

```javascript
export default new Vuex.Store({
  mutations: {
    add(state) {
      state.counter++
    }
  }
})
```

```vue
<h1 @click="$store.commit('add')">
  {{$store.state.counter}}
</h1>
```

#### 派生状态 - getters

从`state`派生出来新状态，类似计算属性

```javascript
export default new Vuex.Store({
  getters: {
    doubleCounter(state) {
      return state.counter * 2;
    }
  }
})
```

```vue
<h1>
{{$store.getters.doubleCounter}}
</h1>
```

#### 动作 - actions

添加业务逻辑，类似于`controller`

```javascript
export default new Vuex.Store({
  actions: {
    add({commit}) {
      setTimeout(() => commit('add'), 1000);
    }
  }
})
```

```vue
<h1 @tap="$store.dispatch('add')">
  {{$store.state.counter}}
</h1>
```

## Vuex原理解析

### 任务分析

- 实现插件
  - 实现Store类
    - 维持一个响应式状态state
    - 实现commit()
    - 实现dispatch()
    - 实现getters
  - 挂载$store

### 创建新的插件

在`Vue2.x`项目中的`src`路径下，复制一份`store`文件，重命名为`ou-store`。

然后在`ou-store`路径下新建一个`ou-vuex.js`文件，并将`index.js`文件中的`Vuex`引入改为`ou-vuex.js`。

```
import Vuex from './ou-vuex'
```

同时将`main.js`中的`router`引入也修改一下。

```
import router from './ou-vuex'
```

### 创建vue的插件

回头看一下`store/index.js`，首先是使用`Vue.use()`注册了`Vuex`，然后再实例化了`Vuex.Store`这个类，因此`Vuex`这个对象里含有一个`install`方法以及一个`Store`的类。

```javascript
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  ...
})

```

因此我们来创建一个新的`Vuex`插件。

```javascript
let Vue;    // 保存Vue的构造函数，插件中需要用到

class Store {
}

function install(_Vue) {
  Vue = _Vue;
}

export default {Store, install};
```

### 挂载`$store`

```javascript
let Vue;    // 保存Vue的构造函数，插件中需要用到

class Store {
}

function install(_Vue) {
  Vue = _Vue;

  Vue.mixin({
    beforeCreate() {
      // 挂载$store
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store;     // vm.$store
      }
    }
  })
}

export default {Store, install};
```

### 实现响应式保存`state`数据

因为`state`是一个对象，我们可以使用`new Vue()`将`state`转换为一个响应式数据进行保存起来。

其次，我们不能显式去保存这个`state`，暴露给外面，因此我们可以使用`get`和`set`去保存。

```javascript
class Store {
  /*
  * options:
  *   state
  *   mutations
  *   actions
  *   modules
  *   getters
  * */
  constructor(options = {}) {
    // data响应式处理
    this._vm = new Vue({
      data: {
        $$state: options.state    // 通过this._vm._data.$$state 或 this._vm.$data.$$state 获取
      }
    });
  }

  // 获取state
  get state() {
    return this._vm._data.$$state;
  }

  // 不可设置state
  set state(v) {
    console.error('please use replaceState to reset state');
  }
}
```

### 实现`commit`方法

当我们使用`commit`方法时，都是`$store.commit(type,payload)`，第一个参数即`mutations`的`type`值，第二个是`payload`负载，而对应`mutation`方法的参数为`state`
和`payload`，因此我们来实现：

```javascript
class Store {
  constructor(options = {}) {
    this._vm = new Vue({
      data: {
        $$state: options.state
      }
    });

    // 保存用户配置的mutations选项
    this._mutations = options.mutations;
  }

  get state() {
    return this._vm._data.$$state;
  }

  set state(v) {
    console.error('please use replaceState to reset state');
  }


  commit(type, payload) {
    // 获取type对应的mutation
    const entry = this._mutations[type]
    if (!entry) {
      console.error(`unknown mutation type : ${type}`);
      return;
    }

    // 传递state和payload给mutation
    entry(this.state, payload)
  }
}
```

### 实现`dispatch`方法

`dispatch`方法跟`commit`方法大同小异，不同之处在于`dispatch`调用的是`action`异步函数，而`action`的参数为`context`和`payload`，`payload`我们可以通过`dispatch`
的参数获取到，而`context`执行上下文其实就是实例中的`this`。

但`action`是用来处理异步函数的，因此我们需要对`dispatch`方法进行`this`绑定；同时，`action`方法中有可能会调用到`commit`方法，因此我们也需要对`commit`方法进行`this`绑定。

```javascript
class Store {
  constructor(options = {}) {
    this._vm = new Vue({
      data: {
        $$state: options.state
      }
    });

    // 保存用户配置的mutations选项和actions选项
    this._mutations = options.mutations;
    this._actions = options.actions;

    // 将commit和dispatch绑定this，
    this.commit = this.commit.bind(this);
    this.dispatch = this.dispatch.bind(this);
  }

  get state() {
    return this._vm._data.$$state;
  }

  set state(v) {
    console.error('please use replaceState to reset state');
  }


  commit(type, payload) {
    const entry = this._mutations[type]
    if (!entry) {
      console.error(`unknown mutation type : ${type}`);
      return;
    }

    entry(this.state, payload)
  }

  dispatch(type, payload) {
    // 获取用户编写的type对应的action
    const entry = this._actions[type];
    if (!entry) {
      console.error(`unknown action type : ${type}`)
    }
    // 异步结果处理常常需要返回Promise
    return entry(this, payload)
  }
}
```

### 实现`getters`派生状态

当我们定义`getters`状态时，实际上是定义了一个`function`。

```javascript
getters: {
  doubleCounter(state)
  {
    return state.counter * 2;
  }
}
```

而使用`getters`中某一个派生状态时，实际上是得到一个值，也就是这个`function`的返回值。

```vue
<h4>double count: {{$store.getters.doubleCounter}}</h4>
```

这其实就有点像对象中的`get`属性，因此我们可以使用`Object.defineProperty()`来实现`getters`。

```javascript
class Store {
  constructor(options = {}) {
    this._vm = new Vue({
      data: {
        $$state: options.state
      }
    });

    this._mutations = options.mutations;
    this._actions = options.actions;

    this.commit = this.commit.bind(this);
    this.dispatch = this.dispatch.bind(this);

    // 初始化getters，默认为一个空对象
    this.getters = {};

    // 遍历options.getters
    for (const key in options.getters) {
      const self = this;
      Object.defineProperty(
        this.getters,
        key,   // key名
        {
          get() {
            // 调用对应的函数，第一个参数为state，将结果返回
            return options.getters[key](self._vm._data.$$state)
          }
        }
      )
    }
  }
}
```

