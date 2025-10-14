/**
 * T064: Live Preview Interface
 *
 * Real-time preview of wedding invitation as configuration changes.
 * Shows desktop preview with live updates from configuration state.
 * Follows Constitution Principle VII: useEffect + fetch for real-time updates only
 * (this is an exception because we need to poll for config changes in the dashboard)
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
      <div className="flex h-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-pink-600" />
          <p className="mt-2 text-sm text-gray-600">Loading preview...</p>
        </div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50">
        <p className="text-gray-500">No configuration found</p>
      </div>
    )
  }

  return (
    <div className="live-preview h-full overflow-auto bg-white">
      {/* Preview Header - Browser Chrome */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-gray-100 px-4 py-2">
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
        </div>
        <div className="text-sm text-gray-600">
          Preview: Your wedding site (Custom subdomain available after domain setup)
        </div>
        <div className="text-xs text-gray-500">
          {config.isPublished ? '🟢 Published' : '🔴 Draft'}
        </div>
      </div>

      {/* Preview Content - Scaled down for dashboard view */}
      <div className="p-8">
        <div className="mx-auto max-w-4xl origin-top scale-90 overflow-hidden rounded-lg shadow-2xl">
          {/* Reuse WeddingLayout component - single source of truth */}
          <WeddingLayout config={config} />
        </div>
      </div>
    </div>
  )
}
