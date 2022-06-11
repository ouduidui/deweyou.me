/* eslint-disable no-tabs */
import { describe, expect, it } from 'vitest'
import MarkdownIt from 'markdown-it'
import matter from 'gray-matter'

it('gray-matter', () => {
  expect(matter(`---
title: Test Post
description: This is a test post.
date: 2022-06-06T08:00:00.000+00:00
lang: zh
---

# H1
This is a paragraph.
  `)).toMatchInlineSnapshot(`
    {
      "content": "
    # H1
    This is a paragraph.
      ",
      "data": {
        "date": 2022-06-06T08:00:00.000Z,
        "description": "This is a test post.",
        "lang": "zh",
        "title": "Test Post",
      },
      "excerpt": "",
      "isEmpty": false,
    }
  `)
})

describe('MarkdownIt', () => {
  const mi = MarkdownIt({
    html: true,
    breaks: true,
    linkify: true,
  })

  it('header', () => {
    expect(mi.render('# h1')).toMatchInlineSnapshot(`
      "<h1>h1</h1>
      "
    `)
    expect(mi.render('## h2')).toMatchInlineSnapshot(`
      "<h2>h2</h2>
      "
    `)
    expect(mi.render('### h3')).toMatchInlineSnapshot(`
      "<h3>h3</h3>
      "
    `)
    expect(mi.render('#### h4')).toMatchInlineSnapshot(`
      "<h4>h4</h4>
      "
    `)
    expect(mi.render('##### h5')).toMatchInlineSnapshot(`
      "<h5>h5</h5>
      "
    `)
    expect(mi.render('###### h6')).toMatchInlineSnapshot(`
      "<h6>h6</h6>
      "
    `)
    expect(mi.render('text')).toMatchInlineSnapshot(`
      "<p>text</p>
      "
    `)
  })

  it('emphasis', () => {
    expect(mi.render('*This text will be italic* '))
      .toMatchInlineSnapshot(`
      "<p><em>This text will be italic</em></p>
      "
    `)
    expect(mi.render('_This will also be italic_'))
      .toMatchInlineSnapshot(`
        "<p><em>This will also be italic</em></p>
        "
      `)

    expect(mi.render('**This text will be bold**'))
      .toMatchInlineSnapshot(`
        "<p><strong>This text will be bold</strong></p>
        "
      `)

    expect(mi.render('__This will also be bold__'))
      .toMatchInlineSnapshot(`
        "<p><strong>This will also be bold</strong></p>
        "
      `)

    expect(mi.render('_You **can** combine them_'))
      .toMatchInlineSnapshot(`
        "<p><em>You <strong>can</strong> combine them</em></p>
        "
      `)
  })

  describe('lists', () => {
    it('unordered', () => {
      expect(mi.render(`
- Item 1
- Item 2
  - Item 2.1
  - Item 2.2
    - Item 2.2.1
- Item 3
    `))
        .toMatchInlineSnapshot(`
        "<ul>
        <li>Item 1</li>
        <li>Item 2
        <ul>
        <li>Item 2.1</li>
        <li>Item 2.2
        <ul>
        <li>Item 2.2.1</li>
        </ul>
        </li>
        </ul>
        </li>
        <li>Item 3</li>
        </ul>
        "
      `)

      expect(mi.render(`
* Item 1
* Item 2
  * Item 2.1
  * Item 2.2
    * Item 2.2.1
* Item 3
    `))
        .toMatchInlineSnapshot(`
        "<ul>
        <li>Item 1</li>
        <li>Item 2
        <ul>
        <li>Item 2.1</li>
        <li>Item 2.2
        <ul>
        <li>Item 2.2.1</li>
        </ul>
        </li>
        </ul>
        </li>
        <li>Item 3</li>
        </ul>
        "
      `)
    })

    it('ordered', () => {
      expect(mi.render(`
1. Item 1
2. Item 2
   1. Item 2.1
   2. Item 2.2
      1. Item 2.2.1
3. Item 3
      `)).toMatchInlineSnapshot(`
        "<ol>
        <li>Item 1</li>
        <li>Item 2
        <ol>
        <li>Item 2.1</li>
        <li>Item 2.2
        <ol>
        <li>Item 2.2.1</li>
        </ol>
        </li>
        </ol>
        </li>
        <li>Item 3</li>
        </ol>
        "
      `)
    })
  })

  it('link', () => {
    expect(mi.render('You may be using [Markdown Live Preview](https://markdownlivepreview.com/).'))
      .toMatchInlineSnapshot(`
      "<p>You may be using <a href=\\"https://markdownlivepreview.com/\\">Markdown Live Preview</a>.</p>
      "
    `)
  })

  it('blockquotes', () => {
    expect(mi.render(`
> Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
>
>> Markdown is often used to format readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.
    `)).toMatchInlineSnapshot(`
      "<blockquote>
      <p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.</p>
      <blockquote>
      <p>Markdown is often used to format readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
      </blockquote>
      </blockquote>
      "
    `)
  })

  it('table', () => {
    expect(mi.render(`
| Left columns  | Right columns |
| ------------- |:-------------:|
| left foo      | right foo     |
| left bar      | right bar     |
| left baz      | right baz     |
    `)).toMatchInlineSnapshot(`
      "<table>
      <thead>
      <tr>
      <th>Left columns</th>
      <th style=\\"text-align:center\\">Right columns</th>
      </tr>
      </thead>
      <tbody>
      <tr>
      <td>left foo</td>
      <td style=\\"text-align:center\\">right foo</td>
      </tr>
      <tr>
      <td>left bar</td>
      <td style=\\"text-align:center\\">right bar</td>
      </tr>
      <tr>
      <td>left baz</td>
      <td style=\\"text-align:center\\">right baz</td>
      </tr>
      </tbody>
      </table>
      "
    `)
  })

  describe('code', () => {
    it('blocks', () => {
      expect(mi.render(`
\`\`\`bash
#!/bin/bash
echo "HelloWorld"
\`\`\`
      `)).toMatchInlineSnapshot(`
        "<pre><code class=\\"language-bash\\">#!/bin/bash
        echo &quot;HelloWorld&quot;
        </code></pre>
        "
      `)

      expect(mi.render(`
\`\`\`ts
// TypeScript
const message = 'Hello world'
alert(message)
\`\`\`
      `)).toMatchInlineSnapshot(`
        "<pre><code class=\\"language-ts\\">// TypeScript
        const message = 'Hello world'
        alert(message)
        </code></pre>
        "
      `)

      expect(mi.render(`
\`\`\`py
# python
message = 'Hello world'
print(message)
\`\`\`
      `)).toMatchInlineSnapshot(`
        "<pre><code class=\\"language-py\\"># python
        message = 'Hello world'
        print(message)
        </code></pre>
        "
      `)

      expect(mi.render(`
\`\`\`html
<html>
	<!--  HTML  -->
	<div>HelloWorld<div>
</html>
\`\`\`
      `)).toMatchInlineSnapshot(`
        "<pre><code class=\\"language-html\\">&lt;html&gt;
        	&lt;!--  HTML  --&gt;
        	&lt;div&gt;HelloWorld&lt;div&gt;
        &lt;/html&gt;
        </code></pre>
        "
      `)

      expect(mi.render(`
\`\`\`vue
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
\`\`\`
      `)).toMatchInlineSnapshot(`
        "<pre><code class=\\"language-vue\\">&lt;script lang=&quot;ts&quot; setup&gt;
        	// Vue script
        	const msg = &quot;HelloWorld&quot;
        &lt;/template&gt;

        &lt;template&gt;
        	&lt;div class=&quot;test&quot;&gt;{{msg}}&lt;div&gt;
        &lt;/template&gt;

        &lt;style lang=&quot;scss&quot;&gt;
        .test {
        	color: red; /* scss */
        }
        &lt;/style&gt;
        </code></pre>
        "
      `)
    })

    it('inline', () => {
      expect(mi.render('This web site is using `markedjs/marked`.'))
        .toMatchInlineSnapshot(`
        "<p>This web site is using <code>markedjs/marked</code>.</p>
        "
      `)
    })
  })

  it('image', () => {
    expect(mi.render('![蜡笔小新](https://p1.itc.cn/images01/20200611/b355f238a324427d956161b3a0d02d44.jpeg)'))
      .toMatchInlineSnapshot(`
        "<p><img src=\\"https://p1.itc.cn/images01/20200611/b355f238a324427d956161b3a0d02d44.jpeg\\" alt=\\"蜡笔小新\\"></p>
        "
      `)

    expect(mi.render('<img width="100px" src="https://p1.itc.cn/images01/20200611/b355f238a324427d956161b3a0d02d44.jpeg" alt="蜡笔小新">'))
      .toMatchInlineSnapshot('"<img width=\\"100px\\" src=\\"https://p1.itc.cn/images01/20200611/b355f238a324427d956161b3a0d02d44.jpeg\\" alt=\\"蜡笔小新\\">"')
  })
})
