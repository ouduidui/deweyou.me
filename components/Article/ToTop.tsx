import type { NextPage } from 'next'
import { useEffect, useState } from 'react'

let timer: number | null = null
let isScrolling = false

const ToTop: NextPage = () => {
  const [show, changeShow] = useState(false)

  const toTopHandle = () => {
    timer && cancelAnimationFrame(timer)
    const top = document.body.scrollTop || document.documentElement.scrollTop
    if (top > 0) {
      isScrolling = true
      document.body.scrollTop = document.documentElement.scrollTop = top - 50
      timer = requestAnimationFrame(toTopHandle)
    }
    else {
      isScrolling = false
      changeShow(false)
      timer && cancelAnimationFrame(timer)
    }
  }

  const scrollHandle = () => {
    if (isScrolling) return
    const top = document.body.scrollTop || document.documentElement.scrollTop
    if (top > 1000 && !show)
      changeShow(true)
    else if (top <= 1000 && show)
      changeShow(false)
  }

  useEffect(() => {
    document.addEventListener('scroll', scrollHandle)
    return () => {
      timer && cancelAnimationFrame(timer)
      document.removeEventListener('scroll', scrollHandle)
    }
  })

  return (<div
    onClick={toTopHandle}
    style={{
      display: show ? 'block' : 'none',
    }}
    className="icon-btn text-xl i-carbon-chevron-up"
  />)
}

export default ToTop
