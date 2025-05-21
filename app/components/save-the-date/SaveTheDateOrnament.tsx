import { motion } from 'framer-motion';
import Image from 'next/image';
import { FC, PropsWithChildren } from 'react';

const variants = {
    wiggle: {
        rotate: [-5, 5, -5],
        transition: {
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
    wiggleDownward: {
        rotate: [185, 175, 185],
        transition: {
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};

const SaveTheDateOrnament = ({ downward = false }: { downward?: boolean }) => (
    <>
        <Image
            src={'/images/ornaments/orn4.png'}
            alt={'blue flowers'}
            width={500}
            height={500}
            className={`absolute -right-2 ${downward ? 'top-0' : 'bottom-0'} w-[55%] ${downward && 'rotate-180'}`}
        />
        <Image
            src={'/images/ornaments/orn4.png'}
            alt={'blue flowers'}
            width={500}
            height={500}
            className={`absolute -left-4 w-[55%] ${downward ? 'top-0' : 'bottom-0'} ${downward && 'rotate-180'}`}
        />
        <Wiggle
            className={`absolute ${downward ? 'bottom-24' : '-bottom-2'} right-8 -z-10 w-[30%]`}
            downward={downward}
        >
            <Image src={'/images/ornaments/baby_orn.png'} alt={'baby breath flower'} width={500} height={500} />
        </Wiggle>
        <Wiggle
            className={`absolute ${downward ? 'bottom-24' : '-bottom-2'} left-[calc(50%-60px)] -z-10 w-[30%]`}
            downward={downward}
        >
            <Image src={'/images/ornaments/baby_orn.png'} alt={'baby breath flower'} width={500} height={500} />
        </Wiggle>
        <Wiggle className={`absolute ${downward ? 'bottom-24' : '-bottom-2'} left-8 -z-10 w-[30%]`} downward={downward}>
            <Image src={'/images/ornaments/baby_orn.png'} alt={'baby breath flower'} width={500} height={500} />
        </Wiggle>
    </>
);

const Wiggle: FC<PropsWithChildren<{ className?: string; downward?: boolean }>> = ({
    children,
    downward,
    className,
}) => (
    <motion.div
        variants={variants}
        animate={`${downward ? 'wiggleDownward' : 'wiggle'}`}
        style={{ transformOrigin: 'bottom center' }}
        className={className}
    >
        {children}
    </motion.div>
);

export default SaveTheDateOrnament;
