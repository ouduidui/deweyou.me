import Router from 'next/router'
import NProgress from 'nprogress'

export const initLoading = () => {
  NProgress.configure({ showSpinner: false })

  Router.events.on('routeChangeStart', () => NProgress.start())
  Router.events.on('routeChangeComplete', () => NProgress.done())
  Router.events.on('routeChangeError', () => NProgress.done())
}
