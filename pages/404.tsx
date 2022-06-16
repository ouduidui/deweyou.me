import type { NextPage } from 'next'
import cssModule from '../styles/404.module.css'

const Custom404: NextPage = () => {
  return (
    <div className={cssModule.container}>
      <img className="w-full h-full" src="/404.svg" />
    </div>
  )
}

export default Custom404
