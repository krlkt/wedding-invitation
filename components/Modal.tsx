import { FC, PropsWithChildren } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import CloseIcon from './icons/CloseIcon';
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
        <div className="fixed left-0 top-0 z-40 h-dvh w-full">
          {/* Backdrop */}
          <div className="h-full w-full bg-black opacity-50" onClick={onClose} />
          {/* Drawer */}
          <motion.div
            className="absolute right-0 top-0 h-full w-[80%] max-w-[25rem] bg-white"
            variants={modalSlide}
            animate="enter"
            exit="exit"
            initial="initial"
          >
            {/* Close Button */}
            <button className="absolute right-4 top-4 z-50 h-10 w-10" onClick={onClose}>
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
    <svg className="svgCurve">
      <motion.path variants={curve} initial="initial" animate="enter" exit="exit" />
    </svg>
  );
};
