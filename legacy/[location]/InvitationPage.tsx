'use client';

import { useEffect, useState } from 'react';

import Lenis from 'lenis';

import BorderedDiv from '@/components/BorderedDiv';
import Button from '@/components/Button';
import DressCode from '@/components/dresscode/DressCode';
import FadeIn from '@/components/FadeIn';
import FAQ from '@/components/faq/FAQ';
import ImageGallery from '@/components/gallery/ImageGallery';
import Gift from '@/components/gift/Gift';
import Hero from '@/components/hero/Hero';
import LoaderScreen from '@/components/LoaderScreen';
import LocationComponent, { Locations } from '@/components/LocationComponent';
import Music from '@/components/Music';
import 'photoswipe/style.css';
import YouTubeEmbed from '@/components/prewedding/YoutubeEmbed';
import RSVPFORM from '@/components/rsvp/RSVPForm';
import SaveTheDate from '@/components/save-the-date/SaveTheDate';
import SaveTheDateOrnament from '@/components/save-the-date/SaveTheDateOrnament';
import SectionTitle from '@/components/SectionTitle';
import Timeline from '@/components/timeline/Timeline';
import Divider from '@/components/wish/Divider';
import Wishes from '@/components/wish/Wishes';
import WishForm from '@/components/wish/WishForm';
import Bride from '@/components/zoomGridPhotos/Bride';
import Groom from '@/components/zoomGridPhotos/Groom';
import { RSVP } from '@/legacy/types/rsvp';
import { Wish } from '@/legacy/types/wish';

import Image from 'next/image';

import { motion } from 'framer-motion';

import { rotateAnimation } from '@/lib/animation';
import GrowIn from '@/components/GrowIn';

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
  const isMalang = location === 'malang';
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
      <main className="bg-secondary-main/90 relative flex w-full">
        <div id="background-overlay" className="texture-overlay" />
        <div className="fixed left-0 top-0 z-10 hidden h-full w-full overflow-hidden md:block md:max-w-[calc(100%-450px)] md:flex-1">
          <div id="overlay" className="overlay absolute -z-10 h-full w-full" />
          <div className="absolute bottom-1/2 w-full translate-y-16 text-center font-serif text-secondary-main">
            <h1 className="text-shadow-header sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              Karel and Sabrina
            </h1>
            <h2 className="text-shadow-header font-cursive3 text-gray-300 sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
              {location === 'bali'
                ? '09.09.2025'
                : location === 'malang'
                  ? '13.09.2025'
                  : '20.09.2025'}
            </h2>
          </div>
          <div id="hero" className="absolute -z-20 h-full w-full">
            <Image
              alt="Couple photo"
              fill
              className="h-full w-full object-cover"
              sizes="100vw"
              src="/images/gallery/gal15.jpg"
              priority
            />
          </div>
        </div>
        <div className="ml-auto flex w-full flex-col items-center justify-between overflow-x-clip font-serif md:max-w-[450px]">
          <Music />
          <div className="relative w-full bg-white">
            <section className="relative flex h-dvh flex-col overflow-hidden">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute h-full w-full object-cover"
              >
                <source src="/hero.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <Hero />
            </section>
            {/* Grooms grid photos */}
            {!isMalang && <Groom />}
            {/* Bride grid photos */}
            {!isMalang && <Bride />}
          </div>
          {/* Love story - Opt: Hide by default, open accordion to animate and show timeline */}
          {!isMalang && (
            <section
              className="relative flex w-full flex-col bg-primary-main px-6 py-16 text-secondary-main"
              id="love-story"
            >
              <SectionTitle title="Love Story" color="secondary" />
              <Timeline />
            </section>
          )}
          {/* When and where */}
          <section className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-white py-24 text-center">
            <SaveTheDateOrnament downward />
            <SaveTheDate />
            <FadeIn from="left" className="absolute -left-4 top-[46%]">
              <Image
                src="/images/ornaments/baby_orn2.png"
                alt="Ornament blue flower"
                width={120}
                height={120}
                className="-rotate-[45deg]"
              />
            </FadeIn>
            <FadeIn from="right" className="absolute -right-4 top-[46%] -translate-y-4">
              <Image
                src="/images/ornaments/baby_orn2.png"
                alt="Ornament blue flower"
                width={120}
                height={120}
                className="-rotate-[220deg]"
              />
            </FadeIn>
            <LocationComponent location={location} />
            <SaveTheDateOrnament />
          </section>
          {/* RSVP */}
          <section id="rsvp" className="relative w-full bg-primary-main p-6 py-12 pb-16">
            <BorderedDiv>
              <SectionTitle title="RSVP" />
              <RSVPFORM rsvp={rsvp} />
            </BorderedDiv>
            {!isMalang && <div className="section-transition-secondary" />}
          </section>
          {/* Grooms grid photos */}
          {isMalang && <Groom />}
          {/* Bride grid photos */}
          {isMalang && <Bride />}
          {/* Love story - Opt: Hide by default, open accordion to animate and show timeline */}
          {isMalang && (
            <section
              className="relative flex w-full flex-col bg-primary-main px-6 py-16 text-secondary-main"
              id="love-story"
            >
              <SectionTitle title="Love Story" color="secondary" />
              <Timeline />
            </section>
          )}
          {/* Photo gallery */}
          <section className="relative w-full pt-16">
            <FadeIn from="left" className="absolute -left-8 top-3 -z-10">
              <Image
                src="/images/ornaments/baby_orn2.png"
                alt="Ornament blue flower"
                width={150}
                height={150}
              />
            </FadeIn>
            <FadeIn from="right" className="absolute -right-8 top-3 -z-10">
              <Image
                src="/images/ornaments/baby_orn2.png"
                alt="Ornament blue flower"
                width={150}
                height={150}
                className="-rotate-[260deg]"
              />
            </FadeIn>

            <div className="relative mx-auto flex w-full max-w-screen-md flex-col items-center text-center">
              <SectionTitle title="Gallery" />
              <ImageGallery />
              <div className="mt-4">
                <Button onClick={() => window.open('/gallery', '_blank')}>
                  See even MORE photos HERE 📸
                </Button>
              </div>
            </div>
          </section>
          {/* Prewedding */}
          <section className="relative w-full py-16 pb-24">
            <SectionTitle title="Prewedding Video" size="medium" />
            <FadeIn className="px-6">
              <YouTubeEmbed videoId="g9ZqnUOyeTc" />
            </FadeIn>
            <FadeIn from="left" className="absolute -left-8 bottom-3 -z-10">
              <Image
                src="/images/ornaments/baby_orn2.png"
                alt="Ornament blue flower"
                width={150}
                height={150}
                className="-rotate-[80deg]"
              />
            </FadeIn>
            <FadeIn from="right" className="absolute -right-8 bottom-3 -z-10">
              <Image
                src="/images/ornaments/baby_orn2.png"
                alt="Ornament blue flower"
                width={150}
                height={150}
                className="-rotate-[180deg]"
              />
            </FadeIn>
          </section>
          {/* FAQ */}
          {location === 'bali' && (
            <section className="relative w-full bg-primary-main py-16 pb-28">
              <FadeIn from="left" className="absolute -left-16 -top-0">
                <Image
                  src="/images/ornaments/baby_orn.png"
                  alt="Baby breath"
                  width={200}
                  height={100}
                  className="pointer-events-none rotate-90"
                />
              </FadeIn>
              <SectionTitle title="FAQ" color="secondary" />
              <FadeIn className="w-full px-8">
                <FAQ faqs={[]} />
              </FadeIn>
              <FadeIn from="right" className="absolute -right-10 bottom-12">
                <Image
                  src="/images/ornaments/baby_orn4.png"
                  alt="Baby breath"
                  width={200}
                  height={100}
                  className="pointer-events-none -rotate-180"
                />
              </FadeIn>
              <div className="section-transition-secondary-fix" />
            </section>
          )}
          {/* Dress code */}
          {location === 'bali' && (
            <section className="relative w-full overflow-hidden px-6 pb-12 pt-52">
              <motion.div
                className="absolute -left-[28rem] -top-20"
                animate={rotateAnimation([183, 178, 183])}
                style={{ transformOrigin: 'center right' }}
              >
                <Image
                  src="/images/ornaments/orn6.png"
                  alt="Ornament blue flower"
                  width={400}
                  height={100}
                />
              </motion.div>
              <SectionTitle title="Dress code" />
              <DressCode />
            </section>
          )}
          {/* Wedding Gift */}
          {/* TODO: add QRIS */}
          <section className="relative bg-primary-main px-8 py-16 pb-20">
            <motion.div
              animate={rotateAnimation([5, -5, 5])}
              style={{ transformOrigin: 'left center' }}
              className="absolute left-0 top-2"
            >
              <Image src="/images/ornaments/cats/mayo.webp" alt="Mayo" width={100} height={100} />
            </motion.div>
            <motion.div
              animate={rotateAnimation([5, -5, 5], 0.5)}
              style={{ transformOrigin: 'right center' }}
              className="absolute bottom-5 right-0 z-10"
            >
              <Image
                src="/images/ornaments/cats/kyupie.webp"
                alt="Kyupie"
                width={100}
                height={100}
              />
            </motion.div>
            <BorderedDiv>
              <SectionTitle title="Gift" />
              <Gift />
            </BorderedDiv>
            <div className="section-transition-secondary" />
          </section>
          {/* Wishes */}
          <section className="relative flex flex-col gap-4 px-6 pb-10 pt-16">
            <div className="relative flex flex-col gap-4">
              <GrowIn className="absolute left-1/2 -z-10">
                <Image
                  src="/images/ornaments/frame/gate.png"
                  alt="Gate"
                  width={300}
                  height={300}
                  className="-translate-x-1/2 translate-y-36 scale-[3.4] opacity-15"
                />
              </GrowIn>
              <SectionTitle title="Your Wishes" />
              <FadeIn>
                <p>
                  Your love and well-wishes mean the world to us, and we&#39;re so excited to share
                  this special day with you. Drop a note of advice, a sweet wish, or just some love
                  in the comments below!
                </p>
              </FadeIn>
              <FadeIn>
                <WishForm guestName={guestName} />
              </FadeIn>
            </div>
            <Divider />
            <Wishes wishes={wishes} />
          </section>
          <section className="bg-primary-main p-6 text-secondary-main">
            <p className="text-md text-center">
              Thank you for being part of our journey and celebrating this special day with us. Your
              love and support mean the world, and we can&#39;t wait to share the joy of our wedding
              with you!
            </p>
            <p className="text-md mt-4 text-center">
              This wedding invitation is handcoded by your one and only{' '}
              <a
                href="https://instagram.com/karelkarunia"
                target="_blank"
                rel="noopener noreferrer"
              >
                <b>
                  <u>GROOM</u>&#169;
                </b>
              </a>
            </p>
          </section>
        </div>
        {/* TODO LIST */}
        {/* RSVP checkedIn for D Day */}
        {/* Update values for jakarta and malang */}
      </main>
    </>
  );
}
