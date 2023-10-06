import type { NextPage } from 'next'
import { PHOTO_URL } from '../../contents/summary'
import Tooltip from './Tooltip'

interface PropsType {
  isDark: boolean
}

const Photo: NextPage<PropsType> = (props: PropsType) => {
  return (
    <Tooltip label="Photo" isDark={props.isDark}>
      <a
        className="icon-btn !outline-none i-iconoir-media-image"
        href={PHOTO_URL}
        target="_blank" rel="noreferrer"
      />
    </Tooltip>
  )
}

export default Photo
