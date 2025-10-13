import { motion, useMotionTemplate, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import './zoomGridPhotos.css';
import Bride1 from '../../../public/images/bride/bride1.jpg';
import Bride2 from '../../../public/images/bride/bride2.jpg';
import Bride3 from '../../../public/images/bride/bride3.jpg';
import Bride4 from '../../../public/images/bride/bride4.jpg';
import Bride5 from '../../../public/images/bride/bride5.jpg';
import Bride6 from '../../../public/images/bride/bride6.jpg';
import Ornament from '../../../public/images/ornaments/orn2.png';
import InstagramIcon from '@/app/icons/InstagramIcon';
import { useScrollContainer } from '@/app/utils/ScrollContainerContext';
import { useWeddingData } from '@/app/utils/useWeddingData';

const Bride = () => {
    // Get wedding data from context
    const { config } = useWeddingData();

    // Get scroll container from context (for embedded previews)
    const { containerRef, isEmbedded } = useScrollContainer();

    // Measure container height for embedded mode
    const [containerHeight, setContainerHeight] = useState<number | null>(null);

    useEffect(() => {
        if (isEmbedded && containerRef?.current) {
            const updateHeight = () => {
                const height = containerRef.current?.clientHeight;
                if (height) {
                    setContainerHeight(height);
                }
            };

            updateHeight();
            window.addEventListener('resize', updateHeight);
            return () => window.removeEventListener('resize', updateHeight);
        }
    }, [isEmbedded, containerRef]);

    // Zoom animation
    const zoomAnimationContainer = useRef(null);
    const { scrollYProgress } = useScroll({
        target: zoomAnimationContainer,
        offset: ['start start', 'end end'],
        container: containerRef, // Use container if provided, otherwise defaults to window
    });

    const scale4 = useTransform(scrollYProgress, [0, 0.8], [1, 4.15]);
    const scale5 = useTransform(scrollYProgress, [0, 0.8], [1, 5]);
    const scale6 = useTransform(scrollYProgress, [0, 0.8], [1, 6]);
    const scale8 = useTransform(scrollYProgress, [0, 0.8], [1, 8]);
    const scale9 = useTransform(scrollYProgress, [0, 0.8], [1, 9]);
    const textOpacityBride = useTransform(scrollYProgress, [0.3, 0.8], [0, 1]);
    const textOpacityParent = useTransform(scrollYProgress, [0.5, 0.9], [0, 1]);
    const bgOpacity = useTransform(scrollYProgress, [0.3, 0.8], [0, 0.4]);
    const backgroundColor = useMotionTemplate`rgba(0,0,0, ${bgOpacity})`;

    // Use measured container height for embedded mode, viewport height for fullscreen
    const stickyHeightValue = isEmbedded && containerHeight ? `${containerHeight}px` : '';
    const containerHeightValue = isEmbedded && containerHeight ? `${containerHeight * 3}px` : '';

    const stickyHeightClass = isEmbedded ? '' : 'h-dvh';
    const containerHeightClass = isEmbedded ? '' : 'h-[calc(var(--vh)*300)]';

    const pictures = [
        {
            src: Bride1,
            scale: scale6,
        },
        {
            src: Bride2,
            scale: scale5,
        },
        {
            src: Bride3,
            scale: scale4,
        },
        {
            src: Bride4,
            scale: scale5,
        },
        {
            src: Bride5,
            scale: scale8,
        },
        {
            src: Bride6,
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
    ];
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
                {pictures.map(({ scale, src }, index) => (
                    // Element container div to make sure everything has the same layout
                    <motion.div key={index} style={{ scale }} className={'grid-placement'}>
                        <div className={'imageContainer'}>
                            <Image
                                src={src}
                                fill
                                alt={'Brides Image'}
                                placeholder="blur"
                                className="object-cover grid-image"
                            />
                        </div>
                    </motion.div>
                ))}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-8">
                    <motion.div style={{ opacity: textOpacityBride }} className="w-[340px] h-[220px]">
                        {/* Background box */}
                        <div className="absolute inset-x-6 inset-y-3 bg-white/50 rounded-lg p-6 z-0" />

                        {/* Text layer */}
                        <div className="absolute inset-x-10 inset-y-16 z-20 flex flex-col gap-1 items-center justify-center">
                            <motion.h2
                                style={{ opacity: textOpacityBride }}
                                className="text-4xl drop-shadow-lg font-semibold"
                            >
                                <span className="inline-flex items-center gap-2">
                                    The Bride
                                    <a
                                        href="https://instagram.com/sabrinaalvina"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <InstagramIcon width={'25px'} />
                                    </a>
                                </span>
                            </motion.h2>
                            <motion.h2
                                style={{ opacity: textOpacityBride }}
                                className="font-cursive2 text-4xl drop-shadow-lg"
                            >
                                {config.brideName}
                            </motion.h2>
                            <motion.h4
                                style={{ opacity: textOpacityParent }}
                                className="text-lg leading-5 drop-shadow-lg text-center"
                            >
                                Daughter of <br />
                                {config.brideFather} &<br />
                                {config.brideMother}
                            </motion.h4>
                        </div>
                    </motion.div>
                </div>
                <motion.div style={{ opacity: textOpacityParent }} className="bride-text-overlay" />
            </div>
        </div>
    );
};

export default Bride;
