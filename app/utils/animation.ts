export const fadeInVariants = {
    initial: {
        opacity: 0,
        y: 100,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: 'easeInOut',
        },
    },
};

export const fadeInFromLeft = {
    initial: {
        opacity: 0,
        x: -100,
    },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: 'easeInOut',
        },
    },
};

export const fadeInFromRight = {
    initial: {
        opacity: 0,
        x: 100,
    },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: 'easeInOut',
        },
    },
};

export const staggeredFadeInVariants = {
    initial: {
        opacity: 0,
        y: 100,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            staggerChildren: 0.5,
            ease: 'easeInOut',
        },
    },
};

export const Stagger = {
    containerVariants: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.3,
                staggerChildren: 0.26,
                ease: 'easeInOut',
            },
        },
    },
    itemVariants: {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeInOut' } },
    },
};

export const rotateAnimation = (degArray: Array<number>, delay?: number) => ({
    rotate: degArray,
    transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
    },
});
