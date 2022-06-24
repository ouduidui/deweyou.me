import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import classnames from 'classnames'
import Tooltip from './Tooltip'

export interface PropsType {
  isDark: boolean
  icon: string
  tooltipLabel: string
  routePath: string
}

const Common: NextPage<PropsType> = ({
  isDark,
  icon,
  tooltipLabel,
  routePath,
}: PropsType) => {
  const router = useRouter()
  const cls = classnames('icon-btn', '!outline-none', icon)

  return (
    <Tooltip label={tooltipLabel} isDark={isDark}>
      <div
        className={cls}
        onClick={() => router.push(routePath)}
      />
    </Tooltip>
  )
}

export default Common
