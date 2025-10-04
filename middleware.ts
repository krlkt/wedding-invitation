/**
 * T054-T055: Authentication and Subdomain Detection Middleware
 *
 * Next.js middleware for authentication and subdomain-based multi-tenancy.
 * Runs on Edge runtime for optimal performance.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes (handled in route handlers)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('/api/')
  ) {
    return NextResponse.next()
  }

  // Extract subdomain from hostname
  const hostname = request.headers.get('host') || ''
  const subdomain = extractSubdomain(hostname)

  // If subdomain exists, set it in headers for tenant context
  if (subdomain) {
    const response = NextResponse.next()
    response.headers.set('x-wedding-subdomain', subdomain)
    return response
  }

  return NextResponse.next()
}

/**
 * Extract subdomain from hostname
 */
function extractSubdomain(hostname: string): string | null {
  // Remove port if present
  const host = hostname.split(':')[0]

  // Split by dots
  const parts = host.split('.')

  // For localhost development: support subdomain.localhost
  if (parts.length === 2 && parts[1] === 'localhost') {
    return parts[0]
  }

  // For localhost or single-part domains, no subdomain
  if (parts.length <= 1 || host === 'localhost') {
    return null
  }

  // For production domains like subdomain.example.com
  // Subdomain is the first part if there are 3+ parts
  if (parts.length >= 3) {
    return parts[0]
  }

  return null
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
}