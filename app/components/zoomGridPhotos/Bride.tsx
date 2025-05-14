import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import './zoomGridPhotos.css';
import Bride1 from '../../../public/images/bride/bride1.jpg';
import Bride2 from '../../../public/images/bride/bride2.jpg';
import Bride3 from '../../../public/images/bride/bride3.jpg';
import Bride4 from '../../../public/images/bride/bride4.jpg';
import Bride5 from '../../../public/images/bride/bride5.jpg';
import Bride6 from '../../../public/images/bride/bride6.jpg';
import Ornament from '../../../public/images/ornaments/orn2.png';

const Bride = () => {
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
    const textOpacityBride = useTransform(scrollYProgress, [0.3, 0.8], [0, 1]);
    const textOpacityParent = useTransform(scrollYProgress, [0.5, 0.9], [0, 1]);

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
        <div ref={zoomAnimationContainer} className="relative h-[300vh] w-full">
            <div className="sticky top-0 h-screen overflow-hidden">
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
                <div className="absolute text-white bottom-14 left-10">
                    <motion.h2
                        style={{ opacity: textOpacityBride }}
                        className="font-serifSuranna text-[64px] leading-tight drop-shadow-lg"
                    >
                        The Bride
                    </motion.h2>
                    <motion.h2
                        style={{ opacity: textOpacityBride }}
                        className="font-serifSuranna text-[30px] leading-tight drop-shadow-lg"
                    >
                        Sabrina Alvina Budiono
                    </motion.h2>
                    <motion.h4 style={{ opacity: textOpacityParent }} className="text-lg leading-5 drop-shadow-lg">
                        First daughter of <br />
                        Hadi Budiono &<br />
                        Weny
                    </motion.h4>
                </div>
            </div>
        </div>
    );
};

export default Bride;
