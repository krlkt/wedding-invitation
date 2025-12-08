import { FC, PropsWithChildren, useEffect, useState } from 'react'

import Image from 'next/image'

const backgroundImagesSrc = [
  '/images/unopened/cycle1.jpg',
  '/images/unopened/cycle2.jpg',
  '/images/unopened/cycle3.jpg',
  '/images/unopened/cycle4.jpg',
  '/images/unopened/cycle5.jpg',
  '/images/unopened/cycle6.jpg',
]

const CycleBackground: FC<PropsWithChildren> = ({ children }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [previousImageIndex, setPreviousImageIndex] = useState<number | null>(null)
  const [isFading, setIsFading] = useState(false)

  // Preload images
  useEffect(() => {
    backgroundImagesSrc.forEach((src) => {
      const img = new window.Image()
      img.src = src
    })
  }, [])

  // Cycle images
  useEffect(() => {
    const timer = setInterval(() => {
      setIsFading(true)
      setPreviousImageIndex(currentImageIndex)
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImagesSrc.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [currentImageIndex])

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.classList.add('animateImage')
    setIsFading(false)
  }

  return (
    <section
      id="landing-section"
      className="relative flex h-dvh flex-col items-center justify-center gap-10 overflow-hidden text-center font-serif text-white"
    >
      <div id="overlay" className="overlay absolute -z-10 h-full w-full" />
      <div id="hero" className="absolute -z-20 h-full w-full">
        {previousImageIndex !== null && (
          <Image
            key={previousImageIndex}
            width={0}
            height={0}
            sizes="100vw"
            className="animateImage absolute inset-0 h-full w-full object-cover"
            src={backgroundImagesSrc[previousImageIndex]}
            alt="couple image"
            priority
          />
        )}
        <Image
          key={currentImageIndex}
          width={0}
          height={0}
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
          style={{ opacity: isFading ? 0 : 1 }}
          src={backgroundImagesSrc[currentImageIndex]}
          alt="couple image"
          priority
          onLoad={handleLoad}
        />
      </div>
      {children}
    </section>
  )
}

export default CycleBackground
