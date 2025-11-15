/**
 * Reusable Field Validation Utilities
 *
 * Central utilities for real-time field validation and visual feedback.
 * Uses Zod schemas for validation to maintain DRY principle.
 */

import { type ZodType } from 'zod'

/**
 * Field state for validation and change tracking
 */
export type FieldState = 'pristine' | 'changed' | 'error'

/**
 * Get CSS classes for field highlighting based on state
 * - pristine: no highlighting
 * - changed: red border to indicate unsaved changes
 * - error: red border with error background
 */
export function getFieldHighlightClasses(state: FieldState, hasError: boolean = false): string {
  if (hasError || state === 'error') {
    return 'bg-red-50 p-2 ring-2 ring-red-500'
  }

  if (state === 'changed') {
    return 'p-2 ring-2 ring-yellow-400 bg-yellow-50'
  }

  return ''
}

/**
 * Get container classes with transition for smooth visual feedback
 */
export function getFieldContainerClasses(state: FieldState, hasError: boolean = false): string {
  const baseClasses = 'space-y-2 rounded-lg transition-all'
  const highlightClasses = getFieldHighlightClasses(state, hasError)

  return `${baseClasses} ${highlightClasses}`.trim()
}

/**
 * Validate a single field using a Zod schema
 * Returns validation result with error message
 *
 * @param value - The value to validate
 * @param schema - The Zod schema to validate against
 * @returns Validation result with error message if invalid
 */
export function validateField<T>(
  value: T,
  schema: ZodType<T>
): {
  valid: boolean
  error?: string
} {
  const result = schema.safeParse(value)

  if (result.success) {
    return { valid: true }
  }

  // Get the first error message
  const firstError = result.error.issues[0]
  return {
    valid: false,
    error: firstError?.message ?? 'Invalid value',
  }
}

/**
 * Determine field state based on current value, saved value, and validation
 */
export function getFieldState(
  currentValue: any,
  savedValue: any,
  hasError: boolean = false
): FieldState {
  if (hasError) {
    return 'error'
  }

  // Normalize null/undefined/empty for comparison
  const normalizedCurrent = currentValue ?? null
  const normalizedSaved = savedValue ?? null

  if (normalizedCurrent !== normalizedSaved) {
    return 'changed'
  }

  return 'pristine'
}
