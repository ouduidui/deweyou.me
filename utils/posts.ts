import fs from 'fs'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import Prism from 'markdown-it-prism'
import LinkAttributes from 'markdown-it-link-attributes'
import anchor from 'markdown-it-anchor'

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

markdown
  .use(Prism)
  .use(LinkAttributes, {
    matcher: (link: string) => /^https?:\/\//.test(link),
    attrs: {
      target: '_blank',
      rel: 'noopener',
    },
  })
  .use(anchor, {
    // slugify,
    permalink: anchor.permalink.linkInsideHeader({
      symbol: '#',
      renderAttrs: () => ({ 'aria-hidden': 'true' }),
    }),
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
