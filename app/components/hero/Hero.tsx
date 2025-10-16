import Image from 'next/image';
import './hero.css';
import { useWeddingData } from '@/app/utils/useWeddingData';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
    const { config } = useWeddingData();

    // Format wedding date
    const formattedDate = new Date(config.weddingDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    return (
      <div className="hero-background grow flex flex-col items-center justify-center w-full h-full text-center">
          <div className="inner-wrapper max-w-[600px] flex flex-col gap-4 relative px-[25%] py-[15%] items-center">
              <div id="monogram" className="relative w-24 h-28">
                  <Image
                      src={'/images/monogram/monogram.webp'}
                      alt={`${config.groomName} & ${config.brideName} Monogram`}
                      fill
                      priority
                      fetchPriority="high"
                  />
              </div>
              <div id="hero-text" className="text-black z-10 flex flex-col font-heading gap-4">
                  <p className="text-lg">The Wedding of</p>
                  <div>
                      <p className="font-cursive2 text-5xl">{config.groomName}</p>
                      <p className="font-cursive2 text-5xl">&</p>
                      <p className="font-cursive2 text-5xl">{config.brideName}</p>
                  </div>
                  <p className="text-lg">{formattedDate}</p>
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
