/**
 * T052: Gallery Management API
 */

import { NextRequest, NextResponse } from 'next/server';

import { getGalleryPhotos } from '@/lib/file-service';
import { requireAuth } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) {
      return session;
    }

    const photos = await getGalleryPhotos(session.weddingConfigId);

    return NextResponse.json({
      success: true,
      data: photos,
    });
  } catch (error: any) {
    console.error('Get gallery error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get gallery photos' },
      { status: 500 }
    );
  }
}
