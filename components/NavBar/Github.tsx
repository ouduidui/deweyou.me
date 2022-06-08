import type { NextPage } from 'next'
import Tooltip from './Tooltip'

interface PropsType {
  isDark: boolean
}

const Github: NextPage<PropsType> = (props: PropsType) => {
  return (
    <Tooltip label="Github" isDark={props.isDark}>
      <a
        className="icon-btn !outline-none i-iconoir-github"
        href="https://github.com/ouduidui/ouduidui.github.io"
        target="_blank" rel="noreferrer"
      />
    </Tooltip>
  )
}

export default Github
