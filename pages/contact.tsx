import type { NextPage } from 'next'
import { useState } from 'react'
import classnames from 'classnames'
import {
  EMAIL, GITHUB, JUEJIN, WECHAT_PUBLIC_CODE,
} from '../contents/summary'
import Head from '../components/Head'

const Contact: NextPage = () => {
  const [image, setImage] = useState('')

  const clickHandle = (handler: () => void) => {
    setImage('')
    handler()
  }

  const contacts = [

    {
      icon: 'i-carbon-logo-github',
      handler: () => window.open(GITHUB),
    },
    {
      icon: 'i-custom:juejin',
      handler: () => window.open(JUEJIN),
    },
    // {
    //   icon: 'i-carbon-logo-wechat',
    //   handler: () => setImage(WECHAT_CODE),
    // },
    // {
    //   icon: 'i-icon-park-solid-twitter',
    //   handler: () => window.open(TWITTER),
    // },
    {
      icon: 'i-mdi-email',
      handler: () => window.open(`mailto:${EMAIL}`),
    },
    {
      icon: 'i-icon-park-solid-weixin-top-stories',
      handler: () => setImage(WECHAT_PUBLIC_CODE),
    },
  ]

  return (
    <>
      <Head title="Contact Me" />
      <div className="content flex items-center justify-between mt-20">
        {contacts.map((contact, idx) => {
          const cls = classnames('w-7', 'h-7', 'cursor-pointer', 'opacity-50', 'hover:opacity-100', contact.icon)
          return (
            <div
              key={idx}
              className={cls}
              onClick={() => clickHandle(contact.handler)}
            />
          )
        })}
      </div>
      {
        image && (
          <div>
            <img className="w-43 h-43 mt-20 m-auto opacity-80" src={image} />
          </div>
        )
      }

    </>
  )
}

export default Contact
