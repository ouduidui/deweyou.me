import type { NextPage } from 'next'
import { COPYRIGHT, FILING } from '../contents/footer'

const Footer: NextPage = () => {
  return (
    <footer className="font-mono text-xs opacity-50 flex flex-col justify-center items-center my-5">
      <div className="mb-1">{COPYRIGHT}</div>
      <a href={FILING.url} target="_blank" rel="noreferrer">{FILING.text}</a>
    </footer>
  )
}

export default Footer
