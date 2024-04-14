import { type Component, onMount } from 'solid-js'
import lottie from 'lottie-web'
import LogoLotties from './logo-lotttie.json'

export const Background: Component = () => {
  let domRef: HTMLDivElement | undefined

  onMount(() => {
    domRef && lottie.loadAnimation({
      container: domRef,
      animationData: LogoLotties,
      renderer: 'svg',
      autoplay: true,
    })
  })

  return (
    <div
      ref={domRef}
      class="
        pointer-events-none
        opacity-5
        max-w-screen-2xl
        md:max-w-screen-lg
        lg:max-w-screen-md
        xl:max-w-screen-lg
        2xl:max-w-screen-xl
        fixed
        top-1/2
        left-1/2
        -translate-x-1/2
        -translate-y-1/2
        mb-10
      "
    >
    </div>
  )
}
