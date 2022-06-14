---
lang: zh-CN
title: JavaScript手写题
description: JavaScript手写题
date: 2022-02-16T08:00:00.000+00:00
author: Dewey Ou
---

# JavaScript 手写题

为了更好的阅读，我将其他分为了六个部分：字符串、数组、对象、函数、Promise 和其他类型的。

而且，我会在每个实现上附上对应的实现方法的功能和简单思路，而不只是只贴实现代码。

> 如果想看源码的话可以到我的[github 项目](https://github.com/ouduidui/javascript-wheels/tree/master)查阅，上面也有对应的测试用例。

## 字符串

### 字符串原生方法

#### trim()

##### 思路

`trim()` 方法会从一个字符串的两端删除空白字符。

它返回一个调用字符串两端去掉空白的新字符串。

##### 实现

```javascript
/**
 * 实现字符串原型方法 trim()
 * @author 欧怼怼
 * @return {string}
 */
function trim() {
  const str = this
  // ^ -> 匹配输入的开始
  // $ -> 匹配输入的结束
  // \s -> 匹配一个空白字符，包括空格、制表符、换页符和换行符
  // A|B -> 匹配‘A’或者‘B’
  return str.replace(/^\s*|\s*$/g, '')
}
```

#### slice()

##### 思路

`slice()`方法提取某个字符串的一部分，并返回一个新的字符串，且不会改动原字符串。

该方法接收两个参数：

- `beginIndex`：从该索引（以 0 为基数）处开始提取原字符串中的字符。如果值为负数，会被当做 `strLength + beginIndex` 看待，这里的`strLength` 是字符串的长度

- `endIndex`：可选。在该索引（以 0 为基数）处结束提取字符串。如果省略该参数，`slice()` 会一直提取到字符串末尾。如果该参数为负数，则被看作是 strLength + endIndex，这里的 strLength 就是字符串的长度

它返回一个从原字符串中提取出来的新字符串。

##### 实现

```javascript
/**
 * 实现字符串原型方法 slice
 * @author 欧怼怼
 * @param beginIndex {number}
 * @param [endIndex] {number}
 * @return {string}
 */
function slice(beginIndex, endIndex) {
  const str = this
  // 处理 beginIndex 小于零情况
  beginIndex = beginIndex < 0 ? str.length + beginIndex : beginIndex
  // 处理 endIndex 为没有传的情况
  endIndex = endIndex === undefined ? str.length : endIndex < 0 /* 判断 endIndex 是不是小于0 */ ? str.length + endIndex : endIndex

  // 当 beginIndex 大于等于 endIndex 时，则返回空字符串
  if (beginIndex >= endIndex) return ''

  let result = ''
  // 遍历拼接结果
  for (let i = beginIndex; i < endIndex; i++) {
    result += str[i]
  }

  return result
}
```

### 解析模板字符串

#### 思路

`ES6`新增了模板字符串，允许在字符串字面量嵌入表达式，使用如下：

```javascript
const name = 'OUDUIDUI'
console.log(`my name is ${name}`) // 'my name is OUDUIDUI'
```

我们可以实现一个`render(template,data)`函数，通过传入字符串或变量对象，来实现解析模板字符串，使用如下：

```javascript
const template = 'my name is ${name}'
const data = { name: 'OUDUIDUI' }
console.log(render(template, date)) // 'my name is OUDUIDUI'
```

#### 实现

```javascript
/**
 * 解析模板字符串
 * @author 欧怼怼
 * @param template {string}
 * @param data {object}
 * @return {*}
 */
function render(template, data) {
  const reg = /\$\{(\w+)\}/ // 模板字符串占位符正则

  // 判断字符串里是否存在占位符
  if (reg.test(template)) {
    // 获取第一个占位符包含的变量名
    const expression = reg.exec(template)[1]
    // 替换为data里的数据
    // 如果对应数据为复杂类型，replace函数会执行 toString 操作
    template = template.replace(reg, data[expression])
    // 递归调用，继续查找下一个占位符
    return render(template, data)
  }

  // 返回结果
  return template
}
```

## 数组

### 数组原生方法

#### forEach

##### 思路

`forEach()` 方法对数组的每个元素执行一次给定的函数。

它接收两个参数，分别为`callback`和`thisArg`。

- `callback`：为数组中每个元素的执行函数，该函数接收一至三个参数

  - `currentValue`：数组正在处理的当前元素

  - `index`：可选，数组正在处理的当前元素的索引

  - `array`：可选，方法正在操作的数组

- `thisArg`：可选参数。是当执行回调函数`callback`时，用在`this`的值

`forEach`没有返回值。

##### 实现

```javascript
/**
 * 实现 _forEach
 * @author 欧怼怼
 * @param callback {(currentValue: *, index?: number, array?: *[]) => void}
 * @param thisArg {object | undefined}
 * @returns {void}
 */
const _forEach = function (callback, thisArg) {
  // 判断this不等于null
  if (this === null) {
    throw new TypeError('this is null or not defined')
  }

  // 判断callback是不是一个函数
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function')
  }

  const arr = this
  const len = arr.length

  let index = 0
  // 遍历数组
  while (index < len) {
    // 使用call调用函数
    callback.call(thisArg, arr[index], index, arr)
    index++
  }
}
```

#### map

##### 思路

`map()` 方法创建一个新数组，其结果是该数组中的每个元素是调用一次提供的函数后的返回值。

它的接收参数跟`forEach`一致，这里就不多说了。

`map()`方法会放毁一个由原数组每个元素执行回调函数的结果组成的新数组。

##### 实现

```javascript
/**
 * 实现数组原型方法 map
 * @author 欧怼怼
 * @param callback {(currentValue: *, index?: number, array?: *[]) => *}
 * @param thisArg {object | undefined}
 * @returns {*[]}
 */
const _map = function (callback, thisArg) {
  // 判断this不等于null
  if (this === null) {
    throw new TypeError('this is null or not defined')
  }

  // 判断callback是不是一个函数
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function')
  }

  const arr = this
  const len = arr.length
  // 初始化返回数组
  const newArr = []

  let index = 0
  // 遍历数组
  while (index < len) {
    // 将返回值保存到newArr
    newArr[index] = callback.call(thisArg, arr[index], index, arr)
    index++
  }

  // 返回新数组
  return newArr
}
```

#### filter

##### 思路

`filter()` 方法创建一个新数组, 其包含通过所提供函数实现的测试的所有元素。

它的接收参数跟`forEach`一致，这里就不多说了。

`filter()`会返回一个新的、由通过测试的元素组成的数组，如果没有任何数组元素通过测试，则返回空数组。

##### 实现

```javascript
/**
 * 实现数组原型方法 filter
 * @author 欧怼怼
 * @param callback {(currentValue: *, index?: number, array?: *[]) => boolean}
 * @param thisArg {object | undefined}
 * @returns {*[]}
 */
const _filter = function (callback, thisArg) {
  // 判断this不等于null
  if (this === null) {
    throw new TypeError('this is null or not defined')
  }

  // 判断callback是不是一个函数
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function')
  }

  const arr = this
  const len = arr.length

  const newArr = []
  let index = 0

  // 遍历数组
  while (index < len) {
    // 如果通过回调函数的测试，则添加到newArr
    if (callback.call(thisArg, arr[index], index, arr)) {
      newArr.push(arr[index])
    }
    index++
  }

  // 返回新数组
  return newArr
}
```

#### find

##### 思路

`find()` 方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 `undefined`。

它的接收参数跟`forEach`一致，这里就不多说了。

##### 实现

```javascript
/**
 * 实现数组原型方法 find
 * @author 欧怼怼
 * @param callback {(currentValue: *, index?: number, array?: *[]) => boolean}
 * @param thisArg {object | undefined}
 * @returns {*}
 */
const _find = function (callback, thisArg) {
  // 判断this不等于null
  if (this === null) {
    throw new TypeError('this is null or not defined')
  }

  // 判断callback是不是一个函数
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function')
  }

  const arr = this
  const len = arr.length

  let index = 0
  // 遍历数组
  while (index < len) {
    // 当有一个满足测试函数就立即返回
    if (callback.call(thisArg, arr[index], index, arr)) {
      return arr[index]
    }
    index++
  }

  // 如果没有一个满足条件的话则返回 undefined
  return undefined
}
```

#### findIndex

##### 思路

`findIndex()`方法返回数组中满足提供的测试函数的第一个元素的**索引**。若没有找到对应元素则返回-1。

它的接收参数跟`forEach`一致，这里就不多说了。

##### 实现

这个其实只需要在`find`的基础上修改一下返回值就可以了：

```javascript
/**
 * 实现数组原型方法 findIndex
 * @author 欧怼怼
 * @param callback {(currentValue: *, index?: number, array?: *[]) => boolean}
 * @param thisArg {object | undefined}
 * @returns {number}
 */
const _findIndex = function (callback, thisArg) {
  // 判断this不等于null
  if (this === null) {
    throw new TypeError('this is null or not defined')
  }

  // 判断callback是不是一个函数
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function')
  }

  const arr = this
  const len = arr.length

  let index = 0
  // 遍历数组
  while (index < len) {
    // 当有一个满足测试函数就立即返回对应的索引
    if (callback.call(thisArg, arr[index], index, arr)) {
      return index
    }
    index++
  }

  // 如果没有一个满足条件的话则返回-1
  return -1
}
```

#### every

##### 思路

`every()` 方法测试一个数组内的所有元素是否都能通过某个指定函数的测试。它返回一个布尔值。

> **注意**：若收到一个空数组，此方法在一切情况下都会返回 `true`。

它的接收参数跟`forEach`一致，这里就不多说了。

##### 实现

```javascript
/**
 * 实现数组原型方法 every
 * @author 欧怼怼
 * @param callback {(currentValue: *, index?: number, array?: *[]) => boolean}
 * @param thisArg {object | undefined}
 * @returns {boolean}
 */
const _every = function (callback, thisArg) {
  // 判断this不等于null
  if (this === null) {
    throw new TypeError('this is null or not defined')
  }

  // 判断callback是不是一个函数
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function')
  }

  const arr = this
  const len = arr.length

  let index = 0
  // 遍历数组
  while (index < len) {
    // 但凡有一个没有通过测试，则返回false
    if (!callback.call(thisArg, arr[index], index, arr)) {
      return false
    }
  }

  // 遍历结束都通过测试，即返回true
  return true
}
```

#### some

##### 思路

`some()`  方法测试数组中是不是至少有 1 个元素通过了被提供的函数测试。它返回的是一个 Boolean 类型的值。

> **注意**：如果用一个空数组进行测试，在任何情况下它返回的都是`false`。

它的接收参数跟`forEach`一致，这里就不多说了。

##### 实现

```javascript
/**
 * 实现数组原型方法 some
 * @author 欧怼怼
 * @param callback {(currentValue: *, index?: number, array?: *[]) => boolean}
 * @param thisArg {object | undefined}
 * @returns {boolean}
 */
const _some = function (callback, thisArg) {
  // 判断this不等于null
  if (this === null) {
    throw new TypeError('this is null or not defined')
  }

  // 判断callback是不是一个函数
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function')
  }

  const arr = this
  const len = arr.length

  let index = 0
  while (index < len) {
    if (callback.call(thisArg, arr[index], index, arr)) {
      // 只要有一个元素通过测试，即返回true
      return true
    }
    index++
  }

  // 遍历结束还没有通过测试，即返回false
  return false
}
```

#### reduce

##### 思路

`reduce()` 方法对数组中的每个元素执行一个由您提供的**reducer**函数(升序执行)，将其结果汇总为单个返回值。

它接收两个参数，分别为`reducer`和`initialValue`。

- `callback`：为`reducer`函数，它接收四个参数：

  - `accumulator`：累计器累计回调的返回值; 它是上一次调用回调时返回的累积值，或`initialValue`

  - `currentValue`：数组中正在处理的元素

  - `index`：可选，数组中正在处理的当前元素的索引。 如果提供了`initialValue`，则起始索引号为 0，否则从索引 1 起始

  - `array`：可选，调用`reduce()`的数组

- `initialValue`：可选参数。作为第一次调用`callback`函数时第一个参数的值。如果没有提供初始值，则将使用数组中的第一个元素。 在没有初始值的空数组上调用`callback` 将报错。

`reduce`会返回函数累计处理的结果。

##### 实现

```javascript
/**
 * 实现数组原型方法 some
 * @author 欧怼怼
 * @param callback {(accumulator: *, currentValue: *, index?: number, array?: *[]) => *}
 * @param initialValue {*}
 * @returns {*}
 */
const _reduce = function (callback, initialValue) {
  // 判断this不等于null
  if (this === null) {
    throw new TypeError('this is null or not defined')
  }

  // 判断callback是不是一个函数
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function')
  }

  const arr = this
  const len = arr.length

  // 在没有初始值的空数组上调用callback将报错
  if (len === 0 && initialValue === undefined) {
    throw new TypeError('Reduce of empty array with no initial value')
  }

  let index = 0
  let accumulator = initialValue
  // 没传入初始值的时候，取数组第一个值为初始值
  if (initialValue === undefined) {
    index = 1
    accumulator = arr[0]
  }

  // 遍历调用
  while (index < len) {
    // 更新accumulator
    accumulator = callback(accumulator, arr[index], index, arr)
    index++
  }

  // 返回累计处理的结果
  return accumulator
}
```

### 数组扁平化（flat）

#### 思路

该方法就是将一个多维数组扁平化。也就是遍历数组，然后将所有元素与遍历到的子数组中的元素合并为一个新数组返回。

```javascript
const arr1 = [0, 1, 2, [3, 4], [5, [6, 7]]]
console.log(arr1.flat()) // [0, 1, 2, 3, 4, 5, 6, 7]
```

#### 简单实现

##### 使用 reduce 实现

```javascript
/**
 * 使用reduce实现简易版扁平化
 * @author 欧怼怼
 * @param array {*[]}
 * @returns {*[]}
 */
const flat = function (array) {
  return array.reduce((acc, cur) => {
    return acc.concat(
      Array.isArray(cur)
        ? flat(cur) //  如果是数组的话，在递归调用flat
        : cur
    )
  }, [])
}
```

##### 使用栈实现

```javascript
/**
 * 使用栈实现简易版扁平化
 * @author 欧怼怼
 * @param array {*[]}
 * @returns {*[]}
 */
const flat = function (array) {
  const stack = [...array]
  const result = []

  while (stack.length > 0) {
    // 弹出最后一个值
    const val = stack.pop()
    if (Array.isArray(val)) {
      // 如果是数组的话解体再入栈
      stack.push(...val)
    } else {
      // 往数组前面推入
      result.unshift(val)
    }
  }

  return result
}
```

#### 完整版本实现

如果使用过`Array.prototype.flat`的话，会发现它可以接收一个`depth`可选参数，用于定要提取嵌套数组的结构深度，而默认的话`depth`为 1。

我们可以将其实现一下，并且额外设定如果`depth`为`-1`的话，就全部扁平化。

先看看测试代码：

```javascript
const arr2 = [0, 1, 2, [[[3, 4]]]]
console.log(arr2.flat()) // [0, 1, 2, [[3, 4]]]
console.log(arr2.flat(1)) // [0, 1, 2, [3, 4]]
console.log(arr2.flat(2)) // [0, 1, 2, 3, 4]
console.log(arr2.flat(-1)) // [0, 1, 2, 3, 4]
```

实现：

```javascript
/**
 * 完整版数组扁平化
 * @author 欧怼怼
 * @param array {*[]}
 * @param depth {number}
 * @returns {*[]}
 */
const flat = function (array, depth = 1) {
  if (depth === -1) {
    return array.reduce((acc, cur) => {
      return acc.concat(Array.isArray(cur) ? flat(cur, -1) : cur)
    }, [])
  } else {
    return depth > 0
      ? array.reduce((acc, cur) => {
          return acc.concat(Array.isArray(cur) ? flat(cur, depth - 1) : cur)
        }, [])
      : array
  }
}
```

### 数组去重（unique）

#### 思路

该方法是用于数组去重的，接收一个参数，即需要去重的数组，然后会返回一个去重后的新数组。

```javascript
const obj1 = { a: 1 }
const obj2 = { a: 1 }
const arr = [1, 2, 3, 2, 'a', 'b', 'c', 'e', 'b', obj1, obj2, obj1]
console.log(unique(arr)) // [1, 2, 3, 'a', 'b', 'c', 'e', {a: 1}, {a: 1}]
```

#### 实现

##### for+splice 实现

```javascript
/**
 * for + splice 实现数组去重
 * @author 欧怼怼
 * @param arr {*[]}
 * @returns {*[]}
 */
function unique(arr) {
  const _arr = [...arr]
  for (let i = 0; i < _arr.length; i++) {
    for (let j = i + 1; j < _arr.length; j++) {
      if (_arr[i] === _arr[j]) {
        _arr.splice(j, 1)
        j-- // 此时已经删除一个元素，记得 j - 1
      }
    }
  }
  return _arr
}
```

##### indexOf 或 includes 实现

```javascript
/**
 * indexOf | include 实现数组去重
 * @author 欧怼怼
 * @param arr {*[]}
 * @returns {*[]}
 */
function unique(arr) {
  const _arr = []
  for (let i = 0; i < arr.length; i++) {
    // (_arr.indexOf(arr[i]) === -1) && _arr.push(arr[i]);
    !_arr.includes(arr[i]) && _arr.push(arr[i])
  }
  return _arr
}
```

##### filter + indexOf 实现

```javascript
/**
 * filter + indexOf 实现数组去重
 * @author 欧怼怼
 * @param arr {*[]}
 * @returns {*[]}
 */
function unique(arr) {
  return arr.filter((item, idx) => arr.indexOf(item) === idx)
}
```

##### reduce + includes 实现

```javascript
/**
 * reduce + includes 实现数组去重
 * @author 欧怼怼
 * @param arr {*[]}
 * @returns {*[]}
 */
function unique(arr) {
  return arr.reduce((acc, cur) => {
    if (!acc.includes(cur)) acc.push(cur)
    return acc
  }, [])
}
```

##### ES6 Set 实现

> 可以使用 ES6 的 Set 集合实现，利用它的值是唯一的特性。

```javascript
/**
 * ES6 Set 实现数组去重
 * @author 欧怼怼
 * @param arr {*[]}
 * @returns {*[]}
 */
function unique(arr) {
  return [...new Set(arr)]
}
```

## 对象

### ES6 的 Set、Map 实现

#### Set

##### 思路

`Set`对象是值的集合，你可以按照插入的顺序迭代它的元素。 Set 中的元素只会**出现一次**，即 Set 中的元素是唯一的。

- 实例属性

  - size：返回`Set`对象中的值的个数

- 实例方法

  - `add(value)`：在`Set`的尾部添加一个元素。返回该`Set`对象

  - `clear()`：移除`Set`对象内的所有元素

  - `delete(value)`：移除`Set`中与这个值相等的元素，返回`has(value)`在这个操作前返回的值

  - `entries()`：返回一个新的迭代器对象，该对象包含`Set`对象中的按插入顺序排列的所有元素的值的`[value, value]`数组

  - `forEach(callback[, thisArg])`：按照插入顺序，为`Set`对象中的每一个值调用一次 callBackFn。如果提供了`thisArg`参数，回调中的`this`会是这个参数

  - `has(val)`：返回一个布尔值，表示该值在`Set`中存在与否

  - `values()`：返回一个新的迭代器，该对象包含`Set`对象中的按插入顺序排列的所有元素的值

  - `@@iterator]()`：同`values()`

##### 实现

```javascript
/**
 * 实现 Set
 * @author 欧怼怼
 * @param values {*[]}
 * @returns {Set}
 */
class Set {
  constructor(values) {
    this._values = []
    this.size = 0

    // 迭代属性
    this[Symbol.iterator] = this.values

    values.length && values.forEach((v) => this.add(v))
  }

  /**
   * 判断是否存在
   * @param value {*}
   * @return {boolean}
   */
  has(value) {
    return this._values.includes(value)
  }

  /**
   * 添加
   * @param value
   */
  add(value) {
    if (!this.has(value)) {
      this._values.push(value)
      this.size++
    }
    return this
  }

  /**
   * 删除
   * @param value
   * @return {boolean}
   */
  delete(value) {
    const hasValue = this.has(value)
    if (hasValue) {
      this._values = this._values.filter((v) => v !== value)
      this.size--
    }
    return hasValue
  }

  /**
   * 清空
   */
  clear() {
    this._values = []
    this.size = 0
  }

  /**
   * 获取values组成的迭代器
   * @return {Generator<*, void, *>}
   */
  values() {
    return this._createIterator([...this._values])
  }

  /**
   * 返回一个新的迭代器对象
   * @return {Generator<*, void, *>}
   */
  entries() {
    const entries = []
    for (let value of this._values) {
      entries.push([value, value])
    }

    return this._createIterator(entries)
  }

  /**
   * 遍历
   * @param callback
   * @param thisArg
   */
  forEach(callback, thisArg = {}) {
    for (let i = 0; i < this._values.length; i++) {
      const value = this._values[i]
      callback.call(thisArg, value, i, this)
    }
  }

  /**
   * 生成迭代器
   * @param items {any[]}
   * @return {Generator<*, void, *>}
   * @private
   */
  *_createIterator(items) {
    for (let i = 0; i < items.length; i++) {
      yield items[i]
    }
  }
}

module.exports = Set
```

#### Map

##### 思路

**`Map`** 对象保存键值对，并且能够记住键的原始插入顺序。任何值（对象或者原始值）都可以作为一个键或一个值。`Map`中的键只会**出现一次**，即 `Map` 中的键是唯一的。

- 实例属性

  - size：返回`Map`对象中的值的个数

- 实例方法

  - `set(key, value)`：在`Map`的尾部添加一个键值对。返回该`Map`对象

  - `clear()`：移除`Map`对象内的所有键值对

  - `delete(key)`：移除`Map`中与这个键相等的键值对，返回`has(key)`在这个操作前返回的值

  - `entries()`：返回一个新的迭代器对象，该对象包含`Map`对象中的按插入顺序排列的所有键值对的值的`[key, value]`数组

  - `forEach(callback[, thisArg])`：按照插入顺序，为`Map`对象中的每一个值调用一次 callBackFn。如果提供了`thisArg`参数，回调中的`this`会是这个参数

  - `has(key)`：返回一个布尔值，表示该键在`Map`中存在与否

  - `keys()`：返回一个新的迭代器，该对象包含`Map`对象中的按插入顺序排列的所有元素的`key`值

  - `values()`：返回一个新的迭代器，该对象包含`Map`对象中的按插入顺序排列的所有元素的`value`值

  - `@@iterator]()`：同`entries()`

##### 实现

```javascript
/**
 * 实现 Map
 * @author 欧怼怼
 * @param values {[*, *][]}
 * @returns {Map}
 */
class Map {
  constructor(values = []) {
    this._values = Object.create(null)
    this.size = 0
    this._keys = []
    this._keyMap = {}

    // 迭代属性
    this[Symbol.iterator] = this.entries

    values.length && values.forEach((v) => this.set(v[0], v[1]))
  }

  /**
   * 判断是否存在该key
   * @param key {*}
   * @return {boolean}
   */
  has(key) {
    const keyStr = this._defaultToString(key)
    return this._values[keyStr] !== undefined && this._keyMap[keyStr] === key
  }

  /**
   * 插入新值
   * @param key
   * @param value
   * @return {Map}
   */
  set(key, value) {
    if (!this.has(key)) {
      const keyStr = this._defaultToString(key)
      this._values[keyStr] = value
      this._keyMap[keyStr] = key
      this._keys.push(keyStr)
      this.size++
    }

    return this
  }

  /**
   * 获取值
   * @param key {*}
   * @return {*}
   */
  get(key) {
    return this._values[this._defaultToString(key)]
  }

  /**
   * 删除值
   * @param key {*}
   * @return {boolean}
   */
  delete(key) {
    const hasKey = this.has(key)
    if (hasKey) {
      const keyStr = this._defaultToString(key)
      delete this._values[keyStr]
      delete this._keyMap[keyStr]
      this._keys = this._keys.filter((k) => k !== keyStr)
      this.size--
    }
    return hasKey
  }

  /**
   * 清空Map
   */
  clear() {
    this._values = Object.create(null)
    this._keyMap = {}
    this._keys = []
    this.size = 0
  }

  /**
   * 获取keys组成的迭代器
   * @return {Generator<*, void, *>}
   */
  keys() {
    let keys = []
    for (let key of this._keys) {
      keys.push(this._keyMap[key])
    }
    return this._createIterator(keys)
  }

  /**
   * 获取values组成的迭代器
   * @return {Generator<*, void, *>}
   */
  values() {
    let values = []
    for (let key of this._keys) {
      values.push(this._values[key])
    }

    return this._createIterator(values)
  }

  /**
   * 返回由key和value组成的迭代器
   * @return {Generator<*, void, *>}
   */
  entries() {
    let map = []
    for (let key of this._keys) {
      map.push([this._keyMap[key], this._values[key]])
    }
    return this._createIterator(map)
  }

  /**
   *
   * @param callback {Function}
   * @param thisArg {object}
   */
  forEach(callback, thisArg = {}) {
    for (let k of this._keys) {
      const key = this._keyMap[k]
      const value = this._values[k]
      callback.call(thisArg, value, key, this)
    }
  }

  /**
   * 将其他类型的key生成字符串key
   * @param key {*}
   * @return {string}
   * @private
   */
  _defaultToString(key) {
    if (key === null) return 'NULL'
    if (key === undefined) return 'UNDEFINED'

    const type = Object.prototype.toString.call(key)
    if (type === '[object Object]' || type === '[object Array]') return JSON.stringify(key)

    return key.toString()
  }

  /**
   * 生成迭代器
   * @param items {any[]}
   * @return {Generator<*, void, *>}
   * @private
   */
  *_createIterator(items) {
    for (let i = 0; i < items.length; i++) {
      yield items[i]
    }
  }
}
```

### 实现 Object.is

#### 思路

`Object.is()`方法是来判断两个值是否为同一个值。它的比较方式跟`===`大致相同，只有两个例外：

- `NaN === NaN`是为 false 的，但`Object.is(NaN, NaN)`是为 true 的；

- `+0 === -0`是为 true 的，但`Object.is(+0, -0)`是为 false 的

`Object.is()`接收两个参数，然后返回一个`boolean`值，标示两个参数是否相等。

#### 实现

```javascript
/**
 * 实现 Object.is 方法
 * @author 欧怼怼
 * @param value1 {*}
 * @param value2 {*}
 * @return {boolean}
 */
function is(value1, value2) {
  if (value1 === value2) {
    // 此时只需要识别 +0 和 -0 的情况
    // 通过 1 / +0 = Infinity 和 1 / -0 = -Infinity 的原则来识别
    return value1 !== 0 || 1 / value1 === 1 / value2
  }

  // 此时需要识别 NaN
  // 通过 NaN !== NaN 来识别
  return value1 !== value1 && value2 !== value2
}
```

### 实现 Object.create

#### 思路

`Object.create()`方法创建一个新对象，使用现有的对象来提供新创建的对象的`__proto__`。

它接收两个参数：

- `proto`：新创建对象的原型对象，只能是对象或 null，否则会报错；

- `propertiesObject`：可选，需要传入一个对象，该对象的属性类型参照[Object.defineProperties()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties)的第二个参数。如果传入`null`会报错。

然后该函数会返回一个新对象，带着指定原型对象和属性。

#### 实现

```javascript
/**
 * 实现 Object.create 方法
 * @author 欧怼怼
 * @param proto {object | null}
 * @param propertiesObject {object | undefined}
 * @return {object}
 */
function create(proto, propertiesObject = undefined) {
  if (typeof proto !== 'object' && typeof proto !== 'function') {
    throw new TypeError('Object prototype may only be an Object or null.')
  }
  if (propertiesObject === null) {
    throw new TypeError('Cannot convert undefined or null to object')
  }

  function F() {}
  F.prototype = proto // 绑定原型
  const obj = new F() // 新建实例对象

  // 自定义属性
  if (propertiesObject !== undefined) {
    Object.defineProperties(obj, propertiesObject)
  }

  if (proto === null) {
    obj.__proto__ = null // 如果proto为null，将清空原型
  }
  return obj
}

module.exports = create
```

### 实现 Object.assign

#### 思路

`Object.assign()` 方法用于将所有可枚举属性的值从一个或多个源对象分配到目标对象。它将返回目标对象。

它接收多个参数，第一个为目标对象`target`，后面则为`sources`源对象。

然后它将会返回一个目标对象，并且传入的`target`目标对象也会发生变化。

#### 实现

```javascript
/**
 * 实现 Object.assign 方法
 * @author 欧怼怼
 * @param target {object}
 * @param sources {object[]}
 * @return {object}
 */
function assign(target, ...sources) {
  if (target == null) {
    throw new TypeError('Cannot convert undefined or null to object')
  }

  // 遍历sources
  for (const obj of sources) {
    if (obj === null) continue

    // 遍历obj
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        target[key] = obj[key]
      }
    }
  }

  return target
}
```

### 实现 JSON.stringify

#### 思路

`JSON.stringify()` 方法将一个 JavaScript  对象或值转换为 JSON 字符串。

这里我们只接受一个`value`参数，原生方法还指出`replacer`参数和`space`参数，这里就不实现了。

然后它最后返回一个表示给定值的 JSON 字符串。

这里我们简单说一下转换规则：

- 基本数据类型：

  - `undefined`转换之后仍然是`undefined`；

  - `boolean`转换之后会变成字符串，比如`"true"`或`"false"`

  - `number`转换之后是字符串类型的数值，除了`NaN`、`Infinity`和`-Infinity`，它们转换后会返回字符串`"null"`

  - `symbol`转换之后是`undefined`

  - `string`转换之后仍是`string`

  - `null`转换之后是字符串`null`

- 函数类型：

  - 转换之后是`undefined`

- 如果是对象类型：

  - 如果是数组：

    - 如果属性出现`undefined`、任意函数或者`symbol`，都转换成字符串`"null"`

    - 如果是正则对象，则返回字符串`"{}"`

    - 如果是`Date`对象，返回`Date`的`toJSON`字符串值

  - 如果是普通对象：

    - 如果有`toJSON`方法，那么序列化`toJSON()`的返回值

    - 如果属性值是`undefined`、任何函数或者`symbol`，则会忽略跳过

    - 所有以`symbol`为键的键值对也都会完全忽略掉

#### 实现

```javascript
/**
 * 实现 JSON.stringify 方法
 * @author 欧怼怼
 * @param value {*}
 * @return {string|undefined}
 */
function stringify(value) {
  // 获取类型
  const type = typeof value

  // 如果不是对象
  if (type !== 'object') {
    let res = value
    // 如果是NaN或者Infinity，返回null
    if (value !== value /* 用来识别NaN */ || value === Infinity || value === -Infinity) {
      res = null
    }
    // 如果为function、undefined或者symbol，返回undefined
    else if (type === 'function' || type === 'undefined' || type === 'symbol') {
      return undefined
    }
    // 如果是字符串的话，加上双引号
    else if (type === 'string') {
      res = `"${value}"`
    }
    // 最后调用String()返回，顺便处理了boolean
    return String(res)
  }

  // 下面就是处理对象

  // 如果是null，返回 'null'
  if (value === null) {
    return 'null'
  }
  // 如果有toJSON方法，直接调用获取json，然后在进行一次 stringify
  if (value.toJSON && typeof value.toJSON === 'function') {
    return stringify(value.toJSON())
  }
  // 处理对象
  if (value instanceof Array) {
    const result = value.map((cur) => {
      // undefined、function或symbol都返回'null'
      if (typeof cur === 'undefined' || typeof cur === 'function' || typeof cur === 'symbol') {
        return 'null'
      }

      // 其余类型再调用一次 stringify
      return stringify(cur)
    })
    // 使用 [] 拼接，并且将单引号全部换成双引号
    return `[${result}]`.replace(/'/g, '"')
  }

  // 处理普通对象 Map Set
  const result = Object.keys(value).reduce((acc, key) => {
    // key 非 symbol， 且值非 symbol、undefined、function，可以拼接处理
    if (typeof key !== 'symbol' && value[key] !== undefined && typeof value[key] !== 'function' && typeof value[key] !== 'symbol') {
      acc.push(`"${key}":${stringify(value[key])}`)
    }
    return acc
  }, [])
  // 使用 {} 拼接，并且将单引号全部换成双引号
  return `{${result}}`.replace(/'/g, '"')
}

module.exports = stringify
```

### 实现 JSON.parse

#### 思路

`JSON.parse()` 方法用来解析 JSON 字符串，构造由字符串描述的 JavaScript 值或对象。

该函数接收一个`text`字符串参数，返回一个解析出来的对象。

#### 实现

##### eval 实现

我们可以直接使用`eval('(' + text + ')')`实现，但是如果学过`eval`的同学都知道`eval`不可乱用，因为会存在 XSS 漏洞，如果传入的`text`是一段可执行的代码，那就糟糕了。

因此我们通过一些正则来判断传入的`text`是不是一段对象字符串。

> 相关正则式实质上是在 JSON 之父 Douglas Crockford 实现的 ployfill 代码中找的，更多的解析可以去这里看看：[JSON.parse 三种实现方式 · Issue #115 · youngwind/blog · GitHub](https://github.com/youngwind/blog/issues/115#issue-300869613)

```javascript
/**
 * 使用 eval 实现 JSON.parse
 * @author 欧怼怼
 * @param text {string}
 * @return {*}
 */
function parse(text) {
  const rx_one = /^[\],:{}\s]*$/
  const rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g
  const rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g
  const rx_four = /(?:^|:|,)(?:\s*\[)+/g

  if (
    /* 如果替换后剩余字符只剩下空格，"]"、","、":"、"{" 或 "}"的话，文本对于eval就是安全的 */
    rx_one.test(
      text
        .replace(rx_two, '@') /* 将所有的反斜杠'\'替换成'@' */
        .replace(rx_three, ']') /* 用']'字符替换所有简单值标记 */
        .replace(rx_four, '') /* 删除所有根据冒号或都好或以文本开头的'[' */
    )
  ) {
    return eval(`(${text})`)
  }
}
```

##### new Function 实现

同样的，我们也挺用`new Function`来替代`eval`操作。

```javascript
/**
 * 使用 new Function 实现 JSON.parse
 * @author 欧怼怼
 * @param text {string}
 * @return {*}
 */
function parse(text) {
  const rx_one = /^[\],:{}\s]*$/
  const rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g
  const rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g
  const rx_four = /(?:^|:|,)(?:\s*\[)+/g

  if (
    /* 如果替换后剩余字符只剩下空格，"]"、","、":"、"{" 或 "}"的话，文本对于eval就是安全的 */
    rx_one.test(
      text
        .replace(rx_two, '@') /* 将所有的反斜杠'\'替换成'@' */
        .replace(rx_three, ']') /* 用']'字符替换所有简单值标记 */
        .replace(rx_four, '') /* 删除所有根据冒号或都好或以文本开头的'[' */
    )
  ) {
    return new Function('return' + text)()
  }
}
```

### 实现 instanceof 运算符

#### 思路

`instanceof` **运算符**用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。

我们这里通过一个`instanceOf(object, constructor)`函数来实现，它接收两个参数，分别为实例对象和构造函数。

实例对象的原型链上存在该构造函数，则返回`true`，否则返回`false`。

#### 实现

```javascript
/**
 * 实现 instanceof 运算符
 * @author 欧怼怼
 * @param object {object}
 * @param constructor {object}
 * @return {boolean}
 */
function instanceOf(object, constructor) {
  // 获取构造函数的原型对象
  const cp = constructor.prototype
  // 获取对象的原型对象
  let oc = object.__proto__

  // 递归遍历
  while (oc) {
    if (oc === cp) {
      return true
    }
    // 顺着原型链继续查找原型对象
    oc = oc.__proto__
  }

  // 如果原型链走完了还没找到，则返回错误
  return false
}
```

### 实现 new 运算符

#### 思路

**`new`  运算符**创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。

首先我们先捋清`new`运算符创建实例的时候做了些什么事情：

- 首先它会创建一个空对象；

- 其次将对象的原型指向构造函数，即声明一个`__proto__`属性，指向构造函数的原型对象`prototype`；

- 接着将对象作为构造函数的执行上下文，然后执行一下构造函数；

- 最后判断构造函数的执行结果是否为对象，是的话直接返回该执行结果，不是的话返回前面我们创造的对象

这里我们将实现一个`newObject(constructor, ...args)`函数，它的第一个参数接收构造函数，其余参数将作为构造函数执行的参数。最后它将返回创建后的实例对象。

#### 实现

```javascript
/**
 * 实现 new 运算符
 * @author 欧怼怼
 * @param constructor {*}
 * @param args {*[]}
 * @return {*}
 */
function newObject(constructor, ...args) {
  // 新建一个空对象，并将原型指向constructor
  const obj = Object.create(constructor.prototype)
  // 以该对象为this上下文执行constructor构造函数
  const result = constructor.apply(obj, args)

  // 如果函数有返回对象的话，直接返回函数返回值，否则返回obj
  if ((typeof result === 'object' && result !== null) || typeof result === 'function') {
    return result
  } else {
    return obj
  }
}
```

### 浅拷贝

#### 思路

不管是现在浅拷贝，还是后面的深拷贝，**都只是针对引用类型的**，因为引用类型是存放在堆内存中，在栈地址有一个或者多个地址来指向推内存的某一数据。

浅拷贝仅仅是复制了最外层的对象，而对于对象内的引用类型，依旧是原来的元素，而只是复制了引用。因此如果我们修改了新对象中的任一引用类型，原对象中对应的引用类型也会随之修改。

我们可以通过下面的代码了解一下：

```javascript
const obj = {
  a: { b: 1 },
}
// 通过浅拷贝生成新的对象
const newObj = shallowCopy(obj)
console.log(newObj) // {a: {b: 1}}

newObj.a.b = 2
console.log(newObj) // {a: {b: 2}}
console.log(obj) // {a: {b: 2}}
```

#### 实现

```javascript
/**
 * 实现浅拷贝
 * @author 欧怼怼
 * @param obj {*}
 * @return {*}
 */
function shallowCopy(obj) {
  // 如果不是对象，直接返回
  if (typeof obj !== 'object' || obj === null) return obj

  // 初始化对象
  let newObj = Array.isArray(obj) ? [] : {}

  // 遍历obj，一一插入新对象
  for (let key in obj) {
    obj.hasOwnProperty(key) && (newObj[key] = obj[key])
  }

  return newObj
}
```

### 深拷贝

#### 思路

深拷贝则解决了浅拷贝的引用问题，它会不断递归元素对象，一一复制过来，而不是只拷贝引用地址。因此返回的新对象跟之前的对象，之间就不会存在任何绑定关系，任意修改其中一个的元素对另外一个也不会有影响。

```javascript
const obj = {
  a: { b: 1 },
}
// 通过深拷贝生成新的对象
const newObj = deepClone(obj)
console.log(newObj) // {a: {b: 1}}

newObj.a.b = 2
console.log(newObj) // {a: {b: 2}}
console.log(obj) // {a: {b: 1}}
```

#### 实现

##### 简单粗暴版本

```javascript
/**
 * 简单粗暴版本深拷贝
 * @author 欧怼怼
 * @param obj {*}
 * @return {*}
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}
```

这种方法虽然很简单粗暴，但是存在一定的缺陷，如果`obj`内存在函数、`symbol`、`undefined`元素，都会被忽略掉。

##### 简单版本

其实我们可以模仿浅拷贝的代码，然后再最后赋值的时候，判断`value`是否为对象，是的话再调用一下自身进行递归深拷贝，不是的话直接复制。

```javascript
/**
 * 实现简单版深拷贝
 * @author 欧怼怼
 * @param obj {*}
 * @return {*}
 */
function deepClone(obj) {
  // 如果不是对象，直接返回
  if (typeof obj !== 'object' || obj === null) return obj
  // 初始化对象
  const newObj = Array.isArray(obj) ? [] : {}
  // 遍历obj，一一插入新对象
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      // 如果是对象的话，再调用一下deepClone进行一次深拷贝
      newObj[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key]
    }
  }
  return newObj
}
```

当然，这个方法还是会存在一些问题，比如遇到一些循环引用，就可能陷入死循环了，比如下面的例子：

```javascript
const obj = { a: 1 }
obj.b = obj
```

如果上面的对象进行调用上面的深拷贝就会陷入死循环。 当然对于一些特殊对象的处理也存在一些问题，因此我们可以实现一个比较全面的深拷贝函数。

##### 复杂版本深拷贝

首先我们实现一下对对象类型的判断函数，并且将其分为可遍历类型和不可遍历类型。

```javascript
// 可遍历类型
const MAP_TAG = '[object Map]' // Map
const SET_TAG = '[object Set]' // Set
const WEAK_MAP_TAG = '[object WeakMap]' // WeakMap
const WEAK_SET_TAG = '[object WeakSet]' // WeakSet
const ARRAY_TAG = '[object Array]' // Array
const OBJECT_TAG = '[object Object]' // Object
const ARGUMENTS_TAG = '[object Arguments]' // Argument
const CAN_TRAVERSE_TYPE = [MAP_TAG, SET_TAG, WEAK_MAP_TAG, WEAK_SET_TAG, ARRAY_TAG, OBJECT_TAG, ARGUMENTS_TAG]

// 不可以遍历类型
const BOOLEAN_TAG = '[object Boolean]' // Boolean
const NUMBER_TAG = '[object Number]' // Number
const STRING_TAG = '[object String]' // String
const SYMBOL_TAG = '[object Symbol]' // Symbol
const DATE_TAG = '[object Date]' // Date
const ERROR_TAG = '[object Error]' // Error
const REGEXP_TAG = '[object RegExp]' // RegExp
const FUNC_TAG = '[object Function]' // Function

/**
 * 判断是否为对象
 * @param target {*}
 * @returns {boolean}
 */
const isObject = (target) => (typeof target === 'object' || typeof target === 'function') && target !== null

/**
 * 获取对象类型
 * @param obj {Object}
 * @returns {string}
 */
const getType = (obj) => Object.prototype.toString.call(obj)
```

接下来初始化一下深拷贝函数。跟前面一下，先判断是否为对象或数组，如果不是的话直接返回数据，否则则继续进行拷贝流程。

然后获取对象的具体类型，判断判断是否为不可遍历状态，如果是的话调用`handleNotTraverse`进行特殊处理。

```javascript
function deepClone(target) {
  // 如果不是对象或函数的话，代表为原始类型，直接返回
  if (!isObject(target)) return target

  // 获取对象类型
  const type = getType(target)

  // 如果是不可遍历状态，调用handleNotTraverse进行处理
  if (!CAN_TRAVERSE_TYPE.includes(type)) return handleNotTraverse(target, type)
}
```

接下来来实现`handleNotTraverse`。

在不可遍历对象类型中，对于 Boolean 对象，String 对象，Number 对象和 Symbol 对象而言，我们只需要重新创建个实例返回就可以了；而对于 Error 对象，则直接返回；对于 Date 对象也是重新创建个实例返回；最后的正则和函数，后面我们再特殊处理。

```javascript
/**
 * 处理不可以遍历类型
 * @param target {*}
 * @param type {string}
 * @returns {*}
 */
function handleNotTraverse(target, type) {
  const Ctor = target.constructor
  switch (type) {
    case BOOLEAN_TAG:
      return new Object(Boolean.prototype.valueOf.call(target))
    case NUMBER_TAG:
      return new Object(Number.prototype.valueOf.call(target))
    case STRING_TAG:
      return new Object(String.prototype.valueOf.call(target))
    case SYMBOL_TAG:
      return new Object(Symbol.prototype.valueOf.call(target))
    case ERROR_TAG:
      return target
    case DATE_TAG:
      return new Ctor(target)
    case REGEXP_TAG:
      return regExpTypeHandle(target)
    case FUNC_TAG:
      return functionTypeHandle(target)
    default:
      return new Ctor(target)
  }
}
```

对于正则，我们需要获取对于的`source`模板文本和`flags`标志，然后新建正则对象返回：

```javascript
/**
 * 处理正则类型
 * @param target {RegExp}
 * @return {RegExp}
 */
function regExpTypeHandle(target) {
  const { source, flags } = target
  return new target.constructor(source, flags)
}
```

对于函数，我们需要分别获取函数内容和函数参数，然后通过`new Function`新建函数返回。

但对于箭头函数，因为他本身是没有原型的，因此直接返回。

```javascript
/**
 * 处理函数类型
 * @param target {Function}
 * @return {Function | null}
 */
function functionTypeHandle(target) {
  // 箭头函数
  if (!target.prototype) return target

  const bodyReg = /(?<={)(.|\n)+(?=})/m
  const paramReg = /(?<=\().+(?=\)\s+{)/
  const funcStr = target.toString()

  // 函数内容
  const body = bodyReg.exec(funcStr)
  if (!body) return null

  // 参数
  const param = paramReg.exec(funcStr)
  if (param) {
    const paramArr = param[0].split(',')
    return new Function(...paramArr, body[0])
  } else {
    return new Function(body[0])
  }
}
```

处理完不可遍历对象，剩下的可遍历对象就容易多了，跟之前的一样就行。

而对于`Map`要注意一点，就是它的`key`是可以为对象的，因此我们也需要调用一次`deepClone`。

```javascript
function deepClone(target) {
  // 如果不是对象或函数的话，代表为原始类型，直接返回
  if (!isObject(target)) return target

  // 获取对象类型
  const type = getType(target)

  // 如果是不可遍历状态，调用handleNotTraverse进行处理
  if (!CAN_TRAVERSE_TYPE.includes(type)) return handleNotTraverse(target, type)

  // 继承对象的原型，可以保证target原型不丢失
  const Ctor = target.constructor
  const newTarget = new Ctor()

  switch (type) {
    // Map 和 WeakMap 类型
    case MAP_TAG || WEAK_MAP_TAG:
      target.forEach((val, key) => newTarget.set(deepClone(key), deepClone(val)))
      break

    // Set 和 WeakSet 类型
    case SET_TAG || WEAK_SET_TAG:
      target.forEach((item) => newTarget.add(deepClone(item)))
      break

    default:
      for (const key in target) {
        if (target.hasOwnProperty(key)) {
          newTarget[key] = deepClone(target[key])
        }
      }
      break
  }

  return newTarget
}
```

最后就来解决一下嵌套引用的问题。这里我们可以使用一个`WeakSet`来记录已经拷贝过的对象，然后每一次调用进行拷贝前，先去查一下`WeakSet`是否存在过该对象，存在的话直接返回，不存在再继续执行。

```javascript
function deepClone(target, valSet = new WeakSet()) {
  // 如果不是对象或函数的话，代表为原始类型，直接返回
  if (!isObject(target)) return target

  // 获取对象类型
  const type = getType(target)

  // 如果是不可遍历状态，调用handleNotTraverse进行处理
  if (!CAN_TRAVERSE_TYPE.includes(type)) return handleNotTraverse(target, type)

  if (valSet.has(target)) return target // 判断是否拷贝过此target

  valSet.add(target) // 记录当前target

  // 继承对象的原型，可以保证target原型不丢失
  const Ctor = target.constructor
  const newTarget = new Ctor()

  switch (type) {
    // Map 和 WeakMap 类型
    case MAP_TAG || WEAK_MAP_TAG:
      target.forEach((val, key) => newTarget.set(deepClone(key, valSet), deepClone(val, valSet)))
      break

    // Set 和 WeakSet 类型
    case SET_TAG || WEAK_SET_TAG:
      target.forEach((item) => newTarget.add(deepClone(item, valSet)))
      break

    default:
      for (const key in target) {
        if (target.hasOwnProperty(key)) {
          newTarget[key] = deepClone(target[key], valSet)
        }
      }
      break
  }

  return newTarget
}
```

这样我们就实现了一个比较完整的深拷贝，点击查[具体代码](https://github.com/欧怼怼/fe-study/blob/master/package/javascript/wheels/src/object/clone/deepClone.js)。

## 函数

### 函数原生方法

#### call

##### 思路

`call()` 方法使用一个指定的 `this` 值和单独给出的一个或多个参数来调用一个函数。

它接收多个参数：

- `thisArg`：可选的。为`Function`函数运行时使用的`this`值

- `arg1、arg2...`：指定的参数列表

它返回使用调用者提供的 `this` 值和参数调用该函数的返回值。

##### 实现

```javascript
/**
 * 实现函数原生方法 call
 * @param thisArg {*} this上下文
 * @param args {*[]} 参数
 * @return {*}
 */
function _call(thisArg, ...args) {
  // 如果没有传thisArg默认为全局
  if (!thisArg) {
    thisArg = window !== undefined ? window : global
  }

  // 有可能thisArg传的不是对象
  thisArg = Object(thisArg)

  // 使用Symbol确保唯一值
  const fnKey = Symbol()
  // 将函数绑定到thisArg上
  thisArg[fnKey] = this

  // 调用函数
  const result = thisArg[fnKey](...args)
  // 删除函数
  delete thisArg[fnKey]

  return result
}
```

#### apply

##### 思路

`apply()` 方法调用一个具有给定`this`值的函数，以及以一个数组（或[类数组对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Indexed_collections#working_with_array-like_objects)）的形式提供的参数。

> `apply()`方法的作用跟`call()`方法类似，区别就是`call()`方法接受的是**参数列表**，而`apply()`方法接受的是**一个参数数组**。因此它们实现上也大同小异。

它接收两个参数：

- `thisArg`：可选的。为`Function`函数运行时使用的`this`值

- `argsArray`：可选的。一个数组或者类数组对象，其中的数组元素将作为单独的参数传给 `func` 函数

它返回使用调用者提供的 `this` 值和参数调用该函数的返回值。

##### 实现

```javascript
/**
 * 实现函数原生方法 apply
 * @author 欧怼怼
 * @param thisArg {object} this上下文
 * @param argsArray {*[]} 参数
 * @return {*}
 */
function _apply(thisArg, argsArray) {
  if (!thisArg) {
    thisArg = window !== undefined ? window : global
  }

  // 处理参数
  if (!argsArray) {
    argsArray = []
  }

  thisArg = Object(thisArg)

  const fnKey = Symbol()
  thisArg[fnKey] = this

  const result = thisArg[fnKey](...argsArray)
  delete thisArg[fnKey]

  return result
}
```

#### bind

##### 思路

`bind()` 方法创建一个新的函数，在 `bind()` 被调用时，这个新函数的 `this` 被指定为 `bind()` 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。

它接收多个参数：

- `thisArg`：调用绑定函数时作为 `this` 参数传递给目标函数的值

- `arg1、arg2...`：当目标函数被调用时，被预置入绑定函数的参数列表中的参数

它返回返回一个原函数的拷贝，并拥有指定的 **`this`** 值和初始参数。

并且，`bind`还有以下特性：

- 返回的新函数被`new`调用作为构造函数时，绑定的值会指向并改为`new`的指定对象
- 返回的新函数存在`length`属性和`name`属性
- 绑定后的函数的`prototype`需要指向原函数的`prototype`

##### 实现

```javascript
/**
 * 实现函数原生方法 bind
 * @author 欧怼怼
 * @param thisArg {object} this上下文
 * @param args {*[]} 参数
 * @return {(function(...[*]=): (*))}
 * @private
 */
function _bind(thisArg, ...args) {
  const fn = this // 获取函数
  // 封装新的函数
  const boundFunc = function (...args1) {
    // 合并参数
    const mergeArgs = args.concat(args1)
    // 判断是否使用new关键字创建实现
    if (new.target) {
      const result = fn.apply(this, mergeArgs)
      // 如果返回值为对象或方法，则直接返回
      if ((typeof result === 'object' || typeof result === 'function') && result !== null) {
        return result
      }
      // 否则返回this
      return this
    }

    // 如果不是new关键字，则直接调用函数
    return fn.apply(thisArg, mergeArgs)
  }

  // 绑定生成的函数的原型指向原函数的原型
  fn.prototype && (boundFunc.prototype = fn.prototype)

  // 定义函数的长度和名称
  const desc = Object.getOwnPropertyDescriptors(fn)
  Object.defineProperties(boundFunc, {
    length: Object.assign(desc.length, {
      // 需要减掉传入的args长度
      value: desc.length.value < args.length ? 0 : desc.length.value - args.length,
    }),
    name: Object.assign(desc.name, {
      value: `bound ${desc.name.value}`,
    }),
  })

  return boundFunc
}
```

### 继承

#### 思路

在`ES6`语法出来之前，JavaScript 还没有`class`和`extend`，因此我们需要通过`function`去封装一个构造函数，来实现一个类。但而对于类继承，也需要我们自己去封装实现。

而对于继承类，无非就是需要在子类上继承到父类的原型属性和原型方法。

下面我们就通过最简单的继承开始。

#### 实现

我们先创建一个类`Color`，后面的实现都以它为父类来实现。

```javascript
function Colors(color) {
  this.colors = ['red', 'blue']
  if (color) {
    this.colors.push(color)
  }
}

Colors.prototype.getColors = function () {
  return this.colors
}
```

##### 原型链实现

该方法是通过创建一个父类实例，然后绑定到子类的原型链上。

```javascript
function Colors1() {}
Colors1.prototype = new Colors()
```

而这个方法有两个缺点：

- 一个就是子类在实例化的时候无法给父类构造函数传参

- 另一个就是子类原型包含的引用类型属性将被所有实例共享

```javascript
const c1 = new Color1('yellow')
console.log(c1.getColors()) // ['red', 'blue']

c1.colors.push('yellow')
console.log(c1.getColors()) // ['red', 'blue', 'yellow']
const c2 = new Color1()
console.log(c2.getColors()) // ['red', 'blue', 'yellow']
```

##### 借用构造函数实现继承

该方法是在子类构造函数中，调用一次父类构造函数并且将其执行上下文绑定为子类的上下文`this`。

```javascript
function Colors1(color) {
  Colors.call(this, color)
}
```

 这个方法很显然解决了原型链继承的两个缺陷，但是它却无法继承父类原型上的属性和方法。

```javascript
let c1 = new Colors1('yellow')
console.log(c1.colors) // ['red', 'blue', 'yellow']

c1.colors.push('black')
console.log(c1.colors) // ['red', 'blue', 'yellow', 'black']
const c2 = new Color1()
console.log(c2.colors) // ['red', 'blue', 'yellow']

console.log(c1.getColors) // undefined
```

##### 组合继承

我们可以发现其实上面两个方法是互补的，因此组合继承实质上就是将上面两个方法做一个结合。

```javascript
function Colors1(color) {
  Colors.call(this, color)
}

Colors1.prototype = new Colors()
Colors1.prototype.construct = Colors1

let c1 = new Colors1('yellow')
console.log(c1.getColors()) // ['red', 'blue', 'yellow']

c1.colors.push('black')
console.log(c1.getColors()) // ['red', 'blue', 'yellow', 'black']
const c2 = new Color1()
console.log(c2.getColors()) // ['red', 'blue', 'yellow']
```

但该方法还有一个小小的缺点，就是它执行了两次父类的构造函数。

##### 寄生式组合继承

该继承方法跟组合继承很类似，唯一的不同就是它继承父类原型不是通过执行父类构造函数，而是通过创建一个对象并绑定父类的原型。

```javascript
function Colors1(color) {
  Colors.call(this, color)
}

Colors1.prototype = Object.create(Colors.prototype)
Colors1.prototype.construct = Colors1
```

当时，我们可以将其进行封装：

```javascript
/**
 * 实现寄生式组合继承
 * @author 欧怼怼
 * @param child {*}
 * @param parent {*}
 */
function extend(child, parent) {
  // 以父类原型对象作为原型初始一个对象
  let prototype = Object.create(parent.prototype)
  // 绑定子类构造函数
  prototype.constructor = child
  // 将prototype对象绑定到子类原型上
  child.prototype = prototype
}
```

```javascript
function Colors1(color) {
  Colors.call(this, color)
}

extend(Colors1, Colors)

let c1 = new Colors1('yellow')
console.log(c1.getColors()) // ['red', 'blue', 'yellow']

c1.colors.push('black')
console.log(c1.getColors()) // ['red', 'blue', 'yellow', 'black']
const c2 = new Color1()
console.log(c2.getColors()) // ['red', 'blue', 'yellow']
```

### 柯里化函数

#### 思路

**柯里化（Currying）**，又称部分求值（Partial Evaluation），是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。

核心思想是把多参数传入的函数拆成单参数（或部分）函数，内部再返回调用下一个单参数（或部分）函数，依次处理剩余的参数。

我们通过一个例子来更直观了解函数柯里化：

```javascript
const add = function (a, b, c, d) {
  return a + b + c + d
}

// 把本来接收多个参数一次性求和的函数改成了接收单一参数逐个求和的函数
const curryAdd = curry(add)

console.log(add(1, 2, 3, 4)) // 10
console.log(currAdd(1)(2)(3)(4)) // 10
```

柯里化函数接收一个参数，为目标函数，然后它会返回一个处理后的函数。

#### 实现

```javascript
/**
 * 函数柯里化
 * @author 欧怼怼
 * @param fn {function(...[*]): *}
 * @return {function(...[*]): *}
 */
function curry(fn) {
  return function (...args) {
    // 如果参数超出一个，报错
    if (args.length > 1) {
      throw new Error('只能传递一个参数')
    }

    // 当fn.length为1的时候，代表是最后一次调用函数了
    if (fn.length === 1) {
      return fn.apply(this, args) // 调用函数返回结果
    } else {
      // 如果还是缺少参数，则返回函数继续调用
      return curry(fn.bind(this, ...args))
    }
  }
}
```

### 偏函数

#### 思路

**偏函数（Partial）**，它跟柯里化函数很类似。

偏函数的功能是固定一个函数的一些参数，然后产生另一个更少参数的函数。我们还是通过一个例子来认识一下：

```javascript
const add = function (a, b, c, d) {
  return a + b + c + d
}

// partialAdd已经固定了a、b参数，它目前只接收两个参数，即c、d参数
const partialAdd = partial(add, 1, 2)

console.log(partialAdd(3, 4)) // 10
```

偏函数的第一个参数为目标函数，后续可接收多个参数作为固定参数。然后它会返回一个处理后的函数。

#### 实现

```javascript
/**
 * 偏函数
 * @author 欧怼怼
 * @param fn {function(...[*]): *}
 * @param args {*}
 * @return {function(...[*]): *}
 */
function partial(fn, ...args) {
  return function (...newArgs) {
    return fn.call(this, ...args, ...newArgs)
  }
}
```

### 函数防抖

#### 思路

函数防抖的作用就是在事件触发的一段时间后，才会执行函数；如果这段时间内又触发函数，则重新开始计时。

#### 实现

##### 简单版本实现

我们可以使用`setTimeout`定时器来实现延迟执行，并设置一个`timer`变量存储定时器，下次调用时可以清除上一次的调用。

```javascript
/**
 * 防抖简易版
 * @author 欧怼怼
 * @param func {(function(): void)}
 * @param delay {number} 延迟时间
 * @return {(function(): void)|*}
 */
function debounce(func, delay) {
  let timer // 存储定时器
  return function (...args) {
    clearTimeout(timer) // 每次调用时，清除之前的定时器
    // 重新新建一个定时器
    timer = setTimeout(() => {
      // 调用函数
      func.apply(this, args)
    }, delay)
  }
}
```

##### 复杂版本实现

我们可以基于简单版本再添加一些功能。比如我们可以实现一个`options`选项参数，可以实现配置上下文，并且实现配置是否立即执行。

其次，我们可以实现一个静态函数`cancel`，可以实现取消执行。

接下来我们来实现一下：

```javascript
/**
 * 防抖复杂版
 * @author 欧怼怼
 * @param func<Function>
 * @param delay<Number>
 * @param options<{context: *, leading: boolean}>
 * @return <Function>
 * */
function debounce(
  func,
  delay,
  options = {
    leading: false, // 表示是否立即执行
    context: null, // 配置上下文
  }
) {
  let timer = null // 存储定时器

  const debounceFn = function (...args) {
    // 清除定时器
    timer && clearTimeout(timer)
    // 处理上下文
    const context = options.context || this

    // 如果timer为空且开启立即执行
    if (timer === null && options.leading) {
      func.apply(context, args) // 立即执行
      // 延迟清空定时器
      timer = setTimeout(() => {
        timer = null
      }, delay)
    }
    // 默认情况
    else {
      timer = setTimeout(() => {
        func.apply(context, args)
        timer = null
      }, delay)
    }
  }

  // 实现取消方法
  debounceFn.cancel = function () {
    clearTimeout(timer)
    timer = null
  }

  return debounceFn
}
```

### 函数节流

#### 思路

函数节流跟函数防抖一样，都是用于优化高频率调用函数。

而节流刚好跟防抖相反，函数节流是在执行后一段时间内，无法重复执行。

#### 实现

##### 使用定时器实现

我们可以模仿函数防抖，使用定时器来实现。

```javascript
/**
 * 节流定时器实现
 * @author 欧怼怼
 * @param func {(function(): void)}
 * @param delay {number}
 * @return {(function(): void)}
 */
function throttle(func, delay) {
  let timer = null // 存储定时器
  return function (...args) {
    // 通过timer判断是否可执行
    if (timer === null) {
      // 立即执行函数
      func.apply(this, args)
      // 开启定时器
      timer = setTimeout(() => {
        timer = null
      }, delay)
    } else {
      console.warn('距离上次调用的时间差不满足要求')
    }
  }
}
```

##### 使用时间戳实现

```javascript
/**
 * 节流时间戳实现
 * @author 欧怼怼
 * @param func {(function(): void)}
 * @param delay {number}
 * @return {(function(): void)}
 */
function throttle(func, delay) {
  // 保存上一次的时间戳
  let prevTimestamp = 0
  return function (...args) {
    // 获取现在的时间戳
    const now = Date.now()
    // 比较 now 和 prevTimestamp + delay
    if (now >= prevTimestamp + delay) {
      // 执行函数
      func.apply(this, args)
      // 更新时间戳
      prevTimestamp = now
    } else {
      console.warn('距离上次调用的时间差不满足要求')
    }
  }
}
```

##### 复杂版本实现

同样我们也可以实现一个比较全面的版本。比如配置选项，可以传入函数调用时的上下文，可以配置是否立即执行，可以配置是否在最后额外再触发一次函数。

同样我们可以再设置一个取消函数，来取消上一次节流操作。

```javascript
/**
 * 节流复杂版本
 * @author 欧怼怼
 * @param func {(function(): void)}
 * @param delay {Number}
 * @param options {{leading?: boolean, trailing?: boolean, context?: *}}
 * @return {(function(): void)}
 * */
function throttle(
  func,
  delay,
  options = {
    leading: true, // 表示是否立即执行
    trailing: false, // 是否在最后额外触发一次
    context: null, // func运行的this指向
  }
) {
  let prevTimestamp = 0 // 存储上一次执行的时间戳
  let timer = null // 存储定时器
  const throttleFn = function (...args) {
    // 初始化选项参数
    const leading = options.leading !== undefined ? options.leading : true
    const trailing = !!options.trailing
    const context = options.context || this

    let now = Date.now()

    // 如果第一次调用且设置不立即执行的话，将 prevTimestamp 设置为当前时间戳
    // 此时第一次调用的时候 now >= prevTimestamp + delay 就不会通过了
    if (!prevTimestamp && !leading) {
      prevTimestamp = now
    }

    // 正常节流调用，跟时间戳实现一致
    if (now >= prevTimestamp + delay) {
      // 如果触发时发现定时器存在也还没执行，则及时取消，以避免重复执行，失去了节流的意义
      if (timer) {
        clearTimeout(timer)
        timer = null
      }

      // 调用函数
      func.apply(context, args)
      prevTimestamp = now
    }

    // 如果设置了在最后额外触发一次，则定义一个定时器去执行
    if (!timer && trailing) {
      timer = setTimeout(() => {
        // 调用函数
        func.apply(context, args)
        timer = null
      }, delay)
    }
  }

  // 取消函数，重置参数
  throttleFn.cancel = function () {
    prevTimestamp = 0
    clearTimeout(timer)
    timer = null
  }

  return throttleFn
}
```

## Promise

### 实现 Promise

[ 手撕一个符合 Promise/A+规范的 Promise](./hw-promise.md)

### 实现 util.promisify

#### 思路

> [util.promisify(original) | Node.js API 文档](http://nodejs.cn/api/util/util_promisify_original.html)

该方法是 Node 工具库的一个方法，它是用于将采用遵循常见的错误优先的回调风格的函数（也就是将 `(err, value) => ...` 回调作为最后一个参数），封装成一个 Promise 风格的函数。

我们可以通过下面的例子了解一下：

```javascript
// 正常使用 fs.readFile
fs.readFile('./data.json', (err, data) => {
  if (err) throw err
  console.log(data.toString())
})

// 使用promisify
const readFile = promisify(fs.readFile)
readFile('./data.json')
  .then((data) => {
    console.log(data.toString())
  })
  .catch((err) => {
    throw err
  })
```

接下来我们来实现一下。

#### 实现

```javascript
/**
 * 实现promisify
 * @author 欧怼怼
 * @param original {function(...[*]=): *}
 * @return {function(...[*]=): Promise<unknown>}
 */
function promisify(original) {
  // 返回一个函数
  return function (...args) {
    // 函数返回一个promise
    return new Promise((resolve, reject) => {
      // 调用函数
      original.call(
        this,
        ...args,
        // 添加回调函数
        (err, data) => {
          err ? reject(err) : resolve(data)
        }
      )
    })
  }
}
```

## 其他

### 使用 setTimeout 实现 setInterval

#### 思路

如果在实际应用中会经常使用到计时器，而使用`setInterval`的话会存在一些缺陷。`setInterval`实际上是把事件直接放到任务队列中，而真正执行的时间并不确定，有可能存在上一个计时器任务还没执行结束，下个计时器任务就开始执行了。

因此我们可以通过`setTimeout`来模拟实现`setInterval`。

#### 实现

##### 简单版实现

```javascript
;(function timer() {
  let t = setTimeout(() => {
    console.log('do something')
    clearTimeout(t)
    timer()
  }, 1000)
})()
```

##### 复杂版实现

我们可以封装成一个工具类，支持添加多个计时任务，同时也支持删除任务。

```javascript
/**
 * 使用setTimeout实现定时器
 * @author 欧怼怼
 */
class Timer {
  constructor() {
    // 存储定时任务
    this.timerList = new Map()
  }

  /**
   * 增加定时任务
   * @param name {string}
   * @param callback {() => void}
   * @param [interval] {number}
   */
  addTimer(name, callback, interval = 1000) {
    // 将定时任务存储起来
    this.timerList.set(name, {
      callback,
      interval,
      timer: null, // 存储定时器，便于清除
    })
    // 开启定时器
    this.runTimer(name)
  }

  /**
   * 开启定时任务
   * @param name {string}
   */
  runTimer(name) {
    const self = this

    // 自调用
    ;(function run() {
      // 判断是否有该定时任务
      if (self.timerList.has(name)) {
        const task = self.timerList.get(name)
        // 设置定时器
        task.timer = setTimeout(() => {
          task.callback()
          // 清除上一个定时器
          clearTimeout(task.timer)
          // 再次调用定时器
          run()
        }, task.interval)
      }
    })()
  }

  /**
   * 删除定时任务
   * @param name {string}
   */
  clearTimer(name) {
    if (this.timerList.has(name)) {
      const task = this.timerList.get(name)
      // 删除前先清除定时器
      clearTimeout(task.timer)
      this.timerList.delete(name)
    }
  }
}
```

然后我们可以这样使用：

```javascript
const timer = new Timer()
let i = 0
// 添加定时任务
timer.addTimer(
  'test',
  () => {
    i++

    // 当i等于5时，删除定时器
    if (i === 5) {
      timer.clearTimer('test')
    }
  },
  5000 // 时间间隔五秒
)
```

### 时间切片

#### 思路

首先来简单讲一下什么是时间切片。

我们都知道一般页面 16ms 刷新一次，但如果我们的任务超过 16ms 的话，可能会产生丢帧的情况。因此我们就可以使用时间切片去对一个长时间的任务进行切片拆分。

而在 react 的虚拟 DOM 操作上，就用到了时间切片。具体可以看看[这篇文章](https://juejin.cn/post/6844904134945030151)，这里就不多花时间去讲概念问题了。

而对于时间切片的实现，我们可以用到 ES6 的迭代器来实现，也就是 Generator 生成器函数，如果对这个概念不熟悉的朋友可以去[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Iterators_and_Generators)学习一下。

接下来我们来实现一下。

#### 实现

如果熟悉 EventLoop 的话，应该知道当一次事件循环结束后，就会刷新一次页面，因此我们只使用`setTimeout`将下一个任务切片设置为一个新的宏任务就可以了。

```javascript
/**
 * 简单版时间切片
 * @author 欧怼怼
 * @param generator {*}
 * @return {(function(): void)|*}
 */
function timeSlicing(generator) {
  if (typeof generator === 'function') generator = generator()

  if (!generator || typeof generator.next !== 'function') return

  return function next() {
    let res = generator.next()
    if (res.done) return
    // next会在下一个宏任务执行
    setTimeout(next)
  }
}

// 使用
button.onclick = timeSlicing(function* () {
  while (true) {
    doSomething()
    yield
  }
})
```

当然我们可以来完善一下。

因为我们其实没法准确保证每个切片的执行时长，那我们可以在一个定时的时间段内（比如 16ms 内）持续迭代执行。

```javascript
/**
 * 增强版时间切片
 * @author 欧怼怼
 * @param generator {*}
 * @return {(function(): void)|*}
 */
function timeSlicing(generator) {
  if (typeof generator === 'function') generator = generator()

  if (!generator || typeof generator.next !== 'function') return

  return function next() {
    // 获取开始执行的毫秒级时间戳
    const start = performance.now()
    let res = null
    // 16ms内持续迭代执行
    do {
      res = generator.next()
    } while (!res.done && performance.now() - start < 16)

    if (res.done) return
    // next会在下一个宏任务执行
    setTimeout(next)
  }
}
```

我们可以通过一个 demo 测试一下 1 秒内两种方法的执行次数。

```javascript
timeSlicing(function* () {
  let times = 0
  const start = performance.now()
  while (performance.now() - start < 1000) {
    times++
    yield
  }

  // 简单版在一秒运行了765次
  // 增强版在一秒运行了1497503次
  console.log(times)
})()
```

### 事件总线（发布-订阅模式）

#### 思路

如果你使用过 Vue，那估计对事件总线不陌生。在 Vue 中的事件绑定`$on`、事件派发`$emit`、事件取消监听`$off`等都属于事件总线的功能。

它实际上就是一种发布-订阅模式，包括 Vue

中的响应式更新实现，也是相同原理。

事件总线是一种集中式事件处理机制，允许不同的组件之间进行彼此通信而又不需要相互依赖，从而达到一种解耦的目的。

#### 实现

```javascript
/**
 * 事件总线 （发布-订阅模式）
 * @author 欧怼怼
 */
class EventBus {
  constructor() {
    // 存储事件
    this.cache = {}
  }

  /**
   * 订阅事件
   * @param name {string} 事件名称
   * @param fn {function} 任务函数
   */
  on(name, fn) {
    // 初始化事件数组
    if (!this.cache[name]) {
      this.cache[name] = []
    }

    // 更新事件
    this.cache[name].push(fn)
  }

  /**
   * 删除事件
   * @param name {string} 事件名称
   * @param fn {function} 任务函数
   */
  off(name, fn) {
    if (this.cache[name]) {
      // 过滤掉取消绑定的任务
      this.cache[name] = this.cache[name].filter((f) => f !== fn && f.callback !== fn)
    }
  }

  /**
   * 派发事件
   * @param name {string} 事件名称
   * @param args {*[]} 参数
   */
  emit(name, ...args) {
    if (this.cache[name]) {
      let tasks = [...this.cache[name]]
      // 遍历调用
      for (let fn of tasks) {
        fn(...args)
      }
    }
  }

  /**
   * 只派发一次后删除
   * @param name
   * @param fn
   */
  once(name, fn) {
    const self = this
    // 新建一个函数，执行完fn后触发off
    const newFn = function (...args) {
      fn.call(this, ...args)
      self.off(name, newFn)
    }
    // 绑定
    self.on(name, newFn)
  }
}
```

### 排序算法

> 点击阅读[十大经典排序算法具体实现](../algorithm/sort.md)

#### 冒泡排序

```javascript
/**
 * 冒泡排序
 * @author 欧怼怼
 * @desc 时间复杂度：O(N²) 空间复杂度：O(1) 排序方式：in-place
 * @param array {number[]}
 * @return {number[]}
 */
function bubbleSort(array) {
  const len = array.length
  let i = 0
  // 循环 len 次
  while (i < len) {
    // 每次结尾都少遍历一个
    const lastIndex = len - 1 - i++
    for (let j = 0; j < lastIndex; j++) {
      // 当前元素与下一个元素做比较，如果大于的话调换顺序
      if (array[j] > array[j + 1]) {
        ;[array[j], array[j + 1]] = [array[j + 1], array[j]]
      }
    }
  }
  return array
}
```

#### 选择排序

```javascript
/**
 * 选择排序
 * @author 欧怼怼
 * @desc 时间复杂度：O(N²) 空间复杂度：O(1) 排序方式：in-place
 * @param array {number[]}
 * @return {number[]}
 */
function selectionSort(array) {
  const len = array.length
  for (let i = 0; i < len - 1; i++) {
    let minIndex = i // 初始化最小值下标
    for (let j = i + 1; j < len; j++) {
      // 寻找最小的值
      if (array[j] < array[minIndex]) minIndex = j
    }
    // 调换顺序
    ;[array[i], array[minIndex]] = [array[minIndex], array[i]]
  }

  return array
}
```

#### 插入排序

```javascript
/**
 * 插入排序
 * @author 欧怼怼
 * @desc 时间复杂度：O(N²) 空间复杂度：O(1) 排序方式：in-place
 * @param array {number[]}
 * @return {number[]}
 */
function insertionSort(array) {
  const len = array.length
  // 从第二个开始遍历
  for (let i = 1; i < len; i++) {
    // 获取当前值
    const curValue = array[i]
    let j = i - 1
    // 遍历 i 之前的元素，如果大于curValue，则直接往后挪一位
    while (j >= 0 && array[j] > curValue) {
      array[j + 1] = array[j]
      j--
    }
    // 插入 curValue
    array[j + 1] = curValue
  }
  return array
}
```

#### 快速排序

```javascript
/**
 * 快速排序
 * @author 欧怼怼
 * @desc 时间复杂度：O(NlogN) 空间复杂度：O(logN) 排序方式：in-place
 * @param array {number[]}
 * @return {number[]}
 */
function quickSort(array) {
  return _quickSort(array, 0, array.length - 1)

  /**
   * 快速排序
   * @param array {number[]}
   * @param left {number}
   * @param right {number}
   * @return {number[]}
   * @private
   */
  function _quickSort(array, left, right) {
    if (left < right) {
      // 进行分区，获取基准点
      const partitionIndex = partition(array, left, right)
      // 以基准值为中心，左右各种再递归调用快速排序
      _quickSort(array, left, partitionIndex - 1)
      _quickSort(array, partitionIndex + 1, right)
    }

    return array
  }

  /**
   * 分区操作
   * @param array {number[]}
   * @param left {number}
   * @param right {number}
   * @return {number}
   */
  function partition(array, left, right) {
    const pivot = left // 基准
    let idx = pivot + 1 // 定位到等于array[pivot]的下标
    // 将小于基准值的与array[idx]调换顺序
    for (let i = idx; i <= right; i++) {
      if (array[i] < array[pivot]) {
        ;[array[i], array[idx]] = [array[idx], array[i]]
        idx++
      }
    }
    // 调换array[pivot]至array[idx - 1]处
    // 形成小于基准值的在基准值的左边，大于基准值的在基准值的右边
    ;[array[pivot], array[idx - 1]] = [array[idx - 1], array[pivot]]
    return idx - 1
  }
}
```
