/**
 * T005: Contract test - PUT /api/wedding/config with new fields
 *
 * Tests the API's ability to handle new Instagram link fields (groomsInstagramLink, brideInstagramLink)
 * Reference: specs/008-split-instagram-links/contracts/api-wedding-config.yaml
 *
 * SKIPPED: These tests require proper authentication setup
 * TODO: Implement test authentication helper for integration tests
 */

import { describe, it, expect, beforeEach } from '@jest/globals'

describe.skip('PUT /api/wedding/config - New Instagram Fields', () => {
  let sessionCookie: string
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000'

  beforeEach(async () => {
    // TODO: Set up authenticated session
    // For now, assume we have a valid session cookie
    sessionCookie = 'test-session-cookie'
  })

  it('should accept both groomsInstagramLink and brideInstagramLink', async () => {
    const response = await fetch(`${baseUrl}/api/wedding/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `session=${sessionCookie}`,
      },
      body: JSON.stringify({
        groomsInstagramLink: 'https://instagram.com/test_groom',
        brideInstagramLink: 'https://instagram.com/test_bride',
      }),
    })

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.data.groomsInstagramLink).toBe('https://instagram.com/test_groom')
    expect(data.data.brideInstagramLink).toBe('https://instagram.com/test_bride')
  })

  it('should accept partial update with only groomsInstagramLink', async () => {
    const response = await fetch(`${baseUrl}/api/wedding/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `session=${sessionCookie}`,
      },
      body: JSON.stringify({
        groomsInstagramLink: 'https://instagram.com/only_groom',
      }),
    })

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.data.groomsInstagramLink).toBe('https://instagram.com/only_groom')
  })

  it('should accept partial update with only brideInstagramLink', async () => {
    const response = await fetch(`${baseUrl}/api/wedding/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `session=${sessionCookie}`,
      },
      body: JSON.stringify({
        brideInstagramLink: 'https://instagram.com/only_bride',
      }),
    })

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.data.brideInstagramLink).toBe('https://instagram.com/only_bride')
  })

  it('should allow clearing both links by setting to null', async () => {
    const response = await fetch(`${baseUrl}/api/wedding/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `session=${sessionCookie}`,
      },
      body: JSON.stringify({
        groomsInstagramLink: null,
        brideInstagramLink: null,
      }),
    })

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.data.groomsInstagramLink).toBeNull()
    expect(data.data.brideInstagramLink).toBeNull()
  })

  it('should include new fields in response after update', async () => {
    // First update with new fields
    await fetch(`${baseUrl}/api/wedding/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `session=${sessionCookie}`,
      },
      body: JSON.stringify({
        groomsInstagramLink: 'https://instagram.com/groom_response_test',
        brideInstagramLink: 'https://instagram.com/bride_response_test',
      }),
    })

    // Then fetch to verify response includes fields
    const response = await fetch(`${baseUrl}/api/wedding/config`, {
      method: 'GET',
      headers: {
        Cookie: `session=${sessionCookie}`,
      },
    })

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.data).toHaveProperty('groomsInstagramLink')
    expect(data.data).toHaveProperty('brideInstagramLink')
  })
})
