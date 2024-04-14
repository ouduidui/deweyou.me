import type { Flatten } from '@solid-primitives/i18n'
import { flatten } from '@solid-primitives/i18n'
import type cn from '../i18n/cn.json'

export type Locale = 'cn' | 'en'
export type RawDictionary = typeof cn
export type Dictionary = Flatten<RawDictionary>

export async function fetchDictionary(locale: Locale): Promise<Dictionary> {
  const dict: RawDictionary = (await import(`../i18n/${locale}.json`))
  return flatten(dict)
}

export class LocaleService {
  private disposeFns: Array<() => void> = []
  getLocale(): Locale {
    const browserLang = navigator.language ?? 'zh-CN'
    if (browserLang === 'zh-CN')
      return 'cn'
    return 'en'
  }

  onChange(cb: (locale: Locale) => void) {
    this.disposeFns.forEach(fn => fn?.())
    this.disposeFns.length = 0

    const onChange = () => {
      cb(this.getLocale())
    }
    window.addEventListener('languagechange', onChange)
    this.disposeFns.push(
      () => window.removeEventListener('languagechange', onChange),
    )
  }
}
