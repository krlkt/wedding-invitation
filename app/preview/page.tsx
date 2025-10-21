/**
 * Admin Preview Page
 *
 * Full-screen preview of wedding site for authenticated users
 */

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import {
  getWeddingConfigById,
  getFeatureToggles,
  getLoveStorySegments,
  getLocationDetails,
  getGalleryItems,
  getFAQItems,
  getDressCode,
  getBankDetails,
} from '@/app/lib/wedding-service'
import { getWishes, getStartingSectionContent } from '@/app/lib/content-service'
import TemplateRenderer from '@/app/components/preview/TemplateRenderer'
import type { PreviewData } from '@/app/components/preview/types'

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
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Configuration Not Found</h1>
          <p className="text-gray-600">Unable to load your wedding configuration.</p>
        </div>
      </div>
    )
  }

  // Fetch all data in parallel
  const [
    features,
    startingSection,
    loveStory,
    locations,
    gallery,
    faqs,
    dressCode,
    bankDetailsData,
    wishesRaw,
  ] = await Promise.all([
    getFeatureToggles(config.id),
    getStartingSectionContent(config.id),
    getLoveStorySegments(config.id),
    getLocationDetails(config.id),
    getGalleryItems(config.id),
    getFAQItems(config.id),
    getDressCode(config.id),
    getBankDetails(config.id),
    getWishes(config.id, 20),
  ])

  // Fix Drizzle's timestamp multiplication for wishes
  // Database stores milliseconds (13 digits), but Drizzle multiplies by 1000
  const wishes = wishesRaw.map((wish) => ({
    ...wish,
    createdAt: new Date(Math.floor(wish.createdAt.getTime() / 1000)),
    updatedAt: new Date(Math.floor(wish.updatedAt.getTime() / 1000)),
  }))

  // Convert features array to map
  const featuresMap = features.reduce(
    (acc, f) => {
      acc[f.featureName] = f.isEnabled
      return acc
    },
    {} as Record<string, boolean>
  )

  // Structure data according to PreviewData interface
  const previewData: PreviewData = {
    config,
    features: featuresMap as any,
    content: {
      startingSection,
      loveStory,
      locations,
      gallery,
      faqs,
      dressCode,
      bankDetails: bankDetailsData,
      wishes,
    },
  }

  return (
    <div className="min-h-screen bg-white">
      <TemplateRenderer data={previewData} />
    </div>
  )
}
