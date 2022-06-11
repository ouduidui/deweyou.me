/* eslint-disable no-tabs */
import { describe, expect, it } from 'vitest'
import MarkdownIt from 'markdown-it'
import Prism from 'markdown-it-prism'

describe('parse markdown code', () => {
  it('highlight options', (done) => {
    const mi = MarkdownIt({
      html: true,
      breaks: true,
      linkify: true,
      highlight(str: string, lang: string) {
        expect(str).toMatchInlineSnapshot(`
          "const msg = 'HelloWorld';
          console.log(msg);
          "
        `)
        expect(lang).toMatchInlineSnapshot('"js"')
        done()
        return str
      },
    })

    mi.render(`
\`\`\`js
const msg = 'HelloWorld';
console.log(msg);
    `)
  })

  it('markdown it with prismjs', () => {
    const mi = MarkdownIt({
      html: true,
      breaks: true,
      linkify: true,
    })
    mi.use(Prism)

    expect(mi.render(`
\`\`\`js
const msg = 'HelloWorld';
console.log(msg);
    `)).toMatchInlineSnapshot(`
      "<pre class=\\"language-js\\"><code class=\\"language-js\\"><span class=\\"token keyword\\">const</span> msg <span class=\\"token operator\\">=</span> <span class=\\"token string\\">'HelloWorld'</span><span class=\\"token punctuation\\">;</span>
      console<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">log</span><span class=\\"token punctuation\\">(</span>msg<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>
      </code></pre>
      "
    `)
  })
})
