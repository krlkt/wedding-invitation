/**
 * T064: Live Preview Interface
 *
 * Real-time preview of wedding invitation as configuration changes.
 * Shows desktop preview with live updates from configuration state.
 */

'use client'

import { useState, useEffect } from 'react'
import WeddingLayout from './WeddingLayout'

interface LivePreviewProps {
  weddingConfigId: string
  refreshTrigger?: number // Increment to force refresh
}

export default function LivePreview({ weddingConfigId, refreshTrigger = 0 }: LivePreviewProps) {
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchConfig() {
      try {
        setLoading(true)
        const response = await fetch('/api/wedding/config')

        if (response.ok) {
          const data = await response.json()
          setConfig(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch config:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchConfig()
  }, [weddingConfigId, refreshTrigger])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto" />
          <p className="mt-2 text-sm text-gray-600">Loading preview...</p>
        </div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <p className="text-gray-500">No configuration found</p>
      </div>
    )
  }

  return (
    <div className="live-preview h-full overflow-auto bg-white">
      {/* Preview Header */}
      <div className="sticky top-0 z-10 bg-gray-100 border-b px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="text-sm text-gray-600">
          Preview: {config.subdomain}.yourdomain.com
        </div>
        <div className="text-xs text-gray-500">
          {config.isPublished ? '🟢 Published' : '🔴 Draft'}
        </div>
      </div>

      {/* Preview Content - Scaled down for dashboard view */}
      <div className="p-8">
        <div className="max-w-4xl mx-auto shadow-2xl rounded-lg overflow-hidden">
          {/* Hero Preview */}
          <section className="bg-gradient-to-b from-pink-50 to-white py-20 px-8 text-center">
            {config.monogramFilename && (
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-gray-500">Monogram</span>
                </div>
              </div>
            )}
            <h1 className="text-5xl font-serif mb-4">
              {config.groomName} & {config.brideName}
            </h1>
            <p className="text-lg text-gray-600">
              {new Date(config.weddingDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            {(config.groomFather || config.groomMother) && (
              <p className="mt-4 text-sm text-gray-500">
                {config.groomFather && config.groomMother &&
                  `Son of ${config.groomFather} & ${config.groomMother}`}
              </p>
            )}
            {(config.brideFather || config.brideMother) && (
              <p className="text-sm text-gray-500">
                {config.brideFather && config.brideMother &&
                  `Daughter of ${config.brideFather} & ${config.brideMother}`}
              </p>
            )}
          </section>

          {/* Feature Previews */}
          <div className="space-y-8 p-8">
            {config.features?.love_story && (
              <div className="border-t pt-8">
                <h2 className="text-2xl font-serif text-center mb-4">Our Love Story</h2>
                <p className="text-center text-gray-500 text-sm">Feature enabled ✓</p>
              </div>
            )}

            {config.features?.rsvp && (
              <div className="border-t pt-8">
                <h2 className="text-2xl font-serif text-center mb-4">RSVP</h2>
                <p className="text-center text-gray-500 text-sm">Feature enabled ✓</p>
              </div>
            )}

            {config.features?.gallery && (
              <div className="border-t pt-8">
                <h2 className="text-2xl font-serif text-center mb-4">Gallery</h2>
                <p className="text-center text-gray-500 text-sm">Feature enabled ✓</p>
              </div>
            )}

            {config.features?.faqs && (
              <div className="border-t pt-8">
                <h2 className="text-2xl font-serif text-center mb-4">FAQs</h2>
                <p className="text-center text-gray-500 text-sm">Feature enabled ✓</p>
              </div>
            )}

            {config.features?.dress_code && (
              <div className="border-t pt-8">
                <h2 className="text-2xl font-serif text-center mb-4">Dress Code</h2>
                <p className="text-center text-gray-500 text-sm">Feature enabled ✓</p>
              </div>
            )}
          </div>

          {/* Footer Preview */}
          <footer className="bg-gray-50 py-6 text-center border-t">
            {config.instagramLink && config.features?.instagram_link && (
              <div className="mb-2">
                <a href={config.instagramLink} className="text-pink-600 text-sm">
                  Follow us on Instagram
                </a>
              </div>
            )}
            {config.footerText && (
              <p className="text-gray-600 text-xs">{config.footerText}</p>
            )}
          </footer>
        </div>
      </div>
    </div>
  )
}