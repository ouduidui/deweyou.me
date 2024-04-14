export type ColorModeType = 'light' | 'dark'

export class ColorModeService {
  private disposeFns: Array<() => void> = []
  getColorMode(): ColorModeType {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches)
      return 'dark'
    return 'light'
  }

  onChange(callback: (mode: ColorModeType) => void) {
    this.disposeFns.forEach(fn => fn?.())
    this.disposeFns.length = 0

    const darkMediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
    const onChangeDarkMode: Parameters<typeof darkMediaQueryList['addListener']>[0] = mediaQueryList => mediaQueryList.matches && callback('dark')
    darkMediaQueryList.addListener(onChangeDarkMode)
    this.disposeFns.push(() => darkMediaQueryList.removeListener(onChangeDarkMode))

    const lightMediaQueryList = window.matchMedia('(prefers-color-scheme: light)')
    const onChangeLightMode: Parameters<typeof lightMediaQueryList['addListener']>[0] = mediaQueryList => mediaQueryList.matches && callback('light')
    lightMediaQueryList.addListener(onChangeLightMode)
    this.disposeFns.push(() => lightMediaQueryList.removeListener(onChangeLightMode))
  }

  setStyle(mode: ColorModeType) {
    if (mode === 'light')
      document.documentElement.classList.remove('dark')
    else
      document.documentElement.classList.add('dark')
  }
}
