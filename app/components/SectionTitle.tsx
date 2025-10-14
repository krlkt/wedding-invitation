import { motion } from 'framer-motion'
import { FC } from 'react'
import { fadeInVariants } from '../utils/animation'

interface SectionTitleProps {
  title: string
  color?: 'primary' | 'secondary'
  size?: 'large' | 'medium'
}

const SectionTitle: FC<SectionTitleProps> = ({ title, color = 'primary', size = 'large' }) => (
  <motion.h2
    variants={fadeInVariants}
    initial="initial"
    whileInView={'animate'}
    viewport={{ once: true }}
    className={`${size === 'medium' ? 'text-3xl' : 'text-5xl'} mb-6 text-center font-heading ${
      color === 'secondary' ? 'text-secondary-main' : 'text-primary-main'
    }`}
  >
    {title}
  </motion.h2>
)

export default SectionTitle
