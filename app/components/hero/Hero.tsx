import Image from 'next/image';
import './hero.css';
import { useLocation } from '@/app/utils/useLocation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
    const { location } = useLocation();
    const isJakartaOrMalang = location === 'malang' || location === 'jakarta';
    return (
        <div className="hero-background grow flex flex-col items-center justify-center w-full h-full text-center">
            <div className="inner-wrapper max-w-[600px] flex flex-col gap-4 relative px-[25%] py-[15%] items-center">
                <div id="monogram" className="relative w-24 h-28">
                    <Image
                        src={'/images/monogram/monogram.webp'}
                        alt={'Karel & Sabrina Monogram'}
                        fill
                        priority
                        fetchPriority="high"
                    />
                </div>
                <div id="hero-text" className="text-black z-10 flex flex-col font-heading gap-4">
                    <p className="text-lg">The Wedding of</p>
                    <div>
                        <p className="font-cursive2 text-5xl">Karel</p>
                        {isJakartaOrMalang && (
                            <p className="text-md text-gray-700">
                                Third child of <br />
                                Rendy Tirtanadi & Elliana Firmanto
                            </p>
                        )}
                        <p className="font-cursive2 text-5xl">&</p>
                        <p className="font-cursive2 text-5xl">Sabrina</p>
                        {isJakartaOrMalang && (
                            <p className="text-md text-gray-700">
                                First child of <br />
                                Hadi Budiono & Weny
                            </p>
                        )}
                    </div>
                    {!isJakartaOrMalang && (
                        <p className="text-lg">
                            {location === 'bali' ? '09.09.2025' : location === 'malang' ? '13.09.2025' : '20.09.2025'}
                        </p>
                    )}
                </div>
            </div>
            <ScrollDownText />
        </div>
    );
};

export default Hero;

const ScrollDownText = () => {
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPrompt(true);
        }, 10000); // 10 seconds

        return () => clearTimeout(timer);
    }, []);

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
            className="flex absolute bottom-10 justify-center text-sm text-secondary-main"
        >
            ↓ Scroll Down ↓
        </motion.div>
    ) : null;
};
