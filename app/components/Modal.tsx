import { FC, PropsWithChildren } from 'react';
import CloseIcon from '../icons/CloseIcon';
import { AnimatePresence, motion } from 'framer-motion';
import './modal.css';

interface ModalProps {
    open: boolean;
    onClose: () => void;
}

const modalSlide = {
    initial: {
        x: 'calc(100% + 100px)',
    },
    enter: {
        x: '0%',
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
        x: 'calc(100% + 100px)',
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
    },
};
const Modal: FC<PropsWithChildren<ModalProps>> = ({ children, open, onClose }) => {
    return (
        <AnimatePresence mode="wait">
            {open ? (
                <div className="fixed h-dvh w-full top-0 left-0 z-40">
                    {/* Backdrop */}
                    <div className="bg-black opacity-50 w-full h-full" onClick={onClose} />
                    {/* Drawer */}
                    <motion.div
                        className="w-[80%] max-w-[25rem] h-full bg-white absolute top-0 right-0"
                        variants={modalSlide}
                        animate="enter"
                        exit={'exit'}
                        initial="initial"
                    >
                        {/* Close Button */}
                        <button className="absolute right-4 top-4 w-10 h-10 z-50" onClick={onClose}>
                            <CloseIcon />
                        </button>
                        {children}
                        <Curve />
                    </motion.div>
                </div>
            ) : null}
        </AnimatePresence>
    );
};

export default Modal;

const Curve = () => {
    const initialPath = `M100 0 L200 0 L200 ${window.innerHeight} L100 ${window.innerHeight} Q-100 ${
        window.innerHeight / 2
    } 100 0`;
    const targetPath = `M100 0 L200 0 L200 ${window.innerHeight} L100 ${window.innerHeight} Q100 ${
        window.innerHeight / 2
    } 100 0`;

    const curve = {
        initial: {
            d: initialPath,
        },
        enter: {
            d: targetPath,
            transition: { duration: 1, ease: [0.76, 0, 0.24, 1] },
        },
        exit: {
            d: initialPath,
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
        },
    };

    return (
        <svg className={'svgCurve'}>
            <motion.path variants={curve} initial="initial" animate="enter" exit="exit"></motion.path>
        </svg>
    );
};
