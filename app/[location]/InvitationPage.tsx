'use client';

import { useEffect, useState } from 'react';
import LoaderScreen from '../components/LoaderScreen';
import Music from '../components/Music';
import Avatar from '../components/Avatar';
import Timeline from '../components/Timeline/Timeline';

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
                <section
                    className="min-h-dvh text-center pt-10 flex flex-col gap-10"
                    id="profile"
                >
                    <h2 className="text-4xl">Bride & Groom</h2>
                    <div className="px-10 flex flex-col gap-8 items-center justify-center">
                        <Avatar src="/images/wife_to_be.jpg" />
                        <div>
                            <h4 className="font-bold text-2xl">
                                Sabrina Alvina Budiono
                            </h4>
                            <p>First daughter of</p>
                            <p>Hadi Budiono</p>
                            <p>& Weny</p>
                        </div>
                    </div>
                    <div className="p-10 flex gap-8 flex-col items-center justify-center">
                        <Avatar src="/images/husband_to_be.jpg" />
                        <div>
                            <h4 className="font-bold text-2xl">
                                Karel Karunia
                            </h4>
                            <p>Second Son Of</p>
                            <p>Rendy Tirtanadi</p>
                            <p>& Elliana Firmanto</p>
                        </div>
                    </div>
                </section>
                <section className="w-full p-4" id="history">
                    <Timeline />
                </section>
                {/* When? */}
                <section className="text-center py-24 bg-white w-full">
                    <div className="flex flex-col gap-2">
                        <div className="font-cursive_nautigal  text-8xl">
                            <p className="text-gray-400 opacity-60">Save</p>
                            <p className="text-gray-500 opacity-70 leading-8">
                                the
                            </p>
                            <p className="text-gray-600 ">Date</p>
                        </div>
                        <p className="uppercase text-gray-600">
                            for the wedding of
                        </p>
                        <p className="uppercase text-2xl font-semibold">
                            Karel & Sabrina
                        </p>
                        <p className="text-2xl text-gray-900">09/09/2025</p>
                    </div>
                </section>
                {/* Where? */}
                <section></section>
                {/* 
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
