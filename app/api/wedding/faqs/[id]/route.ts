import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/app/lib/session'
import { updateFAQ, deleteFAQ, getFAQById } from '@/app/lib/content-service'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth()
    if (session instanceof NextResponse) return session

    const { id } = params
    const body = await request.json()
    const { question, answer, order } = body

    if (!question || !answer || order === undefined) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const existingFAQ = await getFAQById(id)
    if (!existingFAQ || existingFAQ.weddingConfigId !== session.weddingConfigId) {
      return NextResponse.json({ success: false, error: 'FAQ not found' }, { status: 404 })
    }

    const updatedFAQ = await updateFAQ(id, { question, answer, order })
    return NextResponse.json({ success: true, data: updatedFAQ })
  } catch (error: any) {
    console.error('Update FAQ error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update FAQ' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth()
    if (session instanceof NextResponse) return session

    const { id } = params

    const existingFAQ = await getFAQById(id)
    if (!existingFAQ || existingFAQ.weddingConfigId !== session.weddingConfigId) {
      return NextResponse.json({ success: false, error: 'FAQ not found' }, { status: 404 })
    }

    await deleteFAQ(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete FAQ error:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete FAQ' }, { status: 500 })
  }
}
