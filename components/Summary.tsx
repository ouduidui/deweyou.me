import type { NextPage } from 'next'
import Lottie from 'lottie-react'
import TypeIt from 'typeit-react'
import { useState } from 'react'
import classNames from 'classnames'
import LogoJSON from '../public/img/logo-lotties.json'
import { SUMMARY } from '../contents/summary'
import useWillMount from '../hooks/useWillMount'

const TEXT_START_DELAY = 6000

const Summary: NextPage = () => {
  const [isLottieMounted, setIsLottieMounted] = useState(false)
  useWillMount(() => {
    setTimeout(() => { setIsLottieMounted(true) }, TEXT_START_DELAY)
  })
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <Lottie className="max-w-xl m-auto mx-6" loop={false} animationData={LogoJSON} />
      <div className={classNames('font-mono leading-loose text-xl text-center select-none', {
        'opacity-0': !isLottieMounted,
      })}>
        <TypeIt
          options={{
            strings: SUMMARY,
            speed: 100,
            waitUntilVisible: true,
            startDelay: TEXT_START_DELAY,
          }} />
      </div>
    </div>
  )
}

export default Summary
