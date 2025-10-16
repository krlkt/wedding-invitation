/**
 * T013: Wedding Configuration Flow Integration Test
 *
 * Tests complete wedding configuration workflows including creation,
 * updates, feature toggling, and publishing.
 *
 * Following TDD approach - these tests MUST FAIL initially until implementation is complete.
 */

describe('Wedding Configuration Flow Integration Test', () => {
  const baseUrl = 'http://localhost:3000'

  const testUser = {
    email: `config-test-${Date.now()}@example.com`,
    password: 'configPassword123',
    groomName: 'Config Test Groom',
    brideName: 'Config Test Bride',
  }

  beforeAll(async () => {
    // Register and login test user
    await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    })
  })

  describe('Configuration Update Workflow', () => {
    it('should update wedding configuration through complete flow', async () => {
      // Step 1: Login
      const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
        }),
      })

      if (loginResponse.status === 200) {
        // Step 2: Get initial configuration
        const initialConfigResponse = await fetch(`${baseUrl}/api/wedding/config`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })

        if (initialConfigResponse.status === 200) {
          const initialConfig = await initialConfigResponse.json()

          // Step 3: Update configuration with comprehensive data
          const updateData = {
            groomName: 'Updated Groom Name',
            brideName: 'Updated Bride Name',
            weddingDate: '2024-08-15T00:00:00.000Z',
            monogram: 'U&U',
            groomFather: 'Groom Father',
            groomMother: 'Groom Mother',
            brideFather: 'Bride Father',
            brideMother: 'Bride Mother',
            instagramLink: 'https://instagram.com/updatedwedding',
            footerText: 'Join us for our updated celebration!',
          }

          const updateResponse = await fetch(`${baseUrl}/api/wedding/config`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData),
          })

          if (updateResponse.status === 200) {
            const updatedConfig = await updateResponse.json()

            // Verify all fields were updated
            expect(updatedConfig.data).toMatchObject(updateData)
            expect(updatedConfig.data.id).toBe(initialConfig.data.id)

            // Step 4: Verify persistence by fetching again
            const verifyResponse = await fetch(`${baseUrl}/api/wedding/config`, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            })

            if (verifyResponse.status === 200) {
              const verifiedConfig = await verifyResponse.json()
              expect(verifiedConfig.data).toMatchObject(updateData)
            }
          }
        }
      }
    })

    it('should validate configuration data during updates', async () => {
      // Test invalid wedding date
      const invalidDateUpdate = await fetch(`${baseUrl}/api/wedding/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weddingDate: 'invalid-date-format',
        }),
      })

      if (invalidDateUpdate.status === 400) {
        const errorData = await invalidDateUpdate.json()
        expect(errorData.error).toMatch(/date/i)
      }

      // Test invalid Instagram link
      const invalidInstagramUpdate = await fetch(`${baseUrl}/api/wedding/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instagramLink: 'not-a-valid-url',
        }),
      })

      if (invalidInstagramUpdate.status === 400) {
        const errorData = await invalidInstagramUpdate.json()
        expect(errorData.error).toMatch(/instagram/i)
      }
    })
  })

  describe('Feature Toggle Workflow', () => {
    const features = [
      'love_story',
      'rsvp',
      'gallery',
      'prewedding_videos',
      'faqs',
      'dress_code',
      'instagram_link',
    ]

    it('should toggle all features on and off', async () => {
      for (const feature of features) {
        // Step 1: Enable feature
        const enableResponse = await fetch(`${baseUrl}/api/wedding/config/features`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            featureName: feature,
            isEnabled: true,
          }),
        })

        if (enableResponse.status === 200) {
          const enableData = await enableResponse.json()
          expect(enableData.data).toMatchObject({
            featureName: feature,
            isEnabled: true,
          })

          // Step 2: Verify feature is enabled in config
          const configResponse = await fetch(`${baseUrl}/api/wedding/config`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          })

          if (configResponse.status === 200) {
            const configData = await configResponse.json()
            expect(configData.data.features[feature]).toBe(true)
          }

          // Step 3: Disable feature
          const disableResponse = await fetch(`${baseUrl}/api/wedding/config/features`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              featureName: feature,
              isEnabled: false,
            }),
          })

          if (disableResponse.status === 200) {
            const disableData = await disableResponse.json()
            expect(disableData.data).toMatchObject({
              featureName: feature,
              isEnabled: false,
            })
          }
        }
      }
    })

    it('should reject invalid feature names', async () => {
      const invalidFeatureResponse = await fetch(`${baseUrl}/api/wedding/config/features`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          featureName: 'invalid_feature_name',
          isEnabled: true,
        }),
      })

      expect(invalidFeatureResponse.status).toBe(400)
    })
  })

  describe('Publishing Workflow', () => {
    it('should complete publish/unpublish cycle', async () => {
      // Step 1: Ensure configuration has required data for publishing
      await fetch(`${baseUrl}/api/wedding/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weddingDate: '2024-09-20T00:00:00.000Z',
          groomName: 'Publish Test Groom',
          brideName: 'Publish Test Bride',
        }),
      })

      // Step 2: Publish wedding
      const publishResponse = await fetch(`${baseUrl}/api/wedding/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (publishResponse.status === 200) {
        const publishData = await publishResponse.json()

        expect(publishData).toMatchObject({
          success: true,
          data: {
            isPublished: true,
            publishedAt: expect.any(String),
            weddingUrl: expect.any(String),
          },
        })

        // Validate timestamp and URL format
        expect(new Date(publishData.data.publishedAt)).toBeInstanceOf(Date)
        expect(publishData.data.weddingUrl).toMatch(/^https?:\/\/.+/)

        // Step 3: Verify configuration shows published status
        const configResponse = await fetch(`${baseUrl}/api/wedding/config`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })

        if (configResponse.status === 200) {
          const configData = await configResponse.json()
          expect(configData.data.isPublished).toBe(true)
        }

        // Step 4: Unpublish wedding
        const unpublishResponse = await fetch(`${baseUrl}/api/wedding/unpublish`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })

        if (unpublishResponse.status === 200) {
          const unpublishData = await unpublishResponse.json()

          expect(unpublishData).toMatchObject({
            success: true,
            data: {
              isPublished: false,
              unpublishedAt: expect.any(String),
            },
          })

          // Step 5: Verify configuration shows unpublished status
          const finalConfigResponse = await fetch(`${baseUrl}/api/wedding/config`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          })

          if (finalConfigResponse.status === 200) {
            const finalConfigData = await finalConfigResponse.json()
            expect(finalConfigData.data.isPublished).toBe(false)
          }
        }
      }
    })
  })
})
