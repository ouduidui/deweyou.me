import type { NextPage } from 'next'
import cssModule from '../styles/404.module.css'
import Head from '../components/Head'

const Custom404: NextPage = () => {
  return (
    <div className={cssModule.container}>
      <Head title="404 Page Not Found" />
      <img className="w-full h-full" src="/404.svg" />
    </div>
  )
}

export default Custom404
