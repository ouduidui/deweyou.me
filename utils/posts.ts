import fs from 'fs'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'

const markdown = MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
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
