/**
 * T050: Dress Code API
 */

import { NextRequest, NextResponse } from 'next/server'

import { getDressCode, updateDressCode } from '@/app/lib/content-service'
import { requireAuth } from '@/app/lib/session'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    if (session instanceof NextResponse) {return session}

    const dressCode = await getDressCode(session.weddingConfigId)

    return NextResponse.json({
      success: true,
      data: dressCode || {},
    })
  } catch (error: any) {
    console.error('Get dress code error:', error)
    return NextResponse.json({ success: false, error: 'Failed to get dress code' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth()
    if (session instanceof NextResponse) {return session}

    const body = await request.json()
    const { title, description } = body

    const updated = await updateDressCode(session.weddingConfigId, {
      title,
      description,
    })

    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch (error: any) {
    console.error('Update dress code error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update dress code' },
      { status: 500 }
    )
  }
}
