/**
 * Starting Section Media Upload API
 * POST /api/wedding/starting-section/upload - Upload background media
 * DELETE /api/wedding/starting-section/upload - Delete background media
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/app/lib/session'
import {
    uploadStartingSectionMedia,
    deleteStartingSectionMedia,
} from '@/app/lib/file-service'

export async function POST(request: NextRequest) {
    try {
        const session = await requireAuth()
        if (session instanceof NextResponse) return session

        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json(
                { success: false, error: 'No file provided' },
                { status: 400 }
            )
        }

        const result = await uploadStartingSectionMedia(session.weddingConfigId, file)

        return NextResponse.json(
            {
                success: true,
                data: result,
            },
            { status: 201 }
        )
    } catch (error: any) {
        // Handle specific validation errors
        if (error.message === 'Image file size exceeds 10MB limit') {
            return NextResponse.json(
                { success: false, error: 'Image file size exceeds 10MB limit' },
                { status: 413 }
            )
        }

        if (error.message === 'Video file size exceeds 50MB limit') {
            return NextResponse.json(
                { success: false, error: 'Video file size exceeds 50MB limit' },
                { status: 413 }
            )
        }

        if (error.message === 'Invalid file type') {
            return NextResponse.json(
                { success: false, error: 'Invalid file type' },
                { status: 400 }
            )
        }

        console.error('Starting section media upload error:', error)
        return NextResponse.json(
            { success: false, error: 'Upload failed' },
            { status: 500 }
        )
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await requireAuth()
        if (session instanceof NextResponse) return session

        await deleteStartingSectionMedia(session.weddingConfigId)

        return NextResponse.json({
            success: true,
            message: 'Background media deleted successfully',
        })
    } catch (error: any) {
        if (error.message === 'Starting section media not found') {
            return NextResponse.json(
                { success: false, error: 'Media not found' },
                { status: 404 }
            )
        }

        console.error('Starting section media delete error:', error)
        return NextResponse.json(
            { success: false, error: 'Delete failed' },
            { status: 500 }
        )
    }
}
