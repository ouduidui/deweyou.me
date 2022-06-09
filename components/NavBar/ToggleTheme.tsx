import type { NextPage } from 'next'
import Tooltip from './Tooltip'

interface PropsType {
  isDark: boolean
  toggleDark: () => void
}

const ToggleTheme: NextPage<PropsType> = (props: PropsType) => {
  const { isDark, toggleDark } = props
  return (
    <Tooltip isDark={isDark} label="Theme">
      <a
        className="icon-btn !outline-none"
        onClick={() => toggleDark()}
      >
        <div className={isDark ? 'i-carbon-moon' : 'i-carbon-sun'} />
      </a>
    </Tooltip>

  )
}

export default ToggleTheme
