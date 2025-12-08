/**
 * Zod Validation Schemas: FAQ Section
 *
 * Validation schemas for FAQ section content management.
 * Used for form validation and server-side data validation.
 */

import { z } from 'zod'

/**
 * Schema for FAQ item creation and updates
 *
 * All fields are optional to support partial updates.
 * Client can send only the fields that changed.
 */
export const faqItemSchema = z.object({
  question: z
    .string()
    .min(1, 'Question is required')
    .max(500, 'Question must not exceed 500 characters')
    .optional(),

  answer: z
    .string()
    .min(1, 'Answer is required')
    .max(2000, 'Answer must not exceed 2000 characters')
    .optional(),

  order: z.number().int().positive('Order must be a positive integer').optional(),
})

/**
 * Schema for creating a new FAQ item (all fields required)
 */
export const createFaqItemSchema = z.object({
  question: z
    .string()
    .min(1, 'Question is required')
    .max(500, 'Question must not exceed 500 characters'),

  answer: z
    .string()
    .min(1, 'Answer is required')
    .max(2000, 'Answer must not exceed 2000 characters'),

  order: z.number().int().positive('Order must be a positive integer'),
})

export const faqItemsArraySchema = faqItemSchema.array()

export type CreateFaqItemInput = z.infer<typeof createFaqItemSchema>
