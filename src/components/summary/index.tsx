import { type Component, createEffect, createMemo, useContext } from 'solid-js'
import TypeIt from 'typeit'
import { AppContext, I18nContext } from '../../contexts'
import './index.css'

const lineWrapper = (text: string) => `<span>${text}</span>`

const linkWrapper = (text: string, url: string) => `<a target="_blank" href="${url}" class="link">${text}</a>`

export const Summary: Component = () => {
  let domRef: HTMLDivElement | undefined
  const [store] = useContext(AppContext)
  const { t } = useContext(I18nContext)!
  createEffect(() => {
    if (!domRef)
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

    const typeIt = new TypeIt(domRef)
    typeIt
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

  const fontFamily = createMemo(() => {
    return store.locale === 'cn' ? 'font-base' : 'font-mono'
  })

  return (
    <div class={`${fontFamily()} summary leading-loose text-xl text-gray-800 dark:text-gray-200`} ref={domRef}></div>
  )
}
