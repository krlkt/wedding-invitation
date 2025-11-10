/**
 * @jest-environment node
 *
 * Integration Test: Subdomain Collision Retry Logic
 */

import { createWeddingConfiguration, isSubdomainAvailable } from '@/app/lib/wedding-service'

describe('Subdomain Validation Integration', () => {
  it('should retry subdomain generation on collision up to 5 times', async () => {
    // TODO: Mock isSubdomainAvailable to return false for first 3 attempts, then true
    // TODO: Mock database

    const result = await createWeddingConfiguration('user-123', 'John', 'Mary')

    expect(result).toHaveProperty('subdomain')
    expect(result.subdomain).toMatch(/john-mary/)
  })

  it('should throw error after 5 failed attempts', async () => {
    // TODO: Mock isSubdomainAvailable to always return false

    await expect(createWeddingConfiguration('user-123', 'John', 'Mary')).rejects.toThrow(
      'Unable to generate unique subdomain'
    )
  })
})
