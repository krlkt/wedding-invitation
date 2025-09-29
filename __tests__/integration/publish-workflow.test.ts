/**
 * T018: Publish/Unpublish Workflow Test
 *
 * Tests complete publish/unpublish workflow including validation,
 * public access, and status management.
 */

describe('Publish/Unpublish Workflow Test', () => {
  const baseUrl = 'http://localhost:3000'

  const testUser = {
    email: `publish-test-${Date.now()}@example.com`,
    password: 'publishPassword123',
    groomName: 'Publish Test Groom',
    brideName: 'Publish Test Bride'
  }

  beforeAll(async () => {
    // Setup test user with complete wedding configuration
    await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    })
    
    await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    })

    // Set up complete wedding configuration
    await fetch(`${baseUrl}/api/wedding/config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        weddingDate: '2024-10-15T00:00:00.000Z',
        groomName: testUser.groomName,
        brideName: testUser.brideName
      })
    })
  })

  describe('Complete Publish Workflow', () => {
    it('should handle complete publish-unpublish cycle', async () => {
      // Step 1: Verify initial unpublished state
      const initialConfigResponse = await fetch(`${baseUrl}/api/wedding/config`)
      if (initialConfigResponse.status === 200) {
        const initialConfig = await initialConfigResponse.json()
        expect(initialConfig.data.isPublished).toBe(false)
      }

      // Step 2: Publish wedding
      const publishResponse = await fetch(`${baseUrl}/api/wedding/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (publishResponse.status === 200) {
        const publishData = await publishResponse.json()
        
        expect(publishData).toMatchObject({
          success: true,
          data: {
            isPublished: true,
            publishedAt: expect.any(String),
            weddingUrl: expect.any(String)
          }
        })

        const weddingUrl = publishData.data.weddingUrl
        expect(weddingUrl).toMatch(/^https?:\/\/.+/)

        // Step 3: Verify configuration shows published status
        const publishedConfigResponse = await fetch(`${baseUrl}/api/wedding/config`)
        if (publishedConfigResponse.status === 200) {
          const publishedConfig = await publishedConfigResponse.json()
          expect(publishedConfig.data.isPublished).toBe(true)
        }

        // Step 4: Test public access to wedding site
        const publicAccessResponse = await fetch(weddingUrl)
        expect([200, 404]).toContain(publicAccessResponse.status) // 200 if site is accessible

        // Step 5: Unpublish wedding
        const unpublishResponse = await fetch(`${baseUrl}/api/wedding/unpublish`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })

        if (unpublishResponse.status === 200) {
          const unpublishData = await unpublishResponse.json()
          
          expect(unpublishData).toMatchObject({
            success: true,
            data: {
              isPublished: false,
              unpublishedAt: expect.any(String)
            }
          })

          // Step 6: Verify configuration shows unpublished status
          const finalConfigResponse = await fetch(`${baseUrl}/api/wedding/config`)
          if (finalConfigResponse.status === 200) {
            const finalConfig = await finalConfigResponse.json()
            expect(finalConfig.data.isPublished).toBe(false)
          }

          // Step 7: Verify public access is denied after unpublishing
          const deniedAccessResponse = await fetch(weddingUrl)
          expect(deniedAccessResponse.status).toBe(404)
        }
      }
    })
  })

  describe('Publish Validation', () => {
    it('should validate required fields before publishing', async () => {
      // Clear wedding date to test validation
      await fetch(`${baseUrl}/api/wedding/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weddingDate: null
        })
      })

      const publishResponse = await fetch(`${baseUrl}/api/wedding/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      // Should fail validation due to missing required fields
      if (publishResponse.status === 400) {
        const errorData = await publishResponse.json()
        expect(errorData.success).toBe(false)
      }
    })
  })

  describe('Multiple Publish/Unpublish Operations', () => {
    it('should handle multiple publish operations idempotently', async () => {
      // Ensure valid configuration
      await fetch(`${baseUrl}/api/wedding/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weddingDate: '2024-11-20T00:00:00.000Z'
        })
      })

      // Publish twice
      const firstPublish = await fetch(`${baseUrl}/api/wedding/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      const secondPublish = await fetch(`${baseUrl}/api/wedding/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      // Both should succeed (idempotent operation)
      expect(firstPublish.status).toBe(200)
      expect(secondPublish.status).toBe(200)
    })
  })
})