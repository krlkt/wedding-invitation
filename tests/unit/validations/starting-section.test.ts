/**
 * Unit Tests: Starting Section Validation Schemas
 *
 * Tests for Zod validation schemas used in starting section content management.
 * These tests MUST FAIL initially (TDD approach) until schemas are implemented.
 *
 * @see app/lib/validations/starting-section.ts (to be implemented)
 */

import { describe, test, expect } from '@jest/globals'
import {
  startingSectionContentSchema,
  startingSectionMediaSchema,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_VIDEO_TYPES,
} from '@/app/lib/validations/starting-section'

describe('startingSectionContentSchema', () => {
  test('should validate content update with all fields', () => {
    const validData = {
      groomDisplayName: 'John Doe',
      brideDisplayName: 'Jane Smith',
      showParentInfo: true,
      groomFatherName: 'Robert Doe',
      groomMotherName: 'Mary Doe',
      brideFatherName: 'James Smith',
      brideMotherName: 'Patricia Smith',
      showWeddingDate: true,
    }

    const result = startingSectionContentSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  test('should validate partial parent info (groom parents only)', () => {
    const partialData = {
      showParentInfo: true,
      groomFatherName: 'Robert Doe',
      groomMotherName: 'Mary Doe',
      brideFatherName: null,
      brideMotherName: null,
    }

    const result = startingSectionContentSchema.safeParse(partialData)
    expect(result.success).toBe(true)
  })

  test('should allow null values for optional fields', () => {
    const dataWithNulls = {
      groomDisplayName: null,
      brideDisplayName: null,
      showParentInfo: false,
      groomFatherName: null,
      groomMotherName: null,
      brideFatherName: null,
      brideMotherName: null,
    }

    const result = startingSectionContentSchema.safeParse(dataWithNulls)
    expect(result.success).toBe(true)
  })

  test('should fail when groomDisplayName exceeds 100 characters', () => {
    const invalidData = {
      groomDisplayName: 'A'.repeat(101), // 101 characters
    }

    const result = startingSectionContentSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('100')
    }
  })

  test('should fail when brideDisplayName exceeds 100 characters', () => {
    const invalidData = {
      brideDisplayName: 'B'.repeat(101), // 101 characters
    }

    const result = startingSectionContentSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  test('should fail when showParentInfo is not a boolean', () => {
    const invalidData = {
      showParentInfo: 'true', // string instead of boolean
    }

    const result = startingSectionContentSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].code).toBe('invalid_type')
    }
  })

  test('should validate with only showWeddingDate field', () => {
    const minimalData = {
      showWeddingDate: false,
    }

    const result = startingSectionContentSchema.safeParse(minimalData)
    expect(result.success).toBe(true)
  })

  test('should allow empty object (all fields optional)', () => {
    const emptyData = {}

    const result = startingSectionContentSchema.safeParse(emptyData)
    expect(result.success).toBe(true)
  })
})

describe('startingSectionMediaSchema', () => {
  test('should validate valid image file (5MB JPEG)', () => {
    const mockFile = new File(['a'.repeat(5 * 1024 * 1024)], 'test.jpg', {
      type: 'image/jpeg',
    })

    const validData = {
      file: mockFile,
      replaceExisting: false,
    }

    const result = startingSectionMediaSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  test('should validate valid video file (40MB MP4)', () => {
    const mockFile = new File(['a'.repeat(40 * 1024 * 1024)], 'test.mp4', {
      type: 'video/mp4',
    })

    const validData = {
      file: mockFile,
      replaceExisting: true,
    }

    const result = startingSectionMediaSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  test('should fail when image exceeds 10MB', () => {
    const mockFile = new File(['a'.repeat(15 * 1024 * 1024)], 'large.jpg', {
      type: 'image/jpeg',
    })

    console.log('File size:', mockFile.size, 'Type:', mockFile.type)

    const result = startingSectionMediaSchema.safeParse({ file: mockFile })
    console.log(
      'Result:',
      result.success,
      'Errors:',
      result.success ? null : result.error.issues.map((i) => i.message)
    )

    expect(result.success).toBe(false)
    if (!result.success) {
      // Find the error message about file size (might not be at index 0)
      const sizeError = result.error.issues.find((issue) => issue.message.includes('MB'))
      expect(sizeError).toBeDefined()
      expect(sizeError?.message).toMatch(/10.*MB/i)
    }
  })

  test('should fail when video exceeds 50MB', () => {
    const mockFile = new File(['a'.repeat(60 * 1024 * 1024)], 'large.mp4', {
      type: 'video/mp4',
    })

    const result = startingSectionMediaSchema.safeParse({ file: mockFile })
    expect(result.success).toBe(false)
    if (!result.success) {
      // Find the error message about file size (might not be at index 0)
      const sizeError = result.error.issues.find((issue) => issue.message.includes('MB'))
      expect(sizeError).toBeDefined()
      expect(sizeError?.message).toMatch(/50.*MB/i)
    }
  })

  test('should fail for unsupported file type (text/plain)', () => {
    const mockFile = new File(['text content'], 'test.txt', {
      type: 'text/plain',
    })

    const result = startingSectionMediaSchema.safeParse({ file: mockFile })
    expect(result.success).toBe(false)
  })

  test('should validate PNG image', () => {
    const mockFile = new File(['a'.repeat(5 * 1024 * 1024)], 'test.png', {
      type: 'image/png',
    })

    const result = startingSectionMediaSchema.safeParse({ file: mockFile })
    expect(result.success).toBe(true)
  })

  test('should validate WebP image', () => {
    const mockFile = new File(['a'.repeat(5 * 1024 * 1024)], 'test.webp', {
      type: 'image/webp',
    })

    const result = startingSectionMediaSchema.safeParse({ file: mockFile })
    expect(result.success).toBe(true)
  })

  test('should validate WebM video', () => {
    const mockFile = new File(['a'.repeat(30 * 1024 * 1024)], 'test.webm', {
      type: 'video/webm',
    })

    const result = startingSectionMediaSchema.safeParse({ file: mockFile })
    expect(result.success).toBe(true)
  })
})

describe('Validation constants', () => {
  test('MAX_IMAGE_SIZE should be 10MB', () => {
    expect(MAX_IMAGE_SIZE).toBe(10 * 1024 * 1024)
  })

  test('MAX_VIDEO_SIZE should be 50MB', () => {
    expect(MAX_VIDEO_SIZE).toBe(50 * 1024 * 1024)
  })

  test('ACCEPTED_IMAGE_TYPES should include common formats', () => {
    expect(ACCEPTED_IMAGE_TYPES).toContain('image/jpeg')
    expect(ACCEPTED_IMAGE_TYPES).toContain('image/png')
    expect(ACCEPTED_IMAGE_TYPES).toContain('image/webp')
    expect(ACCEPTED_IMAGE_TYPES).toContain('image/gif')
  })

  test('ACCEPTED_VIDEO_TYPES should include MP4 and WebM', () => {
    expect(ACCEPTED_VIDEO_TYPES).toContain('video/mp4')
    expect(ACCEPTED_VIDEO_TYPES).toContain('video/webm')
  })
})
