---
lang: zh-CN
title: Vue2和Vue3的组件通信
description: 对比一下Vue2和Vue3的组件通信实现
---

# 对比一下Vue2和Vue3的组件通信实现

`Vue`框架有一大特色，就是**组件化**。

即我们可以把一个复杂的页面，拆分成一个个独立的组件，这样子更加便于维护和调试；再者，组件还有一个特定就是可复用性，我们可以将多个页面的共有部分抽取成一个组件，比如导航栏、底部信息、轮播图等等。

组件化的实现，有助于我们提供开发效率、方便重复使用，简化调试步骤，提升项目可维护性。



而组件化的实现，就避免不了组件之间的通信，即数据传输和方法调用。而且现实开发中，不仅仅只有父子组件，还会有兄弟组件、爷孙组件等等。


我们先简单过一遍常见的组件通讯方法。

## Vue2组件通信方法

> 之前我写过一篇[关于`Vue2`的组件通信方法的文章](https://ouduidui.cn/blogs/front-end/vue/vue-components-communication.html)，相对比较详细，这里的话就比较简单带过。

### 属性绑定（props）

> [官方文档](https://cn.vuejs.org/v2/guide/components-props.html)

对于父组件向子组件传递数据的时候，我们常用的就是属性绑定。

```vue
// 父组件
<comp :msg="Hello World"></comp>

// 子组件
<script>
  export default {
    props: {  
      msg: {    // 使用props接收msg属性
        type: String,   // 进行类型判断
        default: ''     // 设置默认值
      }
    }
  }
</script>
```

### 事件绑定（on、emit）

> [官方文档](https://cn.vuejs.org/v2/api/#%E5%AE%9E%E4%BE%8B%E6%96%B9%E6%B3%95-%E4%BA%8B%E4%BB%B6)

当子组件先调用父组件的方法的时候，我们常用就是将父组件的方法绑定给子组件，然后子组件通过`$emit`调用。

而且，我们也可以通过此方法，实现子组件向父组件进行传值。

```vue
// 父组件
<comp @saySomething="saySomething"></comp>

<script>
  export default {
    methods: {
      saySomething(msg) {   // 接收到子组件的参数
        console.log(msg);
      }
    }
  }
</script>

// 子组件
<script>
  export default {
    methods: {
      saySomething() {
        // 调用绑定的saySomething事件，并且将HelloWorld作为参数传过去
        this.$emit('saySomething', 'HelloWorld')
      }
    }
  }
</script>
```

### 访问子组件实例（ref）

> [官方文档](https://cn.vuejs.org/v2/guide/components-edge-cases.html#%E8%AE%BF%E9%97%AE%E5%AD%90%E7%BB%84%E4%BB%B6%E5%AE%9E%E4%BE%8B%E6%88%96%E5%AD%90%E5%85%83%E7%B4%A0)

当父组件想要调用子组件的方法的时候，我们可以先获取子组件的实例，然后直接通过实例调用方法。

```vue
// 父组件
<comp ref="comp"></comp>

<script>
  export default {
    methods: {
      saySomething() { 
        // 通过this.$refs.comp获取到comp组件实例，然后直接调用其方法并传入参数。
        this.$refs.comp.saySomething("HelloWorld");
      }
    }
  }
</script>


// 子组件
<script>
  export default {
    methods: {
      saySomething(msg) {
        console.log(msg);
      }
    }
  }
</script>
```

### 事件总线

对于兄弟组件通信，或者多级组件之间的通信，经常都是使用事件总线去实现。

而事件总线不是`Vue`原生自带的，这些需要我们自己去封装或者找插件去实现。而它的实现原理其实很简单，就是模仿原生的`$emit`、`$on`、`$once`、`$off`的实现。

> 在`vue2`中通常也会用`new Vue()`去代替`Bus`，但在`vue3`就取消了`$on`全局接口，就只能同自己实现或者使用插件

```javascript
class Bus {
  constructor() {
    // 存放所有事件
    this.callbacks = {}
  }

  // 事件绑定
  $on(name, fn) {
    this.callbacks[name] = this.callbacks[name] || []
    this.callbacks[name].push(fn)
  }

  // 事件派发
  $emit(name, args) {
    if (this.callbacks[name]) {
      this.callbacks[name].forEach(cb => cb(args))
    }
  }
}

// main.js
Vue.prototype.$bus = new Bus()


// comp1
this.$bus.$on('saySomthing', (msg) => { console.log(msg) });

// comp2
this.$bus.$emit('saySomthing', 'HelloWorld');
```

### VueX

> [官方文档](https://vuex.vuejs.org/zh/)

对于复杂结构的组件通讯，我们可以选择`VueX`去实现通讯，这里就不多讲了。

### 非prop特性（`$attrs`/`$listeners`）

> [官方文档](https://cn.vuejs.org/v2/api/#vm-attrs)

`$attrs` 包含了父作用域中不作为 prop 被识别 (且获取) 的 attribute 绑定 (`class` 和 `style` 除外)。

`$listeners`包含了父作用域中的 (不含 `.native` 修饰器的) `v-on` 事件监听器。

这两种常用于隔代通讯的情况上。

```vue
// 父组件
<comp1 :msg1="helloWorld" :msg2="HiWorld" @saySomething="saySomething"></comp1>


// 子组件 comp1
<comp2 v-bind="$attrs" v-on="$listeners"></comp2>
<!-- 此时的$attrs只存在msg1，因为msg2已经被props识别了 -->
<!-- 上面的代码，等同于下列代码 -->
<!-- <comp2 :msg1="$attrs.msg1" @saySomething="$listeners.saySomething"></comp2> -->

<script>
  export default {
    props: ['msg2']
  }
</script>


// 孙组件 comp2
<div @click="$emit('saySomething')">{{msg1}}</div>

<script>
  export default {
    props: ['msg1']
  }
</script>
```

### `$parent`/`$root`/`$children`

> [官方文档](https://cn.vuejs.org/v2/api/#vm-parent)

我们可以通过`$parent`、`$root`、`$children`分别获取到父级组件实例、根组件实例、子组件实例。

`$children`返回是一个数组，并且不能保证数组中子元素的顺序。



我们可以使用这些接口，配合`$on`和`$emit`实现一些组件通讯。

```javascript
/* 兄弟组件使用共同祖辈搭桥 */
// comp1
this.$parent.$on('foo', handle)
// comp2
this.$parent.$emit('foo')
```

```vue
// slot通信
<comp1>
  <comp2></comp2>
</comp1>


// comp1
<div>
  <slot></slot>
</div>

<script>
  export default {
    methods: {
      saySomething() {
        // 遍历$children进行派发事件
        this.$children.forEach(comp => comp.$emit('saySomething', 'HelloWorld'))
      }
    }
  }
</script>


// comp2
<script>
  export default {
    mounted() {
      // 在mounted的事件进行事件绑定
      this.$on('saySomething', (msg) => {
        console.log(msg)
      })
    }
  }
</script>
```

### provide/inject

> [官方文档](https://cn.vuejs.org/v2/api/#provide-inject)

`provide`和`inject`能够实现祖先组件与后代组件之间的传值，也就是说不论是多少代，只要是嵌套关系，都可以使用该属性进行传值。

```javascript
// 祖先组件
provide() {
  return {
    msg: 'Hello World' // 提供一个msg属性
  }
}

// 后代组件
inject: ['msg'];  // 注入属性
mounted() {
  console.log(this.msg);
}
```

## Vue2实现Form表单

> 下列代码会有删减，可以到 [github](https://github.com/OUDUIDUI/fe-study/tree/master/package/vue/vue_component_communication/vue2) 查看源码

我们通过模仿一下`ElementUI`的`Form`表单实现，来实践一下组件通信。

我们大致一个`Form`组件结构如下：

```vue
<o-form>
  <o-form-item>
    <o-input></o-input>
  </o-form-item>
</o-form>
```

因此我们先实现一下三个组件的页面结构。

```vue
<!--  OForm.vue  -->
<template>
  <div>
    <slot></slot>
  </div>
</template>


<!--  OFormItem.vue  -->
<template>
  <div class="input-box">
    <!--   标签   -->
    <p v-if="label" class="label">{{ label }}：</p>
    <slot></slot>
    <!--   错误提示   -->
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>


<!--  OInput.vue  -->
<template>
  <div>
    <input>
  </div>
</template>
```

首先我们从最简单的开始，实现`input`的`value`双向绑定，这时候需要用到`v-model`去实现。

```vue
<!--  app.vue  -->
<template>
  <o-form>
    <o-form-item>
      <o-input v-model="model.email" @input="input"></o-input>
    </o-form-item>
  </o-form>
</template>

<script>
  export default {
    data() {
      return {
        model: {
          email: ''
        }
      }
    },
    methods: {
      input(value) {
        console.log(`value = ${value}，this.model.email = ${this.model.email}`);
      }
    }
  }
</script>



<!--  OInput.vue  -->
<template>
  <div>
    <input :value="value" @input="input">
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: String
      }
    },
    methods: {
      input(e) {
        // 派发input事件
        this.$emit('input', e.target.value);
      }
    }
  }
</script>
```

通过上面我们可是实现最简单的双向绑定，也实现了`OInput`组件的`input`事件。

当然我们可以顺便实现一下`input`的其他属性，比如`placeholder`、`type`等等，当然这些属性可以使用`$attrs`来实现，这样子就不需要一个个`props`出来。

```vue
<!--  app.vue  -->
<template>
  <o-form>
    <o-form-item>
      <o-input v-model="model.email" @input="input" type="email" placeholder="请输入邮箱"></o-input>
    </o-form-item>
  </o-form>
</template>


<!--  OInput.vue  -->
<template>
  <div>
    <!--    使用$attrs绑定input其它属性    -->
    <input :value="value" @input="input" v-bind="$attrs">
  </div>
</template>

<script>
  export default {
    inheritAttrs: false,  // 不继承默认属性
    ...
  }
</script>
```

接下来也实现一下`o-form-item`的属性绑定，这个组件出现简单显示`label`和错误信息之外，其实还有一个功能，就是数据校验，这个在后面再细讲。

这个组件默认传入两个属性，一个是`label`，一个是`prop`，`prop`主要适用于后面数据校验判断该`form-item`是对应哪个数据。

```vue
<!--  app.vue  -->
<template>
  <o-form>
    <o-form-item label="邮箱" prop="email">
      <o-input v-model="model.email" @input="input" type="email" placeholder="请输入邮箱"></o-input>
    </o-form-item>
    <o-form-item label="密码" prop="password">
      <o-input v-model="model.password" placeholder="请输入密码" type="password"/>
    </o-form-item>
  </o-form>
</template>


<!--  OFormItem.vue  -->
<script>
  export default {
    props: {
      label: {
        type: String,
        default: ''
      },
      prop: {  // 用于判断该item是哪个属性
        type: String,
        default: ''
      }
    },
    data() {
      return {
        error: ''  // 错误信息
      }
    }
  }
</script>
```

同时将检验规则`rules`和`model`传入给`OForm`。

```vue
<!--  app.vue  -->
<template>
  <o-form :model="model" :rules="rules">
    <o-form-item label="邮箱" prop="email">
      <o-input v-model="model.email" @input="input" type="email" placeholder="请输入邮箱"></o-input>
    </o-form-item>
    <o-form-item label="密码" prop="password">
      <o-input v-model="model.password" placeholder="请输入密码" type="password"/>
    </o-form-item>
  </o-form>
</template>

<script>
  export default {
    data() {
      return {
        model: {
          email: '',
          password: ''
        },
        // 校验规则
        rules: {
          email: [
              {required: true, message: "请输⼊邮箱"},  // 必填
              {type: 'email', message: "请输⼊正确的邮箱"}  // 邮箱格式
          ],
          password: [
              {required: true, message: "请输⼊密码"},  // 必填
              {min: 6, message: "密码长度不少于6位"}   // 不少于6位
          ]
        }
      }
    }
  }
</script>


<!--  OForm.vue  -->
<script>
  export default {
    props: {
      model: {
        type: Object,
        required: true   // 必填项
      },
      rules: {
        type: Object
      }
    }
  }
</script>
```

现在基本的组件传参已经实现了，接下来我们就要来实现一下校验功能。

首先，我们在输入的过程中，就要开始调用数据检验了，因此在`OInput`组件中的`input`方法，需要调用到`OFormItem`的检验方法。但因为是使用`slot`嵌套，所以我们可以使用`$parent`去派发事件。

```javascript
// OInput.vue
input(e) {
  // 派发input事件
  this.$emit('input', e.target.value);
	// 派发validate事件
  this.$parent.$emit('validate');
}


// OFormItem.vue
mounted() {
  // 在mounted钩子实现事件绑定
  this.$on('validate', () => {this.validate()}); 
},
methods: {
  // 校验方法
  validate() {}
 }
```

紧接着就来实现`validate`方法。

首先我们需要从`OForm`组件拿到对应的值和规则，因为我们已经有`prop`值，因此我们只需要拿到`OForm`的`model`和`rules`属性即可，然后通过`prop`获取对应的值和规则。

而这时，我们就可以使用到`provide`和`inject`来实现。

```javascript
// OForm.vue
provide() {
  return {
    form: this  // 返回整个实例
  }
}


// OFormItem.vue
inject: ['form'],  // 注入
methods: {
  // 校验方法
  validate() {
    // 获取对应的值和规则
    const value = this.form.model[this.prop];
    const rules = this.form.rules[this.prop];
  }
}
```

这个校验使用了[async-validator](https://github.com/yiminghe/async-validator)，这里就简单带过。

```vue
<!--  OFormItem.vue  -->
<script>
  import Schema from "async-validator";
  
  export default {
    ...
    
    methods: {
      validate() {
        // 获取对应的值和规则
        const value = this.form.model[this.prop];
        const rules = this.form.rules[this.prop];
  
        // 创建规则实例
        const schema = new Schema({[this.prop]: rules});
        // 调用实例方法validate进行校验，该方法返回Promise
        return schema.validate({[this.prop]: value}, errors => {
          if (errors) {
            // 显示错误信息
            this.error = errors[0].message;
          } else {
            this.error = '';
          }
        })
      }
    }
  }
</script>
```

最后一个功能，就是提交表单的时候，需要全部表单校验一遍。因此点击提交按钮的时候，需要调用到`OForm`里的校验方法。

```vue
<!--  app.vue  -->
<template>
  <o-form :model="model" :rules="rules">
    <o-form-item label="邮箱" prop="email">
      <o-input v-model="model.email" @input="input" type="email" placeholder="请输入邮箱"></o-input>
    </o-form-item>
    <o-form-item label="密码" prop="password">
      <o-input v-model="model.password" placeholder="请输入密码" type="password"/>
    </o-form-item>
    <o-form-item>
      <button @click="register">注册</button>
    </o-form-item>
  </o-form>
</template>

<script>
  export default {
    ...
    methods: {
      register() {
        // 调用form组件的validate方法
        this.$refs.form.validate(valid => valid ? alert('注册成功') : '');
      }
    }
}
</script>
```

而`OForm`组件中的`validate`方法，需要遍历调用每个`OFormItem`的`validate`方法，并且将结果方法。

```javascript
// OForm.vue
validate(cb) {
  const tasks = this.$children 
    .filter(item => item.prop)  // 遍历$children，筛选掉没有prop值的实例
  	.map(item => item.validate());  // 调用子组件的validate方法

  // 因为OFormItem的validate方法返回的是Promise，因此通过Promise.all判断是否全都通过
  Promise.all(tasks)  
    .then(() => cb(true))
    .catch(() => cb(false))
}
```

这时我们的`Form`组件就基本实现了。

## Vue3组件通讯的改动

在`Vue3`中，组件通讯的方法发生了不少变化。

### 移除了`$on`、`$once`、`$off`

> [官方文档](https://v3.cn.vuejs.org/guide/migration/events-api.html)

`Vue3`不再支持`$on`、`$once`、`$off`这三个方法，而当我们必须使用此类方法的话，可以通过自己封装`EventBus`事件总线或者使用第三方库实现。

官方也推荐了[mitt](https://github.com/developit/mitt)和[tiny-emitter](https://github.com/scottcorgan/tiny-emitter)这两个库，使用方法也比较简单，可以自己去研究一下。

### 移除了`$children`

> [官方文档](https://v3.cn.vuejs.org/guide/migration/children.html#children)

`Vue3`同时也移除了`$children`方法，官方推荐是使用`$refs`去实现获取子组件的实例。

而`Vue3`在`composition api`中实现`$refs`也有所不同，因为在`setup`中的`this`不是指向组件实例，因此我们不能直接通过`this.$refs`来获取组件实例。

因此，下面简单写一下新的实现方法：

```vue
<template>
  <comp ref="comp"></comp>
</template>

<script>
  import {ref, onMounted} from "vue";
  
  export default {
    setup() {
      const comp = ref();  // 该变量名必须与上面绑定的名称一致，并初始化的值为空或为null
      
      onMounted(() => {
        // 在mounted钩子的时候，Vue会将该实例赋值给comp
        // 但如果你在mounted生命周期前访问该值还是为空的
        console.log(comp.value);  
      })
      
      return {
        comp  // 一定得将该属性暴露出去，否则Vue不会将子组件实例赋值给它
      }
    }
  }
</script>
```

### emits、provide、inject选项

如果在`Vue3`依旧使用`option api`的话，依旧可以使用`this.$emits`以及`provide`、`inject`选项；但如果使用`compsition api`的话，`emits`方法会通过`setup`参数参入，而`provide`和`inject`可以通过引入钩子实现。

```vue
<script>
  import {provide, inject} from "vue";
  
  export default {
    setup(props, {attrs, slots, emit}) {
      // 派发事件
      emit('saySomething', 'Hello World');
        
      // 提供属性
      provide('msg', 'Hello World');
      // 注入属性
      const msg = inject('msg');
    }
  }
</script>
```

## Vue3实现Form表单

>  下列代码会有删减，可以到 [github](https://github.com/OUDUIDUI/fe-study/tree/master/package/vue/vue_component_communication/vue3) 查看源码

结构样式跟上面`Vue2`实现一样，重复的东西我就不多讲，重点是在于后面数据校验的实现上，那部分后面会详细讲一讲。

首先看看`app.vue`的结构，样式结构没有太大变化，而这边使用了`composition api`写法。

```vue
<template>
  <div class="form">
    <h1 class="title">用户注册</h1>
    <o-form :model="model" :rules="rules" ref="formRef">
      <o-form-item label="邮箱" prop="email">
        <o-input v-model="model.email" @input-event="input" placeholder="请输入邮箱" type="email" />
      </o-form-item>
      <o-form-item label="密码" prop="password">
        <o-input v-model="model.password" placeholder="请输入密码" type="password" />
      </o-form-item>
      <o-form-item>
        <button @click="register">注册</button>
      </o-form-item>
    </o-form>
  </div>
</template>

<script>
  import OInput from "./components/OInput.vue";
  import OFormItem from "./components/OFormItem.vue";
  import OForm from "./components/OForm.vue";
  import {ref, reactive} from "vue";

  export default {
    name: 'App',
    components: {
      OInput,OFormItem,OForm
    },
    setup() {
      // 表单数据
      const model = reactive({
        email: '',
        password: ''
      })
  
      // 表单规则
      const rules = reactive({
        email: [
          {required: true, message: "请输⼊邮箱"},
          {type: 'email', message: "请输⼊正确的邮箱"}
        ],
        password: [
          {required: true, message: "请输⼊密码"},
          {min: 6, message: "密码长度不少于6位"}
        ]
      })
  
      // input方法
      const input = (value) => {
        console.log(`value = ${value}，model.email = ${model.email}`);
      }
  
          
      // 获取OForm的实例
      const formRef = ref();
      // 提交事件
      const register = () => {
        // 因为点击事件会发生在mounted生命周期后，因此formRef已经被赋值实例
        formRef.value.validate(valid => valid ? alert('注册成功') : '');
      }
      
      return {
        model,
        rules,
        input,
        register,
        formRef
      }
    }
  }
</script>
```

接着来看看其他组件的基本实现。

```vue
<!--  OInput.vue  -->
<template>
  <input v-model="modelValue" v-bind="$attrs" @input="input">
</template>

<script>
export default {
  name: "OInput",
  props: {
    // Vue3中，v-model绑定的值默认为modelValue，而不再是value
    modelValue: {   
      type: String
    }
  },
  setup(props, {emit}) {
    const input = (e) => {
      const value = e.target.value
      // 派发事件
      emit('inputEvent', value);
    }
    
    return {
      input
    }
  }
}
</script>
```

```vue
<!--  OFormItem.vue  -->
<template>
  <div class="input-box">
    <p v-if="label" class="label">{{ label }}：</p>
    <slot></slot>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
  import {ref} from "vue";
  
  export default {
    name: "OFormItem",
    props: {
      prop: {
        type: String,
        default: ''
      },
      label: {
        type: String,
        default: ''
      }
    },
    setup() {
      // error响应式变量初始化
      const error = ref('');
      
      return {
        error
      }
    }
  }
</script>
```

```vue
<!--  OForm.vue  -->
<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "OForm",
  props: {
    model: {
      type: Object,
      required: true
    },
    rules: {
      type: Object,
      default: {}
    }
  }
}
</script>
```

现在基本的组件结构就实现了。

紧接着第一件事就是实现在`OInput`组件中，在`input`方法能够调用`OFormItem`的校验方法。

而在`vue2`中，我们是通过`this.$parent.$emit`去派发实现，但是在`vue3`的`composition api`中显然是不太好这么去实现的，因为在`setup`中获取不到`$parent`方法，况且在`OFormitem`中也使用不了`$on`去绑定事件。

因此，我们可以使用`provide`和`inject`的方法，将检验方法传递给`OInput`组件，然后它直接调用就可以了。

```javascript
// OFormItem.vue
import {provide} from "vue";

export default {
  setup() {
    ...
  
    // 校验方法
    const validate = () => {}
    // 提供validate方法
    provide('formItemValidate', validate);
  
    ...
  }
}


// OInput.vue
import { inject } from 'vue'

export default {
  setup(props, {emit}) {
    // 注入formItemValidate
    const validate = inject('formItemValidate');

    const input = (e) => {
      const value = e.target.value
      emit('inputEvent', value);
          
      // 调用数据检验
      validate();
    }

    return {
    input
    }
  }
}
```

紧接着，我们就要实现`OFormItem`的校验方法，首先要获取到`OForm`的`model`和`rules`属性，同样使用`provide`和`inject`的方法去实现。

```javascript
// OForm.vue
import {provide} from "vue";

export default {
  setup({model, rules}) {
    // 向下提供model和rules，此时model和rules本身就是响应式数据，因此子组件注入的时候也是响应式数据
    provide('model', model);
    provide('rules', rules);

    ...
  }
}


// OFormItem.vue
import {inject} from "vue";
import Schema from "async-validator"

export default {
  ...
  setup({prop}) {
    ...
       
    // 注入model和rules
    const model = inject('model');
    const rules = inject('rules');
    
    // 校验方法
    const validate = () => {
      // 获取对应的值和校验规则
      const value = model[prop];
      const rule = rules[prop];
      // 进行校验
      const schema = new Schema({[prop]: rule});
      return schema.validate({[prop]: value}, errors => {
        if (errors) {
          error.value = errors[0].message;
        } else {
          error.value = '';
        }
      })
    }

        ...
  }
}
```

最后呢，就是提交表单的时候，需要校验所有的表单数据是否通过。

在`app.vue`中，通过`$refs`的方法调用`OForm`的校验方法。

```javascript
// 获取OForm的实例
const formRef = ref();

// 提交事件
const register = () => {
  // 因为点击事件会发生在mounted生命周期后，因此formRef已经被赋值实例
  formRef.value.validate(valid => valid ? alert('注册成功') : '');
}
```

而最难实现的就是`OForm`的`validate`方法。

在`vue2`中，我们是直接使用`this.$children`进行遍历执行就可以了，但是在`vue3`中，我们没有了`$children`方法，而且官方推荐的`$refs`方法也没办法使用，因为我们使用的是`slot`插槽，无法绑定每个`OFormItem`上。

这时候，我们需要使用事件总线来实现这个方法。

这里我采用的是自己简单写一个`EventBus`。

```javascript
// utils/eventBus.js
const eventBus = {
  callBacks: {},
  // 收集事件
  on(name, cb) {
    if(!this.callBacks[name]){
      this.callBacks[name] = [];
    }

    this.callBacks[name].push(cb);
  },

  // 派发事件
  emit(name, args) {
    if(this.callBacks[name]) {
      this.callBacks[name].forEach(cb => cb(args));
    }
  }
}

export default eventBus
```

紧接着，我们采用的方案是，在`OForm`组件中，收集每个`OFormItem`的实例上下文，然后我们就可以直接调用对应实例上下文的`validate`方法既可。

这个方案有点类似于`Vue`源码中的依赖收集。

我们需要在`OFormItem`组件初始化的时候，即`mounted`生命周期的时候，派发一下收集事件，并将该组件的组件实例上下文作为参数传递过去；即通知`OForm`的收集，将传入的上下文收集起来。

而在`OForm`中，我们需要在`setup`中实现事件绑定，而不应该在`OnMounted`钩子实现，因为子组件的`OnMounted`钩子会比父组件的`OnMounted`先调用，而我们需要在事件派发前先绑定事件。

```javascript
// OFormItem.vue
import {onMounted, getCurrentInstance} from "vue";
import eventBus from "../utils/eventBus"

export default {
  setup() {
    ...

    onMounted(() => {
      // 在mount周期派发collectContext，让OForm收集该组件上下文
      const instance = getCurrentInstance();
      eventBus.emit('collectContext', instance.ctx);
    })

    return {
      ...
      validate  // 方法必须返回出去，反正OForm获取到的OFormItem实例无法调用该方法
    }
  }
}


// OForm.vue
import eventBus from "../utils/eventBus"

export default {
  ...
  
  setup({model, rules}) {
    ...

    // 在mount声明之前收集collectContext事件
    const formItemContext = [];
    eventBus.on('collectContext', (instance) => formItemContext.push(instance));
    
    const validate = (cb) => {
      // 遍历收集到的子组件上下文，调用其校验方法
      const tasks = formItemContext
        .filter(item => item.prop)
        .map(item => item.validate())

      Promise.all(tasks)
         .then(() => cb(true))
         .catch(() => cb(false))
    }

    return {
      validate
    }
  }
}
```

这时候，我们的`Vue3`版本表单组件就实现了。
 
 <Comment /> 
 