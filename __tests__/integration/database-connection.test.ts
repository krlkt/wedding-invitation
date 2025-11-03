/**
 * Integration Tests: Database Connection
 * T009: Test environment-aware database connections
 */

import { describe, it, expect, beforeAll } from '@jest/globals'

describe('Database Connection (T009)', () => {
  beforeAll(() => {
    // Ensure we're in test/development mode
    if (!process.env.DATABASE_URL && !process.env.TURSO_DATABASE_URL) {
      throw new Error('DATABASE_URL or TURSO_DATABASE_URL must be set for integration tests')
    }
  })

  it('should connect to database with valid credentials', async () => {
    // This will fail until we implement environment-aware connection
    const { getConfig } = await import('@/app/lib/env-config')

    const config = getConfig()

    expect(config.databaseUrl).toBeDefined()
    expect(config.databaseUrl).toMatch(/^libsql:\/\//)
    expect(config.databaseAuthToken).toBeDefined()
  })

  it('should execute simple query successfully', async () => {
    // This will fail until app/db/index.ts uses env-aware config
    const { query } = await import('@/app/db/client')

    const result = await query<{ result: number }>('SELECT 1 as result')

    expect(result.rows).toBeDefined()
    expect(result.rows.length).toBeGreaterThan(0)
    expect(result.rows[0].result).toBe(1)
  })

  it('should use correct database URL per environment', async () => {
    const { getConfig } = await import('@/app/lib/env-config')

    const config = getConfig()
    const env = config.environment

    // Verify URL matches expected environment
    if (env === 'development') {
      expect(config.databaseUrl).toContain('wedding-invitation-dev')
    } else if (env === 'test') {
      expect(config.databaseUrl).toContain('wedding-invitation-test')
    } else if (env === 'production') {
      expect(config.databaseUrl).toContain('wedding-invitation-prod')
    }
  })

  it('should handle connection gracefully with invalid credentials', async () => {
    const { createClient } = await import('@libsql/client')

    const invalidClient = createClient({
      url: 'libsql://invalid-url.turso.io',
      authToken: 'invalid-token',
    })

    // Should throw or return error, not crash
    await expect(async () => {
      await invalidClient.execute('SELECT 1')
    }).rejects.toThrow()
  })

  it('should return EnvironmentConfig with all required properties', async () => {
    const { getConfig } = await import('@/app/lib/env-config')

    const config = getConfig()

    expect(config).toHaveProperty('environment')
    expect(config).toHaveProperty('databaseUrl')
    expect(config).toHaveProperty('databaseAuthToken')
    expect(config).toHaveProperty('isProduction')
    expect(config).toHaveProperty('canDestroyDatabase')

    expect(['development', 'test', 'production']).toContain(config.environment)
    expect(typeof config.isProduction).toBe('boolean')
    expect(typeof config.canDestroyDatabase).toBe('boolean')
  })
})
