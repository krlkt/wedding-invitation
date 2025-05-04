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
import SaveTheDate from '../components/SaveTheDate';
import BranchIcon from '../icons/BranchIcon';
import FlowerWithBranchIcon from '../icons/FlowerWithBranchIcon';
import SectionTitle from '../components/SectionTitle';
import BorderedDiv from '../components/BorderedDiv';
import Divider from '../components/wish/Divider';
import './invitationpage.css';
import Image from 'next/image';

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
            <main className="flex w-full">
                <div className="hidden md:block md:w-[60%] fixed left-0 top-0 w-full h-dvh overflow-hidden">
                    <Image
                        src={'/images/couple3.jpg'}
                        alt={'Couple photo'}
                        fill
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex min-h-screen md:w-[40%] flex-col items-center justify-between font-serif ml-auto md:ml-[60%]">
                    <Music />
                    <div className="relative w-full bg-white">
                        <section
                            className="min-h-screen hero-background flex flex-col relative overflow-hidden"
                            id="profile"
                        >
                            {/* TODO: Add scrolldown  */}
                            <Hero />
                        </section>
                        {/* Grooms grid photos */}
                        <section className="h-[300vh] bg-black">
                            <Groom />
                        </section>
                    </div>
                    {/* Grooms grid photos */}
                    <section className="relative h-[300vh] bg-black w-full">
                        <Bride />
                    </section>

                    {/* When? */}
                    <section className="relative text-center py-24 bg-secondary-main w-full overflow-hidden">
                        <div className="absolute top-0 w-20 h-20">
                            <FlowerWithBranchIcon fromLeft={true} />
                        </div>
                        <div className="absolute bottom-0 w-20 h-20">
                            <BranchIcon fromLeft={true} />
                        </div>
                        <div className="absolute bottom-0 w-20 h-20">
                            <FlowerWithBranchIcon fromLeft={false} />
                        </div>
                        <div className="absolute top-0 w-20 h-20">
                            <BranchIcon fromLeft={false} />
                        </div>
                        <SaveTheDate />
                    </section>
                    {/* Where? */}
                    <section className="flex flex-col gap-4 text-center relative w-full h-dvh">
                        <LocationComponent location={location} />
                    </section>
                    <div className="flex flex-col gap-8 my-8 relative">
                        {/* RSVP */}
                        <section
                            id="rsvp"
                            className="flex flex-col gap-4 text-center justify-center relative w-full px-4"
                        >
                            <BorderedDiv>
                                <SectionTitle title="RSVP" />
                                <RSVPForm guestName={guestName} rsvp={rsvp} />
                            </BorderedDiv>
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
                        {/* Love story - Opt: Hide by default, open accordion to animate and show timeline */}
                        <section
                            className="w-full p-4 py-8 flex flex-col gap-10 bg-primary-main text-secondary-main"
                            id="love-story"
                        >
                            <SectionTitle title="Love Story" color="secondary" />
                            <Timeline />
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
