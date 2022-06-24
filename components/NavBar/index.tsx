import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import useDark from '../../hooks/useDark'
import Github from './Github'
import ToggleTheme from './ToggleTheme'
import Posts from './Posts'

const NavBar: NextPage = () => {
  const { isDark, toggleDark } = useDark()
  const router = useRouter()

  return (
    <header className="p-8 flex flex-row justify-between items-center">
      <div className="cursor-pointer" onClick={() => router.push('/')}>
        <img src={isDark ? '/logo-dark.svg' : '/logo.svg'} className="w-10 h-10"></img>
      </div>
      <div className="grid grid-flow-col gap-1.2rem">
        <Posts isDark={isDark} />
        <ToggleTheme
          isDark={isDark}
          toggleDark={toggleDark}
        />
        <Github isDark={isDark} />
      </div>
    </header>
  )
}

export default NavBar
