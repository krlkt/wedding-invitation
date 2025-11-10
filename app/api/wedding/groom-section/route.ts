/**
 * Groom Section Content API
 * GET /api/wedding/groom-section - Get groom section content
 * PUT /api/wedding/groom-section - Update groom section content
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/app/lib/session'
import { getGroomSectionContent, updateGroomSectionContent } from '@/app/lib/content-service'
import { groomSectionContentSchema } from '@/app/lib/validations/groom-section'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    if (session instanceof NextResponse) return session

    const content = await getGroomSectionContent(session.weddingConfigId)

    return NextResponse.json({
      success: true,
      data: content,
    })
  } catch (error) {
    console.error('Get groom section content error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get groom section content' },
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
    const validation = groomSectionContentSchema.safeParse(body)

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

    const content = await updateGroomSectionContent(session.weddingConfigId, dataToUpdate)

    return NextResponse.json({
      success: true,
      data: content,
    })
  } catch (error) {
    console.error('Update groom section content error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update groom section content' },
      { status: 500 }
    )
  }
}
