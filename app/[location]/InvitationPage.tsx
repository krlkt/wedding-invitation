'use client';

import { useEffect, useRef, useState } from 'react';
import LoaderScreen from '../components/LoaderScreen';
import Music from '../components/Music';
import LocationComponent, { Locations } from '../components/LocationComponent';
import 'photoswipe/style.css';
import ImageGallery from '../components/ImageGallery';
import Gift from '../components/Gift';
import Wishes from '../components/wish/Wishes';
import RSVPForm from '../components/rsvp/RSVPForm';
import { Wish } from '../models/wish';
import WishForm from '../components/wish/WishForm';
import { RSVP } from '../models/rsvp';
import Lenis from 'lenis';
import { motion, useScroll, useTransform } from 'framer-motion';
import Groom from '../components/zoomGridPhotos/Groom';
import Hero from '../components/Hero';
import Bride from '../components/zoomGridPhotos/Bride';
import Timeline from '../components/timeline/Timeline';
import SaveTheDate from '../components/SaveTheDate';

export default function InvitationPage({
    location,
    wishes,
    guestName,
    rsvp,
}: {
    location: Locations;
    wishes: Array<Wish>;
    guestName: string;
    rsvp?: RSVP;
}) {
    const [isLoaderScreenVisible, setIsLoaderScreenVisible] = useState<boolean>(true);
    // Section transition animation
    const sectionTransitionContainer = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionTransitionContainer,
        offset: ['start start', 'end end'],
    });
    const scale = useTransform(scrollYProgress, [0, 0.333], [1, 0.6]);
    const scale2 = useTransform(scrollYProgress, [0, 0.333], [0.6, 1]);
    const rotate = useTransform(scrollYProgress, [0, 0.333], [0, -4]);
    const rotate2 = useTransform(scrollYProgress, [0, 0.333], [-4, 0]);

    // use lenis smooth scroll on page
    useEffect(() => {
        const lenis = new Lenis({
            wheelMultiplier: 2,
        });

        function raf(time: any) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
    }, []);

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
                {/* Wrapper for section transition */}
                <div ref={sectionTransitionContainer} className="relative h-[400vh] w-full">
                    <motion.section style={{ scale, rotate }} className="sticky top-0 h-screen" id="profile">
                        <Hero />
                    </motion.section>
                    {/* Grooms grid photos */}
                    <motion.section style={{ scale: scale2, rotate: rotate2 }} className="h-[300vh] bg-black">
                        <Groom />
                    </motion.section>
                </div>
                {/* Grooms grid photos */}
                <section className="relative h-[300vh] bg-black w-full">
                    <Bride />
                </section>
                {/* Love story - Opt: Hide by default, open accordion to animate and show timeline */}
                <section
                    className="w-full p-4 py-8 flex flex-col gap-10 bg-primary-main text-secondary-main"
                    id="love-story"
                >
                    <h2 className="text-5xl font-cursive_nautigal text-center">Love story</h2>
                    <Timeline />
                </section>

                {/* When? */}
                <section className="text-center py-24 bg-secondary-main w-full">
                    <SaveTheDate />
                </section>
                {/* Where? */}
                <section className="flex flex-col gap-4 text-center relative w-full h-dvh">
                    <LocationComponent location={location} />
                </section>
                {/* Photo galery */}
                <section className="flex flex-col gap-4 text-center justify-center relative w-full my-8">
                    <ImageGallery />
                </section>
                {/* RSVP */}
                <section className="flex flex-col gap-4 text-center justify-center relative w-full h-dvh px-4">
                    <RSVPForm guestName={guestName} rsvp={rsvp} />
                </section>
                {/* Wedding Gift */}
                <section className="flex flex-col gap-4 text-center justify-center relative w-full px-4">
                    <Gift />
                </section>
                <section className="flex flex-col gap-4 text-center justify-center relative w-full px-4 my-8">
                    <h2 className="text-5xl font-cursive_nautigal text-gray-700 text-center">Your Wishes</h2>
                    <p>
                        Your love and well-wishes mean the world to us, and we&#39;re so excited to share this special
                        day with you. Drop a note of advice, a sweet wish, or just some love in the comments below!
                    </p>
                    <WishForm guestName={guestName} />
                    <Wishes wishes={wishes} />
                </section>
                <section className="p-8">
                    <p className="text-md text-center">
                        Thank you for being part of our journey and celebrating this special day with us. Your love and
                        support mean the world, and we can&#39;t wait to share the joy of our wedding with you!
                    </p>
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
