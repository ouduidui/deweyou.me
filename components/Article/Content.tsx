import type { NextPage } from 'next'
import dayjs from 'dayjs'
import type { ArticleReturnType } from '../../utils/article'
import cssModule from '../../styles/ArticleContent.module.css'

interface PropsType {
  post: ArticleReturnType
}

const Content: NextPage<PropsType> = (props: PropsType) => {
  const { post } = props
  const renderDate = dayjs(post.date).format('YYYY-MM-DD')
  return (
    <div className={cssModule.content}>
      <div className="mb-8">
        <h1 className="!-mb-0">{post.title}</h1>
        <div className="opacity-50 mt-2">{renderDate} · {post.author}</div>
      </div>
      <div dangerouslySetInnerHTML = {{ __html: post.html }} ></div>
    </div>
  )
}

export default Content
