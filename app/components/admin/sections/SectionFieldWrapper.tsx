/**
 * Validated Field Component
 *
 * Reusable component for form fields with real-time validation and visual feedback.
 * Handles field state (pristine/changed/error) and displays validation errors.
 *
 * Features:
 * - Automatic yellow highlight for unsaved changes
 * - Automatic red highlight for validation errors
 * - Optional real-time Zod validation
 * - Consistent styling across all forms
 */

import { ReactNode } from 'react'
import { type ZodType } from 'zod'
import {
  getFieldContainerClasses,
  getFieldState,
  validateField,
} from '@/app/utils/field-validation'

interface SectionFieldWrapperProps {
  /**
   * Current value of the field
   */
  value: any

  /**
   * Saved value from database (for change tracking)
   */
  savedValue: any

  /**
   * Optional Zod schema for real-time validation
   * If provided, will validate the field and show error messages
   */
  validationSchema?: ZodType<any>

  /**
   * Children to render (typically Input, Textarea, etc.)
   */
  children: ReactNode

  /**
   * Optional custom error message to override Zod validation
   */
  customError?: string
}

/**
 * SectionFieldWrapper component wraps form fields with automatic validation and state styling
 *
 * @example
 * // Basic usage with validation
 * <SectionFieldWrapper
 *   value={groomInstagramLink}
 *   savedValue={groomSectionContent?.groomInstagramLink}
 *   validationSchema={groomSectionContentSchema.shape.groomInstagramLink}
 * >
 *   <Label htmlFor="groomInstagramLink">Instagram Link</Label>
 *   <Input {...register('groomInstagramLink')} />
 * </SectionFieldWrapper>
 *
 * @example
 * // Without validation (just change tracking)
 * <SectionFieldWrapper
 *   value={groomDisplayName}
 *   savedValue={groomSectionContent?.groomDisplayName}
 * >
 *   <Label htmlFor="groomDisplayName">Display Name</Label>
 *   <Input {...register('groomDisplayName')} />
 * </SectionFieldWrapper>
 */
export function SectionFieldWrapper({
  value,
  savedValue,
  validationSchema,
  children,
  customError,
}: SectionFieldWrapperProps) {
  // Perform validation if schema is provided
  const validation = validationSchema ? validateField(value, validationSchema) : { valid: true }

  // Use custom error if provided, otherwise use validation error
  const hasError = customError ? true : !validation.valid
  const errorMessage = customError || validation.error

  // Determine field state and get appropriate classes
  const fieldState = getFieldState(value, savedValue, hasError)
  const containerClasses = getFieldContainerClasses(fieldState, hasError)

  return (
    <div className={containerClasses}>
      {children}
      {hasError && errorMessage && (
        <p className="text-sm font-medium text-red-600">{errorMessage}</p>
      )}
    </div>
  )
}
