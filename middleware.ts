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

  // Define public paths that don't require subdomain handling or authentication checks
  const publicPaths = ['/'] // Add other public paths as needed

  // Skip middleware for public paths, static files, and API routes (handled in route handlers)
  if (
    publicPaths.includes(pathname) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('/api/')
  ) {
    return NextResponse.next()
  }

  // Allow the login page to be accessed without a session
  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next()
  }

  // Check authentication
  const session = request.cookies.get('session')?.value
  if (!session) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/admin/login'
    // Optionally, save the original path so user can return after login
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
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

  // For Vercel preview/production domains like subdomain-oial.vercel.app
  // Check if this is a Vercel domain with dash-separated subdomain
  if (host.includes('vercel.app')) {
    // Extract base domain (e.g., "oial" from "subdomain-oial.vercel.app")
    const baseDomain = process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN?.split('.')[0] || 'oial'

    // Check if there's a subdomain prefix (e.g., "karelsabrina-oial")
    const firstPart = parts[0]
    if (firstPart.includes('-' + baseDomain)) {
      // Extract subdomain from "subdomain-basedomain" format
      return firstPart.split('-' + baseDomain)[0]
    }

    // No subdomain for base domain
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
