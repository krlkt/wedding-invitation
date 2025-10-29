import { Metadata } from 'next/types'

import PublicGallery from './PublicGallery'

export const metadata: Metadata = {
  title: "KS's Photo Gallery",
}

const Page = () => {
  return <PublicGallery />
}

export default Page
