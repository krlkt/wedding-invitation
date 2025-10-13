import { AnimatePresence, motion } from 'framer-motion';
import { FC } from 'react';

interface LoaderScreenProps {
    isVisible: boolean;
    groomName?: string;
    brideName?: string;
}
const LoaderScreen: FC<LoaderScreenProps> = ({ isVisible, groomName = 'Groom', brideName = 'Bride' }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    id={'loader-screen'}
                    exit={{ opacity: 0, scale: 2 }}
                    transition={{ duration: 0.6 }}
                    className="w-dvh h-dvh bg-black grid place-content-center fixed inset-0 z-50 font-serif"
                >
                    <svg viewBox="0 0 400 400">
                        <text
                            name="text-body"
                            x="40%"
                            y="40%"
                            textAnchor="middle"
                            className={'animate-loader'}
                        >
                            {groomName}
                        </text>
                        <text
                            name="text-body"
                            x="50%"
                            y="40%"
                            dy="0.9em"
                            textAnchor="middle"
                            className={'animate-loader'}
                        >
                            &
                        </text>
                        <text
                            name="text-body"
                            x="60%"
                            y="40%"
                            dy="1.9em"
                            textAnchor="middle"
                            className={'animate-loader'}
                        >
                            {brideName}
                        </text>
                    </svg>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoaderScreen;
