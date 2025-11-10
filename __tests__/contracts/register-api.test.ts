/**
 * @jest-environment node
 *
 * Contract Test: POST /api/auth/register - Subdomain Validation
 *
 * Verifies subdomain uniqueness validation and error handling
 */

import { NextRequest } from 'next/server'

// Mock the auth module
jest.mock('../../app/lib/auth', () => ({
  registerUser: jest.fn(),
}))

// Mock the wedding service module
jest.mock('../../app/lib/wedding-service', () => ({
  createWeddingConfiguration: jest.fn(),
}))

import { POST } from '@/app/api/auth/register/route'
import { registerUser } from '../../app/lib/auth'
import { createWeddingConfiguration } from '../../app/lib/wedding-service'

const mockRegisterUser = registerUser as jest.MockedFunction<typeof registerUser>
const mockCreateWeddingConfiguration = createWeddingConfiguration as jest.MockedFunction<
  typeof createWeddingConfiguration
>

describe('POST /api/auth/register - Subdomain Validation Contract', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 201 with unique subdomain on successful registration', async () => {
    mockRegisterUser.mockResolvedValue({ userId: 'user-123' })
    mockCreateWeddingConfiguration.mockResolvedValue({
      id: 'config-123',
      userId: 'user-123',
      subdomain: 'john-mary-abc1',
      groomName: 'John',
      brideName: 'Mary',
      weddingDate: '2025-11-04',
      isPublished: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any)

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'john@example.com',
        password: 'password123',
        groomName: 'John',
        brideName: 'Mary',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.success).toBe(true)
    expect(data.data).toHaveProperty('subdomain')
    expect(data.data.subdomain).toMatch(/^john-mary-[a-z0-9]{4}$/)
  })

  it('should return 400 with error when subdomain generation fails after retries', async () => {
    mockRegisterUser.mockResolvedValue({ userId: 'user-123' })
    mockCreateWeddingConfiguration.mockRejectedValue(
      new Error('Unable to generate unique subdomain. Please try again.')
    )

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        groomName: 'John',
        brideName: 'Mary',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Unable to generate unique subdomain. Please try again.')
  })

  it('should return 400 when email already registered', async () => {
    mockRegisterUser.mockRejectedValue(new Error('Email already registered'))

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'existing@example.com',
        password: 'password123',
        groomName: 'John',
        brideName: 'Mary',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Email already registered')
  })
})
