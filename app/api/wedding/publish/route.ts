/**
 * T044: POST /api/wedding/publish
 *
 * Publish wedding configuration to make it live.
 */

import { NextRequest, NextResponse } from 'next/server'

import { requireAuth } from '@/lib/session'
import { publishWeddingConfig, getWeddingConfigById } from '@/lib/wedding-service'

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    if (session instanceof NextResponse) {
      return session
    }

    // Get current config to build wedding URL
    const config = await getWeddingConfigById(session.weddingConfigId)

    if (!config) {
      return NextResponse.json(
        { success: false, error: 'Wedding configuration not found' },
        { status: 404 }
      )
    }

    // Publish wedding
    const published = await publishWeddingConfig(session.weddingConfigId)

    // Build wedding URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const weddingUrl = `${baseUrl.replace('://', `://${config.subdomain}.`)}`

    return NextResponse.json({
      success: true,
      data: {
        isPublished: true,
        publishedAt: published.updatedAt,
        weddingUrl,
      },
    })
  } catch (error: any) {
    console.error('Publish error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to publish wedding' },
      { status: 500 }
    )
  }
}
