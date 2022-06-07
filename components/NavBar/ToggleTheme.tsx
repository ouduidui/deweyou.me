import type { NextPage } from 'next'

interface PropsType {
  isDark: boolean
  toggleDark: () => void
}

const ToggleTheme: NextPage<PropsType> = (props: PropsType) => {
  const { isDark, toggleDark } = props
  return (
    <a
      className="icon-btn !outline-none"
      onClick={() => toggleDark()}
    >
      <div className={isDark ? 'i-carbon-moon' : 'i-carbon-sun'} />
    </a>
  )
}

export default ToggleTheme
