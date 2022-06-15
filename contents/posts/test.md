---
title: Markdown syntax guide 你好，世界
description: This is a test post.
author: Dewey Ou
date: 2022-06-06T08:00:00.000+00:00
---

[[toc]]

# Headers

# This is a Heading h1
## This is a Heading h2 
### This is a Heading h3
#### This is a Heading h4

This is a paragraph.

你好，世界。

# Emphasis

*This text will be italic*  
_This will also be italic_

**This text will be bold**  
__This will also be bold__

_You **can** combine them_

# Lists

## Unordered

* Item 1
* Item 2
  * Item 2a
  * Item 2b

## Ordered

1. Item 1
2. Item 2
3. Item 3
   1. Item 3a
   2. Item 3b

# Links

You may be using [Markdown Live Preview](https://markdownlivepreview.com/).

# Blockquotes

> Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
>
>> Markdown is often used to format readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.

# Tables

| Left columns  | Right columns |
| ------------- |:-------------:|
| left foo      | right foo     |
| left bar      | right bar     |
| left baz      | right baz     |

# Blocks of code

```bash
#!/bin/bash
echo "HelloWorld"
```

```ts
// TypeScript
const message = 'Hello world'
alert(message)
```

```python
# python
message = 'Hello world'
print(message)
```

```html
<html>
	<!--  HTML  -->
	<div>HelloWorld<div>
</html>
```

```vue
<script lang="ts" setup>
	// Vue script
	const msg = "HelloWorld"
</template>

<template>
	<div class="test">{{msg}}<div>
</template>

<style lang="scss">
.test {
	color: red; /* scss */
}
</style>
```

# Inline code

This web site is using `markedjs/marked`.


# Images

![蜡笔小新](https://p1.itc.cn/images01/20200611/b355f238a324427d956161b3a0d02d44.jpeg)

<img width="100px" src="https://p1.itc.cn/images01/20200611/b355f238a324427d956161b3a0d02d44.jpeg" alt="蜡笔小新">