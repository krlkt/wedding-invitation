import { motion } from 'framer-motion';
import { FC, HTMLAttributes, PropsWithChildren } from 'react';
import { fadeInFromLeft, fadeInFromRight, fadeInVariants } from '../utils/animation';

const FadeIn: FC<
    PropsWithChildren<{ className?: HTMLAttributes<HTMLDivElement>['className']; from?: 'left' | 'right' | 'bottom' }>
> = ({ children, from = 'bottom', ...props }) => (
    <motion.div
        variants={from === 'right' ? fadeInFromRight : from === 'left' ? fadeInFromLeft : fadeInVariants}
        initial="initial"
        whileInView={'animate'}
        // viewport={{ once: true }}
        {...props}
    >
        {children}
    </motion.div>
);

export default FadeIn;
