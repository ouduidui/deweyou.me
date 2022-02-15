---
lang: zh-CN 
title: 关于Vue2组件通讯那点事 
description: 关于Vue2组件通讯那点事
---

# 关于Vue2组件通讯那点事

抽空梳理了一下Vue常用的组件之间的通讯方式，然后想通过使用的技术进行分类整理笔记。

## Prop传值

### 使用范围

父组件向子组件传值。

### 使用方法

#### 父组件

```vue

<template>
  <div id="app">
    <div class="app">
      <div class="title">App.vue</div>
    </div>
    <!-- 将text1绑定给Component1 -->
    <component1 :text="text1"/>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
    Component1,
  },
  data() {
    return {
      text1: "Text From App.vue",
    }
  }
}
</script>
```

#### 子组件

```vue

<template>
  <div class="component1">
    <div class="title">Component1</div>
    <div>
      <!-- 将父组件传递过来的text进行展示 -->
      <span class="text-bold">text：</span>
      {{text}}
    </div>
  </div>
</template>

<script>
export default {
  name: "Component1",
  // 通过props来接收text
  props: {
    text: {
      type: String
    }
  },
}
</script>
```

#### 效果展示

![Prop传值.png](/images/docs/vue-components-communication/1.png)

### 注意

父组件通过Prop传值给子组件是属于单向数据流，因此当父组件修改该值的时候，子组件也会随之更新数据；而子组件是不应该在内部改变 prop的。如果你可以这么做，但是Vue不推荐此做法，并会在控制台发出警告。

## v-on事件绑定

### 使用范围

子组件调用父组件方法。

### 使用方法

#### 父组件

```vue

<template>
  <div id="app">
    <div class="app">
      <div class="title">App.vue</div>
      <div>
        <span class="text-bold">count：</span>
        {{count}}
      </div>
    </div>
    <!-- 将事件addCount绑定给Component1 -->
    <component1 @addCount="addCount"/>
  </div>
</template>

<script>
import Component1 from "@/components/Component1";

export default {
  name: 'App',
  components: {
    Component1
  },
  data() {
    return {
      count: 0
    }
  },
  methods: {
    addCount() {
      this.count++;
    }
  }
}
</script>
```

#### 子组件

```vue

<template>
  <div class="component1">
    <div class="title">Component1</div>
    <!-- Component1的button触发addParentCount -->
    <button @click="addParentCount">
      add count of App.vue
    </button>
  </div>
</template>

<script>
export default {
  name: "Component1",
  methods: {
    // 调用组件绑定的addCount方法
    addParentCount() {
      this.$emit('addCount')
    }
  }
}
</script>
```

#### 效果展示

![v-on事件绑定.gif](/images/docs/vue-components-communication/2.gif)

### 注意

`this.$emit()` 的第一个参数为事件绑定的EventName，而从第二个参数开始为函数的参数，可以传多个参数值，意味着可以通过此方法从子组件传值给父组件。

## ref组件注册

### 适用范围

父组件获取子组件的值或调用子组件的方法。

### 使用方法

#### 父组件

```vue

<template>
  <div id="app">
    <div class="app">
      <div class="title">App.vue</div>
      <!-- 显示获取到的子组件的text -->
      <div>
        <span class="text-bold">text：</span>
        {{text2}}
      </div>
      <!-- 增加子组件的count值 -->
      <button @click="ChildrenCount">
        add count of Component1.vue
      </button>
    </div>
    <!-- 进行组件注册 -->
    <component1 ref="component1"/>
  </div>
</template>

<script>
import Component1 from "@/components/Component1";

export default {
  name: 'App',
  components: {
    Component1,
  },
  data() {
    return {
      text2: ''
    }
  },
  mounted() {
    // 获取子组件的text1值
    this.text2 = this.$refs.component1.text1 || '';
  },
  methods: {
    // 调用子组件的方法
    ChildrenCount() {
      this.$refs.component1.addCount();
    }
  }
}
</script>
```

#### 子组件

```vue

<template>
  <div class="component1">
    <div class="title">Component1</div>
    <div>
      <span class="text-bold">count：</span>
      {{count}}
    </div>
  </div>
</template>

<script>
export default {
  name: "Component1",
  data() {
    return {
      // 父组件获取到此值
      text1: 'Text From Component1.vue',
      count: 0
    }
  },
  methods: {
    // 父组件调用此方法
    addCount() {
      this.count++;
    }
  }
}
</script>
```

#### 效果

![ref组件注册.gif](/images/docs/vue-components-communication/3.gif)

### 注意

`this.$refs` 是组件渲染后才会进行填充，因此无法在计算属性 `computed` 使用，打印出来会显示 `undefined` 。

## EventBus事件总线

### 使用范围

任意组件间的事件调用。

### 使用方法

#### 初始化EventBus

共有两种方式可以初始化EventBus，第一种方式是新建一个 `eventBus.js` ，内容如下：

```js
import Vue from 'vue'

export const EventBus = new Vue()
```

然后使用时均在两个组件内引入该文件。

```js
import {EventBus} from "../eventBus.js";
```

而第二种方式是全局注册EventBus。

在项目的 `main.js` 文件下，插入注册代码：

```js
Vue.prototype.$EventBus = new Vue()
```

然后使用时即可通过 `this.$EventBus` 调用。

后面的案例均用第二种方法实现。

#### 第一个组件

```vue

<template>
  <div class="component2">
    <div class="title">Component2</div>
    <!-- 获取input值更新另一个组件的count值 -->
    <div>
      <input type="number" placeholder="Number..." v-model="value">
    </div>
    <!-- 点击button触发事件 -->
    <button @click="changeComponent1Count">
      change count of Component1
    </button>
  </div>
</template>

<script>
export default {
  name: "Component2",
  data() {
    return {
      value: ''
    }
  },
  methods: {
    // 在EventBus总线注册changeCount事件，并将value值传过去
    changeComponent1Count() {
      this.$EventBus.$emit("changeCount", this.value)
    }
  }
}
</script>
```

#### 第二个组件

```vue

<template>
  <div class="component1">
    <div class="title">Component1</div>
    <div>
      <span class="text-bold">count：</span>
      {{count}}
    </div>
  </div>
</template>

<script>
export default {
  name: "Component1",
  data() {
    return {
      count: 0
    }
  },
  // 在mounted中监听EventBus接收changeCount事件，并触发回调函数将value值赋给count
  mounted() {
    this.$EventBus.$on('changeCount', (value) => this.count = value);
  }
}
</script>
```

#### 效果

![EventBus事件总线.gif](/images/docs/vue-components-communication/4.gif)

### 注意

虽然在Vue中可以使用 `EventBus` 来作为沟通桥梁的概念，就像是所有组件共用相同的事件中心，可以向该中心注册发送事件或接收事件，使得所有组件都可以上下平行地通知其他组件，但是若使用不慎，就会造成难以维护的“灾难”。

Vue是单页应用，如果你在某一个页面刷新了之后，与之相关的 `EventBus` 会被移除，这样就导致业务走不下去。还要就是如果业务有反复操作的页面， `EventBus`
在监听的时候就会触发很多次，也是一个非常大的隐患。这时候我们就需要好好处理 `EventBus` 在项目中的关系。通常会用到，在vue页面销毁时，同时移除 `EventBus` 事件监听。

移除`EventBus` 事件监听的方法如下：

```js
// 移除指定事件
this.$EventBus.$off('changeCount')

// 移除所有事件
this.$EventBus.$off()
```

## \$parent与\$children

### 使用范围

通过插槽嵌套的父子组件进行事件调用和传值。

### 使用方法

#### App.vue

```vue

<template>
  <div id="app">
    <component3>
      <component4></component4>
    </component3>
  </div>
</template>

<script>
import Component3 from "@/components/Component3";
import Component4 from "@/components/Component4";

export default {
  name: 'App',
  components: {
    Component3,
    Component4,
  }
}
</script>
```

#### 父组件

```vue

<template>
  <div class="component3">
    <div class="title">Component3</div>
    <!-- 获取到子组件的text1值 -->
    <div>
      <span class="text-bold">text：</span>
      {{text2}}
    </div>

    <div>
      <span class="text-bold">count：</span>
      {{count}}
    </div>
    <!-- 增加子组件的count值 -->
    <button @click="addChildrenCount">
      add count of Component4.vue
    </button>

    <!-- 插槽 -->
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Component3",
  data() {
    return {
      text1: 'Text From Component3.vue',
      text2: '',
      count: 0
    }
  },
  mounted() {
    // 获取子组件的text1值
    this.text2 = this.$children[0].text1;
    // 监听子组件调用changeCount，并将参数value赋值给父组件的count
    this.$on("changeCount", value => this.count = value);
  },
  methods: {
    addChildrenCount() {
      // 调用第一个子组件绑定的addCount方法
      this.$children[0].$emit('addCount');
    }
  }
}
</script>
```

#### 子组件

```vue

<template>
  <div class="component4">
    <div class="title">Component4</div>
    <!-- 获取到父组件的text1值 -->
    <div>
      <span class="text-bold">text：</span>
      {{text2}}
    </div>

    <div>
      <span class="text-bold">count：</span>
      {{count}}
    </div>

    <div>
      <input type="number" placeholder="Number..." v-model="value">
    </div>
    <!-- 修改父组件的count值 -->
    <button @click="changeParentCount">
      change count of Component3.vue
    </button>
  </div>
</template>

<script>
export default {
  name: "Component4",
  data() {
    return {
      text1: 'Text From Component4.vue',
      text2: '',
      count: 0,
      value: ''
    }
  },
  mounted() {
    // 获取父组件的text1值
    this.text2 = this.$parent.text1;
    // 监听父组件调用addCount，并将count++
    this.$on('addCount', () => this.count++);
  },
  methods: {
    changeParentCount() {
      // 调用父组件绑定的changeCount方法，并传入value参数
      this.$parent.$emit('changeCount', this.value)
    },
  }
}
</script>
```

#### 效果

![$parent与$children.gif](/images/docs/vue-components-communication/5.gif)

### 注意

同 `$refs` ， `$parent` 和 `$children` 是组件渲染后才会进行填充，因此无法在计算属性 `computed` 使用。

`$children` 返回的是一个数组，一个父组件可能有多个子组件，但一个子组件只能有一个父组件。

## provide与inject

### 使用范围

父组件向任一后代组件传值和方法，适用于正常嵌套和插槽嵌套。

### 使用方法

#### App.vue

```vue

<template>
  <div id="app">
    <component3>
      <component4>
        <component5></component5>
      </component4>
    </component3>
  </div>
</template>

<script>
import Component3 from "@/components/Component3";
import Component4 from "@/components/Component4";
import Component5 from "@/components/Component5";

export default {
  name: 'App',
  components: {
    Component3,
    Component4,
    Component5,
  },
}
</script>
```

#### 父组件

```vue

<template>
  <div class="component3">
    <div class="title">Component3</div>
    <div>
      <span class="text-bold">count：</span>
      {{count}}
    </div>
    <!-- 插槽 -->
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Component3",
  // 向后代组件提供text和执行上下文this
  provide() {
    return {
      text: this.text1,
      component3: this
    }
  },
  methods: {
    addCount() {
      this.count++;
    }
  }
}
</script>
```

#### 子组件

```vue

<template>
  <div class="component4">
    <div class="title">Component4</div>
    、
    <!-- 显示父组件的text值 -->
    <div>
      <span class="text-bold">text：</span>
      {{text}}
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Component4",
  // 接收父组件的text值
  inject: ['text']
}
</script>
```

#### 孙组件

```vue

<template>
  <div class="component5">
    <div class="title">Component5</div>
    <!-- 显示祖组件的text值 -->
    <div>
      <span class="text-bold">text：</span>
      {{text}}
    </div>
    <!-- 增加祖组件的count值 -->
    <button @click="addGrandParentCount">
      add count of Component3.vue
    </button>
  </div>
</template>

<script>
export default {
  name: "Component5",
  // 接收祖组件的text值和执行上下文
  inject: ['text', 'component3'],
  methods: {
    // 通过祖组件执行上下文调用其方法
    addGrandParentCount() {
      this.component3.addCount();
    }
  }
}
</script>
```

#### 效果

![provide与inject.gif](/images/docs/vue-components-communication/6.gif)

## \$attrs与\$listeners

### 使用范围

孙组件获取祖组件的值或调用祖组件事件。

### 使用方法

#### 祖组件

```vue

<template>
  <div class="component6">
    <div class="title">Component6</div>
    <div>
      <span class="text-bold">count：</span>
      {{count}}
    </div>

    <!-- 祖组件向自己组件传递了text1与text2和一个addCount事件 -->
    <component7 :text1="text" :text2="text" @addCount="addCount"/>
  </div>
</template>

<script>
import Component7 from "@/components/Component7";

export default {
  name: "Component6",
  components: {
    Component7
  },
  data() {
    return {
      text: 'Text From Component6.vue',
      count: 0
    }
  },
  methods: {
    addCount() {
      this.count++
    }
  }
}
</script>
```

#### 父组件

```vue

<template>
  <div class="component7">
    <div class="title">Component7</div>
    <div>
      <span class="text-bold">text：</span>
      {{text1}}
    </div>
    <!-- 将不被父组件prop识别的attribute绑定到孙组件，也将祖组件的事件绑定到孙组件 -->
    <component8 v-bind="$attrs" v-on="$listeners"/>
  </div>
</template>

<script>
import Component8 from "@/components/Component8";

export default {
  name: "Component7",
  // 父组件prop识别了text1，因此text1不会传递到孙组件
  props: {
    text1: {
      type: String
    }
  },
  components: {
    Component8
  }
}
</script>
```

#### 孙组件

```vue

<template>
  <div class="component8">
    <div class="title">Component8</div>
    <div>
      <span class="text-bold">text：</span>
      {{text2}}
    </div>
    <button @click="addGrandparentCount">
      add count of Component6.vue
    </button>
  </div>
</template>

<script>
export default {
  name: "Component8",
  // 孙组件获取到祖组件的text2
  props: {
    text2: {
      type: String
    },
  },
  methods: {
    // 孙组件调用了祖组件的addCount事件
    addGrandparentCount() {
      this.$emit('addCount');
    }
  }
}
</script>
```

#### 效果

![$attrs与$listeners.gif](/images/docs/vue-components-communication/7.gif)

### 注意

`$attrs` 包含了父作用域中不作为 prop 被识别 (且获取) 的 attribute 绑定 (class 和 style 除外)。因此当 `text1` 已被子组件prop获取后，在孙组件是获取不到 `text1` 的。