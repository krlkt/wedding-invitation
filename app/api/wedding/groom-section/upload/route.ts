/**
 * Groom Section Photo Upload API
 * POST /api/wedding/groom-section/upload - Upload groom section photo
 * DELETE /api/wedding/groom-section/upload - Delete groom section photo
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/session';
import { uploadGroomSectionPhoto, deleteGroomSectionPhoto } from '@/lib/file-service';

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const slotStr = formData.get('slot') as string;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    if (!slotStr) {
      return NextResponse.json({ success: false, error: 'No slot provided' }, { status: 400 });
    }

    const slot = parseInt(slotStr, 10);
    if (isNaN(slot) || slot < 1) {
      return NextResponse.json({ success: false, error: 'Invalid slot number' }, { status: 400 });
    }

    const result = await uploadGroomSectionPhoto(session.weddingConfigId, file, slot);

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 201 }
    );
  } catch (error: any) {
    // Handle specific validation errors
    if (error.message === 'Image file size exceeds 10MB limit') {
      return NextResponse.json(
        { success: false, error: 'Image file size exceeds 10MB limit' },
        { status: 413 }
      );
    }

    if (error.message?.includes('Invalid file type')) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    console.error('Groom section photo upload error:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    const { searchParams } = new URL(request.url);
    const slotStr = searchParams.get('slot');

    if (!slotStr) {
      return NextResponse.json({ success: false, error: 'No slot provided' }, { status: 400 });
    }

    const slot = parseInt(slotStr, 10);
    if (isNaN(slot) || slot < 1) {
      return NextResponse.json({ success: false, error: 'Invalid slot number' }, { status: 400 });
    }

    await deleteGroomSectionPhoto(session.weddingConfigId, slot);

    return NextResponse.json({
      success: true,
      message: 'Photo deleted successfully',
    });
  } catch (error: any) {
    if (error.message === 'Groom section not found') {
      return NextResponse.json(
        { success: false, error: 'Groom section not found' },
        { status: 404 }
      );
    }

    if (error.message === 'Photo not found') {
      return NextResponse.json({ success: false, error: 'Photo not found' }, { status: 404 });
    }

    console.error('Groom section photo delete error:', error);
    return NextResponse.json({ success: false, error: 'Delete failed' }, { status: 500 });
  }
}
