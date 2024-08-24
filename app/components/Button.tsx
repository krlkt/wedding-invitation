'use client';
import { motion } from 'framer-motion';
import { FC, PropsWithChildren } from 'react';

interface ButtonProps {
    onClick?: () => void;
}
const Button: FC<PropsWithChildren<ButtonProps>> = ({ onClick, children }) => {
    return (
        <motion.button
            onClick={onClick}
            whileTap={{ scale: 0.85 }}
            className="bg-opacity-40 bg-white rounded-full px-4 py-2"
        >
            {children}
        </motion.button>
    );
};

export default Button;
