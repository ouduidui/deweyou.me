---
title: Require和Import有什么不一样
description: Require和Import有什么不一样
date: 2021-01-07T08:00:00.000+00:00
author: Dewey Ou
---

## 历史背景

- **require/exports**
  - 来自野生规范当中，即这些规范是JavaScript社区中的开发者自己草拟的规则，得到了大家的承认和广泛的应用，比如`CommonJS`、`AMD`、`CMD`等等。而`Node`遵循`CommonJS`规范，`requireJS`
    遵循`AMD`，`seaJS`遵循`CMD`。
  - 因为`Node`无法直接兼容`ES6`语法，所以现阶段`require/exports`仍然是必要且是必须的。
- **import/export**
  - 来自ES6的新规范，即TC39 制定的新的 ECMAScript 版本。
  - `babel`诞生后，它能将还未被宿主环境（各大浏览器、`Node`）直接支持的`ES6`语法编译为`ES5`，也就是能将`ES6 Module` 的`import/export`编译为`CommonJS`
    的`require/exports`这种写法。

## 差异

### 写法差异

#### require/exports

```js
/* 导出 */
exports.fs = fs;      // 单个特性导出，可导出多个
module.exports = fs;   // 整个模块导出，每个模块只包含一个

/* 引入 */
const fs = require('fs');   // 引入整个模块
```

#### import/export

```js
/* 导出 */
export default fs;     // 默认导出 每个模块包含一个 每次导出都会覆盖前一个导出
export const fs;       // 导出单个特性 每个模块包括多个
export function readFile() {};    // 导出单个特性 每个模块包括多个
export {readFile, read};   // 导出列表
export * from 'fs';     // 导出模块合集

/* 引入 */
import fs from 'fs';       // 引入整个模块的内容
import '/fs.js';          // 仅为副作用而引入一个模块 不导入模块中的任何接口
import * as fs from 'fs';    // 引入整个模块的内容
import {readFile} from 'fs';   // 引入readFile单个接口
import {readFile as read} from 'fs';   // 引入模块中read接口，并重命名为readFile
import fs, {readFile} from 'fs';   // 引入整个模块的内容和readFile接口
```

### 输出差异

#### require/exports

`require/exports` 输出的是一个值的拷贝，也就是说，当你引入一个值，模块内部的变化是影响不到这个值的。

```js
// test.js
let num = 0;

function addNum() {
  num++;
};
module.exports = {
  num: num,
  addNum: addNum
}

// main.js
const test = require('./test.js');

console.log(test.num);     // output： 0
test.addNum();
console.log(test.num);     // output： 0
```

#### import/export

`import/export`输出的是值的索引，也就是说，该引用其实是一个动态引用，并不会缓存值，当模块内部发生变化，你的引入值也会随之更新。

```js
// test.js
export let num = 0;

export function addNum() {
  num++;
};

// main.js
import {num, addNum} from './test.js';

console.log(num);     // output： 0
addNum();
console.log(num);     // output： 1
```

### 加载差异

#### require/exports

`CommonJS`模块是运行时加载。

因为`CommonJS`模块加载的是一个对象，即`module.exports`属性，该对象只有在脚本运行完才生成，也因此没办法再编译时做“静态优化”。

```js
const {test1, test2, test3} = require('test');

/* 等同于 */
const _test = require('test');   // 实质上加载了整个模块，再从中读取这三个方法
const test1 = _test.test1;
const test2 = _test.test2;
const test3 = _test.test3;
```

#### import/export

`ES6`模块是编译时输出接口。

`ES6`模块不是对象，它对外接口只是一个静态定义，在代码静态解析阶段才会生成，因此效率要比`CommonJS`模块加载高。

```js
import {test1, test2, test3} from 'test';   // 只从模块中加载这三个方法，其他的不加载
```

### 异步差异

#### require/exports

`CommonJS`模块中的`require`是同步加载模块。

#### import/export

`ES6`模块的`import`命令是异步加载的，有一个独立的模块依赖的解析阶段。