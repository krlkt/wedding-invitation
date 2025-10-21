import Image from 'next/image'
import './hero.css'
import { useWeddingData } from '@/app/utils/useWeddingData'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const Hero = () => {
  const { config, startingSection } = useWeddingData()

  // Use display names from starting section, fallback to basic names from config
  const groomDisplayName = startingSection?.groomDisplayName || config.groomName
  const brideDisplayName = startingSection?.brideDisplayName || config.brideName

  // Show wedding date if enabled in starting section (default true)
  const showWeddingDate = startingSection?.showWeddingDate !== false

  // Format wedding date
  const formattedDate = new Date(config.weddingDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  // Show parent info if enabled
  const showParentInfo = startingSection?.showParentInfo === true
  const hasGroomParents = startingSection?.groomFatherName || startingSection?.groomMotherName
  const hasBrideParents = startingSection?.brideFatherName || startingSection?.brideMotherName

  return (
    <div className="hero-background flex h-full w-full grow flex-col items-center justify-center text-center">
      <div className="inner-wrapper relative flex max-w-[600px] flex-col items-center gap-4 px-[25%] py-[15%]">
        <div id="monogram" className="relative h-28 w-24">
          <Image
            src={'/images/monogram/monogram.webp'}
            alt={`${groomDisplayName} & ${brideDisplayName} Monogram`}
            fill
            priority
            fetchPriority="high"
          />
        </div>
        <div id="hero-text" className="z-10 flex flex-col gap-4 font-heading text-black">
          <p className="text-lg">The Wedding of</p>
          <div>
            <p className="font-cursive2 text-5xl">{groomDisplayName}</p>
            {showParentInfo && hasGroomParents && (
              <div className="mt-2 text-sm">
                <p className="text-xs opacity-70">Son of</p>
                {startingSection?.groomFatherName && <p>{startingSection.groomFatherName}</p>}
                {startingSection?.groomMotherName && <p>{startingSection.groomMotherName}</p>}
              </div>
            )}
            <p className="font-cursive2 text-5xl">&</p>
            <p className="font-cursive2 text-5xl">{brideDisplayName}</p>
            {showParentInfo && hasBrideParents && (
              <div className="mt-2 text-sm">
                <p className="text-xs opacity-70">Daughter of</p>
                {startingSection?.brideFatherName && <p>{startingSection.brideFatherName}</p>}
                {startingSection?.brideMotherName && <p>{startingSection.brideMotherName}</p>}
              </div>
            )}
          </div>
          {showWeddingDate && <p className="text-lg">{formattedDate}</p>}
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
