---
title: CSS - 水平居中和垂直居中
description: CSS - 水平居中和垂直居中
date: 2022-01-10T08:00:00.000+00:00
author: Dewey Ou
---

[[toc]]

## 水平居中

### 行内元素

如果是行内元素进行水平居中的话，只需要给其父元素设置`text-align: center`即可实现。

```html
<div class="center">HelloWorld</div>
```

```css
.center {
    text-align: center;
    width: 100vw;
}
```

![demo1](/posts/css-center/demo1.png)

### 块级元素

如果是块级元素，给该元素设置`margin: 0 auto`即可。

```html
<div class="center"></div>
```

```css
.center {
  margin: 0 auto;
  width: 100px;
  height: 100px;
  border: 1px solid #222;
}
```

如果你的块级元素没有设置宽度的话，可以使用`display: table`来实现。

```css
.center {
  margin: 0 auto;
  display: table;
}
```

![demo2](/posts/css-center/demo2.png)

### 浮动元素

如果子元素包含float浮动属性，为了让子元素居中，则可以让父元素宽度设置为`fit-content`，并配合`margin`。

```html
<div class="center">
  <div class="float"></div>
  <div class="float"></div>
</div>
```

```css
.center {
  width: -moz-fit-content;
  width: -webkit-fit-content;
  width: fit-content;
  margin: 0 auto;
}

.float {
  float: left;
  width: 100px;
  height: 100px;
  border: 1px solid #222;
}
```

![demo3](/posts/css-center/demo3.png)

> fit-content：取以下两种值中的较大值
>
> - 固有的最小宽度
>
> - 固有首选宽度（max-content）和可用宽度（available）两者中的较小值
>
> fit-content目前不兼容IE

### flex布局

我们可以使用flex弹性布局，轻松实现水平居中，不管子元素是行内元素还是块级元素，只需要在父元素设置`display: flex; justify-content: center;`即可。

```html
<div class="center">
  <div>HelloWorld</div>
</div>
<div class="center">
  <span>HelloWorld</span>
</div>
<div class="center">HelloWorld</div>
```

```css
.center {
  display: flex;
  justify-content: center;
}
```

![demo4](/posts/css-center/demo4.png)

### 绝对定位

我们可以对元素进行绝对定位进行水平居中布局。同时我们可以分别配合`transform`、`margin-left`。

#### transform

```html
<div class="center">HelloWorld</div>
```

```css
.center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
```
![demo5](/posts/css-center/demo5.png)

#### margin-left

该方案适用于已知容器宽度，然后通过`margin-left`向左移动一半宽度实现。

```html
<div class="center"></div>
```

```css
:root {
  --box-width: 100px;
}
.center {
  position: absolute;
  left: 50%;
  margin-left: calc(-1 * var(--box-width) / 2);
  width: var(--box-width);
  height: 60px;
  border: 1px solid #222;
}
```

![demo6](/posts/css-center/demo6.png)

## 垂直居中

### 单行文本

如果元素是单行文本，我们只需要设置`line-height`为父元素高度即可。

```html
<div class="page">
  <span class="center">HelloWorld</span>
</div>
```

```css
.page {
  height: 300px;
  border: 1px solid #222;
}

.center {
  line-height: 300px;
}
```

![demo7](/posts/css-center/demo7.png)

### 行内块级元素

如果元素是行内块级元素, 基本思想是使用`display: inline-block`, `vertical-align: middle`和一个伪元素让内容块处于容器中央。

```html
<div class="page">
  <span class="center"></span>
</div>
```

```css
.page {
  height: 300px;
  border: 1px solid #222;
}

.center {
  display: inline-block;
  vertical-align: middle;
  width: 80px;
  height: 20px;
  background: #D66852;
}

.page::after, .center {
  display: inline-block;
  vertical-align: middle;
}

.page::after {
  content: '';
  height: 100%;
}
```

![demo8](/posts/css-center/demo8.png)

### flex布局

我们可以使用flex弹性布局，轻松实现水平居中，不管子元素是行内元素还是块级元素，只需要在父元素设置`display: flex; align-items: center;`即可。

```html
<div class="center">
  <div>HelloWorld</div>
</div>
```

```css
.center {
  display: flex;
  align-items: center;
  height: 300px;
  border: 1px solid #222;
}
```

![demo9](/posts/css-center/demo9.png)

### 绝对定位

我们可以对元素进行绝对定位进行水平居中布局。同时我们可以分别配合`transform`、`margin-top`。

#### transform

```html
<div class="center">HelloWorld</div>
```

```css
.center {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
```

![demo10](/posts/css-center/demo10.png)

#### margin-top

该方案适用于已知容器高度，然后通过`margin-top`向上移动一半高度实现。

```html
<div class="center"></div>
```

```css
:root {
  --box-height: 60px;
}
.center {
  position: absolute;
  top: 50%;
  margin-top: calc(-1 * var(--box-height) / 2);
  height: var(--box-height);
  width: 100px;
  border: 1px solid #222;
}
```

![demo11](/posts/css-center/demo11.png)
