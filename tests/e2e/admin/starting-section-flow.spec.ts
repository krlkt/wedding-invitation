/**
 * E2E Tests: Starting Section Configuration Flow
 *
 * End-to-end tests for the complete starting section content management flow.
 * These tests MUST FAIL initially (TDD approach) until features are implemented.
 *
 * Tests cover:
 * - Navigation to starting section tab
 * - Form interaction and data persistence
 * - Live preview updates
 * - Parent info toggle and partial data
 * - Wedding date toggle
 *
 * @see app/admin/[configId]/content/page.tsx (to be implemented)
 */

import { test, expect } from '@playwright/test'

// Test data
const TEST_USER = {
  email: 'test@example.com',
  password: 'testpassword123',
}

const TEST_WEDDING_CONFIG = {
  groomFirstName: 'John',
  groomLastName: 'Doe',
  brideFirstName: 'Jane',
  brideLastName: 'Smith',
  weddingDate: '2050-01-01',
}

test.describe('Starting Section - Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to admin dashboard
    await page.goto('/login')
    await page.fill('input[name="email"]', TEST_USER.email)
    await page.fill('input[name="password"]', TEST_USER.password)
    await page.click('button[type="submit"]')
    await page.waitForURL('/admin')
  })

  test('should navigate to Content tab and see Starting section', async ({ page }) => {
    // Click on first wedding config
    await page.click('text=View Dashboard')

    // Navigate to Content tab
    await page.click('text=Content')

    // Should see Starting section (not "Hero Content")
    await expect(page.locator('text=Starting section')).toBeVisible()
    await expect(page.locator('text=Hero Content')).not.toBeVisible()
  })

  test('should see all form sections in Starting section', async ({ page }) => {
    await page.click('text=View Dashboard')
    await page.click('text=Content')

    // Verify all sections are present
    await expect(page.locator('text=Display Names')).toBeVisible()
    await expect(page.locator('text=Parent Information')).toBeVisible()
    await expect(page.locator('text=Wedding Date')).toBeVisible()
    await expect(page.locator('text=Background Media')).toBeVisible()
  })
})

test.describe('Starting Section - Display Names', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', TEST_USER.email)
    await page.fill('input[name="password"]', TEST_USER.password)
    await page.click('button[type="submit"]')
    await page.waitForURL('/admin')
    await page.click('text=View Dashboard')
    await page.click('text=Content')
  })

  test('should show placeholder with full names from basic info', async ({ page }) => {
    const groomInput = page.locator('input[placeholder*="John Doe"]')
    const brideInput = page.locator('input[placeholder*="Jane Smith"]')

    await expect(groomInput).toBeVisible()
    await expect(brideInput).toBeVisible()
  })

  test('should update groom display name and persist', async ({ page }) => {
    const groomInput = page.locator('input[placeholder*="John Doe"]')

    await groomInput.fill('Jonathan Robert Doe')
    await page.click('button:has-text("Save")')

    // Wait for success message
    await expect(page.locator('text=saved successfully')).toBeVisible()

    // Reload page
    await page.reload()

    // Verify data persists
    await expect(groomInput).toHaveValue('Jonathan Robert Doe')
  })

  test('should update bride display name and persist', async ({ page }) => {
    const brideInput = page.locator('input[placeholder*="Jane Smith"]')

    await brideInput.fill('Janet Marie Smith')
    await page.click('button:has-text("Save")')

    await expect(page.locator('text=saved successfully')).toBeVisible()
    await page.reload()

    await expect(brideInput).toHaveValue('Janet Marie Smith')
  })

  test('should show validation error for name exceeding 100 characters', async ({ page }) => {
    const groomInput = page.locator('input[placeholder*="John Doe"]')

    await groomInput.fill('A'.repeat(101))
    await page.click('button:has-text("Save")')

    // Should show error message
    await expect(page.locator('text=/100.*character/i')).toBeVisible()
  })

  test('should update live preview when display name changes', async ({ page }) => {
    const groomInput = page.locator('input[placeholder*="John Doe"]')

    // Change groom display name
    await groomInput.fill('Jonathan Doe')

    // Live preview should update (assuming preview pane exists)
    const preview = page.locator('[data-testid="live-preview"]')
    await expect(preview.locator('text=Jonathan Doe')).toBeVisible()
  })
})

test.describe('Starting Section - Parent Information', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', TEST_USER.email)
    await page.fill('input[name="password"]', TEST_USER.password)
    await page.click('button[type="submit"]')
    await page.waitForURL('/admin')
    await page.click('text=View Dashboard')
    await page.click('text=Content')
  })

  test('should hide parent fields by default', async ({ page }) => {
    const groomFatherInput = page.locator('input[name*="groomFatherName"]')
    await expect(groomFatherInput).not.toBeVisible()
  })

  test('should show parent fields when toggle is enabled', async ({ page }) => {
    const toggleCheckbox = page.locator('input[type="checkbox"][name*="showParentInfo"]')

    await toggleCheckbox.check()

    // All 4 parent fields should be visible
    await expect(page.locator('input[name*="groomFatherName"]')).toBeVisible()
    await expect(page.locator('input[name*="groomMotherName"]')).toBeVisible()
    await expect(page.locator('input[name*="brideFatherName"]')).toBeVisible()
    await expect(page.locator('input[name*="brideMotherName"]')).toBeVisible()
  })

  test('should hide parent fields when toggle is disabled', async ({ page }) => {
    const toggleCheckbox = page.locator('input[type="checkbox"][name*="showParentInfo"]')

    // Enable first
    await toggleCheckbox.check()
    await expect(page.locator('input[name*="groomFatherName"]')).toBeVisible()

    // Disable
    await toggleCheckbox.uncheck()
    await expect(page.locator('input[name*="groomFatherName"]')).not.toBeVisible()
  })

  test('should save all parent information and persist', async ({ page }) => {
    const toggleCheckbox = page.locator('input[type="checkbox"][name*="showParentInfo"]')
    await toggleCheckbox.check()

    // Fill all parent names
    await page.fill('input[name*="groomFatherName"]', 'Robert Doe')
    await page.fill('input[name*="groomMotherName"]', 'Mary Doe')
    await page.fill('input[name*="brideFatherName"]', 'James Smith')
    await page.fill('input[name*="brideMotherName"]', 'Patricia Smith')

    await page.click('button:has-text("Save")')
    await expect(page.locator('text=saved successfully')).toBeVisible()

    // Reload page
    await page.reload()

    // Verify data persists
    await expect(page.locator('input[name*="groomFatherName"]')).toHaveValue('Robert Doe')
    await expect(page.locator('input[name*="groomMotherName"]')).toHaveValue('Mary Doe')
    await expect(page.locator('input[name*="brideFatherName"]')).toHaveValue('James Smith')
    await expect(page.locator('input[name*="brideMotherName"]')).toHaveValue('Patricia Smith')
  })

  test('should save partial parent info (only groom parents)', async ({ page }) => {
    const toggleCheckbox = page.locator('input[type="checkbox"][name*="showParentInfo"]')
    await toggleCheckbox.check()

    // Fill only groom parents
    await page.fill('input[name*="groomFatherName"]', 'Robert Doe')
    await page.fill('input[name*="groomMotherName"]', 'Mary Doe')

    await page.click('button:has-text("Save")')
    await expect(page.locator('text=saved successfully')).toBeVisible()

    await page.reload()

    // Verify only groom parents are saved
    await expect(page.locator('input[name*="groomFatherName"]')).toHaveValue('Robert Doe')
    await expect(page.locator('input[name*="groomMotherName"]')).toHaveValue('Mary Doe')
    await expect(page.locator('input[name*="brideFatherName"]')).toHaveValue('')
    await expect(page.locator('input[name*="brideMotherName"]')).toHaveValue('')
  })

  test('should update live preview when parent info is shown', async ({ page }) => {
    const toggleCheckbox = page.locator('input[type="checkbox"][name*="showParentInfo"]')
    await toggleCheckbox.check()

    await page.fill('input[name*="groomFatherName"]', 'Robert Doe')

    // Live preview should show parent info
    const preview = page.locator('[data-testid="live-preview"]')
    await expect(preview.locator('text=Robert Doe')).toBeVisible()
  })

  test('should hide parent info in live preview when toggled off', async ({ page }) => {
    const toggleCheckbox = page.locator('input[type="checkbox"][name*="showParentInfo"]')

    // Enable and fill
    await toggleCheckbox.check()
    await page.fill('input[name*="groomFatherName"]', 'Robert Doe')

    // Verify in preview
    const preview = page.locator('[data-testid="live-preview"]')
    await expect(preview.locator('text=Robert Doe')).toBeVisible()

    // Disable
    await toggleCheckbox.uncheck()

    // Preview should not show parent info
    await expect(preview.locator('text=Robert Doe')).not.toBeVisible()
  })
})

test.describe('Starting Section - Wedding Date Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', TEST_USER.email)
    await page.fill('input[name="password"]', TEST_USER.password)
    await page.click('button[type="submit"]')
    await page.waitForURL('/admin')
    await page.click('text=View Dashboard')
    await page.click('text=Content')
  })

  test('should show wedding date in live preview by default', async ({ page }) => {
    const preview = page.locator('[data-testid="live-preview"]')

    // Should show wedding date (or placeholder if undefined)
    await expect(preview.locator('text=/1 January 2050|January.*2050/i')).toBeVisible()
  })

  test('should hide wedding date when toggle is disabled', async ({ page }) => {
    const toggleCheckbox = page.locator('input[type="checkbox"][name*="showWeddingDate"]')

    // Initially checked (default true)
    await expect(toggleCheckbox).toBeChecked()

    // Uncheck
    await toggleCheckbox.uncheck()

    // Wedding date should not be in preview
    const preview = page.locator('[data-testid="live-preview"]')
    await expect(preview.locator('text=/1 January 2050|January.*2050/i')).not.toBeVisible()
  })

  test('should persist wedding date toggle state', async ({ page }) => {
    const toggleCheckbox = page.locator('input[type="checkbox"][name*="showWeddingDate"]')

    await toggleCheckbox.uncheck()
    await page.click('button:has-text("Save")')
    await expect(page.locator('text=saved successfully')).toBeVisible()

    await page.reload()

    // Toggle should remain unchecked
    await expect(toggleCheckbox).not.toBeChecked()
  })

  test('should show placeholder date when wedding date is undefined', async ({ page }) => {
    // Assuming wedding date can be undefined in some configs
    // This test would need a config with undefined weddingDate

    const toggleCheckbox = page.locator('input[type="checkbox"][name*="showWeddingDate"]')
    await expect(toggleCheckbox).toBeChecked()

    const preview = page.locator('[data-testid="live-preview"]')

    // Should show placeholder "1 January 2050"
    await expect(preview.locator('text=1 January 2050')).toBeVisible()
  })
})

test.describe('Starting Section - Complete Flow', () => {
  test('should configure complete starting section with all fields', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', TEST_USER.email)
    await page.fill('input[name="password"]', TEST_USER.password)
    await page.click('button[type="submit"]')
    await page.waitForURL('/admin')
    await page.click('text=View Dashboard')
    await page.click('text=Content')

    // Update display names
    await page.fill('input[placeholder*="John Doe"]', 'Jonathan Robert Doe')
    await page.fill('input[placeholder*="Jane Smith"]', 'Janet Marie Smith')

    // Enable and fill parent info
    const parentToggle = page.locator('input[type="checkbox"][name*="showParentInfo"]')
    await parentToggle.check()
    await page.fill('input[name*="groomFatherName"]', 'Robert Doe')
    await page.fill('input[name*="groomMotherName"]', 'Mary Doe')
    await page.fill('input[name*="brideFatherName"]', 'James Smith')
    await page.fill('input[name*="brideMotherName"]', 'Patricia Smith')

    // Keep wedding date enabled (default)
    const dateToggle = page.locator('input[type="checkbox"][name*="showWeddingDate"]')
    await expect(dateToggle).toBeChecked()

    // Save
    await page.click('button:has-text("Save")')
    await expect(page.locator('text=saved successfully')).toBeVisible()

    // Verify live preview shows all data
    const preview = page.locator('[data-testid="live-preview"]')
    await expect(preview.locator('text=Jonathan Robert Doe')).toBeVisible()
    await expect(preview.locator('text=Janet Marie Smith')).toBeVisible()
    await expect(preview.locator('text=Robert Doe')).toBeVisible()
    await expect(preview.locator('text=Mary Doe')).toBeVisible()
    await expect(preview.locator('text=James Smith')).toBeVisible()
    await expect(preview.locator('text=Patricia Smith')).toBeVisible()
    await expect(preview.locator('text=/1 January 2050|January.*2050/i')).toBeVisible()

    // Reload and verify persistence
    await page.reload()

    await expect(page.locator('input[placeholder*="John Doe"]')).toHaveValue('Jonathan Robert Doe')
    await expect(page.locator('input[placeholder*="Jane Smith"]')).toHaveValue('Janet Marie Smith')
    await expect(page.locator('input[name*="groomFatherName"]')).toHaveValue('Robert Doe')
    await expect(page.locator('input[name*="groomMotherName"]')).toHaveValue('Mary Doe')
    await expect(page.locator('input[name*="brideFatherName"]')).toHaveValue('James Smith')
    await expect(page.locator('input[name*="brideMotherName"]')).toHaveValue('Patricia Smith')
  })

  test('should clear all data when fields are emptied', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', TEST_USER.email)
    await page.fill('input[name="password"]', TEST_USER.password)
    await page.click('button[type="submit"]')
    await page.waitForURL('/admin')
    await page.click('text=View Dashboard')
    await page.click('text=Content')

    // First, fill some data
    await page.fill('input[placeholder*="John Doe"]', 'Jonathan Doe')
    await page.click('button:has-text("Save")')
    await expect(page.locator('text=saved successfully')).toBeVisible()

    // Clear the data
    await page.fill('input[placeholder*="John Doe"]', '')
    await page.click('button:has-text("Save")')
    await expect(page.locator('text=saved successfully')).toBeVisible()

    // Reload
    await page.reload()

    // Should be empty (showing placeholder)
    await expect(page.locator('input[placeholder*="John Doe"]')).toHaveValue('')
  })
})
