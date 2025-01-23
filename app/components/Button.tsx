'use client';
import { motion } from 'framer-motion';
import { FC, PropsWithChildren } from 'react';

interface ButtonProps {
    onClick?: () => void;
    alternateBackground?: boolean;
    type?: 'button' | 'submit' | 'reset';
}
const Button: FC<PropsWithChildren<ButtonProps>> = ({
    onClick,
    alternateBackground = false,
    type,
    children,
}) => {
    return (
        <motion.button
            onClick={onClick}
            whileTap={{ scale: 0.85 }}
            className={`bg-opacity-40 ${
                alternateBackground ? 'bg-blue-200' : 'bg-white'
            } rounded-full px-4 py-2`}
            type={type}
        >
            {children}
        </motion.button>
    );
};

export default Button;
