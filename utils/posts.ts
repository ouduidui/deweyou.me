import fs from 'fs'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

const markdown: MarkdownIt = MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  highlight(str: string, lang: string) {
    if (lang === 'vue') lang = 'html'

    if (lang && hljs.getLanguage(lang)) {
      try {
        // eslint-disable-next-line no-control-regex
        str = str.replace(/\x09/g, '  ')
        return `<pre class="hljs"><code>${
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
        }</code></pre>`
      }
      catch (__) {}
    }

    return `<pre class="hljs"><code>${markdown.utils.escapeHtml(str)}</code></pre>`
  },
})

export const genPost = async() => {
  const raw = fs.readFileSync('contents/test.md', 'utf-8')
  const { data, content } = matter(raw)
  const html = markdown.render(content)

  return {
    ...data,
    date: new Date(data.date).getTime(),
    html,
  }
}
