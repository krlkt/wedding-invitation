/**
 * Zod Validation Schemas: Love Story Section
 *
 * Validation schemas for love story segment content management.
 * Used for form validation and server-side data validation.
 */

import { z } from 'zod';

// Available icon types (must match Timeline component icons)
export const ICON_TYPES = [
  'meet',
  'bus',
  'couple',
  'cat',
  'ring',
  'calendar',
  'knot',
  'branch',
  'flower_with_branch',
  'gift',
  'invitation',
  'wish',
  'dinner',
  'table',
  'music',
  'navigation',
  'check',
] as const;

export type IconType = (typeof ICON_TYPES)[number];

/**
 * Schema for love story segment updates
 *
 * All fields are optional to support partial updates.
 */
export const loveStorySegmentSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must not exceed 100 characters')
    .optional(),

  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must not exceed 500 characters')
    .optional(),

  date: z
    .string()
    .min(1, 'Date is required')
    .max(50, 'Date must not exceed 50 characters')
    .optional(),

  iconType: z.enum(ICON_TYPES).optional(),

  order: z.number().int().positive('Order must be a positive integer').optional(),
});

/**
 * Schema for creating a new love story segment (all fields required)
 */
export const createLoveStorySegmentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must not exceed 100 characters'),

  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must not exceed 500 characters'),

  date: z.string().min(1, 'Date is required').max(50, 'Date must not exceed 50 characters'),

  iconType: z.enum(ICON_TYPES),

  order: z.number().int().positive('Order must be a positive integer'),
});

export type CreateLoveStorySegmentInput = z.infer<typeof createLoveStorySegmentSchema>;
