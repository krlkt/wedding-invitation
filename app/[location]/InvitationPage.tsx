'use client';

import { useEffect, useState } from 'react';
import LoaderScreen from '../components/LoaderScreen';
import Music from '../components/Music';
import LocationComponent, { Locations } from '../components/LocationComponent';
import 'photoswipe/style.css';
import Gift from '../components/gift/Gift';
import Wishes from '../components/wish/Wishes';
import RSVPFORM from '../components/rsvp/RSVPForm';
import { Wish } from '../models/wish';
import WishForm from '../components/wish/WishForm';
import { RSVP } from '../models/rsvp';
import Lenis from 'lenis';
import Groom from '../components/zoomGridPhotos/Groom';
import Hero from '../components/hero/Hero';
import Bride from '../components/zoomGridPhotos/Bride';
import Timeline from '../components/timeline/Timeline';
import SaveTheDate from '../components/save-the-date/SaveTheDate';
import SectionTitle from '../components/SectionTitle';
import Divider from '../components/wish/Divider';
import Image from 'next/image';
import SaveTheDateOrnament from '../components/save-the-date/SaveTheDateOrnament';
import BorderedDiv from '../components/BorderedDiv';
import DressCode from '../components/dresscode/DressCode';
import { motion } from 'framer-motion';
import FAQ from '../components/faq/FAQ';
import Button from '../components/Button';
import YouTubeEmbed from '../components/prewedding/YoutubeEmbed';
import ThumbnailCarousel from '../components/gallery/ThumbnailCarousel';
import { rotateAnimation } from '../utils/animation';

export default function InvitationPage({
    location,
    wishes,
    guestName,
    rsvp,
}: {
    location: Locations;
    wishes: { wishes: Array<Wish>; wishPage: number; totalPages: number };
    guestName: string;
    rsvp: RSVP;
}) {
    const [isLoaderScreenVisible, setIsLoaderScreenVisible] = useState<boolean>(true);
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
            <main className="relative flex w-full bg-secondary-main/90">
                <div id="background-overlay" className="texture-overlay" />
                <div className="hidden md:block md:w-[max(60%,100%-450px)] fixed left-0 top-0 w-full h-full overflow-hidden z-10">
                    <div id="overlay" className="w-full h-full absolute -z-10 overlay" />
                    <div className="absolute bottom-1/2 translate-y-16 w-full text-center text-secondary-main font-serif">
                        <h1 className="sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-shadow-header">
                            Karel and Sabrina
                        </h1>
                        <h2 className="sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-shadow-header font-cursive3 text-gray-300">
                            09.09.2025
                        </h2>
                    </div>
                    <div id="hero" className="w-full h-full absolute -z-20">
                        <Image
                            alt={'Couple photo'}
                            fill
                            className="w-full h-full object-cover"
                            sizes="100vw"
                            src={'/images/gallery/gal15.jpg'}
                            priority={true}
                        />
                    </div>
                </div>
                <div className="flex flex-col items-center justify-between md:w-[min(40%,450px)] font-serif md:ml-[max(60%,100%-450px)] overflow-x-clip">
                    <Music />
                    <div className="relative w-full bg-white">
                        <section className="h-dvh flex flex-col relative overflow-hidden">
                            <video autoPlay loop muted playsInline className="w-full h-full absolute object-cover">
                                <source src="/hero.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <Hero />
                        </section>
                        {/* Grooms grid photos */}
                        <Groom />
                        {/* Bride grid photos */}
                        <Bride />
                    </div>
                    {/* Love story - Opt: Hide by default, open accordion to animate and show timeline */}
                    <section
                        className="w-full flex flex-col bg-primary-main text-secondary-main relative px-6 py-16"
                        id="love-story"
                    >
                        <SectionTitle title="Love Story" color="secondary" />
                        <Timeline />
                    </section>
                    {/* When and where */}
                    <section className="relative text-center w-full flex flex-col justify-center items-center py-24 bg-white overflow-hidden">
                        <SaveTheDateOrnament downward />
                        <SaveTheDate />
                        <div className="w-full h-20 absolute top-1/2 -translate-y-1/2">
                            <motion.div>
                                <Image
                                    src={'/images/ornaments/baby_orn2.png'}
                                    alt={'Ornament blue flower'}
                                    width={120}
                                    height={120}
                                    className="absolute -top-2 -left-10 -rotate-[45deg] -z-10"
                                />
                                <Image
                                    src={'/images/ornaments/baby_orn2.png'}
                                    alt={'Ornament blue flower'}
                                    width={120}
                                    height={120}
                                    className="absolute -top-2 -right-10 -rotate-[195deg] -z-10"
                                />
                            </motion.div>
                        </div>
                        <LocationComponent location={location} />
                        <SaveTheDateOrnament />
                    </section>
                    {/* RSVP */}
                    <section id="rsvp" className="relative py-12 pb-16 p-6 bg-primary-main">
                        <BorderedDiv>
                            <SectionTitle title="RSVP" />
                            <RSVPFORM rsvp={rsvp} />
                        </BorderedDiv>
                        <div className="section-transition-secondary" />
                    </section>
                    {/* Photo gallery */}
                    <section className="pt-16 w-full">
                        <div className="flex flex-col items-center text-center relative w-full max-w-screen-md mx-auto">
                            <SectionTitle title="Gallery" />
                            <ThumbnailCarousel />
                            <div className="mt-4">
                                <Button onClick={() => window.open('/gallery', '_blank')}>See more photos 📸</Button>
                            </div>
                        </div>
                    </section>
                    {/* Prewedding */}
                    <section className="py-16 pb-24 relative w-full">
                        <SectionTitle title="Prewedding Video" size="medium" />
                        <div className="px-6">
                            <YouTubeEmbed videoId="g9ZqnUOyeTc" />
                        </div>
                        <Image
                            src={'/images/ornaments/baby_orn2.png'}
                            alt={'Ornament blue flower'}
                            width={150}
                            height={150}
                            className="absolute bottom-3 -left-8 -rotate-[80deg] -z-10"
                        />
                        <Image
                            src={'/images/ornaments/baby_orn2.png'}
                            alt={'Ornament blue flower'}
                            width={150}
                            height={150}
                            className="absolute bottom-3 -right-8 -rotate-[180deg] -z-10"
                        />
                    </section>
                    {/* FAQ */}
                    <section className="py-16 pb-28 relative w-full bg-primary-main">
                        <Image
                            src={'/images/ornaments/baby_orn.png'}
                            alt={'Baby breath'}
                            width={200}
                            height={100}
                            className="absolute rotate-90 -top-0 -left-16"
                        />
                        <SectionTitle title="FAQ" color="secondary" />
                        <div className="w-full px-8">
                            <FAQ />
                        </div>
                        <Image
                            src={'/images/ornaments/baby_orn4.png'}
                            alt={'Baby breath'}
                            width={200}
                            height={100}
                            className="absolute -rotate-180 bottom-12 -right-10"
                        />
                        <div className="section-transition-secondary" />
                    </section>
                    {/* Dress code */}
                    <section className="pt-52 px-6 relative w-full overflow-hidden pb-12">
                        <motion.div
                            className="absolute -top-20 -left-[28rem]"
                            animate={rotateAnimation([183, 178, 183])}
                            style={{ transformOrigin: 'center right' }}
                        >
                            <Image
                                src={'/images/ornaments/orn6.png'}
                                alt={'Ornament blue flower'}
                                width={400}
                                height={100}
                            />
                        </motion.div>
                        <SectionTitle title="Dress code" />
                        <DressCode />
                    </section>
                    {/* Wedding Gift */}
                    {/* TODO: add QRIS */}
                    <section className="py-16 pb-20 px-8 relative bg-primary-main">
                        <motion.div
                            animate={rotateAnimation([5, -5, 5])}
                            style={{ transformOrigin: 'left center' }}
                            className="absolute top-2 left-0"
                        >
                            <Image src={'/images/ornaments/cats/mayo.webp'} alt={'Mayo'} width={100} height={100} />
                        </motion.div>
                        <motion.div
                            animate={rotateAnimation([5, -5, 5], 0.5)}
                            style={{ transformOrigin: 'right center' }}
                            className="absolute bottom-5 right-0 z-10"
                        >
                            <Image src={'/images/ornaments/cats/kyupie.webp'} alt={'Kyupie'} width={100} height={100} />
                        </motion.div>
                        <BorderedDiv>
                            <SectionTitle title="Gift" />
                            <Gift />
                        </BorderedDiv>
                        <div className="section-transition-secondary" />
                    </section>
                    {/* Wishes */}
                    <section className="pt-16 pb-10">
                        <SectionTitle title="Your Wishes" />
                        <div className="flex flex-col gap-4 text-center justify-center relative w-full px-6 ">
                            <p>
                                Your love and well-wishes mean the world to us, and we&#39;re so excited to share this
                                special day with you. Drop a note of advice, a sweet wish, or just some love in the
                                comments below!
                            </p>
                            <WishForm guestName={guestName} />
                            <Divider />
                            <Wishes wishes={wishes} />
                        </div>
                    </section>
                    <section className="p-6 bg-primary-main text-secondary-main">
                        <p className="text-md text-center">
                            Thank you for being part of our journey and celebrating this special day with us. Your love
                            and support mean the world, and we can&#39;t wait to share the joy of our wedding with you!
                        </p>
                        <p className="text-md text-center mt-4">
                            This wedding invitation is handcoded by your one and only{' '}
                            <b>
                                <u>GROOM</u>
                            </b>
                            &#169;
                        </p>
                    </section>
                </div>
                {/* TODO LIST */}
                {/* RSVP checkedIn for D Day */}
                {/* Finish decoration and ornaments */}
                {/* Adds animations */}
                {/* Update values for jakarta and malang */}
            </main>
        </>
    );
}
