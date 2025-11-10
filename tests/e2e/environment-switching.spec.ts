/**
 * E2E Tests: Environment Switching
 * T012: Test Playwright can verify environment in different deployments
 */

import { test, expect } from '@playwright/test'

test.describe('Environment Switching (T012)', () => {
  test('should show "development" environment on local dev server', async ({ page }) => {
    // This will fail until env-config.ts and health endpoint are implemented
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    await page.goto(`${baseUrl}/api/health`)

    const response = await page.textContent('body')
    const data = JSON.parse(response ?? '{}')

    expect(data.environment).toBe('development')
    expect(data.status).toBe('ok')
  })

  test('should detect environment from health endpoint', async ({ page }) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    // Navigate to health endpoint
    const response = await page.goto(`${baseUrl}/api/health`)

    expect(response?.status()).toBe(200)

    const body = await response?.text()
    const data = JSON.parse(body ?? '{}')

    expect(data).toHaveProperty('environment')
    expect(data).toHaveProperty('database')
    expect(data).toHaveProperty('timestamp')
  })

  test('should show correct database connection status', async ({ page }) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    await page.goto(`${baseUrl}/api/health`)

    const response = await page.textContent('body')
    const data = JSON.parse(response ?? '{}')

    // Database should be connected in all environments
    expect(data.database).toBe('connected')
  })

  test('VERCEL_ENV=preview should map to test environment', async ({ page }) => {
    // This test is only applicable when running in Vercel preview
    const vercelEnv = process.env.VERCEL_ENV

    if (vercelEnv === 'preview') {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

      await page.goto(`${baseUrl}/api/health`)

      const response = await page.textContent('body')
      const data = JSON.parse(response ?? '{}')

      expect(data.environment).toBe('test')
    } else {
      // Skip this test in non-preview environments
      test.skip()
    }
  })

  test('VERCEL_ENV=production should map to production environment', async ({ page }) => {
    // This test is only applicable when running in Vercel production
    const vercelEnv = process.env.VERCEL_ENV

    if (vercelEnv === 'production') {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

      await page.goto(`${baseUrl}/api/health`)

      const response = await page.textContent('body')
      const data = JSON.parse(response || '{}')

      expect(data.environment).toBe('production')
      expect(data.database).toBe('connected')
    } else {
      // Skip this test in non-production environments
      test.skip()
    }
  })

  test('should return health data within reasonable time', async ({ page }) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const startTime = Date.now()
    await page.goto(`${baseUrl}/api/health`)
    const endTime = Date.now()

    const responseTime = endTime - startTime

    // Health endpoint should respond within 1 second
    expect(responseTime).toBeLessThan(1000)
  })
})
