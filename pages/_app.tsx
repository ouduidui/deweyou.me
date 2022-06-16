
import '../styles/globals.css'
import 'uno.css'
import '../styles/reset.css'
import '../styles/prism.css'
import '../styles/nprogress.css'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import Footer from '../components/Footer'
import { initLoading } from '../utils/loading'

initLoading()

const NavBar = dynamic(() => import('../components/NavBar'), { ssr: false })

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="font-sans flex flex-col min-h-screen">
      <NavBar />
      <div className="flex-1">
        <Component {...pageProps} />
      </div>
      <Footer />
    </div>
  )
}

export default MyApp
