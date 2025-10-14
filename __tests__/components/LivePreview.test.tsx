/**
 * Component Test: LivePreview URL Display
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import LivePreview from '@/app/components/LivePreview'

// Mock fetch
global.fetch = jest.fn()

describe('LivePreview Component', () => {
  beforeEach(() => {
    ;(global.fetch as jest.Mock).mockClear()
  })

  it('should display updated preview URL message (not .yourdomain.com)', async () => {
    const mockConfig = {
      subdomain: 'test-couple',
      groomName: 'John',
      brideName: 'Mary',
      weddingDate: '2025-11-04',
      isPublished: false,
      features: { love_story: true },
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockConfig }),
    })

    render(<LivePreview weddingConfigId="test-id" />)

    // Wait for the component to load
    await screen.findByText(/Custom subdomain available/)

    // Expect: Should NOT show ".yourdomain.com"
    expect(screen.queryByText(/yourdomain\.com/)).not.toBeInTheDocument()
  })
})
