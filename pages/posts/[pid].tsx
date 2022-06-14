import type { GetStaticProps, NextPage } from 'next'
import type { ArticleReturnType } from '../../utils/article'
import { generate, getPostList } from '../../utils/article'
import ArticleContent from '../../components/Article/Content'

interface PropsType {
  post: ArticleReturnType
}

const Post: NextPage<PropsType> = (props: PropsType) => {
  const { post } = props
  return (
    <div>
      <ArticleContent post={post} />
    </div>
  )
}

export const getStaticPaths = async() => {
  return {
    paths: getPostList().map(post => ({ params: { pid: post.id } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async(context) => {
  return {
    props: {
      post: await generate(context.params!.pid as string),
    },
  }
}

export default Post
