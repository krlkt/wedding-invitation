import Image from 'next/image'
import './hero.css'
import { useLocation } from '@/app/utils/useLocation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const Hero = () => {
  const { location } = useLocation()
  return (
    <div className="hero-background flex h-full w-full grow flex-col items-center justify-center text-center">
      <div className="inner-wrapper relative flex max-w-[600px] flex-col items-center gap-4 px-[25%] py-[15%]">
        <div id="monogram" className="relative h-28 w-24">
          <Image
            src={'/images/monogram/monogram.webp'}
            alt={'Karel & Sabrina Monogram'}
            fill
            priority
            fetchPriority="high"
          />
        </div>
        <div id="hero-text" className="z-10 flex flex-col gap-4 font-heading text-black">
          <p className="text-lg">The Wedding of</p>
          <div>
            <p className="font-cursive2 text-5xl">Karel</p>
            <p className="font-cursive2 text-5xl">&</p>
            <p className="font-cursive2 text-5xl">Sabrina</p>
          </div>
          <p className="text-lg">
            {location === 'bali'
              ? '09.09.2025'
              : location === 'malang'
                ? '13.09.2025'
                : '20.09.2025'}
          </p>
        </div>
      </div>
      <ScrollDownText />
    </div>
  )
}

export default Hero

const ScrollDownText = () => {
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPrompt(true)
    }, 10000) // 10 seconds

    return () => clearTimeout(timer)
  }, [])

  return showPrompt ? (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: [0.8, 1], y: [5, 0, 5] }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut',
      }}
      className="absolute bottom-10 flex justify-center text-sm text-secondary-main"
    >
      ↓ Scroll Down ↓
    </motion.div>
  ) : null
}
