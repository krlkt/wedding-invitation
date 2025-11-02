/**
 * T035: File Upload Service
 *
 * Service layer for file upload management with Vercel Blob storage.
 * Handles gallery photos, dress code photos, and monogram uploads.
 */

import { put, del } from '@vercel/blob'
import { eq } from 'drizzle-orm'

import {
  galleryItems,
  dressCodes,
  weddingConfigurations,
  startingSectionContent,
  type NewGalleryItem,
} from '@/app/db/schema'

import { db } from './database'
import {
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_VIDEO_TYPES,
} from '@/app/lib/validations/starting-section'

// File validation constants
const MAX_FILE_SIZE = 4 * 1024 * 1024 // 4MB in bytes
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']

/**
 * Validate uploaded file
 */
function validateFile(file: File): void {
  if (!file) {
    throw new Error('No file provided')
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 4MB limit')
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error('Invalid file type')
  }
}

/**
 * Generate unique filename with timestamp
 */
function generateFilename(originalName: string, prefix: string = 'upload'): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split('.').pop()
  return `${prefix}-${timestamp}-${random}.${extension}`
}

/**
 * Upload gallery photo
 */
export async function uploadGalleryPhoto(
  weddingConfigId: string,
  file: File,
  alt?: string,
  order?: number
): Promise<{ id: string; filename: string; photoUrl: string }> {
  validateFile(file)

  // Upload to Vercel Blob
  const filename = generateFilename(file.name, 'gallery')
  const blob = await put(filename, file, {
    access: 'public',
    addRandomSuffix: false,
  })

  // Determine order if not provided
  if (order === undefined) {
    const existingPhotos = await db
      .select()
      .from(galleryItems)
      .where(eq(galleryItems.weddingConfigId, weddingConfigId))

    order = existingPhotos.length + 1
  }

  // Save to database
  const newItem: NewGalleryItem = {
    weddingConfigId,
    filename,
    originalName: file.name,
    fileSize: file.size,
    mimeType: file.type,
    order,
    alt,
  }

  const [item] = await db.insert(galleryItems).values(newItem).returning()

  return {
    id: item.id,
    filename: item.filename,
    photoUrl: blob.url,
  }
}

/**
 * Get all gallery photos for wedding
 */
export async function getGalleryPhotos(weddingConfigId: string) {
  return db
    .select()
    .from(galleryItems)
    .where(eq(galleryItems.weddingConfigId, weddingConfigId))
    .orderBy(galleryItems.order)
}

/**
 * Update gallery photo metadata
 */
export async function updateGalleryPhoto(
  photoId: string,
  updates: { order?: number; alt?: string }
) {
  const [updated] = await db
    .update(galleryItems)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(galleryItems.id, photoId))
    .returning()

  return updated
}

/**
 * Delete gallery photo
 */
export async function deleteGalleryPhoto(photoId: string): Promise<void> {
  // Get photo details
  const [photo] = await db.select().from(galleryItems).where(eq(galleryItems.id, photoId)).limit(1)

  if (!photo) {
    throw new Error('Photo not found')
  }

  // Delete from Vercel Blob
  try {
    await del(photo.filename)
  } catch (error) {
    console.error('Failed to delete blob:', error)
    // Continue with database deletion even if blob deletion fails
  }

  // Delete from database
  await db.delete(galleryItems).where(eq(galleryItems.id, photoId))
}

/**
 * Upload dress code photo
 */
export async function uploadDressCodePhoto(
  weddingConfigId: string,
  file: File
): Promise<{ photoFilename: string; photoUrl: string }> {
  validateFile(file)

  // Upload to Vercel Blob
  const filename = generateFilename(file.name, 'dresscode')
  const blob = await put(filename, file, {
    access: 'public',
    addRandomSuffix: false,
  })

  // Get existing dress code record
  const [existing] = await db
    .select()
    .from(dressCodes)
    .where(eq(dressCodes.weddingConfigId, weddingConfigId))
    .limit(1)

  if (existing) {
    // Delete old photo if exists
    if (existing.photoFilename) {
      try {
        await del(existing.photoFilename)
      } catch (error) {
        console.error('Failed to delete old blob:', error)
      }
    }

    // Update existing record
    await db
      .update(dressCodes)
      .set({
        photoFilename: filename,
        photoFileSize: file.size,
        photoMimeType: file.type,
        updatedAt: new Date(),
      })
      .where(eq(dressCodes.id, existing.id))
  } else {
    // Create new record
    await db.insert(dressCodes).values({
      weddingConfigId,
      photoFilename: filename,
      photoFileSize: file.size,
      photoMimeType: file.type,
    })
  }

  return {
    photoFilename: filename,
    photoUrl: blob.url,
  }
}

/**
 * Delete dress code photo
 */
export async function deleteDressCodePhoto(weddingConfigId: string): Promise<void> {
  const [dressCode] = await db
    .select()
    .from(dressCodes)
    .where(eq(dressCodes.weddingConfigId, weddingConfigId))
    .limit(1)

  if (!dressCode?.photoFilename) {
    throw new Error('Dress code photo not found')
  }

  // Delete from Vercel Blob
  try {
    await del(dressCode.photoFilename)
  } catch (error) {
    console.error('Failed to delete blob:', error)
  }

  // Update database record
  await db
    .update(dressCodes)
    .set({
      photoFilename: null,
      photoFileSize: null,
      photoMimeType: null,
      updatedAt: new Date(),
    })
    .where(eq(dressCodes.id, dressCode.id))
}

/**
 * Upload monogram photo
 */
export async function uploadMonogramPhoto(
  weddingConfigId: string,
  file: File
): Promise<{ monogramFilename: string; photoUrl: string }> {
  validateFile(file)

  // Upload to Vercel Blob
  const filename = generateFilename(file.name, 'monogram')
  const blob = await put(filename, file, {
    access: 'public',
    addRandomSuffix: false,
  })

  // Get existing wedding config
  const [config] = await db
    .select()
    .from(weddingConfigurations)
    .where(eq(weddingConfigurations.id, weddingConfigId))
    .limit(1)

  if (!config) {
    throw new Error('Wedding configuration not found')
  }

  // Delete old monogram if exists
  if (config.monogramFilename) {
    try {
      await del(config.monogramFilename)
    } catch (error) {
      console.error('Failed to delete old monogram:', error)
    }
  }

  // Update wedding configuration with full URL
  await db
    .update(weddingConfigurations)
    .set({
      monogramFilename: blob.url, // Store full URL instead of filename
      monogramFileSize: file.size,
      monogramMimeType: file.type,
      updatedAt: new Date(),
    })
    .where(eq(weddingConfigurations.id, weddingConfigId))

  return {
    monogramFilename: blob.url, // Return full URL
    photoUrl: blob.url,
  }
}

/**
 * Delete monogram photo
 */
export async function deleteMonogramPhoto(weddingConfigId: string): Promise<void> {
  const [config] = await db
    .select()
    .from(weddingConfigurations)
    .where(eq(weddingConfigurations.id, weddingConfigId))
    .limit(1)

  if (!config?.monogramFilename) {
    throw new Error('Monogram photo not found')
  }

  // Delete from Vercel Blob
  try {
    await del(config.monogramFilename)
  } catch (error) {
    console.error('Failed to delete blob:', error)
  }

  // Update wedding configuration
  await db
    .update(weddingConfigurations)
    .set({
      monogramFilename: null,
      monogramFileSize: null,
      monogramMimeType: null,
      updatedAt: new Date(),
    })
    .where(eq(weddingConfigurations.id, weddingConfigId))
}

/**
 * Validate starting section media file (image or video)
 */
function validateStartingSectionMedia(file: File): void {
  if (!file) {
    throw new Error('No file provided')
  }

  const allAcceptedTypes = [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES]
  if (!allAcceptedTypes.includes(file.type as any)) {
    throw new Error('Invalid file type')
  }

  // Check size based on type
  if (ACCEPTED_IMAGE_TYPES.includes(file.type as any)) {
    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error('Image file size exceeds 10MB limit')
    }
  } else if (ACCEPTED_VIDEO_TYPES.includes(file.type as any)) {
    if (file.size > MAX_VIDEO_SIZE) {
      throw new Error('Video file size exceeds 50MB limit')
    }
  }
}

/**
 * Upload starting section background media (image or video)
 */
export async function uploadStartingSectionMedia(
  weddingConfigId: string,
  file: File
): Promise<{ backgroundFilename: string; mediaUrl: string; mediaType: 'image' | 'video' }> {
  validateStartingSectionMedia(file)

  // Determine media type
  const mediaType = ACCEPTED_IMAGE_TYPES.includes(file.type as any) ? 'image' : 'video'

  // Upload to Vercel Blob
  const filename = generateFilename(file.name, `starting-section-${mediaType}`)
  const blob = await put(filename, file, {
    access: 'public',
    addRandomSuffix: false,
  })

  // Get existing starting section content
  const [existing] = await db
    .select()
    .from(startingSectionContent)
    .where(eq(startingSectionContent.weddingConfigId, weddingConfigId))
    .limit(1)

  if (existing) {
    // Delete old media if exists
    if (existing.backgroundFilename) {
      try {
        // Vercel Blob del() accepts both URLs and filenames
        await del(existing.backgroundFilename)
      } catch (error) {
        console.error('Failed to delete old blob:', error)
      }
    }

    // Update existing record with full URL
    await db
      .update(startingSectionContent)
      .set({
        backgroundType: mediaType,
        backgroundFilename: blob.url, // Store full URL instead of filename
        backgroundOriginalName: file.name, // Store original filename
        backgroundFileSize: file.size,
        backgroundMimeType: file.type,
        updatedAt: new Date(),
      })
      .where(eq(startingSectionContent.id, existing.id))
  } else {
    // Create new record with full URL
    await db.insert(startingSectionContent).values({
      weddingConfigId,
      backgroundType: mediaType,
      backgroundFilename: blob.url, // Store full URL instead of filename
      backgroundOriginalName: file.name, // Store original filename
      backgroundFileSize: file.size,
      backgroundMimeType: file.type,
    })
  }

  return {
    backgroundFilename: blob.url, // Return full URL
    mediaUrl: blob.url,
    mediaType,
  }
}

/**
 * Delete starting section background media
 */
export async function deleteStartingSectionMedia(weddingConfigId: string): Promise<void> {
  const [content] = await db
    .select()
    .from(startingSectionContent)
    .where(eq(startingSectionContent.weddingConfigId, weddingConfigId))
    .limit(1)

  if (!content?.backgroundFilename) {
    throw new Error('Starting section media not found')
  }

  // Delete from Vercel Blob
  try {
    await del(content.backgroundFilename)
  } catch (error) {
    console.error('Failed to delete blob:', error)
  }

  // Update database record
  await db
    .update(startingSectionContent)
    .set({
      backgroundType: null,
      backgroundFilename: null,
      backgroundFileSize: null,
      backgroundMimeType: null,
      updatedAt: new Date(),
    })
    .where(eq(startingSectionContent.id, content.id))
}
