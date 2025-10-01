/**
 * T049: Bank Details API
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { getBankDetails, updateBankDetails } from '@/lib/content-service'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    if (session instanceof NextResponse) return session

    const details = await getBankDetails(session.weddingConfigId)

    return NextResponse.json({
      success: true,
      data: details || {},
    })
  } catch (error: any) {
    console.error('Get bank details error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get bank details' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth()
    if (session instanceof NextResponse) return session

    const body = await request.json()
    const { bankName, accountName, accountNumber, routingNumber, instructions } = body

    const updated = await updateBankDetails(session.weddingConfigId, {
      bankName,
      accountName,
      accountNumber,
      routingNumber,
      instructions,
    })

    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch (error: any) {
    console.error('Update bank details error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update bank details' },
      { status: 500 }
    )
  }
}