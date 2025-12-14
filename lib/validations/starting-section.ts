/**
 * Zod Validation Schemas: Starting Section
 *
 * Validation schemas for starting section content management.
 * Used for form validation and server-side data validation.
 */

import { z } from 'zod';

// File size limits
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
export const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB

// Accepted file types
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;

export const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm'] as const;

/**
 * Schema for starting section content updates
 *
 * All fields are optional to support partial updates.
 * Client can send only the fields that changed.
 */
export const startingSectionContentSchema = z.object({
  groomDisplayName: z
    .string()
    .max(100, 'Groom display name must not exceed 100 characters')
    .nullable()
    .optional(),

  brideDisplayName: z
    .string()
    .max(100, 'Bride display name must not exceed 100 characters')
    .nullable()
    .optional(),

  showParentInfo: z.boolean().optional(),

  groomFatherName: z.string().nullable().optional(),

  groomMotherName: z.string().nullable().optional(),

  brideFatherName: z.string().nullable().optional(),

  brideMotherName: z.string().nullable().optional(),

  showWeddingDate: z.boolean().optional(),
});

/**
 * Schema for starting section media upload
 *
 * Validates file type and size based on whether it's an image or video.
 */
export const startingSectionMediaSchema = z
  .object({
    file: z
      .any()
      .refine((val): val is File => {
        // Accept File instances or File-like objects (for testing)
        return val && typeof val === 'object' && 'name' in val && 'size' in val && 'type' in val;
      }, 'File is required')
      .refine((file) => {
        // Check if file type is accepted
        const allAcceptedTypes = [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES];
        return allAcceptedTypes.includes(file.type);
      }, 'File type not supported. Please upload a JPEG, PNG, WebP, GIF image or MP4, WebM video.'),

    replaceExisting: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    const file = data.file;
    const isImage = ACCEPTED_IMAGE_TYPES.includes(file.type);
    const isVideo = ACCEPTED_VIDEO_TYPES.includes(file.type);

    // Check image size
    if (isImage && file.size > MAX_IMAGE_SIZE) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['file'],
        message: `Image size exceeds the maximum limit of 10 MB`,
      });
    }

    // Check video size
    if (isVideo && file.size > MAX_VIDEO_SIZE) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['file'],
        message: `Video size exceeds the maximum limit of 50 MB`,
      });
    }
  });

export type StartingSectionContentInput = z.infer<typeof startingSectionContentSchema>;
export type StartingSectionMediaInput = z.infer<typeof startingSectionMediaSchema>;
