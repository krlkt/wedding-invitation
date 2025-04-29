'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import MusicIcon from '../icons/MusicIcon';
import PauseIcon from '../icons/PauseIcon';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';

const Music = () => {
    const audio = useRef<HTMLAudioElement>(null);
    const [playMusic, setPlayMusic] = useState(false);
    const [showIcon, setShowIcon] = useState(true);
    const lastScrollYRef = useRef(0);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, 'change', (latest) => {
        const prev = lastScrollYRef.current;

        if (latest < prev) {
            setShowIcon(true); // scrolling up
        } else {
            setShowIcon(false); // scrolling down
        }

        lastScrollYRef.current = latest;
    });

    const handleMusicClick = useCallback(() => {
        if (playMusic) {
            audio.current?.pause();
            setPlayMusic(false);
        } else {
            audio.current?.play();
            setPlayMusic(true);
        }
    }, [playMusic]);

    useEffect(() => {
        if (audio.current?.paused) setPlayMusic(false);
        else setPlayMusic(true);
    }, [playMusic]);

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
                        <span className="w-12 h-12 absolute top-0 left-0 inline-flex rounded-full  bg-blue-200 opacity-75 ping" />
                        <button
                            className="bg-blue-200 w-12 h-12 p-3 rounded-full z-10 relative"
                            onClick={handleMusicClick}
                        >
                            {playMusic ? <PauseIcon /> : <MusicIcon />}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Music;
