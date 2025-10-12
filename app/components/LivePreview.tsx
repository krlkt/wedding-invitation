/**
 * T064: Live Preview Interface
 *
 * Real-time preview of wedding invitation as configuration changes.
 * Shows actual template with feature toggle integration.
 */

'use client'

import { useState, useEffect } from 'react'
import TemplateRenderer from './preview/TemplateRenderer'
import type { PreviewData } from './preview/types'

interface LivePreviewProps {
  weddingConfigId: string
  refreshTrigger?: number // Increment to force refresh
}

export default function LivePreview({ weddingConfigId, refreshTrigger = 0 }: LivePreviewProps) {
  const [previewData, setPreviewData] = useState<PreviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPreview() {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('/api/wedding/preview')

        if (response.ok) {
          const { data } = await response.json()
          setPreviewData(data)
        } else {
          const errorData = await response.json()
          setError(errorData.message || 'Failed to load preview')
        }
      } catch (err) {
        console.error('Failed to fetch preview:', err)
        setError('Failed to load preview')
      } finally {
        setLoading(false)
      }
    }

    fetchPreview()
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 mb-2">⚠️ {error}</p>
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

  if (!previewData) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <p className="text-gray-500">No preview data available</p>
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
          Preview: {previewData.config.subdomain}.yourdomain.com
        </div>
        <div className="text-xs text-gray-500">
          {previewData.config.isPublished ? '🟢 Published' : '🔴 Draft'}
        </div>
      </div>

      {/* Preview Content - Scaled down for dashboard view */}
      <div className="p-8">
        <div className="max-w-4xl mx-auto shadow-2xl rounded-lg overflow-hidden transform scale-90 origin-top">
          <TemplateRenderer templateId="template-1" data={previewData} />
        </div>
      </div>
    </div>
  )
}