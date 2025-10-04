/**
 * T070: E2E Tests for Complete User Journey
 *
 * End-to-end test covering the entire user workflow from registration to publishing.
 */

import { test, expect } from '@playwright/test'

test.describe('Complete User Journey', () => {
  const testEmail = `e2e-test-${Date.now()}@example.com`
  const testPassword = 'SecurePassword123!'

  test('should complete full wedding setup journey', async ({ page }) => {
    // Step 1: Register new account
    await page.goto('/register')
    await page.fill('input[name="email"]', testEmail)
    await page.fill('input[name="password"]', testPassword)
    await page.fill('input[name="groomName"]', 'John Doe')
    await page.fill('input[name="brideName"]', 'Jane Smith')
    await page.click('button[type="submit"]')

    // Should redirect to dashboard after registration
    await expect(page).toHaveURL(/\/dashboard/)

    // Step 2: Configure basic wedding details
    await page.fill('input[name="weddingDate"]', '2024-12-25')
    await page.fill('input[name="groomFather"]', 'Robert Doe')
    await page.fill('input[name="groomMother"]', 'Mary Doe')
    await page.click('button:has-text("Save Changes")')

    await expect(page.locator('text=Saved successfully')).toBeVisible()

    // Step 3: Toggle features
    await page.click('button:has-text("Features")')
    await page.click('[data-feature="love_story"]')

    // Step 4: Preview wedding site
    const preview = page.locator('.live-preview')
    await expect(preview).toContainText('John Doe & Jane Smith')
    await expect(preview).toContainText('December 25, 2024')

    // Step 5: Publish wedding
    await page.click('button:has-text("Publish Wedding")')
    await expect(page.locator('text=Published')).toBeVisible()

    // Step 6: Verify published site is accessible
    const weddingUrl = await page.textContent('[data-wedding-url]')
    await page.goto(weddingUrl!)

    await expect(page.locator('h1')).toContainText('John Doe & Jane Smith')

    // Step 7: Logout
    await page.goto('/dashboard')
    await page.click('button:has-text("Logout")')
    await expect(page).toHaveURL('/')

    // Step 8: Login again
    await page.goto('/login')
    await page.fill('input[name="email"]', testEmail)
    await page.fill('input[name="password"]', testPassword)
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/\/dashboard/)
  })
})

// NOTE: This test requires a running Next.js server
// Run with: yarn dev (in one terminal) and yarn test:e2e (in another)