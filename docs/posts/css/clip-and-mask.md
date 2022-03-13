---
lang: zh-CN
title: CSS中的剪切和遮罩
description: CSS中的剪切和遮罩
date: 2022-03-13
---

# CSS中的剪切和遮罩

> [Github](https://github.com/OUDUIDUI/fe-study/tree/master/package/css/clipping-and-masking)

## 剪切和遮罩的区别

**剪切（Clipping）** 是针对路径的，而**遮罩（Masking）** 是针对图像的。

## clip-path

### inset

```css
.clip-path-1 {
  clip-path: inset(10px 20px 30px 40px);
}
```

`inset()`会绘成一个矩形路径，对对象进行剪切。

这四个值与margin、padding的顺序相同：

- 距元素顶部10px
- 距元素右侧20px
- 距元素底部30px
- 距元素左侧40px

> 有一点需要注意的，就是这里的参数是无需逗号隔离的

![inset](/images/docs/clipping-and-masking/1.png)

### circle

```css
.clip-path-2 {
  clip-path: circle(100px at center);
}
```

`circle()`会绘成一个圆形路径，对对象进行剪切。

参数一般为`半径 at 圆心`。`半径`支持具体长度或者百分比，而圆心可以写成坐标位置,如果是正中心的话可以写成`center`。

```css
clip-path: circle(100px at center);   /* 以对象中心作为圆心，绘制100px为半径的圆 */
clip-path: circle(50% at 100px 90px);   /* 以对象距左侧100px，距顶部90px作为圆心，绘制以对象对角线50%长度作为半径的圆 */
```

![circle](/images/docs/clipping-and-masking/2.png)

### ellipse

```css
.clip-path-3 {
  clip-path: circle(50% at 100px 90px);
}
```

`ellipse()`会绘成一个椭圆形路径，对对象进行剪切。

参数跟`circle()`雷同，为`半长轴 半短轴 at 圆心`。

![ellipse](/images/docs/clipping-and-masking/3.png)

### polygon

```css
.clip-path-5 {
  clip-path: polygon(5% 5%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%);
}
```

`polygon()`可以自定义标多个锚点，然后用直线按顺序将所有锚点连成一个闭环路径，并对对象进行剪切。

参数可以插入多个点坐标，坐标与坐标用`,`隔开，坐标可用百分比或具体长度。

![polygon](/images/docs/clipping-and-masking/4.png)

### 配合SVG定义的`<clipPath>`使用

`clip-path`可以不直接在`CSS`中定义剪切路径值，而是引用`SVG`定义的`<clipPath>`进行剪切。

```html
<img
  class="clip-path-6"
  src="./img/iso-republic-laptop-top-view.png"
  alt="demo-image"/>

<svg width="0" height="0">
  <defs>
    <clipPath id="myClip">
      <circle cx="200" cy="150" r="100"/>
      <circle cx="60" cy="100" r="70"/>
    </clipPath>
  </defs>
</svg>
```

```css
.clip-path-6 {
  clip-path: url(#myClip)
}
```

![SVG-clipPath](/images/docs/clipping-and-masking/5.png)

### 利用`clip-path`实现变形动画效果

![clip-path-animation](/images/docs/clipping-and-masking/6.gif)

#### 圆形缩放效果

```css
.clip-path-7 {
  clip-path: circle(0 at center);
  animation: circle-animation 2s infinite linear alternate;
}

@keyframes circle-animation {
  0% {
    clip-path: circle(0 at center);
  }

  100% {
    clip-path: circle(100% at center);
  }
}
```

#### 形状变换效果

这里需要注意的是，比如当你初始状态是由4个点绘成的形状，那么变换的形状也需要由4个点绘成的形状，否则的话它是直接变成下一个形状，而不是动画变化过去的。

```css
.clip-path-8 {
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  animation: deformation-animation 2s infinite linear alternate;
}

@keyframes deformation-animation {
  0% {
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  }

  50% {
    clip-path: polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%);
  }

  100% {
    clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);
  }
}
```

### 相关工具

有一个在线工具[Clippy](https://www.html.cn/tool/css-clip-path/)可以可视化地绘制路径并生成相关css代码。

## mask

`mask`可使用渐变作为蒙版。

```css
.mask-1 {
  -webkit-mask-image: -webkit-gradient(
     linear, left top, right bottom,
     color-stop(0.00, rgba(0, 0, 0, 1)),
     color-stop(0.35, rgba(0, 0, 0, 1)),
     color-stop(0.50, rgba(0, 0, 0, 0)),
     color-stop(0.65, rgba(0, 0, 0, 0)),
     color-stop(1.00, rgba(0, 0, 0, 0)));
}
```

![mask1](/images/docs/clipping-and-masking/7.png)

也可以使用`png`或`svg`图片作为蒙版。

```css
.mask-2 {
  -webkit-mask-image: url("../img/mask.svg"); /* 选择蒙版图片 */
  -webkit-mask-repeat: no-repeat; /* 蒙版图片是否重复 */
  -webkit-mask-position: center; /* 蒙版图片位置 */
  -webkit-mask-size: 200px 200px; /* 蒙版图片大小 */
}
```

![mask1](/images/docs/clipping-and-masking/8.png)

目前`mask`属性兼容性较差，大部分可以用前缀识别码实现，`IE`和`EDGE`浏览器不支持。

![兼容性](/images/docs/clipping-and-masking/9.png)


