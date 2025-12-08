'use client'

/**
 * Template 1 Preview Component
 *
 * Renders the wedding invitation template with feature toggle integration.
 * Shows/hides sections based on feature flags and displays empty states for missing content.
 */

import { useEffect, useState } from 'react'

import Image from 'next/image'

import { ScrollContainerProvider } from '@/app/utils/ScrollContainerContext'
import { LocationProvider } from '@/app/hooks/useLocation'
import { WeddingDataProvider } from '@/app/hooks/useWeddingData'

import BorderedDiv from '../BorderedDiv'
import DressCode from '../dresscode/DressCode'
import FadeIn from '../FadeIn'
import FAQ from '../faq/FAQ'
import ImageGallery from '../gallery/ImageGallery'
import Gift from '../gift/Gift'
import GrowIn from '../GrowIn'
import Hero from '../hero/Hero'
import LoaderScreen from '../LoaderScreen'
import LocationComponent from '../LocationComponent'
import YouTubeEmbed from '../prewedding/YoutubeEmbed'
import RSVPForm from '../rsvp/RSVPForm'
import SaveTheDate from '../save-the-date/SaveTheDate'
import SaveTheDateOrnament from '../save-the-date/SaveTheDateOrnament'
import SectionTitle from '../SectionTitle'
import Timeline from '../timeline/Timeline'
import Divider from '../wish/Divider'
import Wishes from '../wish/Wishes'
import Bride from '../zoomGridPhotos/Bride'
import Groom from '../zoomGridPhotos/Groom'

import EmptyState from './EmptyState'

import type { TemplateProps } from './types'

export default function Template1Preview({
  data,
  mode = 'fullscreen',
  scrollContainerRef,
}: TemplateProps) {
  const { config, features, content } = data
  const isFullscreenMode = mode === 'fullscreen'
  const [isLoaderScreenVisible, setIsLoaderScreenVisible] = useState<boolean>(true)

  // Use appropriate height based on mode
  // In embedded mode, use CSS custom property from container; in fullscreen use viewport height
  const viewportHeightClass = isFullscreenMode ? 'h-dvh' : 'h-screen'
  const viewportHeightStyle = !isFullscreenMode ? { height: 'var(--container-height)' } : undefined

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
  }

  useEffect(() => {
    const handleFirstVisit = () => {
      // Add or remove 'locked' class based on loader visibility
      if (isLoaderScreenVisible) {
        document.body.classList.add('locked')
      } else {
        document.body.classList.remove('locked')
      }

      // Remove loader screen after 4.5 seconds
      setTimeout(() => {
        setIsLoaderScreenVisible(false)
      }, 4500)
    }
    handleFirstVisit()
  }, [isLoaderScreenVisible])

  return (
    <>
      {isFullscreenMode && (
        <LoaderScreen
          isVisible={isLoaderScreenVisible}
          groomName={config.groomName}
          brideName={config.brideName}
        />
      )}
      <WeddingDataProvider
        config={config}
        features={features}
        startingSection={content.startingSection}
        faqs={content.faqs}
        groomSection={content.groomSection}
        brideSection={content.brideSection}
      >
        <ScrollContainerProvider containerRef={scrollContainerRef} isEmbedded={!isFullscreenMode}>
          <LocationProvider location="bali">
            <div
              className={`relative flex w-full ${
                isFullscreenMode ? 'bg-secondary-main/90' : 'justify-center bg-white'
              }`}
            >
              <div id="background-overlay" className="texture-overlay" />
              {isFullscreenMode && (
                <div className="fixed left-0 top-0 z-10 hidden h-full w-full overflow-hidden md:block md:max-w-[calc(100%-450px)] md:flex-1">
                  <div id="overlay" className="overlay absolute -z-10 h-full w-full" />
                  <div className="absolute bottom-1/2 w-full translate-y-16 px-4 text-center font-serif text-secondary-main">
                    <h1 className="text-shadow-header break-words sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                      {content.startingSection?.groomDisplayName ?? config.groomName} and{' '}
                      {content.startingSection?.brideDisplayName ?? config.brideName}
                    </h1>
                    <h2 className="text-shadow-header font-cursive3 text-gray-300 sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
                      {new Date(config.weddingDate).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
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
              )}

              <div
                className={`flex w-full flex-col items-center justify-between overflow-x-clip font-serif ${
                  isFullscreenMode ? 'ml-auto md:max-w-[450px]' : 'mx-auto max-w-[450px]'
                }`}
              >
                {/* Hero Section */}
                <div className="relative w-full bg-white">
                  {features.hero && (
                    <section
                      className={`${viewportHeightClass} relative flex flex-col overflow-hidden`}
                      style={viewportHeightStyle}
                    >
                      {/* Background Media - Use custom media if uploaded, otherwise default */}
                      {(() => {
                        const customBackgroundFilename = content.startingSection?.backgroundFilename
                        const hasCustomBackgroundFilename = !!customBackgroundFilename
                        const backgroundType = content.startingSection?.backgroundType

                        if (hasCustomBackgroundFilename && backgroundType === 'video') {
                          return (
                            <video
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="absolute h-full w-full object-cover"
                            >
                              <source
                                src={customBackgroundFilename}
                                type={content.startingSection?.backgroundMimeType ?? 'video/mp4'}
                              />
                            </video>
                          )
                        }

                        if (hasCustomBackgroundFilename && backgroundType === 'image') {
                          return (
                            <Image
                              src={customBackgroundFilename}
                              alt="Wedding background"
                              fill
                              className="absolute h-full w-full object-cover"
                              priority
                            />
                          )
                        }

                        // Default video if no custom media
                        return (
                          <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute h-full w-full object-cover"
                          >
                            <source src="/hero.mp4" type="video/mp4" />
                          </video>
                        )
                      })()}
                      <Hero />
                    </section>
                  )}

                  {/* Groom & Bride Photos */}
                  {features.groom_and_bride && (
                    <>
                      <Groom />
                      <Bride />
                    </>
                  )}
                </div>

                {/* Love Story Section */}
                {features.love_story && (
                  <section
                    className="relative flex w-full flex-col bg-primary-main px-6 py-16 text-secondary-main"
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

                {/* When and Where Section */}
                {(features.save_the_date || features.location) && (
                  <section className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-white py-24 text-center">
                    <SaveTheDateOrnament downward />
                    {features.save_the_date && <SaveTheDate />}
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
                    {features.location &&
                      (content.locations.length > 0 ? (
                        <LocationComponent location="bali" />
                      ) : (
                        <EmptyState message="Add ceremony and reception locations" icon="📍" />
                      ))}
                    <SaveTheDateOrnament />
                  </section>
                )}

                {/* RSVP Section */}
                {features.rsvp && (
                  <section id="rsvp" className="relative w-full bg-primary-main p-6 py-12 pb-16">
                    <BorderedDiv>
                      <SectionTitle title="RSVP" />
                      <RSVPForm rsvp={mockRSVP} />
                    </BorderedDiv>
                    <div className="section-transition-secondary" />
                  </section>
                )}

                {/* Gallery Section */}
                {features.gallery && (
                  <section className="relative w-full overflow-hidden pt-16">
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
                    <div className="relative mx-auto flex w-full max-w-screen-md flex-col items-center overflow-hidden text-center">
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
                  <section className="relative w-full overflow-hidden py-16 pb-24">
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
                )}

                {/* FAQ Section */}
                {features.faqs && (
                  <section className="relative w-full overflow-hidden bg-primary-main py-16 pb-28">
                    <FadeIn from="left" className="pointer-events-none absolute -left-16 -top-3">
                      <Image
                        src="/images/ornaments/baby_orn.png"
                        alt="Baby breath"
                        width={200}
                        height={100}
                        className="rotate-90"
                      />
                    </FadeIn>
                    <SectionTitle title="FAQ" color="secondary" />
                    {content.faqs.length > 0 ? (
                      <FadeIn className="w-full px-8">
                        <FAQ faqs={content.faqs} />
                      </FadeIn>
                    ) : (
                      <EmptyState message="Add frequently asked questions" icon="❓" />
                    )}
                    <FadeIn
                      from="right"
                      className="pointer-events-none absolute -right-10 bottom-4 z-10"
                    >
                      <Image
                        src="/images/ornaments/baby_orn4.png"
                        alt="Baby breath"
                        width={200}
                        height={100}
                        className="-rotate-180"
                      />
                    </FadeIn>
                    <div className="section-transition-secondary-fix" />
                  </section>
                )}

                {/* Dress Code Section */}
                {features.dress_code && (
                  <section className="relative w-full overflow-hidden px-6 pb-12 pt-52">
                    <SectionTitle title="Dress code" />
                    {content.dressCode ? (
                      <DressCode />
                    ) : (
                      <EmptyState message="Add dress code information and photo" icon="👔" />
                    )}
                  </section>
                )}

                {/* Gift Section */}
                {features.gift && (
                  <section className="relative bg-primary-main px-8 py-16 pb-20">
                    <BorderedDiv>
                      <SectionTitle title="Gift" />
                      <Gift />
                    </BorderedDiv>
                    <div className="section-transition-secondary" />
                  </section>
                )}

                {/* Wishes Section */}
                {features.wishes && (
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
                          Your love and well-wishes mean the world to us. Here are the heartfelt
                          messages from our loved ones.
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
                              w.createdAt instanceof Date ? w.createdAt.toISOString() : w.createdAt,
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
                {features.footer && (
                  <footer className="bg-primary-main p-6 text-secondary-main">
                    <p className="text-md text-center">
                      Thank you for being part of our journey and celebrating this special day with
                      us.
                    </p>
                    {config.footerText && (
                      <p className="mt-2 text-center text-sm text-gray-300">{config.footerText}</p>
                    )}
                  </footer>
                )}
              </div>
            </div>
          </LocationProvider>
        </ScrollContainerProvider>
      </WeddingDataProvider>
    </>
  )
}
