'use client'

import { useRef, useState, useEffect, useMemo } from 'react'

import Image from 'next/image'

import { motion, useScroll, useTransform } from 'framer-motion'

import './zoomGridPhotos.css'
import InstagramIcon from '@/app/icons/InstagramIcon'
import { useScrollContainer } from '@/app/utils/ScrollContainerContext'
import { useWeddingData } from '@/app/hooks/useWeddingData'
import { parsePhotos } from '@/app/lib/section-photos'

import Bride1 from '../../../public/images/bride/bride1.jpg'
import Bride2 from '../../../public/images/bride/bride2.jpg'
import Bride3 from '../../../public/images/bride/bride3.jpg'
import Bride4 from '../../../public/images/bride/bride4.jpg'
import Bride5 from '../../../public/images/bride/bride5.jpg'
import Bride6 from '../../../public/images/bride/bride6.jpg'
import Ornament from '../../../public/images/ornaments/orn2.png'

// Default photos (fallback) - defined outside component to avoid re-creation
const defaultPhotos = [Bride1, Bride2, Bride3, Bride4, Bride5, Bride6]

const Bride = () => {
  // Get wedding data from context
  const { config, features, brideSection } = useWeddingData()

  // Get scroll container from context (for embedded previews)
  const { containerRef, isEmbedded } = useScrollContainer()

  // Measure container height for embedded mode
  const [containerHeight, setContainerHeight] = useState<number | null>(null)

  useEffect(() => {
    if (!isEmbedded || !containerRef?.current) {
      return
    }

    const updateHeight = () => {
      if (containerRef?.current) {
        const height = containerRef.current.clientHeight
        if (height) {
          setContainerHeight(height)
        }
      }
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [isEmbedded, containerRef])

  // Zoom animation
  const zoomAnimationContainer = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: zoomAnimationContainer,
    offset: ['start start', 'end end'],
    container: containerRef, // Use container if provided, otherwise defaults to window
    layoutEffect: false, // Use useEffect instead of useLayoutEffect for better SSR compatibility
  })

  const scale4 = useTransform(scrollYProgress, [0, 0.8], [1, 4.15])
  const scale5 = useTransform(scrollYProgress, [0, 0.8], [1, 5])
  const scale6 = useTransform(scrollYProgress, [0, 0.8], [1, 6])
  const scale8 = useTransform(scrollYProgress, [0, 0.8], [1, 8])
  const scale9 = useTransform(scrollYProgress, [0, 0.8], [1, 9])
  const textOpacityBride = useTransform(scrollYProgress, [0.3, 0.8], [0, 1])
  const textOpacityParent = useTransform(scrollYProgress, [0.5, 0.9], [0, 1])

  // Use measured container height for embedded mode, viewport height for fullscreen
  const stickyHeightValue = isEmbedded && containerHeight ? `${containerHeight}px` : ''
  const containerHeightValue = isEmbedded && containerHeight ? `${containerHeight * 3}px` : ''

  const stickyHeightClass = isEmbedded ? '' : 'h-dvh'
  const containerHeightClass = isEmbedded ? '' : 'h-[calc(var(--vh)*300)]'

  // Build ordered photos from brideSection or use defaults
  const orderedPhotos = useMemo(() => {
    if (!brideSection?.photos) return defaultPhotos

    // Parse JSON photos array
    const uploadedPhotos = parsePhotos(brideSection.photos)

    // If no photos uploaded, use defaults
    if (uploadedPhotos.length === 0) return defaultPhotos

    // Map uploaded photos to slots, fill missing with defaults
    const photos = Array.from({ length: 6 }, (_, i) => {
      const slot = i + 1
      const uploadedPhoto = uploadedPhotos.find((p) => p.slot === slot)
      return uploadedPhoto?.filename ?? defaultPhotos[i]
    })

    return photos
  }, [brideSection])

  const pictures = [
    {
      src: orderedPhotos[0],
      scale: scale6,
    },
    {
      src: orderedPhotos[1],
      scale: scale5,
    },
    {
      src: orderedPhotos[2],
      scale: scale4,
    },
    {
      src: orderedPhotos[3],
      scale: scale5,
    },
    {
      src: orderedPhotos[4],
      scale: scale8,
    },
    {
      src: orderedPhotos[5],
      scale: scale9,
    },
    {
      src: Ornament,
      scale: scale5,
    },
    {
      src: Ornament,
      scale: scale8,
    },
  ]

  return (
    // Container for zoom scroll animation
    <div
      ref={zoomAnimationContainer}
      className={`relative ${containerHeightClass} w-full bg-secondary-main`}
      style={isEmbedded && containerHeightValue ? { height: containerHeightValue } : undefined}
    >
      <div
        className={`sticky top-0 ${stickyHeightClass} overflow-hidden`}
        style={isEmbedded && stickyHeightValue ? { height: stickyHeightValue } : undefined}
      >
        {pictures.map(({ scale, src }, index) => {
          // Check if src is a static import (has blurDataURL) or a URL string
          const isStaticImport = typeof src === 'object' && 'src' in src

          return (
            // Element container div to make sure everything has the same layout
            <motion.div key={index} style={{ scale }} className="grid-placement">
              <div className="imageContainer">
                <Image
                  src={src}
                  fill
                  alt="Brides Image"
                  placeholder={isStaticImport ? 'blur' : undefined}
                  className="grid-image object-cover"
                />
              </div>
            </motion.div>
          )
        })}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div style={{ opacity: textOpacityBride }} className="h-[220px] w-[340px]">
            {/* Background box */}
            <div className="absolute inset-x-6 inset-y-3 z-0 rounded-lg bg-white/50 p-6" />

            {/* Text layer */}
            <div className="absolute inset-x-10 inset-y-16 z-20 flex flex-col items-center justify-center gap-1">
              <motion.h2
                style={{ opacity: textOpacityBride }}
                className="text-4xl font-semibold drop-shadow-lg"
              >
                <span className="inline-flex items-center gap-2">
                  The Bride
                  {features.groom_and_bride === true &&
                    brideSection?.brideInstagramLink &&
                    brideSection?.showInstagramLink && (
                      <a
                        href={brideSection.brideInstagramLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <InstagramIcon width="25px" />
                      </a>
                    )}
                </span>
              </motion.h2>
              <motion.h2
                style={{ opacity: textOpacityBride }}
                className="font-cursive2 text-4xl drop-shadow-lg"
              >
                {brideSection?.brideDisplayName ?? config.brideName}
              </motion.h2>
              {brideSection?.showParentInfo &&
                (brideSection.fatherName || brideSection.motherName) && (
                  <motion.h4
                    style={{ opacity: textOpacityParent }}
                    className="text-center text-lg leading-5 drop-shadow-lg"
                  >
                    Daughter of <br />
                    {brideSection.fatherName}{' '}
                    {brideSection.fatherName && brideSection.motherName && (
                      <>
                        &<br />
                      </>
                    )}
                    {brideSection.motherName}
                  </motion.h4>
                )}
            </div>
          </motion.div>
        </div>
        <motion.div style={{ opacity: textOpacityParent }} className="bride-text-overlay" />

        <motion.div style={{ opacity: textOpacityParent }} className="bride-text-overlay" />
      </div>
    </div>
  )
}

export default Bride
