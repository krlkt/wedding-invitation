/**
 * Validated Field Component (Optimized)
 *
 * Optimized reusable component for form fields with real-time validation and visual feedback.
 * Uses memoization to prevent unnecessary re-renders and centralized change tracking for performance.
 *
 * Features:
 * - Automatic yellow highlight for unsaved changes
 * - Automatic red highlight for validation errors
 * - Optional real-time Zod validation (memoized)
 * - Consistent styling across all forms
 * - Optimized with React.memo to only re-render when props actually change
 *
 * Performance optimization:
 * - Uses centralized change tracking (passed via isChanged prop)
 * - Memoizes validation results to avoid recalculation
 * - Only re-renders when isChanged, value, or validationSchema changes
 */

import { ReactNode, useMemo, memo } from 'react'
import { type ZodType } from 'zod'
import { getFieldContainerClasses, validateField } from '@/lib/field-validation'

interface SectionFieldWrapperProps {
  /**
   * Whether the field has changed from saved value
   * Should come from centralized change tracking in parent form
   */
  isChanged: boolean

  /**
   * Current value of the field (for validation)
   */
  value: any

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
 * // Optimized usage with centralized change tracking
 * <SectionFieldWrapper
 *   isChanged={changedFields.has('groomInstagramLink')}
 *   value={formValues.groomInstagramLink}
 *   validationSchema={groomSectionContentSchema.shape.groomInstagramLink}
 * >
 *   <Label htmlFor="groomInstagramLink">Instagram Link</Label>
 *   <Input {...register('groomInstagramLink')} />
 * </SectionFieldWrapper>
 */
export const SectionFieldWrapper = memo(
  ({ isChanged, value, validationSchema, children, customError }: SectionFieldWrapperProps) => {
    // Memoized validation - only runs when value or schema changes
    const validation = useMemo(
      () => (validationSchema ? validateField(value, validationSchema) : { valid: true }),
      [value, validationSchema]
    )

    // Use custom error if provided, otherwise use validation error
    const hasError = customError ? true : !validation.valid
    const errorMessage = customError ?? validation.error

    // Determine field state based on isChanged (from parent) and error state
    let fieldState: 'error' | 'changed' | 'pristine'

    if (hasError) {
      fieldState = 'error'
    } else if (isChanged) {
      fieldState = 'changed'
    } else {
      fieldState = 'pristine'
    }

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
)

SectionFieldWrapper.displayName = 'SectionFieldWrapper'
