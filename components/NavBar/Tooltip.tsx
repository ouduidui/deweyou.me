import type { NextPage } from 'next'
import { useMemo, useState } from 'react'

interface PropsType {
  isDark: boolean
  label: string
  children: React.ReactNode
}

const COLORS = [
  // light
  { bg: '#fcfcfc', color: '#1f2937' },
  // dark
  { bg: '#181818', color: '#f3f4f6' },
] as const

const Tooltip: NextPage<PropsType> = (props: PropsType) => {
  const { isDark, label, children } = props

  const theme = useMemo(() => {
    return COLORS[isDark ? 1 : 0]
  }, [isDark])

  const [tooltipActive, setTooltipActive] = useState(false)

  let timer: number | undefined | NodeJS.Timeout
  const hoverHandler = (isHover: boolean) => {
    if (isHover && !tooltipActive) {
      timer && clearTimeout(timer)
      setTooltipActive(true)
    }
    else if (!isHover && tooltipActive) {
      timer = setTimeout(() => {
        setTooltipActive(false)
      })
    }
  }

  return (
    <div
      className="relative"
      onMouseOver={() => hoverHandler(true)}
      onMouseLeave={() => hoverHandler(false)}
    >
      {children}
      {
        tooltipActive
          ? (
            <div
              style={{ background: theme.bg, color: theme.color }}
              className="absolute bottom-0 left-1/2 translate-y-full -translate-x-1/2 font-mono text-xs shadow py-1 px-2 mt-1"
            >
              {label}
            </div>
          )
          : null
      }

    </div>

  )
}

export default Tooltip
