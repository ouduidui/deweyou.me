import type { NextPage } from 'next'
import type { ArticleReturnType } from '../../utils/article'
import cssModule from '../../styles/ArticleContent.module.css'

interface PropsType {
  post: ArticleReturnType
}

const Content: NextPage<PropsType> = (props: PropsType) => {
  const { post } = props
  return (
    <div className={cssModule.content}>
      <div dangerouslySetInnerHTML = {{ __html: post.html }} ></div>
    </div>
  )
}

export default Content
