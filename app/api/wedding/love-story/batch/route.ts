/**
 * Love Story Batch API
 * PUT /api/wedding/love-story/batch - Batch create/update/delete segments
 */

import { NextRequest, NextResponse } from 'next/server';

import {
  getLoveStorySegments,
  createLoveStorySegment,
  updateLoveStorySegment,
  deleteLoveStorySegment,
} from '@/lib/content-service';
import { requireAuth } from '@/lib/session';
import { createLoveStorySegmentSchema } from '@/lib/validations/love-story-section';
import type { LoveStorySegment } from '@/db/schema/content';

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) {
      return session;
    }

    const weddingConfigId = session.weddingConfigId;
    const body = await request.json();
    const { updated = [], deleted = [] } = body;

    // Validation
    if (!Array.isArray(updated) || !Array.isArray(deleted)) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload format' },
        { status: 400 }
      );
    }

    // Get existing segments for authorization checks
    const existingSegments = await getLoveStorySegments(weddingConfigId);
    const existingIds = new Set(existingSegments.map((s) => s.id));

    // Process updates (create or update)
    const updatePromises = updated.map(async (segment: Partial<LoveStorySegment>) => {
      // Validate segment data
      const validatedData = createLoveStorySegmentSchema.parse({
        title: segment.title,
        description: segment.description,
        date: segment.date,
        iconType: segment.iconType,
        order: segment.order,
      });

      if (!segment.id || !existingIds.has(segment.id)) {
        // Create new segment
        return createLoveStorySegment({
          weddingConfigId,
          ...validatedData,
        });
      }

      // Update existing segment
      return updateLoveStorySegment(segment.id, validatedData);
    });

    // Process deletions
    const deletePromises = deleted.map(async (id: string) => {
      if (!existingIds.has(id)) {
        throw new Error(`Love story segment not found: ${id}`);
      }
      return deleteLoveStorySegment(id);
    });

    await Promise.all([...updatePromises, ...deletePromises]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Love story batch update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to perform batch love story update' },
      { status: 500 }
    );
  }
}
