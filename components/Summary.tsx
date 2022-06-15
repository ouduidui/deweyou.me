import type { NextPage } from 'next'
import TypeIt from 'typeit-react'
import Image from 'next/image'
import { AVATAR, SUMMARY } from '../contents/summary'

const Summary: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <div className="w-40 h-40 rounded-1/2 overflow-hidden relative mb-8">
        <Image
          src={AVATAR}
          layout="fill"
          className="relative"
          objectFit="cover"
          priority={true}
        />
      </div>

      <div className="font-mono leading-loose text-xl text-center select-none">
        <TypeIt
          options={{
            strings: SUMMARY,
            speed: 100,
            waitUntilVisible: true,
            startDelay: 1000,
          }} />
      </div>
    </div>
  )
}

export default Summary
