/**
 * Bride Section Content API
 * GET /api/wedding/bride-section - Get bride section content
 * PUT /api/wedding/bride-section - Update bride section content
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/app/lib/session'
import { getBrideSectionContent, updateBrideSectionContent } from '@/app/lib/content-service'
import { brideSectionContentSchema } from '@/app/lib/validations/bride-section'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    if (session instanceof NextResponse) return session

    const content = await getBrideSectionContent(session.weddingConfigId)

    return NextResponse.json({
      success: true,
      data: content,
    })
  } catch (error) {
    console.error('Get bride section content error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get bride section content' },
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
    const validation = brideSectionContentSchema.safeParse(body)

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

    // Convert photos array to JSON string if present
    const dataToUpdate: any = {
      ...validation.data,
      ...(validation.data.photos && { photos: JSON.stringify(validation.data.photos) }),
    }

    const content = await updateBrideSectionContent(session.weddingConfigId, dataToUpdate)

    return NextResponse.json({
      success: true,
      data: content,
    })
  } catch (error) {
    console.error('Update bride section content error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update bride section content' },
      { status: 500 }
    )
  }
}
