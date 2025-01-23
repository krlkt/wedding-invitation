'use client';

import { useEffect, useState } from 'react';
import LoaderScreen from '../components/LoaderScreen';
import Music from '../components/Music';
import Avatar from '../components/Avatar';
import Timeline from '../components/Timeline/Timeline';
import InstagramIcon from '../icons/InstagramIcon';
import LocationComponent, { Locations } from '../components/LocationComponent';
import Button from '../components/Button';
import 'photoswipe/style.css';
import ImageGallery from '../components/ImageGallery';
import Gift from '../components/Gift';
import WishForm from '../components/WishForm';
import RSVP from '../components/RSVP';

export default function InvitationPage({ location }: { location: Locations }) {
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
                    <h2 className="text-5xl font-cursive_nautigal text-gray-700">
                        Bride & Groom
                    </h2>
                    <div className="flex flex-col gap-4 items-center justify-center">
                        <Avatar src="/images/wife_to_be.jpg" />
                        <div className="flex flex-col gap-1">
                            <h4 className="font-bold text-2xl text-gray-800">
                                Sabrina Alvina Budiono
                            </h4>
                            <div className="text-gray-700">
                                <p>First Daughter Of</p>
                                <p>Hadi Budiono</p>
                                <p>& Weny</p>
                            </div>
                            <a
                                className="flex gap-2 justify-center items-center"
                                href="https://www.instagram.com/sabrinaalvina?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                            >
                                <InstagramIcon width="14px" />
                                <span className="text-sm">sabrinaalvina</span>
                            </a>
                        </div>
                    </div>
                    <div className="flex gap-4 flex-col items-center justify-center ">
                        <Avatar src="/images/husband_to_be.jpg" />
                        <div className="flex flex-col gap-1">
                            <h4 className="font-bold text-2xl text-gray-800">
                                Karel Karunia
                            </h4>
                            <div className="text-gray-700">
                                <p>Second Son Of</p>
                                <p>Rendy Tirtanadi</p>
                                <p>& Elliana Firmanto</p>
                            </div>
                            <a
                                className="flex gap-2 justify-center items-center"
                                href="https://www.instagram.com/karelkarunia?igsh=aTJoeDVndXZmN3I4"
                            >
                                <InstagramIcon width="14px" />
                                <span className="text-sm">karelkarunia</span>
                            </a>
                        </div>
                    </div>
                </section>
                {/* History - Opt: Hide by default, open accordion to animate and show timeline */}
                <section
                    className="w-full p-4 flex flex-col gap-10 mt-10"
                    id="history"
                >
                    <h2 className="text-5xl font-cursive_nautigal text-gray-700 text-center">
                        History
                    </h2>
                    <Timeline />
                </section>
                {/* When? */}
                <section className="text-center py-24 bg-white w-full ,t-10">
                    <div className="flex flex-col gap-2 items-center">
                        <div className="font-cursive_nautigal text-8xl">
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
                        <Button alternateBackground>
                            <a
                                target="_blank"
                                href="https://calendar.google.com/calendar/event?action=TEMPLATE&amp;tmeid=X2M1cGpjb2ppOTFubDZ0YTM2MHIzaWtpaWFoMTNndWFrNzU0bmViamZkZyBrYXJlbGthcnVuaWEyNEBt&amp;tmsrc=karelkarunia24%40gmail.com"
                            >
                                Add to calendar
                            </a>
                        </Button>
                    </div>
                </section>
                {/* Where? */}
                <section className="flex flex-col gap-4 text-center relative w-full h-dvh">
                    <LocationComponent location={location} />
                </section>
                {/* Photo galery */}
                <section className="flex flex-col gap-4 text-center justify-center relative w-full h-dvh">
                    <ImageGallery />
                </section>
                {/* RSVP */}
                <section className="flex flex-col gap-4 text-center justify-center relative w-full h-dvh px-4">
                    <RSVP />
                </section>
                {/* Wedding Gift */}
                <section className="flex flex-col gap-4 text-center justify-center relative w-full h-dvh px-4">
                    <Gift />
                </section>
                <section className="flex flex-col gap-4 text-center justify-center relative w-full h-dvh px-4">
                    <h2 className="text-5xl font-cursive_nautigal text-gray-700 text-center">
                        Your Wishes
                    </h2>
                    <p>
                        Your love and well-wishes mean the world to us, and
                        we&#39;re so excited to share this special day with you.
                        Drop a note of advice, a sweet wish, or just some love
                        in the comments below!
                    </p>
                    <WishForm />
                </section>
                <section>
                    <h2 className="text-3xl font-cursive_nautigal text-gray-700 text-center">
                        Thank you for being part of our journey and celebrating
                        this special day with us. Your love and support mean the
                        world, and we can&#39;t wait to share the joy of our
                        wedding with you!
                    </h2>
                </section>
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
