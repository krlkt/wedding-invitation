/**
 * GET /api/wedding/preview
 *
 * Consolidated preview endpoint for LivePreview component.
 * Returns wedding config, feature toggles, and all content in a single request.
 */

import { NextRequest, NextResponse } from 'next/server'

import type { PreviewData } from '@/app/components/preview/types'
import type { FeatureName } from '@/app/db/schema/features'
import {
  getLoveStorySegments,
  getLocations,
  getFAQs,
  getDressCode,
  getBankDetails,
  getWishes,
  getStartingSectionContent,
} from '@/app/lib/content-service'
import { getGalleryPhotos } from '@/app/lib/file-service'
import { requireAuth } from '@/app/lib/session'
import { getWeddingConfigById, getFeatureToggles } from '@/app/lib/wedding-service'

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const session = await requireAuth()
    if (session instanceof NextResponse) {
      return session
    }

    // Get wedding configuration
    const config = await getWeddingConfigById(session.weddingConfigId)

    if (!config) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Wedding configuration not found for this user' },
        { status: 404 }
      )
    }

    // Get feature toggles
    const toggles = await getFeatureToggles(config.id)
    const features = toggles.reduce(
      (acc, t) => {
        acc[t.featureName] = t.isEnabled
        return acc
      },
      {} as Record<FeatureName, boolean>
    )

    // Fetch content based on enabled features (parallel execution)
    const [
      startingSection,
      loveStory,
      gallery,
      faqs,
      dressCode,
      locations,
      bankDetails,
      wishesRaw,
    ] = await Promise.all([
      getStartingSectionContent(config.id), // Always fetch (needed for Starting Section)
      features.love_story ? getLoveStorySegments(config.id) : Promise.resolve([]),
      features.gallery ? getGalleryPhotos(config.id) : Promise.resolve([]),
      features.faqs ? getFAQs(config.id) : Promise.resolve([]),
      features.dress_code ? getDressCode(config.id) : Promise.resolve(null),
      getLocations(config.id), // Always fetch (needed for When & Where)
      getBankDetails(config.id), // Always fetch (needed for Gift section)
      features.wishes ? getWishes(config.id, 20) : Promise.resolve([]), // Limit to 20 for preview
    ])

    // Fix Drizzle's timestamp multiplication for wishes
    // Database stores milliseconds (13 digits), but Drizzle multiplies by 1000
    const wishes = wishesRaw.map((wish) => ({
      ...wish,
      createdAt: new Date(Math.floor(wish.createdAt.getTime() / 1000)),
      updatedAt: new Date(Math.floor(wish.updatedAt.getTime() / 1000)),
    }))

    // Build response
    const data: PreviewData = {
      config,
      features,
      content: {
        startingSection,
        loveStory,
        gallery: gallery.slice(0, 20), // Limit to 20 for performance
        faqs,
        dressCode,
        locations,
        bankDetails,
        wishes,
      },
    }

    return NextResponse.json(
      { data },
      {
        headers: {
          'Cache-Control': 'private, max-age=30', // 30-second cache
        },
      }
    )
  } catch (error: any) {
    console.error('Preview API error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch preview data' },
      { status: 500 }
    )
  }
}
