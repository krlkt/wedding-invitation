'use client';
import { motion } from 'framer-motion';
import { FC, PropsWithChildren } from 'react';

interface ButtonProps {
    onClick?: () => void;
    alternateBackground?: boolean;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
}
const Button: FC<PropsWithChildren<ButtonProps>> = ({
    onClick,
    alternateBackground = false,
    type,
    disabled = false,
    children,
}) => {
    return (
        <motion.button
            onClick={onClick}
            whileTap={disabled ? {} : { scale: 0.85 }}
            className={`bg-opacity-40 ${disabled ? 'bg-gray-200' : alternateBackground ? 'bg-blue-200' : 'bg-white'} ${
                disabled && 'text-gray-400'
            } rounded-full px-4 py-2`}
            type={type}
            disabled={disabled}
        >
            {children}
        </motion.button>
    );
};

export default Button;
