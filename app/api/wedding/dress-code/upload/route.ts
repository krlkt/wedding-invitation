/**
 * T051: Dress Code Photo Upload API
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/app/lib/session'
import { uploadDressCodePhoto } from '@/app/lib/file-service'

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    if (session instanceof NextResponse) return session

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    const result = await uploadDressCodePhoto(session.weddingConfigId, file)

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
      return NextResponse.json(
        { success: false, error: 'Invalid file type' },
        { status: 400 }
      )
    }

    console.error('Dress code upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    )
  }
}