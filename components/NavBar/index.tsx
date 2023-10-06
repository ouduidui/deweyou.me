import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import useDark from '../../hooks/useDark'
import Github from './Github'
import ToggleTheme from './ToggleTheme'
import Photo from './Photo'
import Common from './Common'
import type { PropsType as CommonCompPropsType } from './Common'

const BUTTONS: Omit<CommonCompPropsType, 'isDark'>[] = [
  {
    icon: 'i-carbon-align-box-top-left',
    tooltipLabel: 'Posts',
    routePath: '/posts',
  },
  // {
  //   icon: 'i-carbon-rocket',
  //   tooltipLabel: 'Projects',
  //   routePath: '/projects',
  // },
  {
    icon: 'i-iconoir-terminal-simple',
    tooltipLabel: 'Note',
    routePath: '/note',
  },
  // {
  //   icon: 'i-carbon-content-delivery-network',
  //   tooltipLabel: 'Websites',
  //   routePath: '/websites',
  // },
  {
    icon: 'i-iconoir-chat-bubble-empty',
    tooltipLabel: 'Contact',
    routePath: '/contact',
  },
]

const NavBar: NextPage = () => {
  const { isDark, toggleDark } = useDark()
  const router = useRouter()

  return (
    <header className="p-8 flex flex-row justify-between items-center">
      <div
        className="cursor-pointer i-custom:logo w-10 h-10"
        onClick={() => router.push('/')}
      />
      <div className="grid grid-flow-col gap-1.2rem">
        {
          BUTTONS.map(prop => (
            <Common
              key={prop.tooltipLabel}
              isDark={isDark}
              {...prop} />
          ))
        }
        <Photo isDark={isDark}></Photo>

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
