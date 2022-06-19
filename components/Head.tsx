import Head from 'next/head'
import type { NextPage } from 'next'

interface PropsType {
  title?: string
  description?: string
  icon?: string
  keywords?: string[]
}

const defaultKeywords = [
  'Dewey Ou', 'Dewey', 'Ou', 'Software Engineer', 'Blogs', 'Front-End', 'Web', '欧怼怼', 'OUDUIDUI',
]

const AdvancedHead: NextPage<PropsType> = ({
  title = '',
  description = 'Dewey Ou is a software engineer and a writer.',
  icon = '/logo-dark.svg',
  keywords = [],
}: PropsType) => {
  title = title ? `${title} · Dewey Ou` : 'Dewey Ou'
  keywords.push(...defaultKeywords)
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
