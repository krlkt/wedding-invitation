/**
 * T040: GET /api/auth/session
 *
 * Check current authentication status.
 */

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getWeddingConfigById } from '@/app/lib/wedding-service'

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000 // change to 5 * 1000 for 5 seconds (testing)

export async function GET(request: NextRequest) {
  try {
    // Get session cookie
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')

    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Parse session data
    const session = JSON.parse(sessionCookie.value)
    const { userId, weddingConfigId, lastActivity } = session

    if (!userId || !weddingConfigId) {
      return NextResponse.json(
        { success: false, error: 'Invalid session' },
        { status: 401 }
      )
    }

    // Check inactivity expiration
    if (!lastActivity || Date.now() - lastActivity > ONE_WEEK_MS) {
      cookieStore.set('session', '', { maxAge: 0, path: '/' }) 
      return NextResponse.json(
        { success: false, error: 'Session expired' },
        { status: 401 }
      )
    }

    // Refresh lastActivity
    const updatedSession = {
      ...session,
      lastActivity: Date.now(),
    }

    cookieStore.set('session', JSON.stringify(updatedSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    // Verify wedding config exists
    const weddingConfig = await getWeddingConfigById(weddingConfigId)

    if (!weddingConfig) {
      return NextResponse.json(
        { success: false, error: 'Wedding configuration not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        userId,
        weddingConfigId,
        subdomain: weddingConfig.subdomain,
      },
    })
  } catch (error: any) {
    console.error('Session check error:', error)
    return NextResponse.json(
      { success: false, error: 'Session check failed' },
      { status: 500 }
    )
  }
}