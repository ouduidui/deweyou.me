import Head from 'next/head'
import type { NextPage } from 'next'

interface PropsType {
  title?: string
  description?: string
  icon?: string
  keywords?: string[]
}

const AdvancedHead: NextPage<PropsType> = ({
  title = 'Dewey Ou',
  description = 'Dewey Ou is a software engineer and a writer.',
  icon = '/favicon.ico',
  keywords = ['Dewey Ou', 'Dewey', 'Ou', 'Software Engineer', 'Writer'],
}: PropsType) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(',')} />
      <link rel="icon" href={icon} />
    </Head>
  )
}

export default AdvancedHead
