/**
 * T071: E2E Tests for Subdomain Routing
 *
 * Tests multi-tenant subdomain routing and tenant isolation.
 */

import { test, expect } from '@playwright/test';

test.describe('Subdomain Routing', () => {
  test('should route to correct wedding by subdomain', async ({ page }) => {
    // Test with mock subdomain (requires local DNS or hosts file setup)
    // Example: karelabrina.localhost:3000

    // Wedding 1: karelabrina
    await page.goto('http://karelabrina.localhost:3000');
    await expect(page.locator('h1')).toContainText('Karel');
    await expect(page.locator('h1')).toContainText('Sabrina');

    // Wedding 2: different subdomain
    await page.goto('http://johnandjayne.localhost:3000');
    await expect(page.locator('h1')).toContainText('John');
    await expect(page.locator('h1')).toContainText('Jayne');
  });

  test('should show 404 for non-existent subdomain', async ({ page }) => {
    const response = await page.goto('http://nonexistent.localhost:3000');
    expect(response?.status()).toBe(404);
    await expect(page.locator('text=Wedding Not Found')).toBeVisible();
  });

  test('should isolate tenant data', async ({ page }) => {
    // Navigate to wedding 1
    await page.goto('http://wedding1.localhost:3000');
    const wedding1Content = await page.textContent('body');

    // Navigate to wedding 2
    await page.goto('http://wedding2.localhost:3000');
    const wedding2Content = await page.textContent('body');

    // Content should be different (tenant isolation)
    expect(wedding1Content).not.toBe(wedding2Content);
  });
});

// NOTE: Subdomain testing requires DNS configuration
// For local testing:
// 1. Add entries to /etc/hosts:
//    127.0.0.1 karelabrina.localhost
//    127.0.0.1 johnandjayne.localhost
// 2. Run: yarn dev
// 3. Run: yarn test:e2e
