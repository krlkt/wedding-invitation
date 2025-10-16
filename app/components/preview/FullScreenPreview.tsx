/**
 * FullScreenPreview Component
 *
 * Displays wedding site in full-screen mode without admin UI
 * Follows Constitution Principle VII: receives data from Server Component
 */

'use client'

import WeddingLayout from '../WeddingLayout'
import type { WeddingConfiguration } from '@/app/db/schema'

interface FullScreenPreviewProps {
  config: WeddingConfiguration & { features: Record<string, boolean> }
}

export default function FullScreenPreview({ config }: FullScreenPreviewProps) {
  if (!config) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">No configuration found</p>
      </div>
    )
  }

  return <WeddingLayout config={config} />
}
