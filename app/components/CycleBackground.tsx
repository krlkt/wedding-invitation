import Image from 'next/image';
import { FC, PropsWithChildren, useEffect, useState } from 'react';

const backgroundImagesSrc = [
    '/images/unopened/cycle1.jpg',
    '/images/unopened/cycle2.jpg',
    '/images/unopened/cycle3.jpg',
    '/images/unopened/cycle4.jpg',
    '/images/unopened/cycle5.jpg',
    '/images/unopened/cycle6.jpg',
];

const CycleBackground: FC<PropsWithChildren> = ({ children }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [previousImageIndex, setPreviousImageIndex] = useState<number | null>(
        null
    );
    const [isFading, setIsFading] = useState(false);

    // Preload images
    useEffect(() => {
        backgroundImagesSrc.forEach((src) => {
            const img = new window.Image();
            img.src = src;
        });
    }, []);

    // Cycle images
    useEffect(() => {
        const timer = setInterval(() => {
            setIsFading(true);
            setPreviousImageIndex(currentImageIndex);
            setCurrentImageIndex(
                (prev) => (prev + 1) % backgroundImagesSrc.length
            );
        }, 4000);
        return () => clearInterval(timer);
    }, [currentImageIndex]);

    const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.classList.add('animateImage');
        setIsFading(false);
    };

    return (
        <section
            id="landing-section"
            className="h-dvh flex items-center justify-center flex-col gap-10 text-center text-white relative overflow-hidden font-serif"
        >
            <div id="overlay" className="w-full h-full absolute -z-10 overlay" />
            <div id="hero" className="w-full h-full absolute -z-20">
                {previousImageIndex !== null && (
                    <Image
                        key={previousImageIndex}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-full h-full object-cover absolute inset-0 animateImage"
                        src={backgroundImagesSrc[previousImageIndex]}
                        alt="couple image"
                        priority
                    />
                )}
                <Image
                    key={currentImageIndex}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-full object-cover absolute inset-0 transition-opacity duration-1000"
                    style={{ opacity: isFading ? 0 : 1 }}
                    src={backgroundImagesSrc[currentImageIndex]}
                    alt="couple image"
                    priority
                    onLoad={handleLoad}
                />
            </div>
            {children}
        </section>
    );
};

export default CycleBackground;
