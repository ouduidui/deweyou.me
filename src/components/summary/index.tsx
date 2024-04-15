import { type Component, createEffect, createMemo, createSignal, useContext } from 'solid-js'
import TypeIt from 'typeit'
import { AppContext, I18nContext } from '../../contexts'
import './index.css'

const lineWrapper = (text: string) => `<span>${text}</span>`

const linkWrapper = (text: string, url: string) => `<a target="_blank" href="${url}" class="summary-link">${text}</a>`

export const Summary: Component = () => {
  let domRef: HTMLDivElement | undefined
  const [store] = useContext(AppContext)
  const { t } = useContext(I18nContext)!
  const fontFamily = store.locale === 'cn' ? 'font-base' : 'font-mono'
  let typeItInstance: TypeIt | undefined
  createEffect(() => {
    if (!domRef || !store.locale)
      return

    const lineOne = lineWrapper(t('lineOne'))
    const lineTwo = lineWrapper(t('lineTwo', {
      company: linkWrapper(t('company'), t('companyHomeUrl')),
      business: linkWrapper(t('business'), t('businessHomeUrl')),
    }))
    const lineThree = lineWrapper(t('lineThree'))
    const lineFour = lineWrapper(t('lineFour'))
    const lineFive = lineWrapper(t('lineFive'))
    const lineSix = lineWrapper(t('lineSix', {
      detail: linkWrapper(t('detailText'), t('detailUrl')),
    }))

    if (!typeItInstance)
      typeItInstance = new TypeIt(domRef)
    else
      typeItInstance.empty()

    typeItInstance
      .options({ speed: 20, breakLines: true })
      .type(lineOne)
      .pause(200)
      .break()
      .break()
      .type(lineTwo)
      .pause(200)
      .break()
      .break()
      .type(lineThree)
      .pause(200)
      .break()
      .break()
      .type(lineFour)
      .pause(200)
      .break()
      .break()
      .type(lineFive)
      .pause(200)
      .break()
      .break()
      .type(lineSix)
      .go()
  })

  return (
    <div class={`${fontFamily} summary leading-loose text-xl text-gray-800 dark:text-gray-200`} ref={domRef}></div>
  )
}
