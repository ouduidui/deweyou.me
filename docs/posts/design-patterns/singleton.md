---
lang: zh-CN
title: 单例模式
description: 设计模式 - 单例模式
date: 2022-03-13
---

# 单例模式

**单例模式（Singleton Pattern** ）又称为单体模式，**保证一个类只有一个实例，并提供一个访问它的全局访问点**。也就是说，第二次使用同一个类创建新对象的时候，应该得到与第一次创建的对象完全相同的对象。

## 你曾经遇见的单例模式

当我们在电脑上玩经营类的游戏，经过一番眼花缭乱的骚操作好不容易走上正轨，夜深了我们去休息，第二天打开电脑，发现要从头玩，立马就把电脑扔窗外了，所以一般希望从前一天的进度接着打，这里就用到了存档。每次玩这游戏的时候，我们都希望拿到同一个存档接着玩，这就是属于单例模式的一个实例。

编程中也有很多对象我们只需要唯一一个，比如数据库连接、线程池、配置文件缓存、浏览器中的 `window`/`document` 等，如果创建多个实例，会带来资源耗费严重，或访问行为不一致等情况。

类似于数据库连接实例，我们可能频繁使用，但是创建它所需要的开销又比较大，这时只使用一个数据库连接就可以节约很多开销。一些文件的读取场景也类似，如果文件比较大，那么文件读取就是一个比较重的操作。比如这个文件是一个配置文件，那么完全可以将读取到的文件内容缓存一份，每次来读取的时候访问缓存即可，这样也可以达到节约开销的目的。

在类似场景中，这些例子有以下特点：
1. 每次访问者来访问，返回的都是同一个实例；
2. 如果一开始实例没有创建，那么这个特定类需要自行创建这个实例；

## 示例的代码实现

浏览器中的 [window](https://developer.mozilla.org/zh-CN/docs/Web/API/Window) 和 [document](https://developer.mozilla.org/zh-CN/docs/Web/API/Document) 全局变量，这两个对象都是单例，任何时候访问他们都是一样的对象，`window` 表示包含 DOM 文档的窗口，`document` 是窗口中载入的 DOM 文档，分别提供了各自相关的方法。​

在 ES6 新增语法的 Module 模块特性，通过 `import/export` 导出模块中的变量是单例的，也就是说，如果在某个地方改变了模块内部变量的值，别的地方再引用的这个值是改变之后的。除此之外，项目中的全局状态管理模式 `Vuex`、`Redux`、`MobX` 等维护的全局状态，`vue-router`、`react-router` 等维护的路由实例，在单页应用的单页面中都属于单例的应用（但不属于单例**模式**的应用）。​

在 `JavaScript` 中使用字面量方式创建一个新对象时，实际上没有其他对象与其类似，因为新对象已经是单例了：

```javascript
console.log({ a: 1 } === { a: 1 } )        // false
```

那么问题来了，如何对构造函数使用 `new` 操作符创建多个对象时，仅获取同一个单例对象呢。

我们可以使用 JavaScript 将上面饭馆例子实现一下：

```javascript
function ManageGame() {
  if (!ManageGame._instance) {
    // 如果 _instance 静态属性没有示例的话，将实例赋值于它
    ManageGame._instance = this
  }
  // 返回实例
  return ManageGame._instance
}

// 定义 getInstance 静态方法，用于获取实例
ManageGame.getInstance = function () {
  if (ManageGame._instance) {
    return ManageGame._instance
  }
  return ManageGame._instance = new ManageGame()
}


// 测试用例
it('示例的代码实现', () => {
  const singleton1 = new ManageGame()
  const singleton2 = ManageGame.getInstance()
  const singleton3 = ManageGame.getInstance()

  expect(singleton1).toBe(singleton2);
  expect(singleton2).toBe(singleton3)
})
```

解释一下，这个构造函数在内部有一个`instance`的静态属性，用于存放自身的一个实例。当我们每次创建`Singleton`实例的时候，它会去访问自身的静态属性`instance`是否有值，如果没有的话，就创建一个实例并赋值给它。最后将实例返回。同时，我们也可以通过自定义一个`getInstance`的静态方法去获取实例。

我们可以用 `ES6` 的 `class` 语法改造一下：

```javascript
class ManageGame {
  // 声明静态属性 _instance 用于存储示例
  static _instance = null;

  constructor() {
    if(!ManageGame._instance) {
      // 初始化示例
      ManageGame._instance = this;
    }

    // 返回实例
    return ManageGame._instance;
  }

  // 定义 getInstance 静态方法，用于获取实例
  static getInstance() {
    if(!ManageGame._instance) {
      // 初始化示例
      ManageGame._instance = this;
    }

    return ManageGame._instance;
  }
}
```

上面实现方法的缺点在于维护的实例作为静态属性直接暴露，外部可以直接修改。

## 单例模式的通用实现

单例模式主要有下面几个概念：

- **Singleton**：特定类，这是我们需要访问的类，访问者要拿到的是它的实例；
- **instance**：单例，是特定类的实例，特定类一般会提供 `getInstance` 方法来获取该单例；
- **getInstance：**获取单例的方法，或者直接由 `new` 操作符获取；

这里有几个实现点要关注一下：

1. 访问时始终返回的是**同一个实例**；
2. **自行实例化**，无论是一开始加载的时候就创建好，还是在第一次被访问时；
3. 一般还会提供一个 **`getInstance`** 方法用来获取它的实例；

![singleton.png](/images/docs/design-patterns/singleton.png)

### IIFE方式

我们可以使用立即调用函数 `IIFE` 将不希望公开的单例实例 `instance` 隐藏。

```javascript
// 使用自调用匿名函数方式声明
const Singleton = (function () {
  // 用于存储示例
  let _instance = null;

  // 真正的 Singleton 构造函数
  const _Singleton = function (name) {
    if (!_instance) {
      _instance = this;
      this.name = name;
    }
    return _instance;
  }

  // 定义 getInstance 静态方法，用于获取实例
  _Singleton.getInstance = function (name) {
    if (!_instance) {
      _instance = new _Singleton(name);
    }
    return _instance;
  }

  // 返回构造函数
  return _Singleton;
})()


// 测试用例
it('使用IIFE方式实现单例模式', () => {
  const singleton1 = new Singleton('OUDUIDUI')
  const singleton2 = Singleton.getInstance('OU')
  const singleton3 = Singleton.getInstance('DUIDUI')

  expect(singleton1).toBe(singleton2);
  expect(singleton2).toBe(singleton3);

  expect(singleton1.name).toBe('OUDUIDUI');
  expect(singleton2.name).toBe('OUDUIDUI');
  expect(singleton3.name).toBe('OUDUIDUI');
})
```

而 `IIFE` 代价是闭包开销，并且因为 IIFE 操作带来了额外的复杂度，让可读性变差。

`IIFE` 内部返回的 `_Singleton` 才是我们真正需要的单例的构造函数，外部的 `Singleton` 把它和一些单例模式的创建逻辑进行了一些封装。

`IIFE` 方式除了直接返回一个方法/类实例之外，还可以通过**模块模式**的方式来进行。

```javascript
// 使用自调用匿名函数方式声明
const Singleton = (function () {
  // 用于存储示例
  let _instance = null;

  // 真正的 Singleton 构造函数
  const _Singleton = function (name) {
    if (!_instance) {
      _instance = this;
      this.name = name;
    }
    return _instance;
  }

  return {
    // 只返回 getInstance 方法
    getInstance (name) {
      if (!_instance) {
        _instance = new _Singleton(name);
      }
      return _instance;
    }
  };
})()
```

### 块级作用域方式

`IIFE` 方式本质还是通过函数作用域的方式来隐藏内部作用域的变量，有了 `ES6` 的 `let/const` 之后，可以通过 `{ }` 块级作用域的方式来隐藏内部变量：

```javascript
// 全局初始化 getInstance 变量
let getInstance;

{
  // 用于存储示例
  let _instance = null;

  // 实现构造函数
  const Singleton = function (name) {
    if(!_instance) {
      _instance = this;
      this.name = name;
    }
    return _instance;
  }

  // 实现 getInstance 方法，并复制给全局变量
  getInstance = function (name) {
    if(!_instance) {
      _instance = new Singleton(name);
    }
    return _instance;
  }
}


// 测试用例
it('使用块级作用域方式实现单例模式', () => {
  const singleton1 = getInstance('OUDUIDUI')
  const singleton2 = getInstance('OU')

  expect(singleton1).toBe(singleton2);
  expect(singleton1.name).toBe('OUDUIDUI');
  expect(singleton2.name).toBe('OUDUIDUI');
})
```

### 单例模式赋能

根据**单一职责原则**，我们可以将单例模式的创建逻辑和特定类的功能逻辑拆开，这样功能逻辑就可以和正常的类一样。

```javascript
//  实现功能类
class DoSomething {
  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}

// 对上面的功能类进行单例模式赋能
const Singleton = (function (){
  let _instance = null;
  const ProxySingleton = function (name) {
    if(!_instance) {
      _instance = new DoSomething(name);
    }
    return _instance;
  }

  ProxySingleton.getInstance = function () {
    if(!_instance) {
      _instance = new DoSomething(name);
    }
    return _instance;
  }

  return ProxySingleton;
})()



// 测试用例
it('单例模式赋能', () => {
  const singleton1 = new Singleton('OUDUIDUI')
  const singleton2 = Singleton.getInstance('OU')
  const singleton3 = Singleton.getInstance('DUIDUI')

  expect(singleton1).toBe(singleton2);
  expect(singleton2).toBe(singleton3);

  expect(singleton1.getName()).toBe('OUDUIDUI');
  expect(singleton2.getName()).toBe('OUDUIDUI');
  expect(singleton3.getName()).toBe('OUDUIDUI');
})
```

这样的单例模式赋能类也可被称为**代理类**，将业务类和单例模式的逻辑解耦，把单例的创建逻辑抽象封装出来，有利于业务类的扩展和维护。

使用类似的概念，配合 ES6 引入的 `Proxy` 来拦截默认的 `new` 方式，我们可以写出更简化的单例模式赋能方法：

```javascript
function Singleton(FuncClass) {
  let _instance = null;
  // 使用 Proxy 来拦截构建示例
  return new Proxy(FuncClass, {
    /**
     * @param target 对象
     * @param args 参数数组
     */
    construct(target, args) {
      return _instance || (_instance = Reflect.construct(FuncClass, args));
    }
  })
}


// 测试用例
it('单例模式赋能 — 使用 Proxy 实现', () => {
  class DoSomething {
    constructor(name) {
      this.name = name;
    }

    getName() {
      return this.name;
    }
  }

  const DoSomething2 = Singleton(DoSomething);

  const singleton1 = new DoSomething2('OUDUIDUI')
  const singleton2 = new DoSomething2('OU')
  const singleton3 = new DoSomething2('DUIDUI')

  expect(singleton1).toBe(singleton2);
  expect(singleton2).toBe(singleton3);

  expect(singleton1.getName()).toBe('OUDUIDUI');
  expect(singleton2.getName()).toBe('OUDUIDUI');
  expect(singleton3.getName()).toBe('OUDUIDUI');
})
```

## 惰性单例

有时候一个实例化过程比较耗费性能的类，但是却一直用不到，如果一开始就对这个类进行实例化就显得有些浪费，那么这时我们就可以使用**惰性创建**，即延迟创建该类的单例。之前的例子都属于惰性单例，实例的创建都是 `new` 的时候才进行。

惰性单例又被成为**懒汉式**，相对应的概念是**饿汉式**：

- 懒汉式单例是在使用时才实例化
- 饿汉式是当程序启动时或单例模式类一加载的时候就被创建。

```javascript
class FuncClass {}

// 饿汉式
const HungrySingleton = (function () {
  // 自调用时就初始化
  const _instance = new FuncClass()

  return function () {
    return _instance
  }
})()

// 懒汉式
const LazySingleton = (function () {
  let _instance = null

  return function () {
    // 当真正使用时再初始化
    return _instance || (_instance = new FuncClass())
  }
})()



// 测试用例

it('惰性单例', () => {
  const singleton1 = new HungrySingleton()
  const singleton2 = new HungrySingleton()
  const singleton3 = new LazySingleton()
  const singleton4 = new LazySingleton()

  expect(singleton1).toBe(singleton2);
  expect(singleton3).toBe(singleton4);
})
```

## 源码中的单例模式

以 `ElementUI` 为例，`ElementUI` 中的全屏 `Loading` 蒙层调用有两种形式：

```javascript
// 1. 指令形式
Vue.use(Loading.directive)
// 2. 服务形式
Vue.prototype.$loading = service
```

用服务方式使用全屏 `Loading` 是单例的，即在前一个全屏 `Loading` 关闭前再次调用全屏 `Loading`，并不会创建一个新的 `Loading` 实例，而是返回现有全屏 `Loading` 的实例。

下面我们可以看看 ElementUI 2.9.2 的[源码](https://github.com/ElemeFE/element/blob/v2.9.2/packages/loading/src/index.spec.js)是如何实现的，为了观看方便，省略了部分代码：

```javascript
import Vue from 'vue'
import loadingVue from './loading.vue'
const LoadingConstructor = Vue.extend(loadingVue)

// 存储示例
let fullscreenLoading

const Loading = (options = {}) => {
  // 如果存在示例，直接返回
  if (options.fullscreen && fullscreenLoading) {
    return fullscreenLoading
  }

  // 如果没有的话，新建一个示例
  let instance = new LoadingConstructor({
    el: document.createElement('div'),
    data: options
  })
  if (options.fullscreen) {
    fullscreenLoading = instance
  }
  return instance
}
export default Loading
```

这里的单例是 `fullscreenLoading`，是存放在闭包中的，如果用户传的 `options` 的 `fullscreen` 为 `true` 且已经创建了单例的情况下则回直接返回之前创建的单例，如果之前没有创建过，则创建单例并赋值给闭包中的 `fullscreenLoading` 后返回新创建的单例实例。

这是一个典型的单例模式的应用，通过复用之前创建的全屏蒙层单例，不仅减少了实例化过程，而且避免了蒙层叠加蒙层出现的底色变深的情况。



## 优缺点

单例模式主要解决的问题就是**节约资源，保持访问一致性**。

### 优点

1. 单例模式在创建后在内存中只存在一个实例，节约了内存开支和实例化时的性能开支，特别是需要重复使用一个创建开销比较大的类时，比起实例不断地销毁和重新实例化，单例能节约更多资源，比如数据库连接；

2. 单例模式可以解决对资源的多重占用，比如写文件操作时，因为只有一个实例，可以避免对一个文件进行同时操作；

3. 只使用一个实例，也可以减小垃圾回收机制 GC（Garbage Collection） 的压力，表现在浏览器中就是系统卡顿减少，操作更流畅，CPU 资源占用更少；

### 缺点

1. 单例模式对扩展不友好，一般**不容易扩展**，因为单例模式一般自行实例化，没有接口；
2. **与单一职责原则冲突**，一个类应该只关心内部逻辑，而不关心外面怎么样来实例化；

## 使用场景

那我们应该在什么场景下使用单例模式呢：

1. 当一个类的**实例化过程消耗的资源过多**，可以使用单例模式来避免性能浪费；
2. 当项目中需要一个公共的状态，那么需要使用单例模式来**保证访问一致性**。
