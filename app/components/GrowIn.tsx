import { motion } from 'framer-motion';
import { FC, HTMLAttributes, PropsWithChildren } from 'react';
import { growInVariants } from '../utils/animation';

const GrowIn: FC<PropsWithChildren<{ className?: HTMLAttributes<HTMLDivElement>['className'] }>> = ({
    children,
    ...props
}) => (
    <motion.div
        variants={growInVariants}
        initial="initial"
        whileInView={'animate'}
        viewport={{ once: true }}
        {...props}
    >
        {children}
    </motion.div>
);

export default GrowIn;
