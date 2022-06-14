import type { NextPage } from 'next'
import { COPYRIGHT } from '../contents/footer'

const Footer: NextPage = () => {
  return (
    <footer className="font-mono text-xs opacity-50 flex flex-col justify-center items-center pt-10 pb-4 select-none">
      <div className="mb-1">{COPYRIGHT}</div>
    </footer>
  )
}

export default Footer
