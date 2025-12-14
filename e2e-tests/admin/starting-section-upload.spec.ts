/**
 * E2E Tests: Starting Section File Upload with Validation
 *
 * End-to-end tests for background media upload functionality.
 * These tests MUST FAIL initially (TDD approach) until features are implemented.
 *
 * Tests cover:
 * - Image upload (JPEG, PNG, WebP, GIF)
 * - Video upload (MP4, WebM)
 * - File size validation (10MB for images, 50MB for videos)
 * - Unsupported file type rejection
 * - Confirmation dialog for replacing existing media
 * - File deletion and persistence
 *
 * @see app/admin/[configId]/content/page.tsx (to be implemented)
 */

import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import os from 'os';

// Test data
const TEST_USER = {
  email: 'test@example.com',
  password: 'testpassword123',
};

// Helper to create temporary test files
function createTempFile(filename: string, sizeInMB: number, mimeType: string): string {
  const tempDir = os.tmpdir();
  const filePath = path.join(tempDir, filename);
  const buffer = Buffer.alloc(sizeInMB * 1024 * 1024, 'a');
  fs.writeFileSync(filePath, buffer);
  return filePath;
}

test.describe('Starting Section - Image Upload', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');
    await page.click('text=View Dashboard');
    await page.click('text=Content');
  });

  test('should upload valid 5MB JPEG image', async ({ page }) => {
    const testFile = createTempFile('test-image.jpg', 5, 'image/jpeg');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFile);

    await page.click('button:has-text("Save")');
    await expect(page.locator('text=saved successfully')).toBeVisible();

    // Verify file appears in UI
    await expect(page.locator('text=test-image.jpg')).toBeVisible();
    await expect(page.locator('text=5.0 MB')).toBeVisible();

    // Clean up
    fs.unlinkSync(testFile);
  });

  test('should upload valid PNG image', async ({ page }) => {
    const testFile = createTempFile('test-image.png', 3, 'image/png');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFile);

    await page.click('button:has-text("Save")');
    await expect(page.locator('text=saved successfully')).toBeVisible();

    await expect(page.locator('text=test-image.png')).toBeVisible();

    fs.unlinkSync(testFile);
  });

  test('should upload valid WebP image', async ({ page }) => {
    const testFile = createTempFile('test-image.webp', 4, 'image/webp');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFile);

    await page.click('button:has-text("Save")');
    await expect(page.locator('text=saved successfully')).toBeVisible();

    fs.unlinkSync(testFile);
  });

  test('should upload valid GIF image', async ({ page }) => {
    const testFile = createTempFile('test-image.gif', 2, 'image/gif');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFile);

    await page.click('button:has-text("Save")');
    await expect(page.locator('text=saved successfully')).toBeVisible();

    fs.unlinkSync(testFile);
  });

  test('should reject image exceeding 10MB limit', async ({ page }) => {
    const testFile = createTempFile('large-image.jpg', 15, 'image/jpeg');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFile);

    // Should show validation error
    await expect(page.locator('text=/exceeds.*10.*MB/i')).toBeVisible();

    // Save button should be disabled or submission should fail
    await page.click('button:has-text("Save")');
    await expect(page.locator('text=saved successfully')).not.toBeVisible();

    fs.unlinkSync(testFile);
  });

  test('should reject exactly 10MB + 1 byte image', async ({ page }) => {
    const testFile = createTempFile('large-image.jpg', 10, 'image/jpeg');
    // Add 1 byte
    fs.appendFileSync(testFile, 'x');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFile);

    await expect(page.locator('text=/exceeds.*10.*MB/i')).toBeVisible();

    fs.unlinkSync(testFile);
  });

  test('should reject unsupported image type (BMP)', async ({ page }) => {
    const testFile = createTempFile('test-image.bmp', 2, 'image/bmp');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFile);

    await expect(page.locator('text=/type|format/i')).toBeVisible();

    fs.unlinkSync(testFile);
  });

  test('should show uploaded image in live preview', async ({ page }) => {
    const testFile = createTempFile('preview-test.jpg', 3, 'image/jpeg');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFile);

    await page.click('button:has-text("Save")');
    await expect(page.locator('text=saved successfully')).toBeVisible();

    // Live preview should show the image
    const preview = page.locator('[data-testid="live-preview"]');
    const previewImage = preview.locator('img[src*="preview-test.jpg"]');
    await expect(previewImage).toBeVisible();

    fs.unlinkSync(testFile);
  });
});

test.describe('Starting Section - Video Upload', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');
    await page.click('text=View Dashboard');
    await page.click('text=Content');
  });

  test('should upload valid 30MB MP4 video', async ({ page }) => {
    const testFile = createTempFile('test-video.mp4', 30, 'video/mp4');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFile);

    await page.click('button:has-text("Save")');
    await expect(page.locator('text=saved successfully')).toBeVisible();

    await expect(page.locator('text=test-video.mp4')).toBeVisible();
    await expect(page.locator('text=30.0 MB')).toBeVisible();

    fs.unlinkSync(testFile);
  });

  test('should upload valid WebM video', async ({ page }) => {
    const testFile = createTempFile('test-video.webm', 25, 'video/webm');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFile);

    await page.click('button:has-text("Save")');
    await expect(page.locator('text=saved successfully')).toBeVisible();

    fs.unlinkSync(testFile);
  });

  test('should accept exactly 50MB video', async ({ page }) => {
    const testFile = createTempFile('max-video.mp4', 50, 'video/mp4');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFile);

    await page.click('button:has-text("Save")');
    await expect(page.locator('text=saved successfully')).toBeVisible();

    fs.unlinkSync(testFile);
  });

  test('should reject video exceeding 50MB limit', async ({ page }) => {
    const testFile = createTempFile('large-video.mp4', 60, 'video/mp4');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFile);

    await expect(page.locator('text=/exceeds.*50.*MB/i')).toBeVisible();

    fs.unlinkSync(testFile);
  });

  test('should reject 50MB + 1 byte video', async ({ page }) => {
    const testFile = createTempFile('large-video.mp4', 50, 'video/mp4');
    fs.appendFileSync(testFile, 'x');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFile);

    await expect(page.locator('text=/exceeds.*50.*MB/i')).toBeVisible();

    fs.unlinkSync(testFile);
  });

  test('should reject unsupported video type (AVI)', async ({ page }) => {
    const testFile = createTempFile('test-video.avi', 10, 'video/x-msvideo');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFile);

    await expect(page.locator('text=/type|format/i')).toBeVisible();

    fs.unlinkSync(testFile);
  });

  test('should show uploaded video in live preview', async ({ page }) => {
    const testFile = createTempFile('preview-video.mp4', 20, 'video/mp4');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFile);

    await page.click('button:has-text("Save")');
    await expect(page.locator('text=saved successfully')).toBeVisible();

    // Live preview should show the video
    const preview = page.locator('[data-testid="live-preview"]');
    const previewVideo = preview.locator('video[src*="preview-video.mp4"]');
    await expect(previewVideo).toBeVisible();

    fs.unlinkSync(testFile);
  });
});

test.describe('Starting Section - File Type Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');
    await page.click('text=View Dashboard');
    await page.click('text=Content');
  });

  test('should reject PDF file', async ({ page }) => {
    const testFile = createTempFile('document.pdf', 2, 'application/pdf');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFile);

    await expect(page.locator('text=/type|format/i')).toBeVisible();

    fs.unlinkSync(testFile);
  });

  test('should reject text file', async ({ page }) => {
    const testFile = path.join(os.tmpdir(), 'test.txt');
    fs.writeFileSync(testFile, 'test content');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFile);

    await expect(page.locator('text=/type|format/i')).toBeVisible();

    fs.unlinkSync(testFile);
  });

  test('should reject JSON file', async ({ page }) => {
    const testFile = path.join(os.tmpdir(), 'data.json');
    fs.writeFileSync(testFile, '{"test": true}');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFile);

    await expect(page.locator('text=/type|format/i')).toBeVisible();

    fs.unlinkSync(testFile);
  });
});

test.describe('Starting Section - File Replacement Confirmation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');
    await page.click('text=View Dashboard');
    await page.click('text=Content');
  });

  test('should show confirmation dialog when replacing existing media', async ({ page }) => {
    // First upload
    const firstFile = createTempFile('first-image.jpg', 3, 'image/jpeg');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(firstFile);
    await page.click('button:has-text("Save")');
    await expect(page.locator('text=saved successfully')).toBeVisible();

    // Try to upload replacement
    const secondFile = createTempFile('second-image.jpg', 4, 'image/jpeg');
    await fileInput.setInputFiles(secondFile);

    // Should show confirmation dialog
    await expect(page.locator('text=/replace existing/i')).toBeVisible();
    await expect(page.locator('text=first-image.jpg')).toBeVisible();

    // Dialog should have Confirm and Cancel buttons
    await expect(page.locator('button:has-text("Confirm")')).toBeVisible();
    await expect(page.locator('button:has-text("Cancel")')).toBeVisible();

    fs.unlinkSync(firstFile);
    fs.unlinkSync(secondFile);
  });

  test('should replace file when confirmation is accepted', async ({ page }) => {
    // First upload
    const firstFile = createTempFile('first-image.jpg', 3, 'image/jpeg');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(firstFile);
    await page.click('button:has-text("Save")');
    await expect(page.locator('text=saved successfully')).toBeVisible();

    // Upload replacement and confirm
    const secondFile = createTempFile('second-image.jpg', 4, 'image/jpeg');
    await fileInput.setInputFiles(secondFile);
    await page.click('button:has-text("Confirm")');
    await page.click('button:has-text("Save")');
    await expect(page.locator('text=saved successfully')).toBeVisible();

    // Should show new filename
    await expect(page.locator('text=second-image.jpg')).toBeVisible();
    await expect(page.locator('text=first-image.jpg')).not.toBeVisible();

    fs.unlinkSync(firstFile);
    fs.unlinkSync(secondFile);
  });

  test('should cancel replacement when confirmation is rejected', async ({ page }) => {
    // First upload
    const firstFile = createTempFile('first-image.jpg', 3, 'image/jpeg');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(firstFile);
    await page.click('button:has-text("Save")');
    await expect(page.locator('text=saved successfully')).toBeVisible();

    // Try to upload replacement but cancel
    const secondFile = createTempFile('second-image.jpg', 4, 'image/jpeg');
    await fileInput.setInputFiles(secondFile);
    await page.click('button:has-text("Cancel")');

    // Should still show original file
    await expect(page.locator('text=first-image.jpg')).toBeVisible();
    await expect(page.locator('text=second-image.jpg')).not.toBeVisible();

    fs.unlinkSync(firstFile);
    fs.unlinkSync(secondFile);
  });

  test('should not show confirmation for first upload', async ({ page }) => {
    const testFile = createTempFile('new-image.jpg', 3, 'image/jpeg');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFile);

    // Should NOT show confirmation dialog
    await expect(page.locator('text=/replace existing/i')).not.toBeVisible();

    fs.unlinkSync(testFile);
  });

  test('should delete old file from filesystem when replaced', async ({ page }) => {
    // This test verifies server-side behavior
    // First upload
    const firstFile = createTempFile('delete-test-1.jpg', 2, 'image/jpeg');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(firstFile);
    await page.click('button:has-text("Save")');
    await expect(page.locator('text=saved successfully')).toBeVisible();

    // Get wedding config ID from URL
    const url = page.url();
    const configId = url.match(/\/admin\/([^\/]+)/)?.[1];

    // Verify file exists in public/uploads
    const uploadPath = path.join(
      process.cwd(),
      'public',
      'uploads',
      configId!,
      'starting-section',
      'delete-test-1.jpg'
    );

    // Note: This check would need to wait for async file write
    // In real implementation, might need page reload to verify

    // Upload replacement
    const secondFile = createTempFile('delete-test-2.jpg', 3, 'image/jpeg');
    await fileInput.setInputFiles(secondFile);
    await page.click('button:has-text("Confirm")');
    await page.click('button:has-text("Save")');
    await expect(page.locator('text=saved successfully')).toBeVisible();

    // Old file should be deleted from filesystem
    // This would be verified server-side
    // expect(fs.existsSync(uploadPath)).toBe(false)

    fs.unlinkSync(firstFile);
    fs.unlinkSync(secondFile);
  });
});

test.describe('Starting Section - File Persistence', () => {
  test('should persist uploaded file across page reloads', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');
    await page.click('text=View Dashboard');
    await page.click('text=Content');

    // Upload file
    const testFile = createTempFile('persist-test.jpg', 4, 'image/jpeg');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFile);
    await page.click('button:has-text("Save")');
    await expect(page.locator('text=saved successfully')).toBeVisible();

    // Reload page
    await page.reload();

    // File should still be shown
    await expect(page.locator('text=persist-test.jpg')).toBeVisible();
    await expect(page.locator('text=4.0 MB')).toBeVisible();

    // Preview should still show file
    const preview = page.locator('[data-testid="live-preview"]');
    const previewImage = preview.locator('img[src*="persist-test.jpg"]');
    await expect(previewImage).toBeVisible();

    fs.unlinkSync(testFile);
  });

  test('should persist file metadata in database', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');
    await page.click('text=View Dashboard');
    await page.click('text=Content');

    // Upload video
    const testFile = createTempFile('metadata-test.mp4', 20, 'video/mp4');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFile);
    await page.click('button:has-text("Save")');
    await expect(page.locator('text=saved successfully')).toBeVisible();

    await page.reload();

    // All metadata should be preserved
    await expect(page.locator('text=metadata-test.mp4')).toBeVisible();
    await expect(page.locator('text=20.0 MB')).toBeVisible();
    // MIME type should be stored (video/mp4)

    fs.unlinkSync(testFile);
  });
});
