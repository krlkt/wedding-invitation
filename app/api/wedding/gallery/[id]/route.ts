/**
 * T052: Gallery Management API - Individual photo operations
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/app/lib/session'
import { updateGalleryPhoto, deleteGalleryPhoto } from '@/app/lib/file-service'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth()
    if (session instanceof NextResponse) return session

    const { id } = await params
    const body = await request.json()
    const { order, alt } = body

    const updated = await updateGalleryPhoto(id, { order, alt })

    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch (error: any) {
    console.error('Update gallery photo error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update photo' },
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
    await deleteGalleryPhoto(id)

    return NextResponse.json({
      success: true,
      message: 'Photo deleted successfully',
    })
  } catch (error: any) {
    console.error('Delete gallery photo error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete photo' },
      { status: 500 }
    )
  }
}