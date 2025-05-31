import './zoomGridPhotos.css';
import Image from 'next/image';
import Groom1 from '../../../public/images/groom/groom1.jpg';
import Groom2 from '../../../public/images/groom/groom2.jpg';
import Groom3 from '../../../public/images/groom/groom3.jpg';
import Groom4 from '../../../public/images/groom/groom4.jpg';
import Groom5 from '../../../public/images/groom/groom5.jpg';
import Groom6 from '../../../public/images/groom/groom6.jpg';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Groom = () => {
    // Zoom animation
    const zoomAnimationContainer = useRef(null);
    const { scrollYProgress } = useScroll({
        target: zoomAnimationContainer,
        offset: ['start start', 'end end'],
    });

    const scale4 = useTransform(scrollYProgress, [0, 0.8], [1, 4.15]);
    const scale5 = useTransform(scrollYProgress, [0, 0.8], [1, 5]);
    const scale6 = useTransform(scrollYProgress, [0, 0.8], [1, 6]);
    const scale8 = useTransform(scrollYProgress, [0, 0.8], [1, 8]);
    const scale9 = useTransform(scrollYProgress, [0, 0.8], [1, 9]);
    const textOpacityGroom = useTransform(scrollYProgress, [0.3, 0.8], [0, 1]);
    const textOpacityParent = useTransform(scrollYProgress, [0.5, 0.9], [0, 1]);

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
        <div ref={zoomAnimationContainer} className="relative h-[300vh] w-full">
            <div className="sticky top-0 h-screen bg-primary-main overflow-hidden">
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
                    <motion.div style={{ opacity: textOpacityGroom }} className="w-[360px] h-[280px] ">
                        {/* Background box */}
                        <div className="absolute inset-x-6 inset-y-3 bg-black/50 rounded-lg p-6 z-0" />

                        {/* Text layer */}
                        <div className="absolute inset-x-10 inset-y-16 z-20 flex flex-col items-center justify-center text-white">
                            <motion.h2
                                style={{ opacity: textOpacityGroom }}
                                className="text-[48px] leading-tight drop-shadow-lg"
                            >
                                The Groom
                            </motion.h2>
                            <motion.h2
                                style={{ opacity: textOpacityGroom }}
                                className="font-cursive2 text-4xl leading-tight drop-shadow-lg"
                            >
                                Karel Karunia
                            </motion.h2>
                            <motion.h4
                                style={{ opacity: textOpacityParent }}
                                className="text-lg leading-5 drop-shadow-lg text-center"
                            >
                                Third child of <br />
                                Rendy Tirtanadi &<br />
                                Elliana Firmanto
                            </motion.h4>
                        </div>
                    </motion.div>
                </div>
                <motion.div style={{ opacity: textOpacityParent }} className="groom-text-overlay" />
            </div>
        </div>
    );
};

export default Groom;
