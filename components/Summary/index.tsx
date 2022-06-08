import type { NextPage } from 'next'
import TypeIt from 'typeit-react'
import Image from 'next/image'
import { AVATAR, SUMMARY } from '../../contents/summary'

const Summary: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-18 h-18 rounded-1/2 overflow-hidden relative mb-5">
        <Image
          src={AVATAR}
          layout="fill"
          className="relative"
          objectFit="cover"
        />
      </div>

      <div className="font-mono text-xl text-center">
        <TypeIt
          options={{
            strings: SUMMARY,
            speed: 50,
            waitUntilVisible: true,
          }} />
      </div>
    </div>
  )
}

export default Summary
