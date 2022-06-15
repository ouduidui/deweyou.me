import type { GetStaticProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import type { ListItemType } from '../../utils/article'
import { getPostList } from '../../utils/article'
import cssModule from '../../styles/List.module.css'
import Head from '../../components/Head'

interface PropsType {
  list: ListItemType[]
}

const Posts: NextPage<PropsType> = (props: PropsType) => {
  const { list } = props
  const router = useRouter()
  return (
    <>
      <Head title="Post" />

      <div className={cssModule.list}>
        {list.map(post => (
          <div
            className="mt-2 mb-6 font-normal opacity-80 hover:opacity-100 cursor-pointer"
            key={post.id}
            onClick={() => router.push(`/posts/${post.id}`)}
          >
            <div className="text-lg" >{post.title}</div>
            <div className="text-sm opacity-50">{dayjs(post.date!).format('YYYY-MM-DD')}</div>
          </div>
        ))}
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      list: getPostList(true),
    },
  }
}

export default Posts
