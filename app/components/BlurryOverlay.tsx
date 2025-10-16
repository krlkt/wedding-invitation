import Image from 'next/image'
import { FC, PropsWithChildren } from 'react'

const BlurryOverlay: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="relative h-dvh w-full">
      {/* Background Image */}
      <Image
        src="/images/tirtha-bali-02.jpg"
        alt="Background"
        fill
        quality={100}
        className="-z-20 object-cover object-[45%]"
      />

      {/* Dark Blur Overlay */}
      <div className="absolute left-0 top-0 -z-10 h-full w-full bg-gray-800 bg-opacity-20 backdrop-blur-sm"></div>

      {/* Content */}
      {children}
    </div>
  )
}

export default BlurryOverlay
