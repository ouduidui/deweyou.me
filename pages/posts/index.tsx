import type { GetStaticProps, NextPage } from 'next'
import { getPostList } from '../../utils/article'

const Posts: NextPage = (props: any) => {
  const { list } = props
  return (
    <div>
      {list.map((post: string) => (
        <div key={post}>
          <a href={`/posts/${post}`} >{post}</a>
        </div>
      ))}
    </div>
  )
}

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      list: getPostList(),
    },
  }
}

export default Posts
