import type { NextPage } from 'next'
import { genPost } from '../utils/posts'

const Test: NextPage = (props: any) => {
  const { post } = props
  return (
    <div>
      <div dangerouslySetInnerHTML = {{ __html: post.html }} ></div>
    </div>
  )
}

export const getStaticProps = async() => {
  return {
    props: {
      post: await genPost(),
    },
  }
}

export default Test
