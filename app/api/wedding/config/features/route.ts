/**
 * T043: PUT /api/wedding/config/features
 *
 * Toggle wedding features on/off.
 */

import { NextRequest, NextResponse } from 'next/server';

import { FEATURE_NAMES } from '@/db/schema/features';
import { requireAuth } from '@/lib/session';
import { toggleFeature } from '@/lib/wedding-service';

// Use the single source of truth from the database schema
const VALID_FEATURES = FEATURE_NAMES as readonly string[];

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) {
      return session;
    }

    const body = await request.json();

    // Support both single feature toggle and batch updates
    if (body.featureName && typeof body.isEnabled === 'boolean') {
      // Single feature toggle (legacy support)
      const { featureName, isEnabled } = body;

      // Validate feature name
      if (!VALID_FEATURES.includes(featureName)) {
        return NextResponse.json(
          { success: false, error: 'Invalid feature name' },
          { status: 400 }
        );
      }

      // Toggle feature
      await toggleFeature(session.weddingConfigId, featureName, isEnabled);

      return NextResponse.json({
        success: true,
        data: {
          featureName,
          isEnabled,
        },
      });
    } else if (body.features && typeof body.features === 'object') {
      // Batch feature update (new)
      const features = body.features;

      // Validate all feature names
      for (const featureName of Object.keys(features)) {
        if (!VALID_FEATURES.includes(featureName)) {
          return NextResponse.json(
            { success: false, error: `Invalid feature name: ${featureName}` },
            { status: 400 }
          );
        }
        if (typeof features[featureName] !== 'boolean') {
          return NextResponse.json(
            { success: false, error: `Feature ${featureName} must be a boolean` },
            { status: 400 }
          );
        }
      }

      // Toggle all features
      await Promise.all(
        Object.entries(features).map(([featureName, isEnabled]) =>
          toggleFeature(session.weddingConfigId, featureName, isEnabled as boolean)
        )
      );

      return NextResponse.json({
        success: true,
        data: {
          features,
        },
      });
    }
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  } catch (error: any) {
    console.error('Toggle feature error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to toggle feature' },
      { status: 500 }
    );
  }
}
