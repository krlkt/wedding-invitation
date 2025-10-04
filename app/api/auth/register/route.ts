/**
 * T038: POST /api/auth/register
 *
 * Register new user account and create initial wedding configuration.
 */

import { NextRequest, NextResponse } from 'next/server'
import { registerUser } from '@/app/lib/auth'
import { createWeddingConfiguration } from '@/app/lib/wedding-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, groomName, brideName } = body

    // Validate required fields
    if (!email || !password || !groomName || !brideName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate names
    if (!groomName.trim() || !brideName.trim()) {
      return NextResponse.json(
        { success: false, error: 'Names required' },
        { status: 400 }
      )
    }

    // Register user
    const { userId } = await registerUser(email, password)

    // Create wedding configuration
    const weddingConfig = await createWeddingConfiguration(userId, groomName, brideName)

    return NextResponse.json(
      {
        success: true,
        data: {
          userId,
          weddingConfigId: weddingConfig.id,
          subdomain: weddingConfig.subdomain,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    // Handle specific errors
    if (error.message === 'Email already registered') {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 400 }
      )
    }

    if (error.message === 'Invalid email format') {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    if (error.message === 'Password too short') {
      return NextResponse.json(
        { success: false, error: 'Password too short' },
        { status: 400 }
      )
    }

    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    )
  }
}