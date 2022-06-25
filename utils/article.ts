import fs from 'fs'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import Prism from 'markdown-it-prism'
import LinkAttributes from 'markdown-it-link-attributes'
import anchor from 'markdown-it-anchor'
// @ts-expect-error missing types
import TOC from 'markdown-it-table-of-contents'

import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-scss'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-python'

const __DEV__ = process.env.NEXT_PUBLIC_DOMAIN_ENV !== 'production'

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
  .use(TOC, {
    includeLevel: [1, 2, 3],
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

type ArticleType = 'posts' | 'note'
export const generate = async (
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

export interface ListItemType {
  id: string
  title?: string
  date?: number
}

export const getPostList = (hasInfo = false): ListItemType[] => {
  let list = fs.readdirSync('contents/posts/')
  if (!__DEV__) list = list.filter(post => post !== 'test.md')
  if (!hasInfo) return list.map(item => ({ id: item.replace('.md', '') }))

  const infoList = list.map((post) => {
    const raw = fs.readFileSync(`contents/posts/${post}`, 'utf-8')
    const { data } = matter(raw)
    return {
      id: post.replace('.md', ''),
      title: data.title,
      date: new Date(data.date).getTime(),
    }
  })

  return infoList.sort((a, b) => b.date - a.date)
}
