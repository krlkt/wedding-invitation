'use client';

import { useEffect } from 'react';

export function useViewportHeight() {
    useEffect(() => {
        let lastHeight = window.innerHeight;

        const setVh = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        const handleScroll = () => {
            const currentHeight = window.innerHeight;
            if (currentHeight > lastHeight) {
                setVh();
                lastHeight = currentHeight;
            }
        };

        // Initial set on mount (likely shorter, due to visible chrome)
        setVh();

        // Only update if height increases (e.g. address bar collapse)
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
}
