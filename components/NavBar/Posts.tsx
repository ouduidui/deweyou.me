import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Tooltip from './Tooltip'

interface PropsType {
  isDark: boolean
}

const Posts: NextPage<PropsType> = (props: PropsType) => {
  const router = useRouter()

  return (
    <Tooltip label="Posts" isDark={props.isDark}>
      <div
        className="icon-btn !outline-none i-carbon-align-box-top-left"
        onClick={() => router.push('/posts')}
      />
    </Tooltip>
  )
}

export default Posts
