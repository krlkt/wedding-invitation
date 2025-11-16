/**
 * E2E Tests for Login Page Redirect
 *
 * End-to-end tests verifying that authenticated users are redirected from /login to /admin,
 * and unauthenticated users can access the login page normally.
 */

import { test, expect } from '@playwright/test'

test.describe('Login Page Redirect', () => {
  const testEmail = `login-redirect-e2e-${Date.now()}@example.com`
  const testPassword = 'SecurePassword123!'

  test.beforeAll(async ({ browser }) => {
    // Setup: Register a test user
    const page = await browser.newPage()
    await page.goto('/register')

    // Fill registration form
    await page.fill('input[name="email"]', testEmail)
    await page.fill('input[name="password"]', testPassword)
    await page.fill('input[name="groomName"]', 'E2E Test Groom')
    await page.fill('input[name="brideName"]', 'E2E Test Bride')

    // Submit registration
    await page.click('button[type="submit"]')

    // Wait for redirect (should go to /admin or /dashboard)
    await page.waitForURL(/\/(admin|dashboard)/)

    // Logout to clean state
    await page.goto('/api/auth/logout')
    await page.close()
  })

  test('should show login page for unauthenticated users', async ({ page }) => {
    await page.goto('/login')

    // Should successfully load login page
    await expect(page).toHaveURL('/login')

    // Should show login form elements
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()

    // Should show login page heading
    await expect(page.locator('text=Wedding Admin')).toBeVisible()
  })

  test('should redirect authenticated users from /login to /admin', async ({ page }) => {
    // Step 1: Login first
    await page.goto('/login')
    await page.fill('input[type="email"]', testEmail)
    await page.fill('input[type="password"]', testPassword)
    await page.click('button[type="submit"]')

    // Wait for successful login and redirect
    await page.waitForURL(/\/admin/)

    // Step 2: Try to access /login again
    await page.goto('/login')

    // Should be redirected to /admin
    await expect(page).toHaveURL('/admin')

    // Should see admin dashboard, not login form
    await expect(page.locator('input[type="email"]')).not.toBeVisible()
    await expect(page.locator('text=Wedding Admin')).toBeVisible()

    // Cleanup: Logout
    await page.click('button:has-text("Logout")')
  })

  test('should maintain authentication state across page navigations', async ({ page }) => {
    // Step 1: Login
    await page.goto('/login')
    await page.fill('input[type="email"]', testEmail)
    await page.fill('input[type="password"]', testPassword)
    await page.click('button[type="submit"]')

    await page.waitForURL(/\/admin/)

    // Step 2: Navigate to various pages
    await page.goto('/admin')
    await expect(page).toHaveURL('/admin')

    // Step 3: Try to access /login
    await page.goto('/login')
    await expect(page).toHaveURL('/admin')

    // Step 4: Direct navigation should still redirect
    await page.goto('/login')
    await expect(page).toHaveURL('/admin')

    // Cleanup: Logout
    await page.click('button:has-text("Logout")')
  })

  test('should allow access to /login after logout', async ({ page }) => {
    // Step 1: Login
    await page.goto('/login')
    await page.fill('input[type="email"]', testEmail)
    await page.fill('input[type="password"]', testPassword)
    await page.click('button[type="submit"]')

    await page.waitForURL(/\/admin/)

    // Step 2: Logout
    await page.click('button:has-text("Logout")')

    // Wait for logout to complete
    await page.waitForTimeout(500)

    // Step 3: Access /login should work now
    await page.goto('/login')
    await expect(page).toHaveURL('/login')

    // Should show login form
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('should redirect to /login when accessing /admin without authentication', async ({
    page,
  }) => {
    // Clear cookies to ensure no authentication
    await page.context().clearCookies()

    // Try to access /admin
    await page.goto('/admin')

    // Should be redirected to /login with redirect parameter
    await expect(page).toHaveURL(/\/login/)

    // Should show login form
    await expect(page.locator('input[type="email"]')).toBeVisible()
  })

  test('should redirect to original destination after login', async ({ page }) => {
    // Clear cookies
    await page.context().clearCookies()

    // Try to access /admin without auth (should redirect to login with redirect param)
    await page.goto('/admin')
    await page.waitForURL(/\/login/)

    // Login
    await page.fill('input[type="email"]', testEmail)
    await page.fill('input[type="password"]', testPassword)
    await page.click('button[type="submit"]')

    // Should redirect back to /admin
    await page.waitForURL(/\/admin/)
    await expect(page).toHaveURL('/admin')

    // Cleanup: Logout
    await page.click('button:has-text("Logout")')
  })

  test('should handle browser back button correctly after redirect', async ({ page }) => {
    // Step 1: Login
    await page.goto('/login')
    await page.fill('input[type="email"]', testEmail)
    await page.fill('input[type="password"]', testPassword)
    await page.click('button[type="submit"]')

    await page.waitForURL(/\/admin/)

    // Step 2: Try to access /login (should redirect to /admin)
    await page.goto('/login')
    await expect(page).toHaveURL('/admin')

    // Step 3: Press back button
    await page.goBack()

    // Should still be on /admin (because /login redirected)
    // Or might be on previous page before /login
    const currentUrl = page.url()
    expect(currentUrl).toMatch(/\/(admin|login)/)

    // Cleanup: Logout
    if (currentUrl.includes('admin')) {
      await page.click('button:has-text("Logout")')
    }
  })

  test('should handle concurrent login attempts from multiple tabs', async ({ browser }) => {
    // Create two browser contexts (simulating two tabs)
    const context1 = await browser.newContext()
    const context2 = await browser.newContext()

    const page1 = await context1.newPage()
    const page2 = await context2.newPage()

    try {
      // Tab 1: Navigate to login
      await page1.goto('/login')
      await expect(page1).toHaveURL('/login')

      // Tab 2: Navigate to login
      await page2.goto('/login')
      await expect(page2).toHaveURL('/login')

      // Tab 1: Login
      await page1.fill('input[type="email"]', testEmail)
      await page1.fill('input[type="password"]', testPassword)
      await page1.click('button[type="submit"]')
      await page1.waitForURL(/\/admin/)

      // Tab 1 should now redirect /login to /admin
      await page1.goto('/login')
      await expect(page1).toHaveURL('/admin')

      // Tab 2 should still show login (different session)
      await expect(page2).toHaveURL('/login')
      await expect(page2.locator('input[type="email"]')).toBeVisible()

      // Cleanup: Logout from tab 1
      await page1.click('button:has-text("Logout")')
    } finally {
      await context1.close()
      await context2.close()
    }
  })

  test('should not cache login page for authenticated users', async ({ page }) => {
    // Step 1: Login
    await page.goto('/login')
    await page.fill('input[type="email"]', testEmail)
    await page.fill('input[type="password"]', testPassword)
    await page.click('button[type="submit"]')

    await page.waitForURL(/\/admin/)

    // Step 2: Hard reload the login page
    await page.goto('/login')
    await page.reload({ waitUntil: 'networkidle' })

    // Should still redirect to /admin (not show cached login page)
    await expect(page).toHaveURL('/admin')

    // Cleanup: Logout
    await page.click('button:has-text("Logout")')
  })

  test('should handle expired/invalid session gracefully', async ({ page }) => {
    // Step 1: Login first
    await page.goto('/login')
    await page.fill('input[type="email"]', testEmail)
    await page.fill('input[type="password"]', testPassword)
    await page.click('button[type="submit"]')

    await page.waitForURL(/\/admin/)

    // Step 2: Manually corrupt the session cookie
    await page.context().addCookies([
      {
        name: 'session',
        value: 'invalid-session-data',
        domain: 'localhost',
        path: '/',
      },
    ])

    // Step 3: Access /login with corrupted session
    await page.goto('/login')

    // Should either show login page (treating as unauthenticated)
    // or redirect to login from middleware
    const currentUrl = page.url()
    expect(currentUrl).toMatch(/\/login/)

    // Should show login form (not admin page)
    await expect(page.locator('input[type="email"]')).toBeVisible()
  })
})

// NOTE: These tests require a running Next.js server
// Run with: yarn dev (in one terminal) and yarn test:e2e (in another)
