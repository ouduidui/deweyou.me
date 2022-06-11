// https://prismjs.com/
import { describe, expect, it } from 'vitest'
import Prism from 'prismjs'

import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-scss'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-python'

describe('prismjs', () => {
  it('js', () => {
    const code = `
    // test comment
    const msg = \'Hello World\'; 
    console.log(msg);
    `
    expect(Prism.highlight(code, Prism.languages.javascript, 'javascript'))
      .toMatchInlineSnapshot(`
        "
            <span class=\\"token comment\\">// test comment</span>
            <span class=\\"token keyword\\">const</span> msg <span class=\\"token operator\\">=</span> <span class=\\"token string\\">'Hello World'</span><span class=\\"token punctuation\\">;</span> 
            console<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">log</span><span class=\\"token punctuation\\">(</span>msg<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>
            "
      `)
  })

  it('ts', () => {
    const code = `
    // test comment
    type MsgType = string; 
    const msg:MsgType = \'Hello World\'; 
    console.log(msg);
    `
    expect(Prism.highlight(code, Prism.languages.ts, 'typescript'))
      .toMatchInlineSnapshot(`
        "
            <span class=\\"token comment\\">// test comment</span>
            <span class=\\"token keyword\\">type</span> <span class=\\"token class-name\\">MsgType</span> <span class=\\"token operator\\">=</span> <span class=\\"token builtin\\">string</span><span class=\\"token punctuation\\">;</span> 
            <span class=\\"token keyword\\">const</span> msg<span class=\\"token operator\\">:</span>MsgType <span class=\\"token operator\\">=</span> <span class=\\"token string\\">'Hello World'</span><span class=\\"token punctuation\\">;</span> 
            <span class=\\"token builtin\\">console</span><span class=\\"token punctuation\\">.</span><span class=\\"token function\\">log</span><span class=\\"token punctuation\\">(</span>msg<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>
            "
      `)
  })

  it('html', () => {
    const code = `
    <!-- test comment -->
    <div class="pages" id="app">
      <h1 style="color: red">Hello World</h1>
    </div>
    `
    expect(Prism.highlight(code, Prism.languages.html, 'html'))
      .toMatchInlineSnapshot(`
        "
            <span class=\\"token comment\\">&lt;!-- test comment --></span>
            <span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;</span>div</span> <span class=\\"token attr-name\\">class</span><span class=\\"token attr-value\\"><span class=\\"token punctuation attr-equals\\">=</span><span class=\\"token punctuation\\">\\"</span>pages<span class=\\"token punctuation\\">\\"</span></span> <span class=\\"token attr-name\\">id</span><span class=\\"token attr-value\\"><span class=\\"token punctuation attr-equals\\">=</span><span class=\\"token punctuation\\">\\"</span>app<span class=\\"token punctuation\\">\\"</span></span><span class=\\"token punctuation\\">></span></span>
              <span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;</span>h1</span> <span class=\\"token special-attr\\"><span class=\\"token attr-name\\">style</span><span class=\\"token attr-value\\"><span class=\\"token punctuation attr-equals\\">=</span><span class=\\"token punctuation\\">\\"</span><span class=\\"token value css language-css\\"><span class=\\"token property\\">color</span><span class=\\"token punctuation\\">:</span> red</span><span class=\\"token punctuation\\">\\"</span></span></span><span class=\\"token punctuation\\">></span></span>Hello World<span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;/</span>h1</span><span class=\\"token punctuation\\">></span></span>
            <span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;/</span>div</span><span class=\\"token punctuation\\">></span></span>
            "
      `)
  })

  it('css', () => {
    const code = `
    /* test comment */
    .pages div:after {
      color: var(--color-red);
      border: flex;
      height: calc(100vh - 100px);
    }
    `
    expect(Prism.highlight(code, Prism.languages.css, 'css'))
      .toMatchInlineSnapshot(`
        "
            <span class=\\"token comment\\">/* test comment */</span>
            <span class=\\"token selector\\">.pages div:after</span> <span class=\\"token punctuation\\">{</span>
              <span class=\\"token property\\">color</span><span class=\\"token punctuation\\">:</span> <span class=\\"token function\\">var</span><span class=\\"token punctuation\\">(</span>--color-red<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>
              <span class=\\"token property\\">border</span><span class=\\"token punctuation\\">:</span> flex<span class=\\"token punctuation\\">;</span>
              <span class=\\"token property\\">height</span><span class=\\"token punctuation\\">:</span> <span class=\\"token function\\">calc</span><span class=\\"token punctuation\\">(</span>100vh - 100px<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>
            <span class=\\"token punctuation\\">}</span>
            "
      `)
  })

  it('scss', () => {
    const code = `
    /* test comment */
    .pages {
      border: flex;

      div:after {
        color: $color-red;
        border: calc(100vh - #{$padding}px);
      }
    }
    `
    expect(Prism.highlight(code, Prism.languages.scss, 'scss'))
      .toMatchInlineSnapshot(`
        "
            <span class=\\"token comment\\">/* test comment */</span>
            <span class=\\"token selector\\">.pages </span><span class=\\"token punctuation\\">{</span>
              <span class=\\"token property\\">border</span><span class=\\"token punctuation\\">:</span> flex<span class=\\"token punctuation\\">;</span>

              <span class=\\"token selector\\">div:after </span><span class=\\"token punctuation\\">{</span>
                <span class=\\"token property\\">color</span><span class=\\"token punctuation\\">:</span> <span class=\\"token variable\\">$color-red</span><span class=\\"token punctuation\\">;</span>
                <span class=\\"token property\\">border</span><span class=\\"token punctuation\\">:</span> <span class=\\"token function\\">calc</span><span class=\\"token punctuation\\">(</span>100vh <span class=\\"token operator\\">-</span> <span class=\\"token variable\\">#{$padding}</span>px<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>
              <span class=\\"token punctuation\\">}</span>
            <span class=\\"token punctuation\\">}</span>
            "
      `)
  })

  it('bash', () => {
    const code = `
    # test comment
    echo "Hello World"
    cd ../
    git add .
    git commit -m "test"
    `

    expect(Prism.highlight(code, Prism.languages.bash, 'bash'))
      .toMatchInlineSnapshot(`
        "
            <span class=\\"token comment\\"># test comment</span>
            <span class=\\"token builtin class-name\\">echo</span> <span class=\\"token string\\">\\"Hello World\\"</span>
            <span class=\\"token builtin class-name\\">cd</span> <span class=\\"token punctuation\\">..</span>/
            <span class=\\"token function\\">git</span> <span class=\\"token function\\">add</span> <span class=\\"token builtin class-name\\">.</span>
            <span class=\\"token function\\">git</span> commit -m <span class=\\"token string\\">\\"test\\"</span>
            "
      `)
  })

  it('json', () => {
    const code = `{
      "name": "test",
      "age": 11,
      "hobbies": ["a", "b", "c"]
      "info": {
        "name": "test",
        "age": 11
      }
    }`

    expect(Prism.highlight(code, Prism.languages.bash, 'bash'))
      .toMatchInlineSnapshot(`
        "<span class=\\"token punctuation\\">{</span>
              <span class=\\"token string\\">\\"name\\"</span><span class=\\"token builtin class-name\\">:</span> <span class=\\"token string\\">\\"test\\"</span>,
              <span class=\\"token string\\">\\"age\\"</span><span class=\\"token builtin class-name\\">:</span> <span class=\\"token number\\">11</span>,
              <span class=\\"token string\\">\\"hobbies\\"</span><span class=\\"token builtin class-name\\">:</span> <span class=\\"token punctuation\\">[</span><span class=\\"token string\\">\\"a\\"</span>, <span class=\\"token string\\">\\"b\\"</span>, <span class=\\"token string\\">\\"c\\"</span><span class=\\"token punctuation\\">]</span>
              <span class=\\"token string\\">\\"info\\"</span><span class=\\"token builtin class-name\\">:</span> <span class=\\"token punctuation\\">{</span>
                <span class=\\"token string\\">\\"name\\"</span><span class=\\"token builtin class-name\\">:</span> <span class=\\"token string\\">\\"test\\"</span>,
                <span class=\\"token string\\">\\"age\\"</span><span class=\\"token builtin class-name\\">:</span> <span class=\\"token number\\">11</span>
              <span class=\\"token punctuation\\">}</span>
            <span class=\\"token punctuation\\">}</span>"
      `)
  })

  it('jsx', () => {
    const code = `
    import { useState } from 'react'

    const App = () => {
      const [count, setCount] = useState(0)
      return (
        <>
          <p onClick={() => setCount(count + 1)}>You clicked {count} times</p>
        </>
      )
    }
    `

    expect(Prism.highlight(code, Prism.languages.jsx, 'jsx'))
      .toMatchInlineSnapshot(`
        "
            <span class=\\"token keyword\\">import</span> <span class=\\"token punctuation\\">{</span> useState <span class=\\"token punctuation\\">}</span> <span class=\\"token keyword\\">from</span> <span class=\\"token string\\">'react'</span>

            <span class=\\"token keyword\\">const</span> <span class=\\"token function-variable function\\">App</span> <span class=\\"token operator\\">=</span> <span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span> <span class=\\"token operator\\">=></span> <span class=\\"token punctuation\\">{</span>
              <span class=\\"token keyword\\">const</span> <span class=\\"token punctuation\\">[</span>count<span class=\\"token punctuation\\">,</span> setCount<span class=\\"token punctuation\\">]</span> <span class=\\"token operator\\">=</span> <span class=\\"token function\\">useState</span><span class=\\"token punctuation\\">(</span><span class=\\"token number\\">0</span><span class=\\"token punctuation\\">)</span>
              <span class=\\"token keyword\\">return</span> <span class=\\"token punctuation\\">(</span>
                <span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;</span></span><span class=\\"token punctuation\\">></span></span><span class=\\"token plain-text\\">
                  </span><span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;</span>p</span> <span class=\\"token attr-name\\">onClick</span><span class=\\"token script language-javascript\\"><span class=\\"token script-punctuation punctuation\\">=</span><span class=\\"token punctuation\\">{</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span> <span class=\\"token operator\\">=></span> <span class=\\"token function\\">setCount</span><span class=\\"token punctuation\\">(</span>count <span class=\\"token operator\\">+</span> <span class=\\"token number\\">1</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">}</span></span><span class=\\"token punctuation\\">></span></span><span class=\\"token plain-text\\">You clicked </span><span class=\\"token punctuation\\">{</span>count<span class=\\"token punctuation\\">}</span><span class=\\"token plain-text\\"> times</span><span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;/</span>p</span><span class=\\"token punctuation\\">></span></span><span class=\\"token plain-text\\">
                </span><span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;/</span></span><span class=\\"token punctuation\\">></span></span>
              <span class=\\"token punctuation\\">)</span>
            <span class=\\"token punctuation\\">}</span>
            "
      `)
  })

  it('tsx', () => {
    const code = `
    import { useState } from 'react'

    const App = () => {
      const [count, setCount] = useState<number>(0)
      return (
        <>
          <p onClick={() => setCount(count + 1)}>You clicked {count} times</p>
        </>
      )
    }
    `

    expect(Prism.highlight(code, Prism.languages.tsx, 'tsx'))
      .toMatchInlineSnapshot(`
        "
            <span class=\\"token keyword\\">import</span> <span class=\\"token punctuation\\">{</span> useState <span class=\\"token punctuation\\">}</span> <span class=\\"token keyword\\">from</span> <span class=\\"token string\\">'react'</span>

            <span class=\\"token keyword\\">const</span> <span class=\\"token function-variable function\\">App</span> <span class=\\"token operator\\">=</span> <span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span> <span class=\\"token operator\\">=></span> <span class=\\"token punctuation\\">{</span>
              <span class=\\"token keyword\\">const</span> <span class=\\"token punctuation\\">[</span>count<span class=\\"token punctuation\\">,</span> setCount<span class=\\"token punctuation\\">]</span> <span class=\\"token operator\\">=</span> <span class=\\"token generic-function\\"><span class=\\"token function\\">useState</span><span class=\\"token generic class-name\\"><span class=\\"token operator\\">&lt;</span><span class=\\"token builtin\\">number</span><span class=\\"token operator\\">></span></span></span><span class=\\"token punctuation\\">(</span><span class=\\"token number\\">0</span><span class=\\"token punctuation\\">)</span>
              <span class=\\"token keyword\\">return</span> <span class=\\"token punctuation\\">(</span>
                <span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;</span></span><span class=\\"token punctuation\\">></span></span><span class=\\"token plain-text\\">
                  </span><span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;</span>p</span> <span class=\\"token attr-name\\">onClick</span><span class=\\"token script language-javascript\\"><span class=\\"token script-punctuation punctuation\\">=</span><span class=\\"token punctuation\\">{</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span> <span class=\\"token operator\\">=></span> <span class=\\"token function\\">setCount</span><span class=\\"token punctuation\\">(</span>count <span class=\\"token operator\\">+</span> <span class=\\"token number\\">1</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">}</span></span><span class=\\"token punctuation\\">></span></span><span class=\\"token plain-text\\">You clicked </span><span class=\\"token punctuation\\">{</span>count<span class=\\"token punctuation\\">}</span><span class=\\"token plain-text\\"> times</span><span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;/</span>p</span><span class=\\"token punctuation\\">></span></span><span class=\\"token plain-text\\">
                </span><span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;/</span></span><span class=\\"token punctuation\\">></span></span>
              <span class=\\"token punctuation\\">)</span>
            <span class=\\"token punctuation\\">}</span>
            "
      `)
  })

  it('python', () => {
    const code = `
    # test comment
    message = 'hello world'
    print(message)
    `
    expect(Prism.highlight(code, Prism.languages.python, 'python'))
      .toMatchInlineSnapshot(`
        "
            <span class=\\"token comment\\"># test comment</span>
            message <span class=\\"token operator\\">=</span> <span class=\\"token string\\">'hello world'</span>
            <span class=\\"token keyword\\">print</span><span class=\\"token punctuation\\">(</span>message<span class=\\"token punctuation\\">)</span>
            "
      `)
  })
})
