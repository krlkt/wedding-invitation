/**
 * T043: PUT /api/wedding/config/features
 *
 * Toggle wedding features on/off.
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { toggleFeature } from '@/lib/wedding-service'

const VALID_FEATURES = [
  'love_story',
  'rsvp',
  'gallery',
  'prewedding_videos',
  'faqs',
  'dress_code',
  'instagram_link',
]

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth()
    if (session instanceof NextResponse) return session

    const body = await request.json()
    const { featureName, isEnabled } = body

    // Validate feature name
    if (!featureName || !VALID_FEATURES.includes(featureName)) {
      return NextResponse.json(
        { success: false, error: 'Invalid feature name' },
        { status: 400 }
      )
    }

    // Validate isEnabled
    if (typeof isEnabled !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'isEnabled must be a boolean' },
        { status: 400 }
      )
    }

    // Toggle feature
    await toggleFeature(session.weddingConfigId, featureName, isEnabled)

    return NextResponse.json({
      success: true,
      data: {
        featureName,
        isEnabled,
      },
    })
  } catch (error: any) {
    console.error('Toggle feature error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to toggle feature' },
      { status: 500 }
    )
  }
}