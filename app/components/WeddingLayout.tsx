/**
 * T063: Configurable Wedding Invitation Layout
 *
 * Dynamic wedding invitation layout that renders based on configuration.
 * Fetches wedding data by subdomain and displays customized content.
 */

'use client'

import { useEffect, useState } from 'react'
import { WeddingConfiguration } from '@/app/db/schema'
import Image from 'next/image'

interface WeddingLayoutProps {
  subdomain?: string
  config?: WeddingData
  children?: React.ReactNode
}

interface WeddingData extends WeddingConfiguration {
  features: Record<string, boolean>
}

export default function WeddingLayout({ subdomain, config, children }: WeddingLayoutProps) {
  const [wedding, setWedding] = useState<WeddingData | null>(config || null)
  const [loading, setLoading] = useState(!config)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If config is provided directly, skip fetching
    if (config) {
      setWedding(config)
      setLoading(false)
      return
    }

    async function fetchWedding() {
      try {
        // Fetch wedding configuration by subdomain
        const response = await fetch(`/api/wedding/config?subdomain=${subdomain}`)

        if (!response.ok) {
          throw new Error('Wedding not found')
        }

        const data = await response.json()
        setWedding(data.data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (subdomain) {
      fetchWedding()
    }
  }, [subdomain, config])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900" />
          <p className="mt-4 text-gray-600">Loading wedding invitation...</p>
        </div>
      </div>
    )
  }

  if (error || !wedding) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Wedding Not Found</h1>
          <p className="text-gray-600">{error || 'This wedding invitation does not exist.'}</p>
        </div>
      </div>
    )
  }

  if (!wedding.isPublished) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Coming Soon</h1>
          <p className="text-gray-600">This wedding invitation is not yet published.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="wedding-layout">
      {/* Hero Section */}
      <section className="hero flex min-h-screen items-center justify-center bg-gradient-to-b from-pink-50 to-white">
        <div className="px-4 text-center">
          {wedding.monogramFilename && (
            <div className="mb-8">
              <Image
                src={`/api/files/${wedding.monogramFilename}`}
                alt="Wedding Monogram"
                className="mx-auto h-32 w-32 object-contain"
              />
            </div>
          )}
          <h1 className="mb-4 font-serif text-6xl">
            {wedding.groomName} & {wedding.brideName}
          </h1>
          <p className="text-xl text-gray-600">
            {new Date(wedding.weddingDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          {wedding.groomFather && wedding.groomMother && (
            <p className="mt-4 text-gray-500">
              Son of {wedding.groomFather} & {wedding.groomMother}
            </p>
          )}
          {wedding.brideFather && wedding.brideMother && (
            <p className="text-gray-500">
              Daughter of {wedding.brideFather} & {wedding.brideMother}
            </p>
          )}
        </div>
      </section>

      {/* Conditional Sections Based on Features */}
      {wedding.features?.love_story && (
        <section className="bg-white px-4 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-8 font-serif text-4xl">Our Love Story</h2>
            <p className="text-gray-600">Feature enabled - content coming soon</p>
          </div>
        </section>
      )}

      {wedding.features?.rsvp && (
        <section className="bg-gray-50 px-4 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-8 font-serif text-4xl">RSVP</h2>
            <p className="text-gray-600">Feature enabled - content coming soon</p>
          </div>
        </section>
      )}

      {wedding.features?.gallery && (
        <section className="bg-white px-4 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-8 font-serif text-4xl">Gallery</h2>
            <p className="text-gray-600">Feature enabled - content coming soon</p>
          </div>
        </section>
      )}

      {wedding.features?.prewedding_videos && (
        <section className="bg-gray-50 px-4 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-8 font-serif text-4xl">Pre-Wedding Videos</h2>
            <p className="text-gray-600">Feature enabled - content coming soon</p>
          </div>
        </section>
      )}

      {wedding.features?.faqs && (
        <section className="bg-white px-4 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-8 font-serif text-4xl">FAQs</h2>
            <p className="text-gray-600">Feature enabled - content coming soon</p>
          </div>
        </section>
      )}

      {wedding.features?.dress_code && (
        <section className="bg-gray-50 px-4 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-8 font-serif text-4xl">Dress Code</h2>
            <p className="text-gray-600">Feature enabled - content coming soon</p>
          </div>
        </section>
      )}

      {/* Additional children (for custom sections) */}
      {children}

      {/* Footer */}
      <footer className="bg-gray-50 py-8 text-center">
        {wedding.instagramLink && wedding.features.instagram_link && (
          <div className="mb-4">
            <a
              href={wedding.instagramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-700"
            >
              Follow us on Instagram
            </a>
          </div>
        )}
        {wedding.footerText && <p className="text-sm text-gray-600">{wedding.footerText}</p>}
        <p className="mt-2 text-xs text-gray-400">
          Created with ❤️ using Wedding Invitation Platform
        </p>
      </footer>
    </div>
  )
}
