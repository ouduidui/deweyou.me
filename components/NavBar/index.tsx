import type { NextPage } from 'next'
import useDark from '../../hooks/useDark'
import Github from './Github'
import ToggleTheme from './ToggleTheme'
import Common from './Common'
import type { PropsType as CommonCompPropsType } from './Common'

const BUTTONS: Omit<CommonCompPropsType, 'isDark'>[] = [
  {
    icon: 'i-carbon-home',
    tooltipLabel: 'Home',
    routePath: '/',
  },
  {
    icon: 'i-carbon-align-box-top-left',
    tooltipLabel: 'Posts',
    routePath: '/posts',
  },
  {
    icon: 'i-iconoir-media-image',
    tooltipLabel: 'Photo',
    routePath: '/photos',
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

  return (
    <header className="p-8 flex flex-row justify-center items-center">
      <div className="grid grid-flow-col gap-1.2rem">
        {
          BUTTONS.map(prop => (
            <Common
              key={prop.tooltipLabel}
              isDark={isDark}
              {...prop} />
          ))
        }
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
