/**
 * T048: FAQ API
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/app/lib/session'
import { getFAQs, createFAQ } from '@/app/lib/content-service'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    if (session instanceof NextResponse) return session

    const faqs = await getFAQs(session.weddingConfigId)

    return NextResponse.json({
      success: true,
      data: faqs,
    })
  } catch (error: any) {
    console.error('Get FAQs error:', error)
    return NextResponse.json({ success: false, error: 'Failed to get FAQs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    if (session instanceof NextResponse) return session

    const body = await request.json()
    const { question, answer, order } = body

    if (!question || !answer || order === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const faq = await createFAQ({
      weddingConfigId: session.weddingConfigId,
      question,
      answer,
      order,
    })

    return NextResponse.json(
      {
        success: true,
        data: faq,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Create FAQ error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create FAQ' }, { status: 500 })
  }
}
