/**
 * T064: Live Preview Interface
 *
 * Real-time preview of wedding invitation as configuration changes.
 * Shows desktop preview with live updates from configuration state.
 * Follows Constitution Principle VII: useEffect + fetch for real-time updates only
 * (this is an exception because we need to poll for config changes in the dashboard)
 */

'use client'

import { useState, useEffect, useRef } from 'react'

import TemplateRenderer from './preview/TemplateRenderer'

import type { PreviewData } from './preview/types'
import type { StartingSectionContent } from '@/app/db/schema/starting-section'
import type { GroomSectionContent } from '@/app/db/schema/groom-section'
import type { BrideSectionContent } from '@/app/db/schema/bride-section'
import type { FAQItem } from '../db/schema/content'

interface LivePreviewProps {
  weddingConfigId: string
  refreshTrigger?: number // Increment to force refresh
  draftFeatures?: Record<string, boolean> // Draft features from local state
  draftStartingSection?: Partial<StartingSectionContent> // Draft starting section from local state
  draftGroomSection?: Partial<GroomSectionContent> // Draft groom section from local state
  draftBrideSection?: Partial<BrideSectionContent> // Draft bride section from local state
  draftFAQs?: FAQItem[]
}

export default function LivePreview({
  weddingConfigId,
  refreshTrigger = 0,
  draftFeatures,
  draftStartingSection,
  draftGroomSection,
  draftBrideSection,
  draftFAQs,
}: LivePreviewProps) {
  const [previewData, setPreviewData] = useState<PreviewData | null>(null)
  const [displayData, setDisplayData] = useState<PreviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [containerHeight, setContainerHeight] = useState<number | null>(null)
  const savedScrollPosition = useRef<number>(0)
  const shouldRestoreScroll = useRef<boolean>(false)

  // Measure container height and set CSS variable
  useEffect(() => {
    const updateHeight = () => {
      if (scrollContainerRef.current) {
        const height = scrollContainerRef.current.clientHeight
        setContainerHeight(height)
      }
    }

    // Use setTimeout to ensure the container is rendered and has dimensions
    const timer = setTimeout(updateHeight, 100)

    window.addEventListener('resize', updateHeight)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', updateHeight)
    }
  }, [previewData])

  useEffect(() => {
    async function fetchPreview() {
      try {
        // Save current scroll position before fetching and mark that we should restore it
        if (scrollContainerRef.current) {
          savedScrollPosition.current = scrollContainerRef.current.scrollTop
          shouldRestoreScroll.current = true
        }

        setLoading(true)
        setError(null)
        // Add timestamp to bust Next.js cache
        const response = await fetch(`/api/wedding/preview`, {
          cache: 'no-store',
        })

        if (response.ok) {
          const { data } = await response.json()
          setPreviewData(data)
        } else {
          const errorData = await response.json()
          setError(errorData.message ?? 'Failed to load preview')
        }
      } catch (err) {
        console.error('Failed to fetch preview:', err)
        setError('Failed to load preview')
      } finally {
        setLoading(false)
      }
    }

    void fetchPreview()
  }, [weddingConfigId, refreshTrigger])

  // Merge draft features and section content with preview data for immediate feedback
  useEffect(() => {
    if (previewData) {
      const mergedStartingSection = draftStartingSection
        ? ({
            ...(previewData.content.startingSection ?? {}),
            ...draftStartingSection,
          } as StartingSectionContent)
        : previewData.content.startingSection

      const mergedGroomSection = draftGroomSection
        ? ({
            ...(previewData.content.groomSection ?? {}),
            ...draftGroomSection,
          } as GroomSectionContent)
        : previewData.content.groomSection

      const mergedBrideSection = draftBrideSection
        ? ({
            ...(previewData.content.brideSection ?? {}),
            ...draftBrideSection,
          } as BrideSectionContent)
        : previewData.content.brideSection

      setDisplayData({
        ...previewData,
        features: draftFeatures
          ? {
              ...previewData.features,
              ...draftFeatures,
            }
          : previewData.features,
        content: {
          ...previewData.content,
          startingSection: mergedStartingSection,
          faqs: draftFAQs ?? previewData.content.faqs,
          groomSection: mergedGroomSection,
          brideSection: mergedBrideSection,
        },
      })
    }
  }, [
    previewData,
    draftFeatures,
    draftStartingSection,
    draftGroomSection,
    draftBrideSection,
    draftFAQs,
  ])

  // Restore scroll position only after fetch operations, not on every draft change
  useEffect(() => {
    if (
      displayData &&
      scrollContainerRef.current &&
      shouldRestoreScroll.current &&
      savedScrollPosition.current > 0
    ) {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = savedScrollPosition.current
          // Reset the flag after restoring
          shouldRestoreScroll.current = false
        }
      })
    }
  }, [displayData])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-pink-600" />
          <p className="mt-2 text-sm text-gray-600">Loading preview...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="mb-2 text-red-500">⚠️ {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-pink-600 underline"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!displayData) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50">
        <p className="text-gray-500">No preview data available</p>
      </div>
    )
  }

  return (
    <div className="live-preview flex h-full flex-col bg-white">
      {/* Preview Header - Browser Chrome */}
      <div className="z-10 flex flex-shrink-0 items-center justify-between border-b bg-gray-100 px-4 py-2">
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
        </div>
        <div className="text-sm text-gray-600">
          Preview: {displayData.config.subdomain}.oial-wedding.com (coming soon)
        </div>
        <div className="text-xs text-gray-500">
          {displayData.config.isPublished ? '🟢 Published' : '🔴 Draft'}
        </div>
      </div>

      {/* Preview Content - Mobile view only for dashboard with scroll animations */}
      <div className="flex flex-1 items-center justify-center overflow-hidden bg-gray-50 p-4">
        <div
          ref={scrollContainerRef}
          className="max-h-full w-[450px] overflow-y-auto overflow-x-hidden rounded-lg bg-white shadow-2xl"
          style={
            containerHeight
              ? {
                  ['--container-height' as string]: `${containerHeight}px`,
                }
              : undefined
          }
        >
          <TemplateRenderer
            templateId="template-1"
            data={displayData}
            mode="embedded"
            scrollContainerRef={scrollContainerRef}
          />
        </div>
      </div>
    </div>
  )
}
