import type { JSX } from 'solid-js'
import { Show, Suspense, createContext, createEffect, createMemo, createResource, useContext } from 'solid-js'
import type { BaseTemplateArgs, NullableTranslator } from '@solid-primitives/i18n'
import { resolveTemplate, translator } from '@solid-primitives/i18n'
import { AppContext } from '..'
import type { Locale, RawDictionary } from '../../common/locale'
import { fetchDictionary } from '../../common/locale'

export const I18nContext = createContext<{
  t: (key: keyof RawDictionary, args?: BaseTemplateArgs) => string
}>(undefined)

export function I18nProvider(props: { children: JSX.Element }) {
  const [store] = useContext(AppContext)
  const [dict] = createResource(store.locale, fetchDictionary)

  const getText = (key: keyof RawDictionary, args?: BaseTemplateArgs) => {
    dict()
    const t = translator(dict, resolveTemplate)
    return t(key, args)!
  }

  let prevLocale: Locale = store.locale
  createEffect(() => {
    if (prevLocale !== store.locale) {
      prevLocale = store.locale
      location.reload()
    }
  })

  return (
    <I18nContext.Provider value={{ t: getText }}>
      <Suspense>
        <Show when={(dict())}>
          {props.children}
        </Show>
      </Suspense>
    </I18nContext.Provider>
  )
}
