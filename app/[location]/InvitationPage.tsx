'use client';

import { useEffect, useState } from 'react';
import LoaderScreen from '../components/LoaderScreen';
import Music from '../components/Music';
import Avatar from '../components/Avatar';

export default function InvitationPage() {
    const [isLoaderScreenVisible, setIsLoaderScreenVisible] =
        useState<boolean>(true);

    useEffect(() => {
        const handleFirstVisit = () => {
            // Add or remove 'locked' class based on loader visibility
            if (isLoaderScreenVisible) {
                document.body.classList.add('locked');
            } else {
                document.body.classList.remove('locked');
            }

            // Remove loader screen after 4.5 seconds
            setTimeout(() => {
                setIsLoaderScreenVisible(false);
            }, 4500);

            // Play music
            const music = document.getElementById('music') as HTMLAudioElement;
            music?.play();
        };
        handleFirstVisit();
    }, [isLoaderScreenVisible]);

    return (
        <>
            <LoaderScreen isVisible={isLoaderScreenVisible} />
            <main className="flex min-h-screen w-screen flex-col items-center justify-between font-serif">
                <Music />
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
        </>
    );
}
