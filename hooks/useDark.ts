import { useDarkMode } from 'usehooks-ts'
import { useEffect } from 'react'

let html: HTMLHtmlElement

export default function useDark() {
  const { isDarkMode: isDark, toggle: toggleDark } = useDarkMode()

  useEffect(() => {
    html = html || document.getElementsByTagName('html')[0]
    if (isDark)
      html.classList.add('dark')
    else
      html.classList.remove('dark')
  })

  return {
    isDark,
    toggleDark,
  }
}
