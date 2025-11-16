/**
 * Integration tests for Groom and Bride Section APIs
 * @jest-environment node
 *
 * Tests:
 * - GET /api/wedding/groom-section
 * - PUT /api/wedding/groom-section
 * - GET /api/wedding/bride-section
 * - PUT /api/wedding/bride-section
 * - Instagram link validation
 * - showInstagramLink toggle functionality
 *
 * SKIPPED: These tests require proper authentication setup with cookie handling
 * TODO: Implement cookie extraction and management for Node.js fetch environment
 * - Extract set-cookie header from register/login response
 * - Include cookie in subsequent requests
 * - Or use a cookie jar library like tough-cookie
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import { db } from '@/app/lib/database'
import { userAccounts } from '@/app/db/schema/users'
import { eq } from 'drizzle-orm'

// Helper to create authenticated fetch options
const withAuth = (cookie: string, options: RequestInit = {}): RequestInit => ({
  ...options,
  headers: {
    ...options.headers,
    Cookie: cookie,
  },
})

describe('Groom Section API', () => {
  const baseUrl = process.env.TEST_BASE_URL ?? 'http://localhost:3000'
  let sessionCookie: string = ''

  const testUser = {
    email: `groom-test-${Date.now()}@example.com`,
    password: 'testPassword123',
    groomName: 'Test Groom',
    brideName: 'Test Bride',
  }

  beforeAll(async () => {
    // Register test user
    await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    })
    // Login to establish session and extract cookie
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    })

    // Extract session cookie from response
    const setCookie = loginResponse.headers.get('set-cookie')
    if (setCookie) {
      sessionCookie = setCookie.split(';')[0]
    }
  })

  afterAll(async () => {
    // Clean up: Delete test user (CASCADE will delete wedding_config and all related content)
    await db.delete(userAccounts).where(eq(userAccounts.email, testUser.email))
  })

  describe('GET /api/wedding/groom-section', () => {
    it('should return groom section content', async () => {
      const response = await fetch(`${baseUrl}/api/wedding/groom-section`, withAuth(sessionCookie))

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data).toBeDefined()
    })

    it('should include showInstagramLink field', async () => {
      // First create some data to ensure content exists
      await fetch(`${baseUrl}/api/wedding/groom-section`, withAuth(sessionCookie, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groomDisplayName: 'Test Groom',
          showInstagramLink: false,
        }),
      }))

      // Then verify GET includes the field
      const response = await fetch(`${baseUrl}/api/wedding/groom-section`, withAuth(sessionCookie))

      const data = await response.json()
      expect(data.data).toHaveProperty('showInstagramLink')
      expect(typeof data.data.showInstagramLink).toBe('boolean')
    })
  })

  describe('PUT /api/wedding/groom-section', () => {
    it('should update groom display name', async () => {
      const response = await fetch(`${baseUrl}/api/wedding/groom-section`, withAuth(sessionCookie, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groomDisplayName: 'John Doe',
        }),
      }))

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data.groomDisplayName).toBe('John Doe')
    })

    it('should update showInstagramLink toggle', async () => {
      const response = await fetch(`${baseUrl}/api/wedding/groom-section`, withAuth(sessionCookie, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          showInstagramLink: true,
        }),
      }))

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data.showInstagramLink).toBe(true)
    })

    it('should update Instagram link when showInstagramLink is true', async () => {
      const response = await fetch(`${baseUrl}/api/wedding/groom-section`, withAuth(sessionCookie, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          showInstagramLink: true,
          groomInstagramLink: 'https://www.instagram.com/johndoe',
        }),
      }))

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data.showInstagramLink).toBe(true)
      expect(data.data.groomInstagramLink).toBe('https://www.instagram.com/johndoe')
    })

    it('should accept null for groomInstagramLink when showInstagramLink is false', async () => {
      const response = await fetch(`${baseUrl}/api/wedding/groom-section`, withAuth(sessionCookie, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          showInstagramLink: false,
          groomInstagramLink: null,
        }),
      }))

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data.showInstagramLink).toBe(false)
    })

    it('should update parent information fields', async () => {
      const response = await fetch(`${baseUrl}/api/wedding/groom-section`, withAuth(sessionCookie, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          showParentInfo: true,
          fatherName: 'John Doe Sr.',
          motherName: 'Jane Doe',
        }),
      }))

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data.showParentInfo).toBe(true)
      expect(data.data.fatherName).toBe('John Doe Sr.')
      expect(data.data.motherName).toBe('Jane Doe')
    })
  })

  describe('Instagram Link Validation - Groom', () => {
    it('should reject invalid URL format for groomInstagramLink', async () => {
      const response = await fetch(`${baseUrl}/api/wedding/groom-section`, withAuth(sessionCookie, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          showInstagramLink: true,
          groomInstagramLink: 'not-a-valid-url',
        }),
      }))

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.success).toBe(false)
      expect(data.error).toBeDefined()
    })

    it('should reject non-Instagram URLs', async () => {
      const response = await fetch(`${baseUrl}/api/wedding/groom-section`, withAuth(sessionCookie, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          showInstagramLink: true,
          groomInstagramLink: 'https://twitter.com/someuser',
        }),
      }))

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.success).toBe(false)
    })

    it('should accept valid Instagram URL with www', async () => {
      const response = await fetch(`${baseUrl}/api/wedding/groom-section`, withAuth(sessionCookie, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          showInstagramLink: true,
          groomInstagramLink: 'https://www.instagram.com/test_user',
        }),
      }))

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
    })

    it('should accept valid Instagram URL without www', async () => {
      const response = await fetch(`${baseUrl}/api/wedding/groom-section`, withAuth(sessionCookie, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          showInstagramLink: true,
          groomInstagramLink: 'https://instagram.com/test_user',
        }),
      }))

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
    })

    it('should accept null value when showInstagramLink is false', async () => {
      const response = await fetch(`${baseUrl}/api/wedding/groom-section`, withAuth(sessionCookie, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          showInstagramLink: false,
          groomInstagramLink: null,
        }),
      }))

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
    })
  })
})

describe('Bride Section API', () => {
  const baseUrl = process.env.TEST_BASE_URL ?? 'http://localhost:3000'
  let sessionCookie: string = ''

  const testUser = {
    email: `bride-test-${Date.now()}@example.com`,
    password: 'testPassword123',
    groomName: 'Test Groom',
    brideName: 'Test Bride',
  }

  beforeAll(async () => {
    // Register test user
    await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    })
    // Login to establish session and extract cookie
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    })

    // Extract session cookie from response
    const setCookie = loginResponse.headers.get('set-cookie')
    if (setCookie) {
      sessionCookie = setCookie.split(';')[0]
    }
  })

  afterAll(async () => {
    // Clean up: Delete test user (CASCADE will delete wedding_config and all related content)
    await db.delete(userAccounts).where(eq(userAccounts.email, testUser.email))
  })

  describe('GET /api/wedding/bride-section', () => {
    it('should return bride section content', async () => {
      const response = await fetch(`${baseUrl}/api/wedding/bride-section`, withAuth(sessionCookie))

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data).toBeDefined()
    })

    it('should include showInstagramLink field', async () => {
      // First create some data to ensure content exists
      await fetch(`${baseUrl}/api/wedding/bride-section`, withAuth(sessionCookie, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brideDisplayName: 'Test Bride',
          showInstagramLink: false,
        }),
      }))

      // Then verify GET includes the field
      const response = await fetch(`${baseUrl}/api/wedding/bride-section`, withAuth(sessionCookie))

      const data = await response.json()
      expect(data.data).toHaveProperty('showInstagramLink')
      expect(typeof data.data.showInstagramLink).toBe('boolean')
    })
  })

  describe('PUT /api/wedding/bride-section', () => {
    it('should update bride display name', async () => {
      const response = await fetch(`${baseUrl}/api/wedding/bride-section`, withAuth(sessionCookie, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brideDisplayName: 'Jane Smith',
        }),
      }))

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data.brideDisplayName).toBe('Jane Smith')
    })

    it('should update showInstagramLink toggle', async () => {
      const response = await fetch(`${baseUrl}/api/wedding/bride-section`, withAuth(sessionCookie, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          showInstagramLink: true,
        }),
      }))

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data.showInstagramLink).toBe(true)
    })

    it('should update Instagram link when showInstagramLink is true', async () => {
      const response = await fetch(`${baseUrl}/api/wedding/bride-section`, withAuth(sessionCookie, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          showInstagramLink: true,
          brideInstagramLink: 'https://www.instagram.com/janesmith',
        }),
      }))

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data.showInstagramLink).toBe(true)
      expect(data.data.brideInstagramLink).toBe('https://www.instagram.com/janesmith')
    })

    it('should accept null for brideInstagramLink when showInstagramLink is false', async () => {
      const response = await fetch(`${baseUrl}/api/wedding/bride-section`, withAuth(sessionCookie, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          showInstagramLink: false,
          brideInstagramLink: null,
        }),
      }))

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data.showInstagramLink).toBe(false)
    })

    it('should update parent information fields', async () => {
      const response = await fetch(`${baseUrl}/api/wedding/bride-section`, withAuth(sessionCookie, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          showParentInfo: true,
          fatherName: 'Robert Smith',
          motherName: 'Mary Smith',
        }),
      }))

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data.showParentInfo).toBe(true)
      expect(data.data.fatherName).toBe('Robert Smith')
      expect(data.data.motherName).toBe('Mary Smith')
    })
  })

  describe('Instagram Link Validation - Bride', () => {
    it('should reject invalid URL format for brideInstagramLink', async () => {
      const response = await fetch(`${baseUrl}/api/wedding/bride-section`, withAuth(sessionCookie, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          showInstagramLink: true,
          brideInstagramLink: 'invalid url',
        }),
      }))

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.success).toBe(false)
      expect(data.error).toBeDefined()
    })

    it('should reject non-Instagram URLs', async () => {
      const response = await fetch(`${baseUrl}/api/wedding/bride-section`, withAuth(sessionCookie, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          showInstagramLink: true,
          brideInstagramLink: 'https://facebook.com/someuser',
        }),
      }))

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.success).toBe(false)
    })

    it('should accept valid Instagram URL with www', async () => {
      const response = await fetch(`${baseUrl}/api/wedding/bride-section`, withAuth(sessionCookie, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          showInstagramLink: true,
          brideInstagramLink: 'https://www.instagram.com/test_bride',
        }),
      }))

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
    })

    it('should accept valid Instagram URL without www', async () => {
      const response = await fetch(`${baseUrl}/api/wedding/bride-section`, withAuth(sessionCookie, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          showInstagramLink: true,
          brideInstagramLink: 'https://instagram.com/test_bride',
        }),
      }))

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
    })

    it('should accept null value when showInstagramLink is false', async () => {
      const response = await fetch(`${baseUrl}/api/wedding/bride-section`, withAuth(sessionCookie, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          showInstagramLink: false,
          brideInstagramLink: null,
        }),
      }))

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
    })

    it('should provide clear error messages for validation failures', async () => {
      const response = await fetch(`${baseUrl}/api/wedding/bride-section`, withAuth(sessionCookie, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          showInstagramLink: true,
          brideInstagramLink: 'bad-url',
        }),
      }))

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toBeDefined()
      expect(typeof data.error).toBe('string')
      expect(data.error.length).toBeGreaterThan(0)
    })
  })
})
