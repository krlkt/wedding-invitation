"use client";

import { useEffect, useState } from "react";
import Button from "./components/Button";
import Music from "./components/Music";
import couple_image1 from "../public/images/couple1.jpg";
import couple_image2 from "../public/images/couple2.jpg";
import couple_image3 from "../public/images/couple3.jpg";
import couple_image4 from "../public/images/couple4.jpg";
import couple_image5 from "../public/images/couple5.jpg";
import couple_image6 from "../public/images/couple6.jpg";
import Image from "next/image";
import LoaderScreen from "./components/LoaderScreen";

const landingPageImages = [
    couple_image1,
    couple_image2,
    couple_image3,
    couple_image4,
    couple_image5,
    couple_image6,
];

export default function Home() {
    const [currentIndex, setCurrentIndex] = useState(0);

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
        const intervalId = setInterval(() => {
            if (currentIndex === landingPageImages.length - 1) {
                setCurrentIndex(0);
            } else {
                setCurrentIndex(currentIndex + 1);
            }
        }, 5000);

        return () => clearInterval(intervalId);
    }, [currentIndex]);

    return (
        <body>
            <LoaderScreen />
            <main className="flex min-h-screen w-screen flex-col items-center justify-between font-serif overflow-x-hidden">
                <Music />
                <section
                    id="landing-section"
                    className="h-dvh flex items-center justify-center flex-col gap-10 text-center text-white"
                >
                    <div className="w-full h-full absolute -z-10 overflow-hidden">
                        <Image
                            className="animateImage"
                            src={landingPageImages[currentIndex]}
                            alt="landing page images"
                            fill
                            objectFit="cover"
                            objectPosition="center"
                        />
                    </div>
                    <header className="font-serif flex flex-col gap-4">
                        <h2 className="text-4xl">The wedding of</h2>
                        <h3 className="text-6xl font-cursive">
                            Karel and Sabrina
                        </h3>
                    </header>
                    <div className="flex flex-col gap-4">
                        <h4 className="text-2xl">Dear Mr./Mrs.</h4>
                        <h2 className="text-5xl font-cursive2 text-shadow-lg">
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
