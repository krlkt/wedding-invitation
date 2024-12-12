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
                <section className="min-h-dvh text-center pt-10" id="profile">
                    <div className="p-10 flex gap-8 flex-col items-center justify-center">
                        <Avatar src="/images/husband_to_be.jpg" />
                        <div>
                            <h4 className="font-bold text-2xl">
                                Karel Karunia
                            </h4>
                            <p>
                                Husband to be. Developer. Video Gamer. Sports
                                enthusiast. Believer. Cat dad.
                            </p>
                        </div>
                    </div>
                    <div className="px-10 flex flex-col gap-8 items-center justify-center">
                        <Avatar src="/images/wife_to_be.jpg" />
                        <div>
                            <h4 className="font-bold text-2xl">
                                Sabrina Alvina Budiono
                            </h4>
                            <p>
                                Wife to be. Developer. Video Gamer. Sports
                                enthusiast. Believer. Cat mom.
                            </p>
                        </div>
                    </div>
                </section>
                {/* Landing page (Wedding of bla, dear bla, open invitation) Music on open
                Profile of KK and Sab
                History
                first met / first date / bf gf / first & second pet / proposal
                Countdown / Save the date (opt) masukin calendar
                When and where (Google map link) (How to differentiate bali malang jakarta)
                Photo galery
                Confirmation (RSVP)
                Wedding Gift (Bank bca/paypal)
                Name and wish
                Thank you
                Show table sitting position (Bali only - opt) */}
            </main>
        </>
    );
}
