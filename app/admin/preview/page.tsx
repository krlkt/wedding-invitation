/**
 * Admin Preview Page
 *
 * Full-screen preview of wedding site for authenticated users
 */

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getWeddingConfigById, getFeatureToggles } from '@/app/lib/wedding-service'
import FullScreenPreview from '@/app/components/preview/FullScreenPreview'

async function getSession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')

  if (!sessionCookie) {
    return null
  }

  try {
    const sessionData = JSON.parse(sessionCookie.value)
    return sessionData
  } catch {
    return null
  }
}

export default async function AdminPreviewPage() {
  // Check authentication
  const session = await getSession()

  if (!session || !session.weddingConfigId) {
    redirect('/admin/login')
  }

  // Fetch wedding configuration
  const config = await getWeddingConfigById(session.weddingConfigId)

  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Configuration Not Found</h1>
          <p className="text-gray-600">Unable to load your wedding configuration.</p>
        </div>
      </div>
    )
  }

  // Get feature toggles
  const features = await getFeatureToggles(config.id)
  const featuresMap = features.reduce((acc, f) => {
    acc[f.featureName] = f.isEnabled
    return acc
  }, {} as Record<string, boolean>)

  const configWithFeatures = {
    ...config,
    features: featuresMap
  }

  return <FullScreenPreview config={configWithFeatures} />
}
