export const fadeInVariants = {
    initial: {
        opacity: 0,
        y: 100,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
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
            duration: 0.7,
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
                duration: 0.75,
                staggerChildren: 0.5,
                ease: 'easeInOut',
            },
        },
    },
    itemVariants: {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: 'easeInOut' } },
    },
};
