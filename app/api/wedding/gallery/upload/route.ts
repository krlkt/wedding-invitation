/**
 * T051: Gallery Upload API
 */

import { NextRequest, NextResponse } from 'next/server'

import { uploadGalleryPhoto } from '@/lib/file-service'
import { requireAuth } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    if (session instanceof NextResponse) {
      return session
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const alt = formData.get('alt') as string | undefined
    const orderStr = formData.get('order') as string | undefined
    const order = orderStr ? parseInt(orderStr, 10) : undefined

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    const result = await uploadGalleryPhoto(session.weddingConfigId, file, alt, order)

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 201 }
    )
  } catch (error: any) {
    if (error.message === 'File size exceeds 4MB limit') {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 4MB limit' },
        { status: 413 }
      )
    }

    if (error.message === 'Invalid file type') {
      return NextResponse.json({ success: false, error: 'Invalid file type' }, { status: 400 })
    }

    console.error('Gallery upload error:', error)
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 })
  }
}
