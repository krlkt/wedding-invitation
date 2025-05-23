'use client';

import { useEffect, useState } from 'react';
import LoaderScreen from '../components/LoaderScreen';
import Music from '../components/Music';
import LocationComponent, { Locations } from '../components/LocationComponent';
import 'photoswipe/style.css';
import ImageGallery from '../components/ImageGallery';
import Gift from '../components/gift/Gift';
import Wishes from '../components/wish/Wishes';
import RSVPForm from '../components/rsvp/RSVPForm';
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
import BorderedDiv from '../components/BorderedDiv';
import Divider from '../components/wish/Divider';
import Image from 'next/image';
import SaveTheDateOrnament from '../components/save-the-date/SaveTheDateOrnament';

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
            <main className="relative flex w-full bg-[#ceeaff]/10 min-w-[400px]">
                <div id="background-overlay" className="texture-overlay" />
                <div className="hidden md:block md:w-[max(60%,100%-450px)] fixed left-0 top-0 w-full h-full overflow-hidden">
                    <Image
                        src={'/images/couple2.jpg'}
                        alt={'Couple photo'}
                        fill
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex min-h-screen md:w-[min(40%,450px)] flex-col items-center justify-between font-serif md:ml-[max(60%,100%-450px)]">
                    <Music />
                    <div className="relative w-full bg-white">
                        <section className="min-h-screen flex flex-col relative overflow-hidden">
                            <video autoPlay loop muted playsInline className="w-full h-full absolute object-cover">
                                <source src="/hero.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            {/* TODO: Add scrolldown  */}
                            <Hero />
                        </section>
                        {/* Grooms grid photos */}
                        <section className="h-[300vh]">
                            <Groom />
                        </section>
                    </div>
                    {/* Bride grid photos */}
                    <section className="relative h-[300vh] w-full">
                        <Bride />
                    </section>
                    {/* Love story - Opt: Hide by default, open accordion to animate and show timeline */}
                    <section
                        className="w-full p-4 py-8 flex flex-col gap-10 bg-primary-main text-secondary-main"
                        id="love-story"
                    >
                        <SectionTitle title="Love Story" color="secondary" />
                        <Timeline />
                    </section>
                    {/* When */}
                    <section className="relative text-center w-full overflow-hidden h-[700px] flex flex-col justify-center items-center">
                        <SaveTheDate />
                    </section>
                    {/* Where */}
                    <section className="relative w-full flex flex-col items-center justify-center overflow-x-hidden">
                        <SaveTheDateOrnament downward />
                        <LocationComponent location={location} />
                        <SaveTheDateOrnament />
                    </section>
                    <div className="flex flex-col gap-8 my-8 relative">
                        {/* RSVP */}
                        <section id="rsvp" className="rounded-lg bg-blue-100/50 p-8 m-4">
                            <div className="flex flex-col gap-4 text-center justify-center relative w-full px-4">
                                <SectionTitle title="Let us know if you’ll be there..." />
                                <RSVPForm guestName={guestName} rsvp={rsvp} />
                            </div>
                        </section>
                        {/* Wedding Gift */}
                        {/* TODO: add QRIS */}
                        <section className="flex flex-col gap-4 text-center justify-center relative w-full px-4">
                            <Gift />
                        </section>
                        {/* Photo galery */}
                        <section className="flex flex-col gap-4 text-center justify-center relative w-full">
                            <SectionTitle title="Gallery" />
                            <ImageGallery />
                        </section>
                        {/* Wishes */}
                        <section className="flex flex-col gap-4 text-center justify-center relative w-full px-4">
                            <BorderedDiv>
                                <SectionTitle title="Your Wishes" />
                                <p>
                                    Your love and well-wishes mean the world to us, and we&#39;re so excited to share
                                    this special day with you. Drop a note of advice, a sweet wish, or just some love in
                                    the comments below!
                                </p>
                                <WishForm guestName={guestName} />
                                <Divider />
                                <Wishes wishes={wishes} />
                            </BorderedDiv>
                        </section>
                        <section className="px-8">
                            <p className="text-md text-center">
                                Thank you for being part of our journey and celebrating this special day with us. Your
                                love and support mean the world, and we can&#39;t wait to share the joy of our wedding
                                with you!
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
                    {/* Countdown */}
                </div>
            </main>
        </>
    );
}
