/**
 * T046: Love Story API
 * GET /api/wedding/love-story - Get all segments
 * POST /api/wedding/love-story - Create segment
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/app/lib/session'
import { getLoveStorySegments, createLoveStorySegment } from '@/app/lib/content-service'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    if (session instanceof NextResponse) return session

    const segments = await getLoveStorySegments(session.weddingConfigId)

    return NextResponse.json({
      success: true,
      data: segments,
    })
  } catch (error: any) {
    console.error('Get love story error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get love story segments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    if (session instanceof NextResponse) return session

    const body = await request.json()
    const { title, description, date, iconType, order } = body

    // Validate required fields
    if (!title || !description || !date || !iconType || order === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const segment = await createLoveStorySegment({
      weddingConfigId: session.weddingConfigId,
      title,
      description,
      date: new Date(date),
      iconType,
      order,
    })

    return NextResponse.json(
      {
        success: true,
        data: segment,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Create love story error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create love story segment' },
      { status: 500 }
    )
  }
}