/**
 * T041: GET /api/wedding/config
 * T042: PUT /api/wedding/config
 *
 * Wedding configuration CRUD operations.
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/app/lib/session'
import { getWeddingConfigById, updateWeddingConfiguration, getFeatureToggles } from '@/app/lib/wedding-service'
import { isValidInstagramUrl } from '@/app/lib/validation'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    if (session instanceof NextResponse) return session

    // Get wedding configuration
    const config = await getWeddingConfigById(session.weddingConfigId)

    if (!config) {
      return NextResponse.json(
        { success: false, error: 'Wedding configuration not found' },
        { status: 404 }
      )
    }

    // Get feature toggles
    const features = await getFeatureToggles(config.id)
    const featuresMap = features.reduce(
      (acc, f) => {
        acc[f.featureName] = f.isEnabled
        return acc
      },
      {} as Record<string, boolean>
    )

    return NextResponse.json({
      success: true,
      data: {
        id: config.id,
        subdomain: config.subdomain,
        groomName: config.groomName,
        brideName: config.brideName,
        weddingDate: config.weddingDate,
        monogramFilename: config.monogramFilename,
        monogramFileSize: config.monogramFileSize,
        monogramMimeType: config.monogramMimeType,
        groomFather: config.groomFather,
        groomMother: config.groomMother,
        brideFather: config.brideFather,
        brideMother: config.brideMother,
        groomsInstagramLink: config.groomsInstagramLink,
        brideInstagramLink: config.brideInstagramLink,
        footerText: config.footerText,
        isPublished: config.isPublished,
        features: featuresMap,
        createdAt: config.createdAt,
        updatedAt: config.updatedAt,
      },
    })
  } catch (error: any) {
    console.error('Get config error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get configuration' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth()
    if (session instanceof NextResponse) return session

    const body = await request.json()
    const {
      groomName,
      brideName,
      weddingDate,
      groomFather,
      groomMother,
      brideFather,
      brideMother,
      groomsInstagramLink,
      brideInstagramLink,
      footerText,
    } = body

    // Validate wedding date if provided
    if (weddingDate) {
      const date = new Date(weddingDate)
      if (isNaN(date.getTime())) {
        return NextResponse.json({ success: false, error: 'Invalid date format' }, { status: 400 })
      }
    }

    // Validate groom's Instagram link if provided
    if (groomsInstagramLink !== undefined && groomsInstagramLink !== null) {
      if (!isValidInstagramUrl(groomsInstagramLink)) {
        return NextResponse.json(
          { success: false, error: 'Invalid Instagram URL for groom' },
          { status: 400 }
        )
      }
    }

    // Validate bride's Instagram link if provided
    if (brideInstagramLink !== undefined && brideInstagramLink !== null) {
      if (!isValidInstagramUrl(brideInstagramLink)) {
        return NextResponse.json(
          { success: false, error: 'Invalid Instagram URL for bride' },
          { status: 400 }
        )
      }
    }

    // Update configuration
    const updated = await updateWeddingConfiguration(session.weddingConfigId, {
      groomName,
      brideName,
      weddingDate: weddingDate ? new Date(weddingDate) : undefined,
      groomFather,
      groomMother,
      brideFather,
      brideMother,
      groomsInstagramLink,
      brideInstagramLink,
      footerText,
    })

    // Get feature toggles
    const features = await getFeatureToggles(updated.id)
    const featuresMap = features.reduce(
      (acc, f) => {
        acc[f.featureName] = f.isEnabled
        return acc
      },
      {} as Record<string, boolean>
    )

    return NextResponse.json({
      success: true,
      data: {
        ...updated,
        features: featuresMap,
      },
    })
  } catch (error: any) {
    console.error('Update config error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update configuration' },
      { status: 500 }
    )
  }
}
