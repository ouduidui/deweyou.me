import '../styles/globals.css'
import 'uno.css'
import '../styles/reset.css'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import Footer from '../components/Footer'

const NavBar = dynamic(() => import('../components/NavBar'), { ssr: false })

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex-1">
        <Component {...pageProps} />
      </div>
      <Footer />
    </div>
  )
}

export default MyApp
