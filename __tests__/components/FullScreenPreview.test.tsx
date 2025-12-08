/**
 * Component Test: FullScreenPreview Component
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import FullScreenPreview from '@/components/preview/FullScreenPreview'

describe('FullScreenPreview Component', () => {
  it('should render wedding layout with configuration data', () => {
    const mockConfig = {
      id: 'test-id',
      groomName: 'John',
      brideName: 'Mary',
      weddingDate: '2025-12-25',
      subdomain: 'john-mary',
      isPublished: true,
      features: {
        love_story: true,
        rsvp: false,
      },
      instagramLink: null,
      footerText: null,
    } as any

    render(<FullScreenPreview config={mockConfig} />)

    expect(screen.getByText(/John & Mary/)).toBeInTheDocument()
  })
})
