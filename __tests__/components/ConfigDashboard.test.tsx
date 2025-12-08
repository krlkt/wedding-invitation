/**
 * Component Test: ConfigDashboard "View Live Site" Button
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import ConfigDashboard from '@/components/admin/ConfigDashboard'

// Mock fetch
global.fetch = jest.fn()

describe('ConfigDashboard Component', () => {
  beforeEach(() => {
    ;(global.fetch as jest.Mock).mockClear()
  })

  it('should render "View Live Site" button that links to /preview', async () => {
    const mockConfig = {
      id: 'test-id',
      subdomain: 'test-couple',
      groomName: 'John',
      brideName: 'Mary',
      weddingDate: '2025-11-04',
      isPublished: false,
      features: { love_story: true },
    }

    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockConfig }),
    })

    render(<ConfigDashboard />)

    // Wait for the config to load
    const button = await screen.findByRole('link', { name: /view live site/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('href', '/preview')
    expect(button).toHaveAttribute('target', '_blank')
  })
})
