import { http, HttpResponse } from 'msw'

// Mock data that matches your actual database structure
const mockUserAccount = {
  id: 'user_123',
  email: 'test@example.com',
  passwordHash: 'hashed_password',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const mockWeddingConfig = {
  id: 'wedding_123',
  userId: 'user_123',
  subdomain: 'test-wedding',
  groomName: 'John',
  brideName: 'Jane',
  weddingDate: '2024-06-15',
  monogram: 'J&J',
  groomFather: 'John Sr.',
  groomMother: 'Mary',
  brideFather: 'Robert',
  brideMother: 'Susan',
  instagramLink: 'https://instagram.com/johnandjane',
  footerText: 'Thank you for celebrating with us!',
  isPublished: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const mockRSVP = {
  id: 'rsvp_123',
  name: 'Test Guest',
  response: 'yes',
  attendeeCount: 2,
  maxGuests: 2,
  foodChoice: 'chicken',
  notes: 'Excited to attend!',
  location: 'bali',
  invitationLink: 'http://localhost:3000/bali?to=Test+Guest&id=123',
  group: 'Friends',
  possiblyNotComing: false,
  weddingConfigId: 'wedding_123',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const handlers = [
  // Auth API endpoints
  http.post('/api/auth/register', async ({ request }) => {
    const body = await request.json() as any
    return HttpResponse.json({
      success: true,
      data: {
        userId: mockUserAccount.id,
        weddingConfigId: mockWeddingConfig.id,
        subdomain: body.groomName.toLowerCase() + '-' + body.brideName.toLowerCase(),
      }
    }, { status: 201 })
  }),

  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as any
    if (body.email === 'test@example.com' && body.password === 'password123') {
      return HttpResponse.json({
        success: true,
        data: {
          userId: mockUserAccount.id,
          weddingConfigId: mockWeddingConfig.id,
          subdomain: mockWeddingConfig.subdomain,
        }
      })
    }
    return HttpResponse.json({
      success: false,
      error: 'Invalid email or password'
    }, { status: 401 })
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({
      success: true,
      message: 'Logged out successfully'
    })
  }),

  http.get('/api/auth/session', () => {
    return HttpResponse.json({
      success: true,
      data: {
        userId: mockUserAccount.id,
        weddingConfigId: mockWeddingConfig.id,
        subdomain: mockWeddingConfig.subdomain,
      }
    })
  }),

  // Wedding Configuration API endpoints
  http.get('/api/wedding/config', () => {
    return HttpResponse.json({
      success: true,
      data: {
        ...mockWeddingConfig,
        features: {
          love_story: true,
          rsvp: true,
          gallery: true,
          prewedding_videos: false,
          faqs: true,
          dress_code: true,
          instagram_link: true,
        }
      }
    })
  }),

  http.put('/api/wedding/config', async ({ request }) => {
    const body = await request.json() as any
    return HttpResponse.json({
      success: true,
      data: {
        ...mockWeddingConfig,
        ...body,
        updatedAt: new Date().toISOString(),
      }
    })
  }),

  http.put('/api/wedding/config/features', async ({ request }) => {
    const body = await request.json() as any
    return HttpResponse.json({
      success: true,
      data: {
        featureName: body.featureName,
        isEnabled: body.isEnabled,
      }
    })
  }),

  http.post('/api/wedding/publish', () => {
    return HttpResponse.json({
      success: true,
      data: {
        isPublished: true,
        publishedAt: new Date().toISOString(),
        weddingUrl: `http://localhost:3000`,
      }
    })
  }),

  http.post('/api/wedding/unpublish', () => {
    return HttpResponse.json({
      success: true,
      data: {
        isPublished: false,
        unpublishedAt: new Date().toISOString(),
      }
    })
  }),

  // RSVP endpoints (existing functionality)
  http.get('/api/rsvp', () => {
    return HttpResponse.json([mockRSVP])
  }),

  http.post('/api/rsvp', async ({ request }) => {
    const body = await request.json() as any
    return HttpResponse.json({
      ...mockRSVP,
      ...body,
      id: 'rsvp_' + Date.now(),
    }, { status: 201 })
  }),

  // File upload endpoints
  http.post('/api/wedding/gallery/upload', () => {
    return HttpResponse.json({
      success: true,
      data: {
        id: 'gallery_123',
        filename: 'test-photo.jpg',
        originalName: 'wedding-photo.jpg',
        fileSize: 1024000,
        mimeType: 'image/jpeg',
        order: 1,
        photoUrl: 'http://localhost:3000/uploads/test-photo.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }, { status: 201 })
  }),

  // Fallback for unhandled requests
  http.all('*', ({ request }) => {
    console.warn(`Unhandled ${request.method} request to ${request.url}`)
    return HttpResponse.json(
      { error: `Unhandled API endpoint: ${request.method} ${request.url}` },
      { status: 404 }
    )
  }),
]