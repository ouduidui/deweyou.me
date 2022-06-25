import type { NextPage } from 'next'
import { GITHUB_REPO } from '../../contents/summary'
import Tooltip from './Tooltip'

interface PropsType {
  isDark: boolean
}

const Github: NextPage<PropsType> = (props: PropsType) => {
  return (
    <Tooltip label="Github" isDark={props.isDark}>
      <a
        className="icon-btn !outline-none i-iconoir-github"
        href={GITHUB_REPO}
        target="_blank" rel="noreferrer"
      />
    </Tooltip>
  )
}

export default Github
