'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'

import MusicIcon from '../icons/MusicIcon'
import PauseIcon from '../icons/PauseIcon'

const Music = () => {
  const audio = useRef<HTMLAudioElement>(null)
  const [playMusic, setPlayMusic] = useState(false)
  const [showIcon, setShowIcon] = useState(true)
  const lastScrollYRef = useRef(0)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const prev = lastScrollYRef.current

    if (latest < prev) {
      setShowIcon(true) // scrolling up
    } else {
      setShowIcon(false) // scrolling down
    }

    lastScrollYRef.current = latest
  })

  const handleMusicClick = useCallback(() => {
    if (audio.current?.paused) {
      audio.current?.play().catch(() => {
        setPlayMusic(false)
      })
    } else {
      audio.current?.pause()
    }
  }, [])

  useEffect(() => {
    const audioElement = audio.current
    if (!audioElement) {return}

    const onPlay = () => setPlayMusic(true)
    const onPause = () => setPlayMusic(false)

    audioElement.addEventListener('play', onPlay)
    audioElement.addEventListener('pause', onPause)

    setPlayMusic(!audioElement.paused)

    return () => {
      audioElement.removeEventListener('play', onPlay)
      audioElement.removeEventListener('pause', onPause)
    }
  }, [])

  return (
    <>
      <audio preload="auto" id="music" ref={audio} loop>
        <source src="/music/luckyme.mp3" type="audio/mpeg" />
      </audio>
      <AnimatePresence>
        {showIcon && (
          <motion.div
            key="music-icon"
            className="fixed bottom-6 right-6 z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <span className="ping absolute left-0 top-0 inline-flex h-12 w-12 rounded-full bg-blue-200 opacity-75" />
            <button
              className="relative z-10 h-12 w-12 rounded-full bg-blue-200 p-3"
              onClick={handleMusicClick}
            >
              {playMusic ? <PauseIcon /> : <MusicIcon />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Music
