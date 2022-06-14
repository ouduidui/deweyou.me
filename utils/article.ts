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
    permalink: anchor.permalink.linkInsideHeader({
      symbol: '#',
      renderAttrs: () => ({ 'aria-hidden': 'true' }),
    }),
  })

export interface ArticleReturnType {
  id: string
  title: string
  describe: string
  date: number
  lang: string
  html: string
  author: string
}

type ArticleType = 'posts'
export const generate = async(
  id: string,
  type: ArticleType = 'posts',
): Promise<ArticleReturnType> => {
  const raw = fs.readFileSync(`contents/${type}/${id}.md`, 'utf-8')
  const { data, content } = matter(raw)
  const html = markdown.render(content)

  return {
    id,
    ...data,
    date: new Date(data.date).getTime(),
    html,
  } as ArticleReturnType
}

export const getPostList = () => {
  return fs.readdirSync('contents/posts/').map(item => item.replace('.md', ''))
}
