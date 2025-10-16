'use client';

import './zoomGridPhotos.css';
import Image from 'next/image';
import Groom1 from '../../../public/images/groom/groom1.jpg';
import Groom2 from '../../../public/images/groom/groom2.jpg';
import Groom3 from '../../../public/images/groom/groom3.jpg';
import Groom4 from '../../../public/images/groom/groom4.jpg';
import Groom5 from '../../../public/images/groom/groom5.jpg';
import Groom6 from '../../../public/images/groom/groom6.jpg';
import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import InstagramIcon from '@/app/icons/InstagramIcon';
import { useScrollContainer } from '@/app/utils/ScrollContainerContext';
import { useWeddingData } from '@/app/utils/useWeddingData';

const Groom = () => {
    // Get wedding data from context
    const { config, features } = useWeddingData();

    // Get scroll container from context (for embedded previews)
    const { containerRef, isEmbedded } = useScrollContainer();

    // Measure container height for embedded mode
    const [containerHeight, setContainerHeight] = useState<number | null>(null);

    useEffect(() => {
        if (!isEmbedded || !containerRef?.current) return;

        const updateHeight = () => {
            if (containerRef?.current) {
                const height = containerRef.current.clientHeight;
                if (height) {
                    setContainerHeight(height);
                }
            }
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, [isEmbedded, containerRef]);

    // Zoom animation
    const zoomAnimationContainer = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: zoomAnimationContainer,
        offset: ['start start', 'end end'],
        container: containerRef, // Use container if provided, otherwise defaults to window
        layoutEffect: false, // Use useEffect instead of useLayoutEffect for better SSR compatibility
    });

  const scale4 = useTransform(scrollYProgress, [0, 0.8], [1, 4.15])
  const scale5 = useTransform(scrollYProgress, [0, 0.8], [1, 5])
  const scale6 = useTransform(scrollYProgress, [0, 0.8], [1, 6])
  const scale8 = useTransform(scrollYProgress, [0, 0.8], [1, 8])
  const scale9 = useTransform(scrollYProgress, [0, 0.8], [1, 9])
  const textOpacityGroom = useTransform(scrollYProgress, [0.3, 0.8], [0, 1])
  const textOpacityParent = useTransform(scrollYProgress, [0.5, 0.9], [0, 1])

    // Use measured container height for embedded mode, viewport height for fullscreen
    const stickyHeightValue = isEmbedded && containerHeight ? `${containerHeight}px` : '';
    const containerHeightValue = isEmbedded && containerHeight ? `${containerHeight * 3}px` : '';

    const stickyHeightClass = isEmbedded ? '' : 'h-dvh';
    const containerHeightClass = isEmbedded ? '' : 'h-[calc(var(--vh)*300)]';

    const pictures = [
        {
            src: Groom1,
            scale: scale6,
        },
        {
            src: Groom2,
            scale: scale5,
        },
        {
            src: Groom3,
            scale: scale4,
        },
        {
            src: Groom4,
            scale: scale5,
        },
        {
            src: Groom5,
            scale: scale8,
        },
        {
            src: Groom6,
            scale: scale9,
        },
    ];

    return (
        // Container for zoom scroll animation
        <div
            ref={zoomAnimationContainer}
            className={`relative ${containerHeightClass} w-full`}
            style={isEmbedded && containerHeightValue ? { height: containerHeightValue } : undefined}
        >
            <div
                className={`sticky top-0 ${stickyHeightClass} bg-primary-main overflow-hidden`}
                style={isEmbedded && stickyHeightValue ? { height: stickyHeightValue } : undefined}
            >
                {pictures.map(({ scale, src }, index) => (
                    // Element container div to make sure everything has the same layout
                    <motion.div key={index} style={{ scale }} className={'grid-placement'}>
                        <div className={'imageContainer'}>
                            <Image
                                src={src}
                                fill
                                alt={'Grooms Image'}
                                placeholder="blur"
                                className="object-cover grid-image"
                            />
                        </div>
                    </motion.div>
                ))}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-8">
                    <motion.div style={{ opacity: textOpacityGroom }} className="w-[340px] h-[230px]">
                        {/* Background box */}
                        <div className="absolute inset-x-6 inset-y-3 bg-black/50 rounded-lg p-6 z-0" />

                        {/* Text layer */}
                        <div className="absolute inset-x-10 inset-y-16 z-20 flex flex-col gap-2 items-center justify-center text-white">
                            <motion.h2
                                style={{ opacity: textOpacityGroom }}
                                className="text-4xl drop-shadow-lg font-semibold"
                            >
                                <span className="inline-flex items-center gap-2">
                                    The Groom
                                    {features.groom_and_bride === true && config.groomsInstagramLink && (
                                        <a href={config.groomsInstagramLink} target="_blank" rel="noopener noreferrer">
                                            <InstagramIcon width={'25px'} color="white" />
                                        </a>
                                    )}
                                </span>
                            </motion.h2>
                            <motion.h2
                                style={{ opacity: textOpacityGroom }}
                                className="font-cursive2 text-4xl drop-shadow-lg"
                            >
                                {config.groomName}
                            </motion.h2>
                            <motion.h4
                                style={{ opacity: textOpacityParent }}
                                className="text-lg leading-5 drop-shadow-lg text-center"
                            >
                                Son of <br />
                                {config.groomFather} &<br />
                                {config.groomMother}
                            </motion.h4>
                        </div>
                    </motion.div>
                </div>
                <motion.div style={{ opacity: textOpacityParent }} className="groom-text-overlay" />
   
      </div>
    </div>
  )
}

export default Groom
