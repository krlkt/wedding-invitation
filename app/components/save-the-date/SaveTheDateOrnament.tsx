import { motion } from 'framer-motion';
import Image from 'next/image';
import { FC, PropsWithChildren } from 'react';

const variants = {
    wiggle: {
        rotate: [-2, 2, -2],
        transition: {
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};

const SaveTheDateOrnament = () => (
    <>
        <Image
            src={'/images/ornaments/orn4.png'}
            alt={'blue flowers'}
            width={500}
            height={500}
            className="absolute -right-2 bottom-0 w-[55%]"
        />
        <Image
            src={'/images/ornaments/orn4.png'}
            alt={'blue flowers'}
            width={500}
            height={500}
            className="absolute -left-4 bottom-0 w-[55%]"
        />
        <Wiggle className="absolute right-8 -bottom-2 -z-10 w-[30%]">
            <Image src={'/images/ornaments/baby_orn.png'} alt={'baby breath flower'} width={500} height={500} />
        </Wiggle>
        <Wiggle className="absolute left-[calc(50%-60px)] -bottom-2 w-[30%]">
            <Image src={'/images/ornaments/baby_orn.png'} alt={'baby breath flower'} width={500} height={500} />
        </Wiggle>
        <Wiggle className="absolute left-8 -bottom-2 w-[30%] -z-10">
            <Image src={'/images/ornaments/baby_orn.png'} alt={'baby breath flower'} width={500} height={500} />
        </Wiggle>
    </>
);

const Wiggle: FC<PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
    <motion.div variants={variants} animate="wiggle" style={{ transformOrigin: 'bottom center' }} className={className}>
        {children}
    </motion.div>
);

export default SaveTheDateOrnament;
