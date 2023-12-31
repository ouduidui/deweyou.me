import type { NextPage } from 'next'
import Image from 'next/image'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import { PHOTO_LIST } from '../contents/photos'
import 'react-photo-view/dist/react-photo-view.css'
import Head from '../components/Head'

const Photos: NextPage = () => {
  return (
    <>
      <Head title="Photo" />
      <PhotoProvider bannerVisible={false}>
        <div className="content mt-20">
          {PHOTO_LIST.map((item, index) => {
            const { location, photos, date } = item

            return (
              <div key={`item_${index}`} className="mb-10">
                <div className="text-2xl font-light italic mb-2">#{location}<span className="text-sm pl-2 opacity-50">{date.format('YYYY-MM-DD')}</span></div>
                <div className="flex flex-wrap">
                  {
                    photos.map(photo => (
                      <div key={photo.url} className="p-2">
                        <PhotoView src={photo.url} >
                          <Image
                            className="cursor-pointer"
                            width={'200px'}
                            height={'200px'}
                            src={photo.url}
                            objectFit="cover"
                            priority={true}
                          />
                        </PhotoView>
                      </div>
                    ))
                  }
                </div>
              </div>
            )
          })}
        </div>
      </PhotoProvider>
    </>
  )
}

export default Photos
