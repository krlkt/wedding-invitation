/**
 * Contract Test: GET /api/wedding/config
 *
 * Verifies the preview API contract for wedding configuration retrieval
 */

import { NextRequest, NextResponse } from 'next/server'

// Mock the session module
jest.mock('../../app/lib/session', () => ({
  requireAuth: jest.fn(),
}))

// Mock the wedding service module
jest.mock('../../app/lib/wedding-service', () => ({
  getWeddingConfigById: jest.fn(),
  getFeatureToggles: jest.fn(),
}))

import { GET } from '@/app/api/wedding/config/route'
import { requireAuth } from '../../app/lib/session'
import { getWeddingConfigById, getFeatureToggles } from '../../app/lib/wedding-service'

const mockRequireAuth = requireAuth as jest.MockedFunction<typeof requireAuth>
const mockGetWeddingConfigById = getWeddingConfigById as jest.MockedFunction<typeof getWeddingConfigById>
const mockGetFeatureToggles = getFeatureToggles as jest.MockedFunction<typeof getFeatureToggles>

describe('GET /api/wedding/config - Preview API Contract', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 200 with wedding config data including subdomain and features', async () => {
    // Mock authenticated session
    const mockSession = {
      userId: 'user-123',
      weddingConfigId: 'config-123',
    }

    const mockConfig = {
      id: 'config-123',
      userId: 'user-123',
      subdomain: 'john-mary',
      groomName: 'John',
      brideName: 'Mary',
      weddingDate: '2025-11-04',
      groomFather: 'Papa',
      groomMother: 'Mama',
      brideFather: 'Dad',
      brideMother: 'Mamsky',
      isPublished: false,
      instagramLink: null,
      footerText: null,
      monogramFilename: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const mockFeatures = [
      { id: '1', weddingConfigId: 'config-123', featureName: 'love_story', isEnabled: true },
      { id: '2', weddingConfigId: 'config-123', featureName: 'rsvp', isEnabled: true },
    ]

    mockRequireAuth.mockResolvedValue(mockSession)
    mockGetWeddingConfigById.mockResolvedValue(mockConfig as any)
    mockGetFeatureToggles.mockResolvedValue(mockFeatures as any)

    const request = new NextRequest('http://localhost:3000/api/wedding/config')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toHaveProperty('subdomain')
    expect(data.data).toHaveProperty('groomName')
    expect(data.data).toHaveProperty('brideName')
    expect(data.data).toHaveProperty('weddingDate')
    expect(data.data).toHaveProperty('features')
    expect(data.data.features).toHaveProperty('love_story')
    expect(data.data.features).toHaveProperty('rsvp')
  })

  it('should return 401 when user is not authenticated', async () => {
    const unauthorizedResponse = NextResponse.json(
      { success: false, error: 'Not authenticated' },
      { status: 401 }
    )
    mockRequireAuth.mockResolvedValue(unauthorizedResponse)

    const request = new NextRequest('http://localhost:3000/api/wedding/config')
    const response = await GET(request)

    expect(response.status).toBe(401)
  })

  it('should return 404 when wedding configuration not found', async () => {
    const mockSession = {
      userId: 'user-123',
      weddingConfigId: 'nonexistent-config',
    }

    mockRequireAuth.mockResolvedValue(mockSession)
    mockGetWeddingConfigById.mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/wedding/config')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Wedding configuration not found')
  })
})
