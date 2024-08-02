"use client";

import { useEffect, useRef, useState } from "react";
import Button from "./components/Button";
import Music from "./components/Music";
import LoaderScreen from "./components/LoaderScreen";

const backgroundImages = [
    'url("/images/couple1.jpg")',
    'url("/images/couple2.jpg")',
    'url("/images/couple3.jpg")',
    'url("/images/couple4.jpg")',
    'url("/images/couple5.jpg")',
    'url("/images/couple6.jpg")',
];

export default function Home() {
    let imageIndexRef = useRef(1);

    const handleOpenInvitation = () => {
        // Show loader screen and attach animation
        const loaderScreen = document.getElementById("loader-screen");
        const loaderText = document.getElementsByName("text-body");

        loaderScreen?.classList.add("visible");
        loaderText?.forEach((element) => {
            element.classList.add("animate-loader");
        });
        setTimeout(() => {
            loaderScreen?.classList.remove("visible");
            loaderScreen?.classList.add("after-visible");
        }, 4500);

        // Scroll into next section during animation
        setTimeout(() => {
            const profileSection = document.getElementById("profile");
            profileSection?.scrollIntoView();
        }, 1000);

        // Play music
        const music = document.getElementById("music") as HTMLAudioElement;
        music?.play();
    };

    useEffect(() => {
        const animationAndBackgroundInterval = setInterval(() => {
            const hero = document.getElementById("hero");
            if (!hero) return;
            // Change background image
            hero.style.backgroundImage =
                backgroundImages[imageIndexRef.current];
            imageIndexRef.current =
                backgroundImages.length - 1 === imageIndexRef.current
                    ? 0
                    : imageIndexRef.current + 1;
            // Reset animation
            hero.classList.remove("animateImage");
            void hero.offsetWidth;
            hero.classList.add("animateImage");
        }, 5000);

        return () => clearInterval(animationAndBackgroundInterval);
        // Prevent rerender by letting dependency array be empty
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <body>
            <LoaderScreen />
            <main className="flex min-h-screen w-screen flex-col items-center justify-between font-serif overflow-x-hidden">
                <Music />
                <section
                    id="landing-section"
                    className="h-dvh flex items-center justify-center flex-col gap-10 text-center text-white relative overflow-hidden"
                >
                    <div
                        id="hero"
                        className="w-full h-full absolute -z-10 overlay hero animateImage"
                    />
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
                    <div>Karel Karunia</div>
                    <div>Sabrina Alvina Budiono</div>
                </section>
                <section></section>
            </main>
        </body>
    );
}
