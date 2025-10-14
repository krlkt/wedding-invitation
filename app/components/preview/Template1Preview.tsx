'use client';

/**
 * Template 1 Preview Component
 *
 * Renders the wedding invitation template with feature toggle integration.
 * Shows/hides sections based on feature flags and displays empty states for missing content.
 */

import Image from 'next/image';
import Hero from '../hero/Hero';
import Timeline from '../timeline/Timeline';
import RSVPForm from '../rsvp/RSVPForm';
import ImageGallery from '../gallery/ImageGallery';
import YouTubeEmbed from '../prewedding/YoutubeEmbed';
import FAQ from '../faq/FAQ';
import DressCode from '../dresscode/DressCode';
import Gift from '../gift/Gift';
import SectionTitle from '../SectionTitle';
import BorderedDiv from '../BorderedDiv';
import Groom from '../zoomGridPhotos/Groom';
import Bride from '../zoomGridPhotos/Bride';
import SaveTheDate from '../save-the-date/SaveTheDate';
import SaveTheDateOrnament from '../save-the-date/SaveTheDateOrnament';
import LocationComponent from '../LocationComponent';
import FadeIn from '../FadeIn';
import GrowIn from '../GrowIn';
import EmptyState from './EmptyState';
import { LocationProvider } from '@/app/utils/useLocation';
import type { TemplateProps } from './types';
import LoaderScreen from '../LoaderScreen';
import { useEffect, useState } from 'react';
import { ScrollContainerProvider } from '@/app/utils/ScrollContainerContext';
import { WeddingDataProvider } from '@/app/utils/useWeddingData';
import Wishes from '../wish/Wishes';
import Divider from '../wish/Divider';

export default function Template1Preview({ data, mode = 'fullscreen', scrollContainerRef }: TemplateProps) {
    const { config, features, content } = data;
    const isFullscreenMode = mode === 'fullscreen';
    const [isLoaderScreenVisible, setIsLoaderScreenVisible] = useState<boolean>(true);

    // Use appropriate height based on mode
    // In embedded mode, use CSS custom property from container; in fullscreen use viewport height
    const viewportHeightClass = isFullscreenMode ? 'h-dvh' : 'h-screen';
    const viewportHeightStyle = !isFullscreenMode ? { height: 'var(--container-height)' } : undefined;

    // Mock RSVP for preview
    const mockRSVP = {
        id: 0,
        name: 'Preview Guest',
        attendance: null as any,
        mealPreference: null as any,
        additionalGuests: 0,
        notes: '',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

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
        };
        handleFirstVisit();
    }, [isLoaderScreenVisible]);

    return (
        <>
            {isFullscreenMode && (
                <LoaderScreen
                    isVisible={isLoaderScreenVisible}
                    groomName={config.groomName}
                    brideName={config.brideName}
                />
            )}
            <WeddingDataProvider config={config} features={features}>
                <ScrollContainerProvider containerRef={scrollContainerRef} isEmbedded={!isFullscreenMode}>
                    <LocationProvider location="bali">
                        <div
                            className={`relative flex w-full ${
                                isFullscreenMode ? 'bg-secondary-main/90' : 'bg-white justify-center'
                            }`}
                        >
                            <div id="background-overlay" className="texture-overlay" />
                            {isFullscreenMode && (
                                <div className="hidden md:block md:flex-1 md:max-w-[calc(100%-450px)] w-full fixed left-0 top-0 h-full overflow-hidden z-10">
                                    <div id="overlay" className="w-full h-full absolute -z-10 overlay" />
                                    <div className="absolute bottom-1/2 translate-y-16 w-full text-center text-secondary-main font-serif">
                                        <h1 className="sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-shadow-header">
                                            {config.groomName} and {config.brideName}
                                        </h1>
                                        <h2 className="sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-shadow-header font-cursive3 text-gray-300">
                                            {new Date(config.weddingDate).toLocaleDateString('en-GB', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                            })}
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
                            )}

                            <div
                                className={`flex flex-col items-center justify-between w-full font-serif overflow-x-clip ${
                                    isFullscreenMode ? 'md:max-w-[450px] ml-auto' : 'max-w-[450px] mx-auto'
                                }`}
                            >
                                {/* Hero Section - Always visible */}
                                <div className="relative w-full bg-white">
                                    <section
                                        className={`${viewportHeightClass} flex flex-col relative overflow-hidden`}
                                        style={viewportHeightStyle}
                                    >
                                        <video
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            className="w-full h-full absolute object-cover"
                                        >
                                            <source src="/hero.mp4" type="video/mp4" />
                                        </video>
                                        <Hero />
                                    </section>

                                    {/* Groom & Bride Photos */}
                                    <Groom />
                                    <Bride />
                                </div>

                                {/* Love Story Section */}
                                {features.love_story && (
                                    <section
                                        className="w-full flex flex-col bg-primary-main text-secondary-main relative px-6 py-16"
                                        id="love-story"
                                    >
                                        <SectionTitle title="Love Story" color="secondary" />
                                        {content.loveStory.length > 0 ? (
                                            <Timeline />
                                        ) : (
                                            <EmptyState
                                                message="Add your love story timeline in the Love Story section"
                                                icon="💕"
                                            />
                                        )}
                                    </section>
                                )}

                                {/* When and Where Section - Always visible */}
                                <section className="relative text-center w-full flex flex-col justify-center items-center py-24 bg-white overflow-hidden">
                                    <SaveTheDateOrnament downward />
                                    <SaveTheDate />
                                    <FadeIn from="left" className="absolute top-[46%] -left-4">
                                        <Image
                                            src={'/images/ornaments/baby_orn2.png'}
                                            alt={'Ornament blue flower'}
                                            width={120}
                                            height={120}
                                            className="-rotate-[45deg]"
                                        />
                                    </FadeIn>
                                    <FadeIn from="right" className="absolute top-[46%] -translate-y-4 -right-4">
                                        <Image
                                            src={'/images/ornaments/baby_orn2.png'}
                                            alt={'Ornament blue flower'}
                                            width={120}
                                            height={120}
                                            className="-rotate-[220deg]"
                                        />
                                    </FadeIn>
                                    {content.locations.length > 0 ? (
                                        <LocationComponent location="bali" />
                                    ) : (
                                        <EmptyState message="Add ceremony and reception locations" icon="📍" />
                                    )}
                                    <SaveTheDateOrnament />
                                </section>

                                {/* RSVP Section */}
                                {features.rsvp && (
                                    <section id="rsvp" className="relative w-full py-12 pb-16 p-6 bg-primary-main">
                                        <BorderedDiv>
                                            <SectionTitle title="RSVP" />
                                            <RSVPForm rsvp={mockRSVP} />
                                        </BorderedDiv>
                                        <div className="section-transition-secondary" />
                                    </section>
                                )}

                                {/* Gallery Section */}
                                {features.gallery && (
                                    <section className="pt-16 w-full relative overflow-hidden">
                                        <FadeIn from="left" className="absolute top-3 -left-8 -z-10">
                                            <Image
                                                src={'/images/ornaments/baby_orn2.png'}
                                                alt={'Ornament blue flower'}
                                                width={150}
                                                height={150}
                                            />
                                        </FadeIn>
                                        <FadeIn from="right" className="absolute top-3 -right-8 -z-10">
                                            <Image
                                                src={'/images/ornaments/baby_orn2.png'}
                                                alt={'Ornament blue flower'}
                                                width={150}
                                                height={150}
                                                className="-rotate-[260deg]"
                                            />
                                        </FadeIn>
                                        <div className="flex flex-col items-center text-center relative w-full max-w-screen-md mx-auto overflow-hidden">
                                            <SectionTitle title="Gallery" />
                                            {content.gallery.length > 0 ? (
                                                <ImageGallery />
                                            ) : (
                                                <EmptyState message="Upload photos to your gallery" icon="📸" />
                                            )}
                                        </div>
                                    </section>
                                )}

                                {/* Prewedding Video Section */}
                                {features.prewedding_videos && (
                                    <section className="py-16 pb-24 relative w-full overflow-hidden">
                                        <SectionTitle title="Prewedding Video" size="medium" />
                                        <FadeIn className="px-6">
                                            <YouTubeEmbed videoId="g9ZqnUOyeTc" />
                                        </FadeIn>
                                        <FadeIn from="left" className="absolute bottom-3 -left-8 -z-10">
                                            <Image
                                                src={'/images/ornaments/baby_orn2.png'}
                                                alt={'Ornament blue flower'}
                                                width={150}
                                                height={150}
                                                className="-rotate-[80deg]"
                                            />
                                        </FadeIn>
                                        <FadeIn from="right" className="absolute bottom-3 -right-8 -z-10">
                                            <Image
                                                src={'/images/ornaments/baby_orn2.png'}
                                                alt={'Ornament blue flower'}
                                                width={150}
                                                height={150}
                                                className="-rotate-[180deg]"
                                            />
                                        </FadeIn>
                                    </section>
                                )}

                                {/* FAQ Section */}
                                {features.faqs && (
                                    <section className="py-16 pb-28 relative w-full bg-primary-main overflow-hidden">
                                        <FadeIn from="left" className="absolute -top-0 -left-16">
                                            <Image
                                                src={'/images/ornaments/baby_orn.png'}
                                                alt={'Baby breath'}
                                                width={200}
                                                height={100}
                                                className="rotate-90 pointer-events-none"
                                            />
                                        </FadeIn>
                                        <SectionTitle title="FAQ" color="secondary" />
                                        {content.faqs.length > 0 ? (
                                            <FadeIn className="w-full px-8">
                                                <FAQ />
                                            </FadeIn>
                                        ) : (
                                            <EmptyState message="Add frequently asked questions" icon="❓" />
                                        )}
                                        <FadeIn from="right" className="absolute bottom-12 -right-10">
                                            <Image
                                                src={'/images/ornaments/baby_orn4.png'}
                                                alt={'Baby breath'}
                                                width={200}
                                                height={100}
                                                className="-rotate-180 pointer-events-none"
                                            />
                                        </FadeIn>
                                        <div className="section-transition-secondary-fix" />
                                    </section>
                                )}

                                {/* Dress Code Section */}
                                {features.dress_code && (
                                    <section className="pt-52 px-6 relative w-full overflow-hidden pb-12">
                                        <SectionTitle title="Dress code" />
                                        {content.dressCode ? (
                                            <DressCode />
                                        ) : (
                                            <EmptyState message="Add dress code information and photo" icon="👔" />
                                        )}
                                    </section>
                                )}

                                {/* Gift Section - Always visible */}
                                <section className="py-16 pb-20 px-8 relative bg-primary-main">
                                    <BorderedDiv>
                                        <SectionTitle title="Gift" />
                                        <Gift />
                                    </BorderedDiv>
                                    <div className="section-transition-secondary" />
                                </section>

                                {/* Wishes Section */}
                                {features.wishes && (
                                    <section className="pt-16 pb-10 px-6 relative flex flex-col gap-4">
                                        <div className="relative flex flex-col gap-4">
                                            <GrowIn className="absolute -z-10 left-1/2">
                                                <Image
                                                    src={'/images/ornaments/frame/gate.png'}
                                                    alt={'Gate'}
                                                    width={300}
                                                    height={300}
                                                    className="scale-[3.4] opacity-15 -translate-x-1/2 translate-y-36"
                                                />
                                            </GrowIn>
                                            <SectionTitle title="Your Wishes" />
                                            <FadeIn>
                                                <p>
                                                    Your love and well-wishes mean the world to us. Here are the
                                                    heartfelt messages from our loved ones.
                                                </p>
                                            </FadeIn>
                                        </div>
                                        <Divider />
                                        {content.wishes.length > 0 ? (
                                            <Wishes
                                                wishes={{
                                                    wishes: content.wishes.map((w) => ({
                                                        id: 0, // Mock ID for preview
                                                        name: w.name,
                                                        wish: w.message,
                                                        created_at:
                                                            w.createdAt instanceof Date
                                                                ? w.createdAt.toISOString()
                                                                : w.createdAt,
                                                        created_by_id: 0, // Mock ID for preview
                                                    })),
                                                    wishPage: 1,
                                                    totalPages: 1,
                                                }}
                                            />
                                        ) : (
                                            <EmptyState
                                                message="No wishes yet. They will appear here when guests leave messages."
                                                icon="💌"
                                            />
                                        )}
                                    </section>
                                )}

                                {/* Footer */}
                                <footer className="p-6 bg-primary-main text-secondary-main">
                                    <p className="text-md text-center">
                                        Thank you for being part of our journey and celebrating this special day with
                                        us.
                                    </p>
                                    {config.footerText && (
                                        <p className="text-sm text-center mt-2 text-gray-300">{config.footerText}</p>
                                    )}
                                </footer>
                            </div>
                        </div>
                    </LocationProvider>
                </ScrollContainerProvider>
            </WeddingDataProvider>
        </>
    );
}
