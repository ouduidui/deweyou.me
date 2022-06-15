---
title: 聊一聊Vue2中的Diff算法
description: 聊一聊Vue2中的Diff算法
date: 2021-06-09T08:00:00.000+00:00
author: Dewey Ou
---

[[toc]]

## Vue2是如何更新节点

我们都知道，`Vue`中是使用了基于`HTML`的模板语法，允许开发者声明式地将`DOM`绑定至底层`Vue`实例的数据。而初始化的时候，`Vue`就会将该模板语法转化为真实`DOM`，渲染到页面中。

```html
<template>
	<div>{{msg}}</div>
</template>

<script>
  export.default {
    data() {
      return {
        msg: 'HelloWorld'
      }
    }
  }
</script>
```

但当数据发生变化的时候，`Vue`会如何去更新页面呢？

如果选择重新渲染整个`DOM`，那必然会引起整个`DOM`树的重绘和重排，而在真实项目中，不可能就跟上面的例子一样只有一句`<div>{{msg}}</div>`。当我们的页面非常复杂的情况下，且修改的数据只影响到一小部分页面数据的更新的时候，重新渲染页面一定是不可取的。

而这时候，最便捷的方式，就是找到该修改的数据所影响到的`DOM`，然后只更新那一个`DOM`就可以了。这就是`Vue`更新页面的方法。

`Vue`在初始化页面后，会将当前的真实`DOM`转换为虚拟`DOM`（Virtual DOM），并将其保存起来，这里称为`oldVnode`。然后当某个数据发变化后，`Vue`会先生成一个新的虚拟`DOM`——`vnode`，然后将`vnode`和`oldVnode`进行比较，找出需要更新的地方，然后直接在对应的真实`DOM`上进行修改。当修改结束后，就将`vnode`赋值给`oldVnode`存起来，作为下次更新比较的参照物。

而这个更新中的难点，也是我们今天要聊的内容，就是新旧`vnode`的比较，也就是我们常说的`Diff`算法。

## 什么是虚拟DOM

前面我们提到了虚拟`DOM`（Virtual DOM），那虚拟`DOM`是什么呢？

我们可能曾经打印过真实`DOM`，它实质上是个对象，但是它的元素是非常的多的，即使是很简单的几句代码。

![dom](/posts/vue-diff/dom.png)

因此，在真实`DOM`下，我们不太敢随便去直接操作和改动。

这时候，虚拟`DOM`就诞生了。它也是一个对象，而它其实是将真实`DOM`的数据抽取出来，以对象的形式模拟树形结构，使其更加简洁明了。

虚拟`DOM`没有很固定的模板，每个框架上的实现都存在差异，但是大部分结构都是相同的。下面我们就用`Vue`的虚拟`DOM`举个例子。

```html
<div id="app">
  <p class="text">HelloWorld</p>
</div>
```

上面的`DOM`通过`Vue`生成了下面的虚拟`DOM`（有删减），对象中包含了根节点的标签`tag`、`key`值，文本信息`text`等等，同时也含有`elm`属性存放真实`DOM`，同时有个`children`数组，存放着子节点，子节点的结构也是一致的。

```json
{
  "tag": "div",  // 标签
  "key": undefined,  // key值
  "elm": div#app,   // 真实DOM
  "text": undefined,   // 文本信息
  "data": {attrs: {id:"app"}}, // 节点属性
  "children": [{    // 孩子属性
    "tag": "p",
    "key": undefined,
    "elm": p.text,
    "text": undefined,
    "data": {attrs: {class: "text"}},
    "children": [{
      "tag": undefined,
      "key": undefined,
      "elm": text,
      "text": "helloWorld",
      "data": undefined,
      "children": []
    }]
  }]
}
```

当我们把一些常用的信息提取出来，并且使用对象嵌套的形式，去存放子节点信息，从而形成一个虚拟`DOM`,这时候我们用其来进行比较的话，就会比两个真实`DOM`做比较简单多了。

在`Vue`中，有个`render`函数，这个函数返回的`VNode`就是一个虚拟`DOM`。当然，你也可以使用 [virtual-dom](https://github.com/Matt-Esch/virtual-dom) 或 [snabbdom](https://github.com/snabbdom/snabbdom) 去体验一下虚拟`DOM`。

## Diff的实现

在使用`Diff`算法比较两个节点的时候，只会在同层级进行比较，而不会跨层级比较。

![diff](/posts/vue-diff/diff.gif)

### 流程

在`Vue`中，主要是`patch()`、`patchVnode()`和`updateChildren()`这三个主要方法来实现`Diff`的。

- 当我们`Vue`中的响应式数据变化的时候，就会触发页面更新函数`updateComponent()`（如何触发可以通过阅读`Vue`源码进行学习或者看一下我之前一篇[《简单手写实现Vue2.x》](https://juejin.cn/post/6963079075938172936)）；
- 此时`updateComponet()`就会调用`patch()`方法，在该方法中进行比较是否为相同节点，是的话执行`patchVnode()`方法，开始比较节点差异；而如果不是相同节点的话，则进行替换操作，具体后面会讲到；
- 在`patchVnode()`中，首先是更新节点属性，然后会判断有没有孩子节点，有的话则执行`updateChildren()`方法，对孩子节点进行比较；如果没有孩子节点的话，则进行节点文本内容判断更新；（文本节点是不会有孩子节点的）
- `updateChildren()`中，会对传入的两个孩子节点数组进行一一比较，当找到相同节点的情况下，调用`patchVnode()`继续节点差异比较。

![diff](/posts/vue-diff/diff.jpg)

### 准备工作

为了后面更好的看核心代码，我们先在前面捋清楚一些函数。

#### isDef 和 isUndef

在源码中会用`isDef()`和`isUndef()`判断`vnode`是否存在，实质上是判断`vnode`是不是`undefined`或`null`，毕竟`vnode`虚拟DOM是个对象。

```javascript
export function isUndef (v: any): boolean %checks {
  return v === undefined || v === null
}

export function isDef (v: any): boolean %checks {
  return v !== undefined && v !== null
}
```

#### sameVnode

在源码中会用`sameVnode()`方法去判断两个节点是否相同，实质上是通过去判断`key`值，`tag`标签等静态属性从而去判断两个节点是否为相同节点。

注意的是，这里的相同节点不意味着为相等节点，比如`<div>HelloWorld</div>`和`<div>HiWorld</div>`为相同节点，但是它们并不相等。在源码中是通过`vnode1 === vnode2`去判断是不是为相等节点。

```javascript
// 比较是否相同节点
function sameVnode(a, b) {
  return (
    a.key === b.key &&
    a.asyncFactory === b.asyncFactory && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}

function sameInputType(a, b) {
  if (a.tag !== 'input') return true
  let i
  const typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type
  const typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type
  return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
}
```



### patch

接下来开始看源码了，看看`Vue`是如何实现`Diff`算法。

> 下面的所有代码都只保留核心的代码，想看全部代码可以去看`Vue`的源码（patch文件路径：https://github.com/vuejs/vue/blob/2.6/src/core/vdom/patch.js ）。



首先看看`patch()`方法，该方法接收新旧虚拟Dom，即`oldVnode`，`vnode`，这个函数其实是对新旧虚拟`Dom`做一个简单的判断，而还没有进入详细的比较阶段。

- 首先判断`vnode`是否存在，如果不存在的话，则代表这个旧节点要整个删除；
- 如果`vnode`存在的话，再判断`oldVnode`是否存在，如果不存在的话，则代表只需要新增整个`vnode`节点就可以；
- 如果`vnode`和`oldVnode`都存在的话，判断两者是不是相同节点，如果是的话，这调用`patchVnode`方法，对两个节点进行详细比较判断；
- 如果两者不是相同节点的话，这种情况一般就是初始化页面，此时`oldVnode`其实是真实`Dom`，这是只需要将`vnode`转换为真实`Dom`然后替换掉`oldVnode`，具体就不多讲，这不是今天讨论的范围内。

```javascript
// 更新时调用的__patch__
function patch(oldVnode, vnode, hydrating, removeOnly) {
  // 判断新节点是否存在
  if (isUndef(vnode)) {
    if (isDef(oldVnode)) invokeDestroyHook(oldVnode)  // 新的节点不存在且旧节点存在：删除
      return
  }

	// 判断旧节点是否存在
  if (isUndef(oldVnode)) {
    // 旧节点不存在且新节点存在：新增
    createElm(vnode, insertedVnodeQueue)  
  } else {
    if (sameVnode(oldVnode, vnode)) {
      // 比较新旧节点 diff算法
      patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
    } else {
      // 初始化页面（此时的oldVnode是个真实DOM）
      oldVnode = emptyNodeAt(oldVnode)
    }
    // 创建新的节点
    createElm(
      vnode,
      insertedVnodeQueue,
      oldElm._leaveCb ? null : parentElm,
      nodeOps.nextSibling(oldElm)
    )
  }

  return vnode.elm;
}
```

![diff2](/posts/vue-diff/diff2.jpg)

### patchVnode

在`patchVnode()`中，同样是接收新旧虚拟Dom，即`oldVnode`，`vnode`；在该函数中，即开始对两个虚拟`Dom`进行比较更新了。

- 首先判断两个虚拟`Dom`是不是全等，即没有任何变动；是的话直接结束函数，否则继续执行；
- 其次更新节点的属性；
- 接着判断`vnode.text`是否存在，即`vnode`是不是文本节点。是的话，只需要更新节点文本既可，否则的话，这继续比较；
- 判断`vnode`和`oldVnode`是否有孩子节点：
  - 如果两者都有孩子节点的话，执行`updateChildren()`方法，进行比较更新孩子节点；
  - 如果`vnode`有孩子节点而`oldVnode`没有的话，则直接新增所有孩子节点，并将该节点文本属性设为空；
  - 如果`oldVnode`有孩子节点而`vnode`没有的话，则直接删除所有孩子节点；
  - 如果两者都没有孩子节点，就判断`oldVnode.text`是否有内容，有的话清空内容既可。

```javascript
// 比较两个虚拟DOM
function patchVnode(oldVnode, vnode,  insertedVnodeQueue, ownerArray, index, removeOnly) {
  // 如果两个虚拟DOM一样，无需比较直接返回
  if (oldVnode === vnode) {
    return
  }
  
  // 获取真实DOM
  const elm = vnode.elm = oldVnode.elm

  // 获取两个比较节点的孩子节点
  const oldCh = oldVnode.children
  const ch = vnode.children

  // 属性更新
  if (isDef(data) && isPatchable(vnode)) {
    for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
    if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
  }

  if (isUndef(vnode.text)) {   // 没有文本 -> 该情况一般都是有孩子节点
    if (isDef(oldCh) && isDef(ch)) {  // 新旧节点都有孩子节点 -> 比较子节点
      if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
    } else if (isDef(ch)) {  // 新节点有孩子节点，旧节点没有孩子节点 -> 新增
      if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')  // 如果旧节点有文本内容，将其设置为空
      addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
    } else if (isDef(oldCh)) {   // 旧节点有孩子节点，新节点没有孩子节点 -> 删除
      removeVnodes(oldCh, 0, oldCh.length - 1)
    } else if (isDef(oldVnode.text)) {   // 旧节点有文本，新节点没有文本 -> 删除文本
      nodeOps.setTextContent(elm, '')
    }
  } else if (oldVnode.text !== vnode.text) {  // 新旧节点文本不同 -> 更新文本
    nodeOps.setTextContent(elm, vnode.text)
  }
}
```

![diff3](/posts/vue-diff/diff3.jpg)

### updateChildren

最后就来看看`updateChildren`方法了，这个也是最难理解的一部分，所以就先带大家一步步捋清楚后，手写一下，再看源码。

首先这个方法传入三个比较重要的参数，即`parentElm`父级真实节点，便于直接节点操作；`oldCh`为`oldVnode`的孩子节点；`newCh`为`Vnode`的孩子节点。

`oldCh`和`newCh`都是一个数组。 这个方法的作用，就是对这两个数组一一比较，找到相同的节点，执行`patchVnode`再次进行比较更新，剩下的少退多补。



这个方法我们想到最简单的方法，就是两个数组进行遍历匹配，但是这样子的复杂度是很大的，时间复杂度为`O(NM)`，而且我们真实项目中，页面结构是非常庞大和复杂的，所以这个方案是非常耗性能的。

在`Vue`中，主要的实现是用四个指针进行实现。四个指针初始位置分别在两个数组的头尾。因此我们先来初始化必要的变量。

```javascript
let oldStartIdx = 0;   								// oldCh数组左边的指针位置
let oldStartVnode = oldCh[0];  			  // oldCh数组左边的指针对应的节点
let oldEndIdx = oldCh.length - 1; 		// oldCh数组右边的指针位置
let oldEndVnode = oldCh[oldEndIdx]; 	// oldCh数组右边的指针对应的节点
let newStartIdx = 0;									// newCh数组左边的指针位置
let newStartVnode = newCh[0];					// newCh数组左边的指针对应的节点
let newEndIdx = newCh.length - 1;			// newCh数组右边的指针位置
let newEndVnode = newCh[newEndIdx]; 	// newCh数组右边的指针对应的节点
```

![diff4](/posts/vue-diff/diff4.jpeg)

然而这四个指针不会一直不动的，它们会进行相互比较，如果比较得出是相同节点后，对应两个指针就会向另一侧移动，而直至两两重合的时候，这个循环也就结束了。

当然看到这里，你会有很多疑问，但先把疑问记起来，后面都会一一作答的。我们接着写一个循环语句。

```javascript
while(oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      // TODO
}
```

接着我们开始相互比较。

首先是`oldStartVnode`和`newStartVnode`进行比较，如果比较相同的话，我们就可以执行`patchVnode`语句，并且移动`oldStartIdx`和`newStartIdx`。

![diff2](/posts/vue-diff/diff2.gif)

```javascript
while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
  if (sameVnode(oldStartVnode, newStartVnode)) {
    patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
    oldStartVnode = oldCh[++oldStartIdx];
    newStartVnode = newCh[++newStartIdx];
  }
}
```

如果`oldStartVnode`和`newStartVnode`匹配不上的话，接下来就是`oldEndVnode`和`newEndVnode`做比较了。

![diff3](/posts/vue-diff/diff3.gif)

```javascript
while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
  if (sameVnode(oldStartVnode, newStartVnode)) {
    ...
  } else if (sameVnode(oldEndVnode, newEndVnode)) {
    patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
    oldEndVnode = oldCh[--oldEndIdx]
    newEndVnode = newCh[--newEndIdx]
  }
}
```

但如果两头比较和两尾比较都不是相同节点的话，这时候就开始交叉比较了。首先是`oldStartVnode`和`newEndVnode`做比较。

![diff4](/posts/vue-diff/diff4.gif)

但交叉比较的时候如果匹配上的话，就需要注意到一个问题，这时候你不仅仅要比较更新节点的内容，你还需要移动节点的位置，因此我们可以借助`insertBefore`和`nextSibling`的`DOM`操作方法去实现，这个自行去学习叭。

```javascript
while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
  if (sameVnode(oldStartVnode, newStartVnode)) {
    ...
  } else if (sameVnode(oldEndVnode, newEndVnode)) {
    ...
  } else if (sameVnode(oldStartVnode, newEndVnode)) {
    patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
    // 将oldStartVnode节点移动到对应位置，即oldEndVnode节点的后面
    nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))

    oldStartVnode = oldCh[++oldStartIdx]
    newEndVnode = newCh[--newEndIdx]
  }
}
```

如果`oldStartVnode`和`newEndVnode`匹配不上的话，就`oldEndVnode`和`newStartVnode`进行比较。

![diff5](/posts/vue-diff/diff5.gif)

```javascript
while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
  if (sameVnode(oldStartVnode, newStartVnode)) {
    ...
  } else if (sameVnode(oldEndVnode, newEndVnode)) {
    ...
  } else if (sameVnode(oldStartVnode, newEndVnode)) {
    ...
  } else if (sameVnode(oldEndVnode, newStartVnode)) {
    patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
    // 将oldEndVnode节点移动到对应位置，即oldStartVnode节点的前面
    nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)

    oldEndVnode = oldCh[--oldEndIdx]
    newStartVnode = newCh[++newStartIdx]
  }
}
```

此时，如果四种比较方法都匹配不到相同节点的话，我们就只能使用暴力解法去实现了，也就是针对于`newStartVnode`这个节点，我们去遍历`oldCh`中剩余的节点，一一匹配。

在`Vue`中，我们知道标签会有一个属性——`key`值，而在同一级的`Dom`中，如果`key`有值的话，它必须是唯一的；如果不设值就默认为`undefined`。所以我们可以先用`key`来配对一下。

我们可以先生成一个`oldCh`的`key->index`的映射表，我们可以创建一个函数`createKeyToOldIdx`实现，返回的结果用一个变量`oldKeyToIdx`去存储。

```javascript
function createKeyToOldIdx(children, beginIdx, endIdx) {
  let i, key
  const map = {}
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key
    if (isDef(key)) map[key] = i
  }
  return map
}
```

这时候，如果`newStartVnode`存在`key`的话，我们就可以直接用`oldKeyToIdx[newStartVnode.key]`拿到对应旧孩子节点的下标`index`。

但如果`newStartVnode`没有`key`值的话，就只能通过遍历`oldCh`中剩余的节点，一一进行匹配获取对应下标`index`，这个也可以封装成一个函数去实现。

```javascript
function findIdxInOld(node, oldCh, start, end) {
  for (let i = start; i < end; i++) {
    const c = oldCh[i]
    if (isDef(c) && sameVnode(node, c)) return i
  }
}
```

这时候我们先继续手写代码。

```javascript
let oldKeyToIdx, idxInOld;

while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
  if (sameVnode(oldStartVnode, newStartVnode)) {
    ...
  } else if (sameVnode(oldEndVnode, newEndVnode)) {
    ...
  } else if (sameVnode(oldStartVnode, newEndVnode)) {
    ...
  } else if (sameVnode(oldEndVnode, newStartVnode)) {
    ...
  } else {
    // 遍历剩余的旧孩子节点，将有key值的生成index表 <{key: i}>
    if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)

    // 如果newStartVnode存在key，就进行匹配index值；如果没有key值，遍历剩余的旧孩子节点，一一与newStartVnode匹配，相同节点的返回index
    idxInOld = isDef(newStartVnode.key)
      ? oldKeyToIdx[newStartVnode.key]
      : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
  }
}
```

当然，这个情况下，`idxInOld`下标值还是有可能为空，这种情况就代表那个`newStartVnode`是一个全新的节点，这时候我们只需要新增节点就可以了。

如果`idxInOld`不为空的话，我们就获取对应的`oldVnode`，然后与`newStartVnode`进行比较，如果是相同节点的话，调用`patchVnode()`函数， 并且将对应的`oldVnode`设置为`undefined`；如果匹配出来时不同节点，那就直接创建一个节点既可。

最后，移动一下`newStartIdx`。

```javascript
let oldKeyToIdx, idxInOld, vnodeToMove;

while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
  if (sameVnode(oldStartVnode, newStartVnode)) {
    ...
  } else if (sameVnode(oldEndVnode, newEndVnode)) {
    ...
  } else if (sameVnode(oldStartVnode, newEndVnode)) {
    ...
  } else if (sameVnode(oldEndVnode, newStartVnode)) {
    ...
  } else {
    // 遍历剩余的旧孩子节点，将有key值的生成index表 <{key: i}>
    if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)

    // 如果newStartVnode存在key，就进行匹配index值；如果没有key值，遍历剩余的旧孩子节点，一一与newStartVnode匹配，相同节点的返回index
    idxInOld = isDef(newStartVnode.key)
      ? oldKeyToIdx[newStartVnode.key]
      : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
    if (isUndef(idxInOld)) {
      // 如果匹配不到index，则创建新节点
      createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
    } else {
      // 获取对应的旧孩子节点
      vnodeToMove = oldCh[idxInOld]
      if (sameVnode(vnodeToMove, newStartVnode)) {
        patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
        // 因为idxInOld是处于oldStartIdx和oldEndIdx之间，因此只能将其设置为undefined，而不是移动两个指针
        oldCh[idxInOld] = undefined
        nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
      } else {
        // 如果key相同但节点不同，就创建一个新的节点
        createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
      }
    }
    // 移动新节点的左边指针
    newStartVnode = newCh[++newStartIdx]
  }
}
```

![diff6](/posts/vue-diff/diff6.gif)

这里有个重点，如果我们匹配到对应的`oldVnode`的话，需要将其设置为`undefined`，同时当后面我们的`oldStartIdx`和`oldEndIdx`移动后，如果判断出对应的`vnode`为`undefined`时，就需要选择跳过。

```javascript
let oldKeyToIdx, idxInOld, vnodeToMove;

while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
  if (isUndef(oldStartVnode)) {
    // 当oldStartVnode为undefined的时候，oldStartVnode右移
    oldStartVnode = oldCh[++oldStartIdx]
  } else if (isUndef(oldEndVnode)) {
    // 当oldEndVnode为undefined的时候，oldEndVnode左移
    oldEndVnode = oldCh[--oldEndIdx]
  } else if (sameVnode(oldStartVnode, newStartVnode)) {
    ...
  } else if (sameVnode(oldEndVnode, newEndVnode)) {
    ...
  } else if (sameVnode(oldStartVnode, newEndVnode)) {
    ...
  } else if (sameVnode(oldEndVnode, newStartVnode)) {
    ...
  } else {
    ...
  }
}
```

![diff7](/posts/vue-diff/diff7.gif)

![diff8](/posts/vue-diff/diff8.gif)

到这个时候，我们已经完成的差不多了，只剩下最后的收尾工作了。

如果这时候，`oldCh`的两个指针已经重叠并越过，而`newCh`的两个指针还未重叠；或者说是相反情况下。

![diff5](/posts/vue-diff/diff5.jpeg)

这时候，如果`oldCh`有多余的`vnode`，我们只需要将其都删除既可；如果是`newCh`有多余的`vnode`，我们只需新增它们就可以了。

```javascript
let oldKeyToIdx, idxInOld, vnodeToMove, refElm;

while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
  if (isUndef(oldStartVnode)) {
    ...
  } else if (isUndef(oldEndVnode)) {
    ...
  } else if (sameVnode(oldStartVnode, newStartVnode)) {
    ...
  } else if (sameVnode(oldEndVnode, newEndVnode)) {
    ...
  } else if (sameVnode(oldStartVnode, newEndVnode)) {
    ...
  } else if (sameVnode(oldEndVnode, newStartVnode)) {
    ...
  } else {
    ...
  }

  if (oldStartIdx > oldEndIdx) {
    // 当旧节点左指针已经超过右指针的时候，新增剩余的新的孩子节点
    refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
    addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
  } else if (newStartIdx > newEndIdx) {
    // 当新节点左指针已经超过右指针的时候，删除剩余的旧的孩子节点
    removeVnodes(oldCh, oldStartIdx, oldEndIdx)
  }
}
```

这时候，我们就完成了`updateChildren()`方法了，整体代码如下：

```javascript
// 比较两组孩子节点
function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
  // 设置首尾4个指针和对应节点
  let oldStartIdx = 0
  let newStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let oldStartVnode = oldCh[0]
  let oldEndVnode = oldCh[oldEndIdx]
  let newEndIdx = newCh.length - 1
  let newStartVnode = newCh[0]
  let newEndVnode = newCh[newEndIdx]

  // diff查找是所需的变量
  let oldKeyToIdx, idxInOld, vnodeToMove, refElm

  // 循环结束条件：新旧节点的头尾指针都重合
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (isUndef(oldStartVnode)) {
      // 当oldStartVnode为undefined的时候，oldStartVnode右移
      oldStartVnode = oldCh[++oldStartIdx]
    } else if (isUndef(oldEndVnode)) {
      // 当oldEndVnode为undefined的时候，oldEndVnode左移
      oldEndVnode = oldCh[--oldEndIdx]
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      // 当oldStartVnode与newStartVnode节点相同，对比节点
      patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
      // 对应两个指针更新
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      // 当oldEndVnode与newEndVnode节点相同，对比节点
      patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
      // 对应两个指针更新
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      // 当oldStartVnode与newEndVnode节点相同，对比节点
      patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
      // 将oldStartVnode节点移动到对应位置，即oldEndVnode节点的后面
      nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
      // 对应两个指针更新
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      // 当oldEndVnode与newStartVnode节点相同，对比节点
      patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
      // 将oldEndVnode节点移动到对应位置，即oldStartVnode节点的前面
      nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
      // 对应两个指针更新
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    } else {   // 暴力解法 使用key匹配
      // 遍历剩余的旧孩子节点，将有key值的生成index表 <{key: i}>
      if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)

      // 如果newStartVnode存在key，就进行匹配index值；如果没有key值，遍历剩余的旧孩子节点，一一与newStartVnode匹配，相同节点的返回index
      idxInOld = isDef(newStartVnode.key)
        ? oldKeyToIdx[newStartVnode.key]
        : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)

      if (isUndef(idxInOld)) {
        // 如果匹配不到index，则创建新节点
        createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
      } else {
        // 获取对应的旧孩子节点
        vnodeToMove = oldCh[idxInOld]
        if (sameVnode(vnodeToMove, newStartVnode)) {
          patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
          // 因为idxInOld是处于oldStartIdx和oldEndIdx之间，因此只能将其设置为undefined，而不是移动两个指针
          oldCh[idxInOld] = undefined
          nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
        } else {
          // 如果key相同但节点不同，就创建一个新的节点
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
        }
      }
      // 移动新节点的左边指针
      newStartVnode = newCh[++newStartIdx]
    }
  }

  if (oldStartIdx > oldEndIdx) {
    // 当旧节点左指针已经超过右指针的时候，新增剩余的新的孩子节点
    refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
    addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
  } else if (newStartIdx > newEndIdx) {
    // 当新节点左指针已经超过右指针的时候，删除剩余的旧的孩子节点
    removeVnodes(oldCh, oldStartIdx, oldEndIdx)
  }
}
```

### 流程图

![diff6](/posts/vue-diff/diff6.png)

### 为什么要用key值

我们在前面的`sameVnode()`可以看到，我们在比较两个节点是否相同的时候，第一个判断条件就是`vnode.key`；并且在后面使用暴力解法的时候，第一选择也是通过`key`去匹配，而这样会有什么好处呢？我们通过下面一个简单的例子来解答这个问题叭。

假设我们此时的新旧节点如下：

```html
<!--  old  -->
<div>
  <p>A</p>
  <p>B</p>
  <p>C</p>
</div>

<!--  new  -->
<div>
  <p>B</p>
  <p>C</p>
  <p>A</p>
</div>
```

在上面的例子，我们可以看出，`<p>A</p>`被移动到最后面去了。

但如果我们没有设置`key`值的话，通过`diff`需要操作`Dom`的次数会很多，因为当`key`为`undefined`的情况下，每个`p`标签其实都是相同节点，因此这是执行`diff`的话，它会将第一个`A`改成`B`，把第二个`B`改成`C`，把第三个`C`改成`A`，这时一共操作了三次`Dom`。

![diff9](/posts/vue-diff/diff9.gif)

但如果，我们分别给对应添加了`key`值，通过`diff`只需操作一次`Dom`，即将第一个节点移动到最后既可。

![diff10](/posts/vue-diff/diff10.gif)

