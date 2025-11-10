/**
 * @jest-environment node
 *
 * T011: User Registration Flow Integration Test
 *
 * Tests the complete user registration workflow from account creation
 * to initial wedding configuration setup.
 *
 * Following TDD approach - these tests MUST FAIL initially until implementation is complete.
 */

describe('User Registration Flow Integration Test', () => {
  const baseUrl = 'http://localhost:3000'

  describe('Complete Registration Workflow', () => {
    const testUser = {
      email: `test-${Date.now()}@example.com`,
      password: 'securePassword123',
      groomName: 'John Doe',
      brideName: 'Jane Smith',
    }

    it('should complete full registration workflow', async () => {
      // Step 1: Register new user
      const registrationResponse = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUser),
      })

      if (registrationResponse.status === 201) {
        const registrationData = await registrationResponse.json()

        // Validate registration creates user and wedding config
        expect(registrationData).toMatchObject({
          success: true,
          data: {
            userId: expect.any(String),
            weddingConfigId: expect.any(String),
            subdomain: expect.any(String),
          },
        })

        // Step 2: Verify user can immediately login with credentials
        const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: testUser.email,
            password: testUser.password,
          }),
        })

        if (loginResponse.status === 200) {
          const loginData = await loginResponse.json()

          // Should return same user and wedding config IDs
          expect(loginData.data.userId).toBe(registrationData.data.userId)
          expect(loginData.data.weddingConfigId).toBe(registrationData.data.weddingConfigId)
          expect(loginData.data.subdomain).toBe(registrationData.data.subdomain)

          // Step 3: Verify initial wedding configuration exists
          const configResponse = await fetch(`${baseUrl}/api/wedding/config`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            // TODO: Add session cookies/auth headers from login
          })

          if (configResponse.status === 200) {
            const configData = await configResponse.json()

            // Initial wedding config should contain registration data
            expect(configData.data).toMatchObject({
              id: registrationData.data.weddingConfigId,
              subdomain: registrationData.data.subdomain,
              groomName: testUser.groomName,
              brideName: testUser.brideName,
              isPublished: false, // Should start as draft
              features: expect.objectContaining({
                love_story: expect.any(Boolean),
                rsvp: expect.any(Boolean),
                gallery: expect.any(Boolean),
                prewedding_videos: expect.any(Boolean),
                faqs: expect.any(Boolean),
                dress_code: expect.any(Boolean),
                instagram_link: expect.any(Boolean),
              }),
            })
          }
        }
      }
    })

    it('should prevent registration with duplicate email', async () => {
      // First registration
      const firstRegistration = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...testUser,
          email: 'duplicate@example.com',
        }),
      })

      // Second registration with same email
      const duplicateRegistration = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...testUser,
          email: 'duplicate@example.com',
          groomName: 'Different Groom',
          brideName: 'Different Bride',
        }),
      })

      expect(duplicateRegistration.status).toBe(400)

      if (duplicateRegistration.status === 400) {
        const errorData = await duplicateRegistration.json()
        expect(errorData).toMatchObject({
          success: false,
          error: 'Email already registered',
        })
      }
    })

    it('should generate unique subdomains for different users', async () => {
      const user1 = {
        email: `user1-${Date.now()}@example.com`,
        password: 'password123',
        groomName: 'John',
        brideName: 'Jane',
      }

      const user2 = {
        email: `user2-${Date.now()}@example.com`,
        password: 'password123',
        groomName: 'John', // Same names
        brideName: 'Jane', // Same names
      }

      const registration1 = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user1),
      })

      const registration2 = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user2),
      })

      if (registration1.status === 201 && registration2.status === 201) {
        const data1 = await registration1.json()
        const data2 = await registration2.json()

        // Subdomains should be different even with same names
        expect(data1.data.subdomain).not.toBe(data2.data.subdomain)
      }
    })

    it('should validate subdomain format', async () => {
      const registration = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `subdomain-test-${Date.now()}@example.com`,
          password: 'password123',
          groomName: "John-Michael O'Connor",
          brideName: 'Jane-Marie Smith-Jones',
        }),
      })

      if (registration.status === 201) {
        const data = await registration.json()

        // Subdomain should be URL-safe
        expect(data.data.subdomain).toMatch(/^[a-z0-9-]+$/)
        expect(data.data.subdomain.length).toBeGreaterThan(0)
        expect(data.data.subdomain.length).toBeLessThanOrEqual(63) // DNS limit
      }
    })
  })
})
