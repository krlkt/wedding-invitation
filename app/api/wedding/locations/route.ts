/**
 * T047: Location API
 */

import { NextRequest, NextResponse } from 'next/server';

import { getLocations, createLocation } from '@/lib/content-service';
import { requireAuth } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) {
      return session;
    }

    const locations = await getLocations(session.weddingConfigId);

    return NextResponse.json({
      success: true,
      data: locations,
    });
  } catch (error: any) {
    console.error('Get locations error:', error);
    return NextResponse.json({ success: false, error: 'Failed to get locations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    if (session instanceof NextResponse) {
      return session;
    }

    const body = await request.json();
    const {
      locationIdentifier,
      name,
      address,
      googleMapsLink,
      ceremonyTime,
      receptionTime,
      order,
    } = body;

    if (!locationIdentifier || !name || !address || order === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const location = await createLocation({
      weddingConfigId: session.weddingConfigId,
      locationIdentifier,
      name,
      address,
      googleMapsLink,
      ceremonyTime,
      receptionTime,
      order,
    });

    return NextResponse.json(
      {
        success: true,
        data: location,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create location error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create location' },
      { status: 500 }
    );
  }
}
