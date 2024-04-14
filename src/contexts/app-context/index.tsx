import { createContext, createEffect, onMount } from 'solid-js'
import { createStore } from 'solid-js/store'
import type { JSX } from 'solid-js'
import { Persistence } from '../../common/persistence'
import { ColorModeService, type ColorModeType } from '../../common/color-mode'
import { type Locale, LocaleService } from '../../common/locale'

const colorModeService = new ColorModeService()
const localeService = new LocaleService()

const persistence = new Persistence<AppContextState>('deweyou.me', {
  locale: localeService.getLocale(),
  colorMode: colorModeService.getColorMode(),
})

interface AppContextState {
  locale: Locale
  colorMode: ColorModeType
}

interface AppContextAction {
  changeColorMode: (colorMode: ColorModeType) => void
  changeLocale: (locale: Locale) => void
}

const defaultState: AppContextState = persistence.getValue()

export const AppContext = createContext<[AppContextState, AppContextAction]>([defaultState, { changeColorMode: () => {}, changeLocale: () => {} }])

export function AppProvider(props: { children: JSX.Element }) {
  const [store, setStore] = createStore<AppContextState>(defaultState)

  const actions: AppContextAction = {
    changeColorMode: (colorMode: ColorModeType) => {
      setStore('colorMode', colorMode)
      colorModeService.setStyle(store.colorMode)
    },
    changeLocale: (locale: Locale) => {
      setStore('locale', locale)
    },
  }

  const value: [AppContextState, AppContextAction] = [
    store,
    actions,
  ]

  createEffect(() => persistence.setValue({ ...store }))

  onMount(() => {
    persistence.setValue({ ...store })
    colorModeService.setStyle(store.colorMode)
    colorModeService.onChange(colorMode => actions.changeColorMode(colorMode))
    localeService.onChange(locale => actions.changeLocale(locale))
  })

  return (<AppContext.Provider value={value}>{props.children}</AppContext.Provider>)
}
