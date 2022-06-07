import type { NextPage } from 'next'
import useDark from '../../hooks/useDark'
import Github from './Github'
import ToggleTheme from './ToggleTheme'

const NavBar: NextPage = () => {
  const { isDark, toggleDark } = useDark()

  return (
    <header className="p-8 flex flex-row justify-between items-center">
      <a href="/">
        <img src={isDark ? '/logo-dark.svg' : '/logo.svg'} className="w-10 h-10"></img>
      </a>
      <div className="grid grid-flow-col gap-1.2rem">
        <ToggleTheme
          isDark={isDark}
          toggleDark={toggleDark}
        />
        <Github />
      </div>
    </header>
  )
}

export default NavBar
