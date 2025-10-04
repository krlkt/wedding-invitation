/**
 * T051: Dress Code Photo Delete API
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/app/lib/session'
import { deleteDressCodePhoto } from '@/app/lib/file-service'

export async function DELETE(request: NextRequest) {
  try {
    const session = await requireAuth()
    if (session instanceof NextResponse) return session

    await deleteDressCodePhoto(session.weddingConfigId)

    return NextResponse.json({
      success: true,
      message: 'Dress code photo deleted',
    })
  } catch (error: any) {
    console.error('Delete dress code photo error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete dress code photo' },
      { status: 500 }
    )
  }
}