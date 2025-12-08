import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { createFAQ, updateFAQ, deleteFAQ, getFAQById } from '@/lib/content-service'

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAuth()
    if (session instanceof NextResponse) return session

    const weddingConfigId = session.weddingConfigId
    const { updated = [], deleted = [] } = await req.json()

    if (!Array.isArray(updated) || !Array.isArray(deleted)) {
      return NextResponse.json({ success: false, error: 'Invalid payload format' }, { status: 400 })
    }

    const updatePromises = updated.map(async (faq: any) => {
      let existing = null
      if (faq.id) {
        existing = await getFAQById(faq.id)
      }

      if (!faq.id || !existing) {
        return createFAQ({
          weddingConfigId,
          question: faq.question,
          answer: faq.answer,
          order: faq.order,
        })
      }

      if (existing.weddingConfigId !== weddingConfigId) {
        throw new Error(`FAQ not found or unauthorized: ${faq.id}`)
      }

      return updateFAQ(faq.id, {
        question: faq.question,
        answer: faq.answer,
        order: faq.order,
      })
    })

    const deletePromises = deleted.map(async (id: string) => {
      const existing = await getFAQById(id)
      if (existing?.weddingConfigId !== weddingConfigId) {
        throw new Error(`FAQ not found or unauthorized: ${id}`)
      }
      return deleteFAQ(id)
    })

    await Promise.all([...updatePromises, ...deletePromises])

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('FAQ batch update error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to perform batch FAQ update' },
      { status: 500 }
    )
  }
}
