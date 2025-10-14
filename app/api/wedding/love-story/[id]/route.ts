/**
 * T046: Love Story API - Individual segment operations
 * PUT /api/wedding/love-story/[id] - Update segment
 * DELETE /api/wedding/love-story/[id] - Delete segment
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/app/lib/session'
import { updateLoveStorySegment, deleteLoveStorySegment } from '@/app/lib/content-service'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAuth()
    if (session instanceof NextResponse) return session

    const { id } = await params
    const body = await request.json()
    const { title, description, date, iconType, order } = body

    const updated = await updateLoveStorySegment(id, {
      title,
      description,
      date: date ? new Date(date) : undefined,
      iconType,
      order,
    })

    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch (error: any) {
    console.error('Update love story error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update love story segment' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth()
    if (session instanceof NextResponse) return session

    const { id } = await params
    await deleteLoveStorySegment(id)

    return NextResponse.json({
      success: true,
      message: 'Love story segment deleted',
    })
  } catch (error: any) {
    console.error('Delete love story error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete love story segment' },
      { status: 500 }
    )
  }
}
