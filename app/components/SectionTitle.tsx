import { motion } from 'framer-motion';
import { FC } from 'react';
import { fadeInVariants } from '../utils/animation';

interface SectionTitleProps {
    title: string;
    color?: 'primary' | 'secondary';
}

const SectionTitle: FC<SectionTitleProps> = ({ title, color = 'primary' }) => (
    <motion.h2
        variants={fadeInVariants}
        initial="initial"
        whileInView={'animate'}
        viewport={{ once: true }}
        className={`text-5xl font-cursive_nautigal text-center ${
            color === 'secondary' ? 'text-secondary-main' : 'text-primary-main'
        }`}
    >
        {title}
    </motion.h2>
);

export default SectionTitle;
