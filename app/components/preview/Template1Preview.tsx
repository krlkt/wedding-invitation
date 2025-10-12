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
import EmptyState from './EmptyState';
import { LocationProvider } from '@/app/utils/useLocation';
import type { TemplateProps } from './types';

export default function Template1Preview({ data }: TemplateProps) {
    const { config, features, content } = data;

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

    return (
        <LocationProvider location="bali">
            <div className="flex flex-col items-center justify-between md:max-w-[450px] w-full font-serif bg-white">
                {/* Hero Section - Always visible */}
                <div className="relative w-full bg-white">
                    <section className="h-dvh flex flex-col relative overflow-hidden">
                        <video autoPlay loop muted playsInline className="w-full h-full absolute object-cover">
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
                            <EmptyState message="Add your love story timeline in the Love Story section" icon="💕" />
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
                    <section className="pt-16 w-full relative">
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
                        <div className="flex flex-col items-center text-center relative w-full max-w-screen-md mx-auto">
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
                    <section className="py-16 pb-24 relative w-full">
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
                    <section className="py-16 pb-28 relative w-full bg-primary-main">
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

                {/* Footer */}
                <footer className="p-6 bg-primary-main text-secondary-main">
                    <p className="text-md text-center">
                        Thank you for being part of our journey and celebrating this special day with us.
                    </p>
                    {features.instagram_link && config.instagramLink && (
                        <p className="text-sm text-center mt-4">
                            Follow us on{' '}
                            <a
                                href={config.instagramLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline"
                            >
                                Instagram
                            </a>
                        </p>
                    )}
                    {config.footerText && <p className="text-sm text-center mt-2 text-gray-300">{config.footerText}</p>}
                </footer>
            </div>
        </LocationProvider>
    );
}
