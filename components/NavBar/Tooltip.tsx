import type { NextPage } from 'next'
import { Tooltip as TT } from '@chakra-ui/react'
import { useMemo } from 'react'

type PropsType = {
  isDark: boolean,
  label: string,
  children: React.ReactNode,
}

const COLORS = [
  // light
  {bg: '#fcfcfc', color:'#1f2937'},
  // dark
  {bg: '#181818', color:'#f3f4f6'}
] as const

const Tooltip: NextPage<PropsType> = (props: PropsType) => {
  const { isDark, label, children } = props

  const theme = useMemo(() => {
    return COLORS[isDark ? 1 : 0]
  }, [isDark])

  return (
     <TT 
     label={label} 
     placement='bottom' 
     bg={theme.bg} 
     color={theme.color} 
     className='font-mono text-xs'
     >
      {children}
    </TT>

  )
}

export default Tooltip
