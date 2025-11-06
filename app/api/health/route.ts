/**
 * Health Check Endpoint
 * T017: Enhanced endpoint with environment information
 * Returns environment name, database status, and timestamp
 */

import { NextResponse } from 'next/server'
import { getConfig } from '@/app/lib/env-config'

export async function GET() {
  try {
    // Get environment configuration
    const config = getConfig()

    // Test database connection
    let databaseStatus: 'connected' | 'error' = 'connected'
    try {
      const { query } = await import('@/app/db/client')
      await query('SELECT 1')
    } catch (error) {
      console.error('Database health check failed:', error)
      databaseStatus = 'error'
    }

    // Return health information
    return NextResponse.json(
      {
        status: databaseStatus === 'connected' ? 'ok' : 'error',
        environment: config.environment,
        database: databaseStatus,
        timestamp: new Date().toISOString(),
      },
      {
        status: databaseStatus === 'connected' ? 200 : 500,
      }
    )
  } catch (error) {
    // Handle any unexpected errors
    console.error('Health endpoint error:', error)

    return NextResponse.json(
      {
        status: 'error',
        environment: 'unknown',
        database: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 500,
      }
    )
  }
}
