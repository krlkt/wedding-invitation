/**
 * T038: POST /api/auth/login
 *
 * Authenticate user and establish session.
 */

import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser } from '@/app/lib/auth'
import { getWeddingConfigByUserId } from '@/app/lib/wedding-service'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password required' },
        { status: 400 }
      )
    }

    // Authenticate user
    const user = await authenticateUser(email, password)

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Get wedding configuration
    const weddingConfig = await getWeddingConfigByUserId(user.userId)

    if (!weddingConfig) {
      return NextResponse.json(
        { success: false, error: 'Wedding configuration not found' },
        { status: 404 }
      )
    }

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set(
      'session',
      JSON.stringify({
        userId: user.userId,
        weddingConfigId: weddingConfig.id,
        lastActivity: Date.now(),
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      }
    )

    return NextResponse.json({
      success: true,
      data: {
        userId: user.userId,
        weddingConfigId: weddingConfig.id,
        subdomain: weddingConfig.subdomain,
      },
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 })
  }
}
