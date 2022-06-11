import fs from 'fs'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import Prism from 'markdown-it-prism'

import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-scss'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-python'

const markdown: MarkdownIt = MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
})

markdown.use(Prism)

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
