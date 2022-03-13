---
lang: zh-CN
title: CSS中的层叠上下文
description: 深入学习CSS中的层叠上下文
date: 2022-01-10
sidebar: auto
---

# CSS中的层叠上下文

## 什么是层叠上下文

我们假定用户正面向（浏览器）视窗或网页，而 HTML 元素沿着其相对于用户的一条虚构的 z 轴排开，**层叠上下文（stacking context）** 就是对这些 HTML 元素的一个三维构想。众 HTML 元素基于其元素属性按照优先级顺序占据这个空间。

![stack-context-1](/images/docs/stacking-context/stack-context-1.png)

如果一个元素含有层叠上下文，这时候也就说明它是一个层叠上下文的元素，那我们可以理解这个元素在z轴上会高人一等，也就是它会比普通元素距离屏幕观察者更近了。

## 什么是层叠水平

**层叠水平（stacking level）**，在同一个层叠上下文中，它描述定义的是该层叠上下文中的元素在z轴上的显示顺序；而在其他普通元素中，它描述的的是这些普通元素在z轴上的显示顺序。

- 普通元素的层叠等级优先由其所在的层叠上下文决定

- **层叠等级的比较只有在当前层叠上下文元素中才有意义**，而不同层叠上下文中比较层叠等级是没有意义的

## 什么是层叠顺序

**层叠顺序（stacking order）** 表示元素发生层叠时候有着特定的垂直显示顺序。

> 层叠上下文和层叠水平是概念，而层叠顺序是规则。

在CSS2.1时代，**即CSS3还没出现的时候**，层叠顺序规则遵循下面这张图：

![stack-context-2](/images/docs/stacking-context/stack-context-2.jpg)

- 位于最低水平的`border`和`background`指的是层叠上下文元素的边框和背景，每一个层叠顺序规则适用于一个完整的层叠上下文

- 单纯从层叠水平来看，`z-index: auto`和`z-index: 0`可以看成一样的，实际上两者在层叠上下文领域有着根本性的差异



上面的这些层叠顺序规则其实属于旧时代的，如果把CSS3加入讨论的话，那就不一样了。



## 层叠准则

当元素发生层叠的时候，其覆盖关系遵循下面2个准则：

- **谁大谁上**

  - 当具有明细的层叠水平标示的时候，比如`z-index`，在同一层叠上下文中，层叠水平大的会覆盖小的

- **后来居上**

  - 当元素的层叠水平一致、层叠顺序相同的时候，在DOM流中处于后面的元素会覆盖前面的元素

## 层叠上下文的特性

- 层叠上下文的层叠水平要比普通元素高

- 层叠上下文可以阻断元素的混合模式

- 层叠上下文可以嵌套，内部层叠上下文以其所有子元素均受制外部的层叠上下文

- 每个层叠上下文和兄弟元素独立，也就是当进行层叠变化或渲染的时候，只需要考虑后代元素

- 每个层叠上下文是自成体系的，当元素发生层叠的时候，整个元素被认为是在父层叠上下文的层叠顺序中

## 如何产生层叠上下文

> [层叠上下文 - CSS（层叠样式表） | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context#%E5%B1%82%E5%8F%A0%E4%B8%8A%E4%B8%8B%E6%96%87)

层叠上下文基本上是由一些特定的CSS属性创建的：

- HTML的根元素`<html></html>`本身就具有层叠上下文，称为**根层叠上下文**

- 普通元素设置`position`为`absolute`（绝对定位）或 `relative`（相对定位）的时候，并设置`z-index`属性不为`auto`时，会产生层叠上下文

- 普通元素设置`position`为 `fixed`（固定定位）或 `sticky`（粘滞定位）的时候，会产生层叠上下文

- flex容器的子元素，且`z-index`属性不为`auto`时，会产生层叠上下文

- grid容器的子元素，且`z-index`属性不为`auto`时，会产生层叠上下文

- `opacity`属性值小于1的元素，会产生层叠上下文

- `mix-blend-mode`属性值不为`normal`的元素，会产生层叠上下文

- 以下任意属性不为`none`的元素，会产生层叠上下文：

  - `transform`

  - `filter`

  - `persective`

  - `clip-path`

  - `mask`、`mask-image`、`mask-border`

- `isolation`属性值为`isolate`的元素

- `-webkit-overflow-scrolling`属性值为`touch`的元素

- `will-change`值设定了任意属性而该属性在任何非初始值会创建层叠上下文的元素，会产生层叠上下文

- `contain`属性值为`layout`、`paint`或包含它们其中之一的合成值（比如`contain: strict`、`contain: content`）的元素



### 根层叠上下文

HTML的根元素`<html></html>`本身就是一个层叠上下文，这也就是为什么绝对定位元素在`left`、`top`等定位的时候，如果没有其他祖先级元素限制下，会相对浏览器窗口定位的原因。

### 定位元素

对于定位元素，如果为 `fixed`（固定定位）或 `sticky`（粘滞定位）的时候，就会产生层叠上下文；而如果是`absolute`（绝对定位）或 `relative`（相对定位）的时候，需要同时`z-index`不为`auto`的前提下，才会产生层叠上下文。



我们可以来看一个例子。

```html
<div style="position:relative; z-index:auto;">
  <div style="position:absolute; z-index:2;" class="box-1">BOX-1</div>
</div>
<div style="position:relative; z-index:auto;">
  <div style="position:relative; z-index:1;" class="box-2">BOX-2</div>
</div>
```

![](/images/docs/stacking-context/stack-context-3.png)

如果我们将`z-index: auto`改成`z-index: 0`试试看。

```html
<div style="position:relative; z-index:0;">
  <div style="position:absolute; z-index:2;" class="box-1">BOX-1</div>
</div>
<div style="position:relative; z-index:0;">
  <div style="position:relative; z-index:1;" class="box-2">BOX-2</div>
</div>
```

![](/images/docs/stacking-context/stack-context-4.png)

这时候`BOX-1`就会变成在上面一层了。



这两者的差别就在`z-index: 0`所在的`div`元素为层叠上下文元素，而`z-index: auto`所在的`div`元素为普通元素。

而第一个例子中，外层两个`div`均为普通元素，因此里面两个box均不受父级的影响，而直接套用了**层叠准则——谁大谁上**。这里两者有不一样的`z-index`，因此`BOX-1`的`z-index`比较大，所以就在上面。

而第二个例子中，外层两个`div`就变成了层叠上下文，此时的层叠规则就发了变化。在层叠上下文特性中有一条是——**自成体系**。因此两个box的层叠顺序比较变成了优先比较其父级层叠上下文的层叠顺序。而由于两者都是`z-index: 0`，层叠顺序两者一致，因此就遵守层叠准则的第二条——**后来居上**，根据DOM流中的位置决定谁在上面，于是，位于后面的`BOX-2`也就在上面了。



这就是为什么很多时候，我们在实现页面的时候，会发现写了很多`z-index`，但呈现效果不是我们想要的。大多数就是因为这个原因。



### Flex Box

在flex容器的子元素，且`z-index`属性不为`auto`时，会产生层叠上下文。



我们也通过一个示例来试一下：

```html
<div>
  <div style="background: #D66852; z-index: 1">
    <img src="../assets/demo.jpg" 
         style="width: 200px; z-index: -1; position: relative">
  </div>
</div>
```

![](/images/docs/stacking-context/stack-context-5.png)

这时候图片会在背景下面了。

但如果我们将最外层`div`变成Flex容器：

```html
<div style="display: flex">
  <div style="background: #D66852; z-index: 1">
    <img src="../assets/demo.jpg"
         style="width: 200px; z-index: -1; position: relative">
  </div>
</div>
```

![](/images/docs/stacking-context/stack-context-6.png)

这时候图片就会显示出来了。而这个其实在层叠顺序那张图就可以找到答案，负的`z-index`在`background`上面。

![stack-context-2](/images/docs/stacking-context/stack-context-2.jpg)

因为在Flex容器中的`div`设置了`z-index: 1`，因此该元素便产生层叠上下文（并不是Flex容器产生层叠上下文）。



同时，Grid容器也是同理，就不多说了。



### opacity

`opacity`属性值小于1的元素，会产生层叠上下文。



```html
<div style="width:100px; background: #D66852;">
  <img src="../assets/demo.jpg"
       style="width: 200px; z-index: -1; position: relative">
</div>
```

![](/images/docs/stacking-context/stack-context-7.png)

此时的图片会覆盖在背景下面。

然后我们再给`div`添加上透明度。

```html
<div style="width:100px; background: #D66852; opacity: 0.5;">
  <img src="../assets/demo.jpg"
       style="width: 200px; z-index: -1; position: relative">
</div>
```

![](/images/docs/stacking-context/stack-context-8.png)

这时候图片就会跑上来了。

这是因为设置了`opacity`的元素具有层叠上下文，因此嵌套的元素中的`z-index:-1`无法穿透，只能显示在上面。

### 其它

其它其实都是相同的原理，我们就简单看一下效果：

#### transform

```html
<div style="width:100px; background: #D66852;">
  <img src="../assets/demo.jpg"
       style="width: 200px; z-index: -1; position: relative">
</div>

<div style="width:100px; background: #D66852; transform: rotate(15deg);">
  <img src="../assets/demo.jpg"
       style="width: 200px; z-index: -1; position: relative">
</div>
```

![](/images/docs/stacking-context/stack-context-9.png)

#### filter

```html
<div style="width:100px; background: #D66852;">
  <img src="../assets/demo.jpg"
       style="width: 200px; z-index: -1; position: relative">
</div>

<div style="width:100px; background: #D66852; filter: blur(5px);">
  <img src="../assets/demo.jpg"
       style="width: 200px; z-index: -1; position: relative">
</div>
```

![](/images/docs/stacking-context/stack-context-10.png)

#### mix-blend-mode

> [mix-blend-mode - CSS（层叠样式表） | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/mix-blend-mode)

```html
<div style="width:100px; background: #D66852;">
  <img src="../assets/demo.jpg"
       style="width: 200px; z-index: -1; position: relative">
</div>
<div style="width:100px; background: #D66852; mix-blend-mode: darken;">
  <img src="../assets/demo.jpg"
       style="width: 200px; z-index: -1; position: relative">
</div>
```

![](/images/docs/stacking-context/stack-context-11.png)

#### will-change

```html
<div style="width:100px; background: #D66852;">
  <img src="../assets/demo.jpg"
       style="width: 200px; z-index: -1; position: relative">
</div>

<div style="width:100px; background: #D66852; will-change: transform">
  <img src="../assets/demo.jpg"
       style="width: 200px; z-index: -1; position: relative">
</div>
```

![](/images/docs/stacking-context/stack-context-12.png)

#### isolation

该属性就是纯粹用来创建新的层叠上下文的，详情可以看：[isolation - CSS（层叠样式表） | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/isolation)。

```html
<div style="width:100px; background: #D66852;">
  <img src="../assets/demo.jpg"
       style="width: 200px; z-index: -1; position: relative">
</div>

<div style="width:100px; background: #D66852; isolation:isolate;">
  <img src="../assets/demo.jpg"
       style="width: 200px; z-index: -1; position: relative">
</div>
```

![](/images/docs/stacking-context/stack-context-13.png)

## 层叠上下文与层叠关系

通过上面的案例可以发现，一旦普通元素具有了层叠上下文，其层叠关系就会变高。那它的层叠顺序究竟在哪个位置呢？

这里需要分两种情况讨论：

- 如果层叠上下文元素不依赖`z-index`数值的话，则其层叠关系顺序可以看成`z-index: 0`级别

- 如果层叠上下文依赖`z-index`数值的话，则其层叠顺序由`z-index`值决定



因此我们可以更新一下层叠顺序图：

![](/images/docs/stacking-context/stack-context-14.jpg)

### 定位元素和普通元素

读到这里，基本就可以知道为什么定位元素会层叠在普通元素之上了。

原因就在于元素一旦成为定位元素，其`z-index`就会自动生效，默认为`auto`，因此根据上面的顺序图，它是会覆盖普通元素的。



> 参考文献：[深入理解CSS中的层叠上下文和层叠顺序](https://www.zhangxinxu.com/wordpress/2016/01/understand-css-stacking-context-order-z-index/)、[层叠上下文 - CSS（层叠样式表） | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context#%E5%B1%82%E5%8F%A0%E4%B8%8A%E4%B8%8B%E6%96%87)
