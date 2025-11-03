/**
 * Unit Tests: Environment Configuration
 * T007: Test environment detection logic
 * T008: Test config validation (added after T007 completes)
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'

describe('Environment Detection (T007)', () => {
  const originalEnv = process.env

  beforeEach(() => {
    // Reset environment before each test
    process.env = { ...originalEnv }
    delete process.env.APP_ENV
    delete process.env.VERCEL_ENV

    // Clear module cache to get fresh imports
    jest.resetModules()
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('should return "development" when APP_ENV=development', async () => {
    process.env.APP_ENV = 'development'

    // This will fail until we implement app/lib/env-config.ts
    const { getEnvironment } = await import('@/app/lib/env-config')

    expect(getEnvironment()).toBe('development')
  })

  it('should return "test" when VERCEL_ENV=preview', async () => {
    process.env.VERCEL_ENV = 'preview'

    const { getEnvironment } = await import('@/app/lib/env-config')

    expect(getEnvironment()).toBe('test')
  })

  it('should return "production" when VERCEL_ENV=production', async () => {
    process.env.VERCEL_ENV = 'production'

    const { getEnvironment } = await import('@/app/lib/env-config')

    expect(getEnvironment()).toBe('production')
  })

  it('should default to "development" when no env vars set', async () => {
    delete process.env.APP_ENV
    delete process.env.VERCEL_ENV

    const { getEnvironment } = await import('@/app/lib/env-config')

    expect(getEnvironment()).toBe('development')
  })

  it('should prioritize APP_ENV over VERCEL_ENV', async () => {
    process.env.APP_ENV = 'test'
    process.env.VERCEL_ENV = 'production'

    const { getEnvironment } = await import('@/app/lib/env-config')

    expect(getEnvironment()).toBe('test')
  })
})

/**
 * T008: Config Validation Tests
 * Depends on T007 completion
 */
describe('Config Validation (T008)', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
    jest.resetModules()
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('should throw error for invalid DATABASE_URL format', async () => {
    process.env.DATABASE_URL = 'invalid-url'
    process.env.DATABASE_AUTH_TOKEN = 'some-token'

    // This will fail until validateConfig is implemented
    const { getConfig } = await import('@/app/lib/env-config')

    expect(() => getConfig()).toThrow(/DATABASE_URL/)
  })

  it('should accept libsql:// URLs', async () => {
    process.env.DATABASE_URL = 'libsql://wedding-invitation-dev.turso.io'
    process.env.DATABASE_AUTH_TOKEN = 'valid-token'

    const { getConfig } = await import('@/app/lib/env-config')

    expect(() => getConfig()).not.toThrow()
  })

  it('should accept http:// URLs for local development', async () => {
    process.env.DATABASE_URL = 'http://localhost:8080'
    process.env.DATABASE_AUTH_TOKEN = ''
    process.env.APP_ENV = 'development'

    const { getConfig } = await import('@/app/lib/env-config')

    expect(() => getConfig()).not.toThrow()
  })

  it('should throw error for missing auth token on remote database', async () => {
    process.env.DATABASE_URL = 'libsql://wedding-invitation-dev.turso.io'
    delete process.env.DATABASE_AUTH_TOKEN
    delete process.env.TURSO_AUTH_TOKEN // Also delete legacy variable

    const { getConfig } = await import('@/app/lib/env-config')

    expect(() => getConfig()).toThrow(/auth.*token/i)
  })

  it('should throw error if production database marked as destroyable', async () => {
    process.env.DATABASE_URL = 'libsql://wedding-invitation-prod.turso.io'
    process.env.DATABASE_AUTH_TOKEN = 'prod-token'
    process.env.VERCEL_ENV = 'production'
    delete process.env.APP_ENV // Ensure APP_ENV doesn't override

    const { getConfig } = await import('@/app/lib/env-config')

    const config = getConfig()

    // Production databases must never be destroyable
    expect(config.canDestroyDatabase).toBe(false)
  })

  it('should pass validation for valid development configuration', async () => {
    process.env.DATABASE_URL = 'libsql://wedding-invitation-dev.turso.io'
    process.env.DATABASE_AUTH_TOKEN = 'dev-token'
    process.env.APP_ENV = 'development'

    const { getConfig } = await import('@/app/lib/env-config')

    const config = getConfig()

    expect(config.environment).toBe('development')
    expect(config.databaseUrl).toBe(process.env.DATABASE_URL)
    expect(config.canDestroyDatabase).toBe(true)
  })

  it('should validate all required config properties exist', async () => {
    process.env.DATABASE_URL = 'libsql://wedding-invitation-test.turso.io'
    process.env.DATABASE_AUTH_TOKEN = 'test-token'
    process.env.APP_ENV = 'test'

    const { getConfig } = await import('@/app/lib/env-config')

    const config = getConfig()

    expect(config).toHaveProperty('environment')
    expect(config).toHaveProperty('databaseUrl')
    expect(config).toHaveProperty('databaseAuthToken')
    expect(config).toHaveProperty('isProduction')
    expect(config).toHaveProperty('canDestroyDatabase')
  })

  it('should detect NEXT_PUBLIC_ prefix on sensitive variables (T015.5)', async () => {
    // Security validation: sensitive env vars should not use NEXT_PUBLIC_ prefix
    process.env.NEXT_PUBLIC_DATABASE_URL = 'libsql://wedding-invitation-dev.turso.io'
    process.env.DATABASE_AUTH_TOKEN = 'dev-token'

    const { getConfig } = await import('@/app/lib/env-config')

    // Should warn or throw if NEXT_PUBLIC_ prefix detected on sensitive vars
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

    getConfig()

    // Expect warning about client-side exposure
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(/NEXT_PUBLIC.*DATABASE/i)
    )

    consoleSpy.mockRestore()
  })
})
