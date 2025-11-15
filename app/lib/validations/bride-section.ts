/**
 * Zod Validation Schemas: Bride Section
 *
 * Validation schemas for bride section content management.
 * Used for form validation and server-side data validation.
 */

import { z } from 'zod'

// File size limits
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10 MB

// Accepted file types
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
] as const

/**
 * Schema for individual photo object in JSON array
 */
export const sectionPhotoObjectSchema = z.object({
  filename: z.string(),
  fileSize: z.number().positive(),
  mimeType: z.enum(ACCEPTED_IMAGE_TYPES),
  slot: z.number().int().positive(),
  uploadedAt: z.string().datetime(),
})

/**
 * Schema for bride section content updates
 *
 * All fields are optional to support partial updates.
 * Client can send only the fields that changed.
 */
export const brideSectionContentSchema = z.object({
  brideDisplayName: z
    .string()
    .max(100, 'Bride display name must not exceed 100 characters')
    .nullable()
    .optional(),

  showParentInfo: z.boolean().optional(),

  fatherName: z.string().nullable().optional(),

  motherName: z.string().nullable().optional(),

  showInstagramLink: z.boolean().optional(),

  brideInstagramLink: z
    .string()
    .refine(
      (val) => {
        if (!val) return true // Optional field
        return /^https?:\/\/(www\.)?instagram\.com\/.+/.test(val)
      },
      { message: 'Must be a valid Instagram URL' }
    )
    .nullable()
    .optional(),

  photos: z.array(sectionPhotoObjectSchema).optional(),
})

/**
 * Schema for bride section photo upload
 *
 * Validates file type and size for image uploads.
 * No longer limited to specific slots - templates decide how many photos they need.
 */
export const brideSectionPhotoSchema = z.object({
  file: z
    .any()
    .refine((val): val is File => {
      // Accept File instances or File-like objects (for testing)
      return val && typeof val === 'object' && 'name' in val && 'size' in val && 'type' in val
    }, 'File is required')
    .refine((file) => {
      // Check if file type is accepted
      return ACCEPTED_IMAGE_TYPES.includes(file.type)
    }, 'File type not supported. Please upload a JPEG, PNG, WebP, or GIF image.')
    .refine(
      (file) => {
        // Check file size
        return file.size <= MAX_IMAGE_SIZE
      },
      {
        message: 'Image size exceeds the maximum limit of 10 MB',
      }
    ),

  photoSlot: z.number().int().positive(), // Now a number, not enum

  replaceExisting: z.boolean().optional(),
})

export type BrideSectionContentInput = z.infer<typeof brideSectionContentSchema>
export type BrideSectionPhotoInput = z.infer<typeof brideSectionPhotoSchema>
