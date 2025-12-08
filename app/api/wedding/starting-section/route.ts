/**
 * Starting Section Content API
 * GET /api/wedding/starting-section - Get starting section content
 * PUT /api/wedding/starting-section - Update starting section content
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { getStartingSectionContent, updateStartingSectionContent } from '@/lib/content-service'
import { startingSectionContentSchema } from '@/lib/validations/starting-section'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    if (session instanceof NextResponse) return session

    const content = await getStartingSectionContent(session.weddingConfigId)

    return NextResponse.json({
      success: true,
      data: content,
    })
  } catch (error: any) {
    console.error('Get starting section content error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get starting section content' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth()
    if (session instanceof NextResponse) return session

    const body = await request.json()

    // Validate with Zod schema
    const validation = startingSectionContentSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.error.issues,
        },
        { status: 400 }
      )
    }

    const content = await updateStartingSectionContent(session.weddingConfigId, validation.data)

    return NextResponse.json({
      success: true,
      data: content,
    })
  } catch (error: any) {
    console.error('Update starting section content error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update starting section content' },
      { status: 500 }
    )
  }
}
