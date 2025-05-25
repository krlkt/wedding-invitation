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
    const [bgImageIndex, setBgImageIndex] = useState(0);

    useEffect(() => {
        const animationAndBackgroundInterval = setInterval(() => {
            // Change background image
            setBgImageIndex((currentBgImgIndex) =>
                backgroundImagesSrc.length - 1 === currentBgImgIndex ? 0 : currentBgImgIndex + 1
            );
        }, 4000);

        return () => clearInterval(animationAndBackgroundInterval);
        // Prevent rerender by letting dependency array be empty
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const hero = document.getElementById('hero');
        if (!hero) return;
        // Reset animation
        hero.classList.remove('animateImage');
        void hero.offsetWidth;
        hero.classList.add('animateImage');
    }, [bgImageIndex]);

    return (
        <section
            id="landing-section"
            className="h-dvh flex items-center justify-center flex-col gap-10 text-center text-white relative overflow-hidden font-serif"
        >
            <div id="overlay" className="w-full h-full absolute -z-10 overlay" />
            <div id="hero" className="w-full h-full absolute -z-20">
                <Image
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-full object-cover animateImage"
                    src={backgroundImagesSrc[bgImageIndex]}
                    alt="couple image"
                    priority={true}
                />
            </div>
            {children}
        </section>
    );
};

export default CycleBackground;
