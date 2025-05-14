import styles from './zoomGridStyles.module.scss';
import Image from 'next/image';
import Groom1 from '../../../public/images/groom/groom1.jpg';
import Groom2 from '../../../public/images/groom/groom2.jpg';
import Groom3 from '../../../public/images/groom/groom3.jpg';
import Groom4 from '../../../public/images/groom/groom4.jpg';
import Groom5 from '../../../public/images/groom/groom5.jpg';
import Groom6 from '../../../public/images/groom/groom6.jpg';
import Ornament1 from '../../../public/images/ornaments/orn2.png';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Groom = () => {
    // Zoom animation
    const zoomAnimationContainer = useRef(null);
    const { scrollYProgress } = useScroll({
        target: zoomAnimationContainer,
        offset: ['start start', 'end end'],
    });

    const scale4 = useTransform(scrollYProgress, [0, 0.8], [1, 4]);
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
        {
            src: Ornament1,
            scale: scale6,
        },
        {
            src: Ornament1,
            scale: scale8,
        },
    ];
    return (
        // Container for zoom scroll animation
        <div ref={zoomAnimationContainer} className="relative h-[300vh] w-full">
            <div className="sticky top-0 h-screen bg-primary-main overflow-hidden">
                {pictures.map(({ scale, src }, index) => (
                    // Element container div to make sure everything has the same layout
                    <motion.div key={index} style={{ scale }} className={styles.el}>
                        <div className={styles.imageContainer}>
                            <Image src={src} fill alt={'Grooms Image'} placeholder="blur" className="object-cover" />
                        </div>
                    </motion.div>
                ))}
                <div className="absolute text-white bottom-14 left-10">
                    <motion.div style={{ opacity: textOpacityGroom }} className="relative">
                        <motion.h2 className="font-serifSuranna text-[48px] leading-tight drop-shadow-lg relative">
                            The Groom
                        </motion.h2>
                        <Image
                            src={'/images/bowtie.png'}
                            alt={'Bowtie'}
                            width={60}
                            height={25}
                            className="absolute -top-2 -right-7 rotate-45"
                        />
                    </motion.div>
                    <motion.h2
                        style={{ opacity: textOpacityGroom }}
                        className="font-serifSuranna text-[30px] leading-tight drop-shadow-lg"
                    >
                        Karel Karunia
                    </motion.h2>
                    <motion.h4 style={{ opacity: textOpacityParent }} className="text-lg leading-5 drop-shadow-lg">
                        Second son of <br />
                        Rendy Tirtanadi &<br />
                        Elliana Firmanto
                    </motion.h4>
                </div>
            </div>
        </div>
    );
};

export default Groom;
