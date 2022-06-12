import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { genPost } from '../../utils/posts'

const Post: NextPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  console.log(props)
  return (
    <div>
      Hey
    </div>
  )
}

export const getStaticPaths = async() => {
  return {
    paths: [
      {
        params: {
          pid: 'test',
        },
      },
    ],
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async(context) => {
  return {
    props: {
      pid: context.params!.pid,
      post: await genPost(),
    },
  }
}

export default Post
