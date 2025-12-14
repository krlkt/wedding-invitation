/**
 * T045: POST /api/wedding/unpublish
 *
 * Unpublish wedding configuration (return to draft).
 */

import { NextRequest, NextResponse } from 'next/server';

import { requireAuth } from '@/lib/session';
import { unpublishWeddingConfig } from '@/lib/wedding-service';

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) {
      return session;
    }

    // Unpublish wedding
    const unpublished = await unpublishWeddingConfig(session.weddingConfigId);

    return NextResponse.json({
      success: true,
      data: {
        isPublished: false,
        unpublishedAt: unpublished.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Unpublish error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to unpublish wedding' },
      { status: 500 }
    );
  }
}
