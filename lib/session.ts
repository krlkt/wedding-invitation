/**
 * Session Management Utilities
 *
 * Helper functions for session validation and authentication middleware.
 */

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export interface Session {
  userId: string;
  weddingConfigId: string;
}

/**
 * Get current session from cookies
 */
export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return null;
    }

    const session = JSON.parse(sessionCookie.value);
    const { userId, weddingConfigId } = session;

    if (!userId || !weddingConfigId) {
      return null;
    }

    return { userId, weddingConfigId };
  } catch (error) {
    console.error('Session parse error:', error);
    return null;
  }
}

/**
 * Require authenticated session or return 401 response
 */
export async function requireAuth(): Promise<Session | NextResponse> {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  }

  return session;
}
