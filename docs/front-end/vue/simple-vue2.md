---
lang: zh-CN
title: 简单手写实现Vue2
description: 简单手写实现Vue2
---

# 简单手写实现Vue2.x

## Vue的设计思想

`Vue`设计思想参考了`MVVM`模型，即将视图`View`和行为`Model`抽象化，即将视图UI和业务逻辑分开来，然后通过`ViewModel`层来实现双向数据绑定。

`MVVM` 与 `MVC` 最大的不同就是`MVVM`实现了 `View` 和 `Model` 的自动同步，也就是当`Model` 的属性改变时，我们不用再自己手动操作 `Dom` 元素，来改变 `View` 的显示，而是改变属性后该属性对应 View 层显示会自动改变。

`MVVM`框架的三个要素：**数据响应式、模板引擎及其渲染**。

- 数据响应式
    - 监听数据变化并在视图中更新
    - 在`Vue2.x`中，是根据`Object.defineProperty()`来实现数据响应式的
- 模板引擎
    - 提供描述视图的模板语法
    - `Vue`的插槽和指令`v-bind`、`v-on`、`v-model`等
- 渲染
    - 将模板渲染成`HTML`进行显示

## 数据响应式原理

在`JavaScript`的对象`Object`中有一个属性叫访问器属性，其中有`[[Get]]`和`[[Set]]`特性，它们分别是获取函数或设置函数，即在获取对象特定属性的时候回调用到。

而访问器属性是不能直接定义的，必须使用`Object.defineProperty()`进行定义。

```javascript
const obj = {
  _name: 'Matt'
};
Object.defineProperty(obj, 'name', {
  get() {
    return this._name;
  },
  set(newVal) {
    console.log('set name')
    this._name = newVal;
  }
})

console.log(obj.name);   // 'Matt'
obj.name = 'OUDUIDUI';   // 'set name'
console.log(obj.name);   // 'Henry'
```

而`Vue2.x`就是在`set`函数中进行监听，当数据发生变化了，就会进行响应操作。

因此，我们可以简单实现一个`Vue`中的`defineReactive`函数。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>reactive app</title>
</head>
<body>
<div id="app"></div>
<script>
  /**
   * defineReactive : 将对象中某一个属性设置为响应式数据
   * @param obj<Object>: 对象
   * @param key<any>: key名
   * @param val<any>: 初始值
   */
  function defineReactive(obj, key, val) {
    Object.defineProperty(obj, key, {
      get() {
        console.log(`get ${key}`)
          return val;   // 此时val存在obj的闭包里面
      },
      set(newVal) {
        console.log(`set ${key}`)
          if (newVal !== val) {
            val = newVal;
            update();    // 更新函数
          }
        }
      })
  }
  
  /**
   * update : 更新函数，重新渲染app DOM
   */
  function update() {
    const app = document.getElementById('app');
    app.innerHTML = `obj.time = ${obj.time}`
  }
  
  const obj = {}; 
  defineReactive(obj, 'time', new Date().toLacaleTimeString());  // 将obj进行响应式处理
  setInterval(() => obj.time = new Date().toLacaleTimeString(), 1000);   // 定时更新obj.time的值
</script>
```

在代码中，我们在`set`中，调用了`update`更新函数，因此我们定时器每更新`obj.time`一次，`update`函数就会被调用一次，因此页面数据也会更新一次。这时候，我们就简单的实现了数据响应式。

但`defineReactive`函数有个问题，就是一次只能对一个属性值进行响应式处理，而且如果这个属性是个对象的话，我们更改对象里面的值的时候，是实现不了响应式的。

```javascript
const obj = {};
defineReactive(obj, 'info', {name: 'OUDUIDUI', age: 18});  // 将obj进行响应式处理
setTimeout(() => obj.info.age++, 1000);  // 这时候不会触发set函数
```

![demo1](/images/docs/simple-handwriting-vue2/demo1.gif)

因此，我们需要一个新的方法去实现对整个对象进行响应式处理，在`Vue`中这个方法叫`observe`。

在这个函数中，我们先需要对传入的`obj`进行类型判断，然后对对象进行遍历，对每一个属性进行响应式处理。这个地方需要对数组做处理，这个放到后面再说。

```javascript
/**
 * observe: 将整个对象设置为响应式数据
 * @param obj<Object>: 对象
 */
function observe(obj) {
  // 如果obj不是对象的话，跳出函数
  if (typeof obj !== "object" || obj === null) {
    return;
  }

  // 判断传入obj的类型
  if (Array.isArray(obj)) {
    // TODO
  } else {
    // 遍历obj所有所有key，做响应式处理
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key]);
    })
  }
}
```

同时，我们需要实现对这个对象一个递归处理，因此我们需要修改一下`defineReactive`函数。我们只需要在最开始的地方，调用一次`observe`函数，如果传入的`val`是对象，就会进行递归响应式处理，如果不是就返回。

```javascript
function defineReactive(obj, key, val) {
  observe(val);  // 递归处理：如果val是对象，继续做响应式处理

  Object.defineProperty(obj, key, {
    ...
  })
}
```

我们来测试一下：

```javascript
const obj = {
  time: new Date().toLocaleTimeString(),
  info: {
    name: 'OUDUIDUI',
    age: 18
  }
};
observe(obj);

setInterval(() => {
  obj.time = new Date().toLocaleTimeString();
}, 1000)

setTimeout(() => {
  obj.info.age++;
}, 2000)
```

![demo2](/images/docs/simple-handwriting-vue2/demo2.gif)

这里还有一个小问题，就是如果`obj`原本有一个属性是常规类型，即字符串、数值等等，然后再将其改为引用类型时，如对象、数值等，该引用类型内部的属性，是没有响应式的。比如下来这种情况：

```javascript
const obj = {
  text: 'Hello World',
};
observe(obj);  // 响应式处理

obj.text = {en: 'Hello World'};    // 将obj.text由字符串改成一个对象

setTimeout(() => {
  obj.text.en = 'Hi World';   // 此时修改text对象属性页面是不会更新的，因为obj.text.en不是响应式数据
}, 2000)
```

对于这种情况，我们只需要在`defineReactive`函数中，`set`的时候调用一下`observe`函数，将`newVal`传入，如果是对象就进行响应式处理，否则就直接返回。

```javascript
function defineReactive(obj, key, val) {
  observe(val);

  Object.defineProperty(obj, key, {
    get() {
      console.log(`get ${key}`)
      return val;
    },
    set(newVal) {
      console.log(`set ${key}`)
      if (newVal !== val) {
        observe(newVal);  // 如果newVal是对象，再次做响应式处理
        val = newVal;
        update();
      }
    }
  })
}
```

我们测试一下。

```javascript
function update() {
  const app = document.getElementById('app');
  app.innerHTML = `obj.text = ${JSON.stringify(obj.text)}`
}

const obj = {
  text: 'Hello World'
};

// 响应式处理
observe(obj);

setTimeout(() => {
  obj.text = {     // 将obj.text由字符串改成一个对象
    en: 'Hello World'
  }
}, 2000)

setTimeout(() => {
  obj.text.en = 'Hi World';
}, 4000)
```

![demo3](/images/docs/simple-handwriting-vue2/demo3.gif)

最后我们来完成前面楼下的一个问题，就是数组的响应式处理。

之所以数组需要特殊处理，因为数组有七个自带方法可以去处理数组的内容，分别是`push`、`pop`、`shift`、`unshift`、`reverse`、`sort`、`splice`，它们都是可以修改数组本身的。

所以，我们需要对七个方法进行监听。我们可以先克隆一个新的数组原型，然后在新的原型中，新建这七个方法，先执行对应的方法操作后，进行数据响应式更新处理。

```javascript
// 数组响应式
const originalProto = Array.prototype;
const arrayProto = Object.create(originalProto);  // 以Array.prototype为原型创新一个新对象
['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'].forEach(method => {
  arrayProto[method] = function () {
    // 原始操作
    originalProto[method].apply(this, arguments);
    // 覆盖操作：通知更新
    update();
  }
})
```

然后继续完成`observe`函数操作。

如果类型是数组的话，将其的原型进行覆盖，然后再数组每一个元素进行响应式处理。

```javascript
function observe(obj) {
  if (typeof obj !== "object" || obj === null) {
    return;
  }

  // 判断传入obj的类型
  if (Array.isArray(obj)) {
    // 覆盖原型
    obj.__proto__ = arrayProto;
    // 对数组内部原型执行响应式
    for (let i = 0; i < obj.length; i++) {
      observe(obj[i]);
    }
  } else {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key]);
    })
  }
}
```

测试一下：

```javascript
function update() {
  const app = document.getElementById('app');
  app.innerHTML = `obj.nums = ${JSON.stringify(obj.nums)}`
}

const obj = {
  nums: [4, 2, 3]
};

// 响应式处理
observe(obj);

setTimeout(() => {
  obj.nums.push(1);
}, 2000)

setTimeout(() => {
  obj.nums.sort((a, b) => a - b);
}, 4000)
```

![demo4](/images/docs/simple-handwriting-vue2/demo4.gif)

## 简单手写Vue

### 原理分析

当我们使用`vue`的时候，首先都会创建一个`Vue`实例，然后在里面初始化`element`、`data`、`methods`等等。

```javascript
const app = new Vue({
  el: '#app',
  data: {
    count: 1
  },
  methods: {}
});
```

然后我们可以在`data`里面设置一些变量，而这些变量会被处理为响应式数据，然后我们就可以使用模板语句去渲染`data`数据。

```html
<div id="app">
  <p>{{counter}}</p>
</div>
```

所以我们需要实现的功能就是**对`data`进行响应式处理**、**编译和渲染模板**、以及**数据变化时更新模板**。

因此我们创建`Vue`实例需要实现以下内容：

- 对`data`执行响应式处理，这个过程发生在`Observer`中；
- 对模板执行编译，找到其中动态绑定的数据，从`data`中获取并初始化视图，这个过程发生在`Compile`中；
- 每创建一个响应式数据，同时定义一个更新函数和`Watcher`，将来对应数据变化时`Watcher`会调用更新函数；
- 由于`data`的某个`key`在一个视图中可能出现多次，所以每个`key`都需要一个依赖`Dependence`来管理多个`Watcher`；将来`data`中数据一旦发生变化，会首先找到对应的`Dependence`，然后`Dependence`通知对应所有的`Watcher`执行更新函数。

![Vue1](/images/docs/simple-handwriting-vue2/Vue1.jpg)

### 实现

#### 数据响应式

首先我们新建一个`vue.js`，创建一个`Vue`的类，在`constructor`对参数数据进行保存。

```javascript
/**
 * Vue:
 *   1. 对data选项做响应式处理
 *   2. 编译模板
 * @param options<Object>: 包含el、data、methods等等
 */
class Vue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data;    // data选项

    // 对data进行响应式处理
    observe(this.$data);
  }
}
```

`observe()`方法跟前面所说的类似，只不过我们把大部分内容放入`Observer`类中，因为我们需要对每一个响应式数据进行监听并通知`Dep`。

```javascript
/**
 * observe: 将整个对象设置为响应式数据
 * @param obj<Object>: 对象
 */
function observe(obj) {
  // 如果obj不是对象的话，跳出函数
  if (typeof obj !== "object" || obj === null) {
    return;
  }

  // 响应式处理
  new Observer(obj);
}
```

`Observer`中`constructor`构造函数的内容，基本就是之前`observe`方法中的内容，以及类中的`defineReactive`方法也跟前面讲的一致，这里就不说了。

唯一不同的是，这里不再是调用`update`函数，而在后面我们需要创建一个依赖`Dependence`实例并调用，现在我们先留空着。

```javascript
/**
 * Observer:
 *   1. 根据传入value的类型做响应的响应式处理
 * @param value<Object || Array>
 */
class Observer {
  constructor(value) {
    this.value = value;

    // 数据类型判断
    if (Array.isArray(value)) {
      // 覆盖原型
      value.__proto__ = this.getArrayProto();
      // 对数组内部原型执行响应式
      for (let i = 0; i < value.length; i++) {
        observe(value[i]);
      }
    } else {
      // 遍历obj所有所有key，做响应式处理
      Object.keys(value).forEach(key => {
        this.defineReactive(value, key, value[key]);
      })
    }
  }

  getArrayProto() {
    const self = this;

    const originalProto = Array.prototype;
    const arrayProto = Object.create(originalProto);
    ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'].forEach(method => {
      arrayProto[method] = function () {
        originalProto[method].apply(self, arguments);

        // TODO 通知变化
      }
    })
    return arrayProto;
  }

  /**
   * defineReactive : 将对象中某一个属性设置为响应式数据
   * @param obj<Object>: 对象
   * @param key<any>: key名
   * @param val<any>: 初始值
   */
  defineReactive(obj, key, val) {
    observe(val);

    Object.defineProperty(obj, key, {
      get() {
        Dependence.target && dep.addDep(Dependence.target);
        return val;
      },
      set(newVal) {
        if (newVal !== val) {
          observe(newVal);
          val = newVal;

          // TODO 通知变化
        }
      }
    })
  }
}
```

现在我们基本实现了对`data`数据进行响应式处理。

但现在我们在`JavaScript`中创建了`Vue`实例后，我们无法直接在实例中获取到`data`数据，而是需要通过实例中的`$data`中获取到`data`的内容。

```javascript
const app = new Vue({
  el: '#app',
  data: {
    desc: 'HelloWorld',
  }
});

console.log(app.desc);   	// undefined
console.log(app.$data.desc);   // 'HelloWorld'
```

因为我们得对`data`中的数据实现一下代理，代理的实现也是通过对象的访问器属性实现，这里也不多说。

```javascript
class Vue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data;
    observe(this.$data);

    // 代理
    proxy(this);
  }
}

/**
 * proxy: 数据代理
 * @param vm<Object>
 */
function proxy(vm) {
  Object.keys(vm.$data).forEach(key => {
    Object.defineProperty(vm, key, {
      get() {
        return vm.$data[key]
      },
      set(v) {
        vm.$data[key] = v;
      }
    })
  })
}
```

这时候我们就可以用`app.desc`访问到`data.desc`属性了。

#### 模板编译和渲染

在我们实现数据响应式后，我们就可以对模板进行编译和渲染，这时候就需要来实现`Compile`类。

```javascript
class Vue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data;    // data选项

    observe(this.$data);
    proxy(this);

    // 模板编译和渲染
    new Compile(options.el, this);
  }
}
```

`Compile`类的构造函数接收两个参数，一个是`element`，一个是`Vue`实例中的`this`，这个实际上就是`View Model`的数据，也是我们在`Vue`中常见的`vm`。

在构造函数中，先对传入数据进行保存，然后获取节点，如果节点存在的话，就开始进行编译处理。

```javascript
/**
 * Compile:
 *   1. 解析模板
 *      a. 处理插值
 *      b. 处理指令和事件
 *      c. 以上两者初始化和更新
 * @param el
 * @param vm
 */
class Compile {
  constructor(el, vm) {
    this.$vm = vm;
    this.$el = document.querySelector(el);

    if (this.$el) {
      // 编译节点
      this.compile(this.$el);
    }
  }

  /**
   * compile: 递归节点，对节点进行编译
   * @param el
   */
  compile(el) {}
}
```

首先，我们需要对节点进行递归遍历，然后通过`nodeType`识别出当前节点的信息，如果是元素节点的话，我们需要对其进行指令和事件处理，如果是文本节点的话，同时含有插槽的话，我们需要对齐进行文本替换处理。

```javascript
class Compile {
  constructor(el, vm) { ... }

  /**
   * compile: 递归节点，对节点进行编译
   * @param el
   */
  compile(el) {
    // 遍历el子节点，判断他们类型做相应的处理
    const childNodes = el.childNodes;

    childNodes.forEach(node => {
      if (node.nodeType === 1) {
        // 元素
        console.log('元素', node.nodeName);
        // TODO 指令和事件处理
      } else if (this.isInter(node)) {
        // 文本
        console.log('文本', node.textContent);
        // TODO 文本替换处理
      }

      // 递归
      if (node.childNodes) {
        this.compile(node);
      }
    })
  }

  // 判断是否为插值表达式
  isInter(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }
}
```

首先我们来实现一下文本编译。

因为我们前面判断的时候，使用过正则去判断`node.textContent`，因此如果符合标准的话，我们就可以通过`RegExp.$1`获取到属性名，因此我们就可以那属性名去`data`中进行匹配。

```javascript
class Compile {
  constructor(el, vm) { ... }

  compile(el) {
    const childNodes = el.childNodes;

    childNodes.forEach(node => {
      if (node.nodeType === 1) {
        // TODO 指令和事件处理
      } else if (this.isInter(node)) {
        // 文本初始化
        this.compileText(node);
      }

      if (node.childNodes) {
        this.compile(node);
      }
    })
  }

  // 编译文本
  compileText(node) {
    node.textContent = this.$vm[RegExp.$1];
  }
}
```

这时候，我们可以测试一下。

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
    content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>vue app</title>
</head>
<body>
<div id="app">
  <p>{{desc}}</p>
</div>

<script src="./src/vue.js"></script>
<script>
  const app = new Vue({
    el: '#app',
    data: {
      desc: 'HelloWorld',
    },
  });
</script>
</body>
</html>
```

![demo5](/images/docs/simple-handwriting-vue2/demo5.png)

接下来，我们简单实现一下指令和实现，这个`demo`就实现一下`v-text`、`v-html`以及事件绑定`@click`。

首先，当我们递归节点的时候，当`nodeType === 1`的时候，我们得知该节点是一个元素，就可以通过`node.attributes`去获取该标签中的所有指令。然后通过遍历和识别`attrName`是否以`v-`或者`@`开头的。

```javascript
if (node.nodeType === 1) {
  // 元素
  console.log('元素', node.nodeName);
  // 处理指令和事件
  const attrs = node.attributes;
  Array.from(attrs).forEach(attr => {
    const attrName = attr.name;
    const exp = attr.value;
    if (attrName.startsWith('v-')) {
      // 处理指令
    }
    if (attrName.indexOf('@') === 0) {
      // 处理事件
    }
  })
}
```

因为事件处理比较简单，所以我们先来处理事件。

我们只需要提取出事件的类型，然后将节点`node`、方法名`exp`和事件类型`dir`进行事件监听。

这里需要主要的是，`addEventListener`事件监听第二个参数的方法，需要绑定`this.$vm`，因为在方法中有可能会用到`data`数据。

```javascript
class Compile {
  constructor(el, vm) { ... }

  compile(el) {
    const childNodes = el.childNodes;

    childNodes.forEach(node => {
      if (node.nodeType === 1) {
        const attrs = node.attributes;
        Array.from(attrs).forEach(attr => {
          const attrName = attr.name;
          const exp = attr.value;
          if (attrName.startsWith('v-')) {
            // 处理指令
          }
          // 处理事件
          if (attrName.indexOf('@') === 0) {
            const dir = attrName.substring(1);
            // 事件监听
            this.eventHandler(node, exp, dir);
          }
        })
      } else if (node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)) {
        console.log('文本', node.textContent);
        this.compileText(node);
      }

      if (node.childNodes) {
        this.compile(node);
      }
    })
  }

  /**
   * eventHandler: 节点事件处理
   * @param node: 节点
   * @param exp: 函数名
   * @param dir: 事件类型
   */
  eventHandler(node, exp, dir) {
    const fn = this.$vm.$options.methods && this.$vm.$options.methods[exp];
    node.addEventListener(dir, fn.bind(this.$vm));
  }
}
```

现在来测试一下。

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
    content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>vue app</title>
</head>
<body>
<div id="app">
  <button @click="add">测试</button>
</div>

<script src="./src/vue.js"></script>
<script>
  const app = new Vue({
    el: '#app',
    data: {
      desc: 'HelloWorld'
    },
    methods:{
      test() {
        console.log(this.desc);
      }
    }
  });
</script>
</body>
</html>
```

![demo6](/images/docs/simple-handwriting-vue2/demo6.gif)

接下来来处理指令。

对不同指令的处理是不一样，因此得对每一种指令都需要新建一个更新函数。这里只实现以下`v-text`、`v-html`、`v-model`。

每个方法名是与指令名一致，这有利于后面直接用指令名去查找。然后每个方法都接受两个参数——`node`节点和`exp`变量名。

```javascript
class Compile {
  constructor(el, vm) { ... }

  compile(el) { ... }

  // v-text
  text(node, exp) {
    node.textContent = this.$vm[exp];
  }

  // v-html
  html(node, exp) {
    node.innerHTML = this.$vm[exp];
  }

  // v-model
  model(node, exp) {
    // 表单原生赋值
    node.value = value;
    // 事件监听
    node.addEventListener('input', e => {
      // 赋值实现双向绑定
      this.$vm[exp] = e.target.value;
    })
  }
}
```

然后处理指令只需要直接查找一下`this`有没有这个指令方法，有的话调用。

```javascript
// 处理指令
if (attrName.startsWith('v-')) {
  const dir = attrName.substring(2);
  this[dir] && this[dir](node, exp);
}
```

最后试验一下。

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
    content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>vue app</title>
</head>
<body>
<div id="app">
  <p v-text="desc"></p>
  <p v-html="desc2"></p>
  <input type="text" v-model="desc" />
</div>

<script src="./src/vue.js"></script>
<script>
  const app = new Vue({
    el: '#app',
    data: {
      counter: 1,
      desc: 'HelloWorld',
      desc2: `<span style="font-weight: bolder">Hello World</span>`
    }
  });
</script>
</body>
</html>
```

![demo7](/images/docs/simple-handwriting-vue2/demo7.png)

#### 数据更新

数据的更新就会用到`Watcher`监听器和`Dependence`观察者。

当我们视图中用到了`data`中某个属性`key`，这称为**依赖**，比如`<div>{{desc}}</div>`，`desc`就是一个依赖。而同一个`key`出现多次的时候，每一次都会创建一个`Watcher`来维护它们，而这个过程称为**依赖收集**。然而但某个`key`发生变化的时候，我们需要通过该依赖下的所有`Watcher`去更新，这时候就需要一个`Dependence`来管理，需要更新的时候就由它来统一通知。

![Vue2](/images/docs/simple-handwriting-vue2/Vue2.jpg)

在实现这个功能之前，我们需要先来重构一个地方的代码。

就是我们只需在模板中用到`data`属性的地方需要创建一个`Watcher`监听器，因此我们需要在`Compile`中创建。但是在其中我们插值表达式用到了一个更新方法，每个指令各用到了一个更新方法。

因此我们需要一个高级函数，将其都封装起来。也就是当用到每一种指令或插值表达式，我们都会经历调用这个高级函数，因此我们也可以在这个高级函数中创建`Watcher`。

```javascript
class Compile {
  constructor(el, vm) { ... }

  compile(el) { ... }

  /**
   * update: 高阶函数 —— 操作节点
   * @param node: 节点
   * @param exp: 绑定数据变量名
   * @param dir: 指令名
   */
  update(node, exp, dir) {
    // 初始化
    const fn = this[dir + 'Updater'];
    fn && fn(node, this.$vm[exp]);

    // TODO 创建监听器
  }

  // 编译文本
  compileText(node) {
    this.update(node, RegExp.$1, 'text');
  }

  // v-text
  text(node, exp) {
    this.update(node, exp, 'text');
  }

  textUpdater(node, value) {
    node.textContent = value;
  }

  // v-html
  html(node, exp) {
    this.update(node, exp, 'html');
  }

  htmlUpdater(node, value) {
    node.innerHTML = value;
  }

  // v-model
  model(node, exp) {
    this.update(node, exp, 'model');
    node.addEventListener('input', e => {
      this.$vm[exp] = e.target.value;
    })
  }

  modelUpdater(node, value) {
    node.value = value;
  }

  eventHandler(node, exp, dir) { ...
  }
}
```

紧接着，我们就可以来创建`Watcher`类。

这个类的功能其实很简单，就是保存这个更新函数，然后当数据更新的时候，我们调用一下更新函数就可以了。

```javascript
/**
 * Watcher:
 *   1. 监听器 —— 负责依赖更新
 * @param vm
 * @param key: 绑定数据变量名
 * @param updateFn: 更新函数
 */
class Watcher {
  constructor(vm, key, updateFn) {
    this.vm = vm;
    this.key = key;
    this.updateFn = updateFn;
  }

  update() {
    // 执行实际更新操作
    this.updateFn.call(this.vm, this.vm[this.key]);
  }
}
```

然后在高阶函数中调用。

```javascript
update(node, exp, dir) {
  const fn = this[dir + 'Updater'];
  fn && fn(node, this.$vm[exp]);

  // 创建Watcher监听器
  new Watcher(this.$vm, exp, function (val) {
    fn && fn(node, val);
  })
}
```

而`Dependence`这个类，主要就三个功能：

- 一个是在每一次将`data`响应式处理的时候，都要创建一个相应的空数组`deps`，用于收集相应的监听器；
- 第二个是再每一次创建新的`Watcher`，都要将其放置对应的`deps`数组中；
- 第三个是每次数据更新的时候，我们就要遍历对应的`deps`，通知对应的所有监听器更新视图。

因此，我们就可以来实现`Dependence`类。

```javascript
/**
 * Dependence:
 *   观察者 —— 负责通知监听器更新
 */
class Dependence {
  constructor() {
    this.deps = [];
  }

  /**
   * addDep: 添加新的监听器
   * @param dep
   */
  addDep(dep) {
    this.deps.push(dep);
  }

  /**
   * notify: 通知更新
   */
  notify() {
    this.deps.forEach(dep => dep.update());
  }
}
```

然后我们在`Observer`类中，实现数据响应式的时候，需要创建一个`Dependence`实例，并且更新的时候通知更新。

```javascript
class Observer {
  constructor(value) {
    this.value = value;
    // 创建Dependence实例
    this.dep = new Dependence();

  ...
  }

  getArrayProto() {
    const self = this;

    const originalProto = Array.prototype;
    const arrayProto = Object.create(originalProto);
    ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'].forEach(method => {
      arrayProto[method] = function () {
        originalProto[method].apply(self, arguments);
        // 覆盖操作：通知更新
        self.dep.notify();
      }
    })
    return arrayProto;
  }

  defineReactive(obj, key, val) {
    observe(val);

    const self = this;

    Object.defineProperty(obj, key, {
      get() {
        return val;
      },
      set(newVal) {
        if (newVal !== val) {
          observe(newVal);
          val = newVal;
          // 通知更新
          self.dep.notify();
        }
      }
    })
  }
}
```

最后一步，就是收集监听器。这一步的一个难点就在于我们在创建`Watcher`之后，需要将其放置对应`key`的`deps`中，而对应的`deps`，只能在对应的`Observer`类中才能访问到。

因此，我们可以调用一次`get`，来完成收集工作。

所以我们可以直接在创建完`Watcher`后，然后将这个`this`赋值给`Dependence`类的一个新建属性中，然后访问一下对应`key`，因此触发`get`方法，就执行收集工作。

当然对于数组也是一样得到了，我们可以调用一下`push`方法且不传参，就可以将`Watcher`实例添加到数组对应的`deps`中。

```javascript
class Watcher {
  constructor(vm, key, updateFn) {
    this.vm = vm;
    this.key = key;
    this.updateFn = updateFn;

    // 触发依赖收集 
    Dependence.target = this;   // 将this赋值给Dependence的target属性
    Array.isArray(this.vm[this.key]) ? this.vm[this.key].push() : '';  // 触发收集
    Dependence.target = null;   // 收集完成后，将target设置回null
  }

  update() { ... }
}
```

```javascript
get(){
  // 依赖收集
  Dependence.target && self.dep.addDep(Dependence.target);
  return val;
}
```

```javascript
getArrayProto() {
  const self = this;

  const originalProto = Array.prototype;
  const arrayProto = Object.create(originalProto);
  ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'].forEach(method => {
    arrayProto[method] = function () {
      originalProto[method].apply(self, arguments);
      // 收集监听器
      Dependence.target && self.dep.addDep(Dependence.target);

      self.dep.notify();
    }
  })
  return arrayProto;
}
```

最后测试一下。

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
    content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>vue app</title>
</head>
<body>
<div id="app">
  <p @click="add" style="cursor: pointer">{{counter}}</p>
  <p v-text="desc"></p>
  <p v-html="desc2"></p>
  <input type="text" v-model="desc" />
  <div @click="pushArr">{{arr}}</div>
</div>

<script src="./src/vue.js"></script>
<script>
  const app = new Vue({
    el: '#app',
    data: {
      counter: 1,
      desc: 'HelloWorld',
      desc2: `<span style="font-weight: bolder">Hello World</span>`,
      arr: [0],
    },
    methods:{
      add() {
        this.counter++;
      },
      pushArr() {
        this.arr.push(this.arr.length);
      }
    }
  });
</script>
</body>
</html>
```

![demo8](/images/docs/simple-handwriting-vue2/demo8.gif)