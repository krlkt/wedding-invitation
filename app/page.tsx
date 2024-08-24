'use client';

import { useEffect, useState } from 'react';
import Button from './components/Button';
import Music from './components/Music';
import LoaderScreen from './components/LoaderScreen';
import Image from 'next/image';
import Avatar from './components/Avatar';

const backgroundImagesSrc = [
    '/images/couple1.jpg',
    '/images/couple2.jpg',
    '/images/couple3.jpg',
    '/images/couple4.jpg',
    '/images/couple5.jpg',
    '/images/couple6.jpg',
];

export default function Home() {
    const [bgImageIndex, setBgImageIndex] = useState(0);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const handleOpenInvitation = () => {
        // Show loader screen and attach animation
        const loaderScreen = document.getElementById('loader-screen');
        const loaderText = document.getElementsByName('text-body');

        setIsVisible(true);
        loaderText?.forEach((element) => {
            element.classList.add('animate-loader');
        });
        setTimeout(() => {
            setIsVisible(false);
        }, 4500);

        // Scroll into next section during animation
        setTimeout(() => {
            const profileSection = document.getElementById('profile');
            profileSection?.scrollIntoView();
        }, 1000);

        // Play music
        const music = document.getElementById('music') as HTMLAudioElement;
        music?.play();
    };

    useEffect(() => {
        const animationAndBackgroundInterval = setInterval(() => {
            // Change background image
            setBgImageIndex((currentBgImgIndex) =>
                backgroundImagesSrc.length - 1 === currentBgImgIndex
                    ? 0
                    : currentBgImgIndex + 1
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
        <body>
            <LoaderScreen isVisible={isVisible} />
            <main className="flex min-h-screen w-screen flex-col items-center justify-between font-serif">
                <Music />
                <section
                    id="landing-section"
                    className="h-dvh flex items-center justify-center flex-col gap-10 text-center text-white relative overflow-hidden"
                >
                    <div
                        id="overlay"
                        className="w-full h-full absolute -z-10 overlay"
                    />
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
                    <header className="font-serif flex flex-col gap-4">
                        <h2 className="text-2xl">The wedding of</h2>
                        <h3 className="text-4xl font-cursive">
                            Karel and Sabrina
                        </h3>
                    </header>
                    <div className="flex flex-col gap-4">
                        <h4 className="text-xl">Dear Mr./Mrs.</h4>
                        <h2 className="text-3xl font-cursive2 text-shadow-lg">
                            Sabrina A. Budiono and partner
                        </h2>
                    </div>
                    <Button onClick={handleOpenInvitation}>
                        Open invitation
                    </Button>
                </section>
                <section className="h-dvh" id="profile">
                    <div className="px-10 flex gap-8">
                        <Avatar src="/images/husband_to_be.png" />
                        <div className="flex flex-col gap-2 justify-end">
                            <h4 className="font-bold text-2xl">
                                Karel Karunia
                            </h4>
                            <p>
                                Husband to be. Developer. Video Gamer. Sports
                                enthusiast. Believer. Cat dad.
                            </p>
                        </div>
                    </div>
                    <div className="px-10 flex gap-8">
                        <div className="flex flex-col gap-2 justify-end">
                            <h4 className="font-bold text-2xl">
                                Sabrina Alvina Budiono
                            </h4>
                            <p>
                                Wife to be. Developer. Video Gamer. Sports
                                enthusiast. Believer. Cat mom.
                            </p>
                        </div>
                        <Avatar src="/images/wife_to_be.png" />
                    </div>
                </section>
            </main>
        </body>
    );
}
