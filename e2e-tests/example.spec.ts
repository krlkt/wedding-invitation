import { test, expect } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
  await page.goto('/');

  // Wait for the page to load
  await page.waitForLoadState('networkidle');

  // Check that we can see the page content
  expect(page.url()).toBe('http://localhost:3000/');

  // Basic check that the page is not showing an error
  const body = await page.textContent('body');
  expect(body).not.toContain('Application error');
  expect(body).not.toContain('500');
  expect(body).not.toContain('404');
});

test('wedding invitation displays for valid location', async ({ page }) => {
  // Test with a known location from your actual data
  await page.goto('/bali');

  // Wait for content to load
  await page.waitForLoadState('networkidle');

  // Should show wedding content, not an error page
  const title = await page.title();
  expect(title).toContain('Karel'); // Should contain groom's name
});
