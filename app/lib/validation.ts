/**
 * T060: Input Validation Schemas
 *
 * Centralized validation utilities for API request validation.
 * Uses simple validation functions to ensure data integrity.
 */

/**
 * Validate email format
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email) {
    return { valid: false, error: 'Email is required' }
  }

  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' }
  }

  return { valid: true }
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password) {
    return { valid: false, error: 'Password is required' }
  }

  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' }
  }

  return { valid: true }
}

/**
 * Validate URL format
 */
export function validateUrl(url: string): { valid: boolean; error?: string } {
  try {
    new URL(url)
    return { valid: true }
  } catch {
    return { valid: false, error: 'Invalid URL format' }
  }
}

/**
 * Validate Instagram link
 */
export function validateInstagramLink(link: string): { valid: boolean; error?: string } {
  if (!link) {
    return { valid: true } // Optional field
  }

  if (!link.match(/^https?:\/\/(www\.)?instagram\.com\/.+/)) {
    return { valid: false, error: 'Must be a valid Instagram URL' }
  }

  return { valid: true }
}

/**
 * Validate subdomain format
 */
export function validateSubdomain(subdomain: string): { valid: boolean; error?: string } {
  if (!subdomain) {
    return { valid: false, error: 'Subdomain is required' }
  }

  // Must be alphanumeric with hyphens, max 63 chars (DNS limit)
  if (!subdomain.match(/^[a-z0-9-]{1,63}$/)) {
    return { valid: false, error: 'Subdomain must be alphanumeric with hyphens, max 63 characters' }
  }

  // Cannot start or end with hyphen
  if (subdomain.startsWith('-') || subdomain.endsWith('-')) {
    return { valid: false, error: 'Subdomain cannot start or end with hyphen' }
  }

  return { valid: true }
}

/**
 * Validate file upload
 */
export function validateFileUpload(
  file: File,
  options: {
    maxSize?: number
    allowedMimeTypes?: string[]
  } = {}
): { valid: boolean; error?: string } {
  const maxSize = options.maxSize || 4 * 1024 * 1024 // 4MB default
  const allowedMimeTypes = options.allowedMimeTypes || ['image/jpeg', 'image/png', 'image/webp']

  if (!file) {
    return { valid: false, error: 'No file provided' }
  }

  if (file.size > maxSize) {
    return { valid: false, error: `File size exceeds ${maxSize / 1024 / 1024}MB limit` }
  }

  if (!allowedMimeTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type' }
  }

  return { valid: true }
}

/**
 * Validate required string field
 */
export function validateRequired(
  value: any,
  fieldName: string
): { valid: boolean; error?: string } {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return { valid: false, error: `${fieldName} is required` }
  }

  return { valid: true }
}

/**
 * Validate date format
 */
export function validateDate(dateString: string): { valid: boolean; error?: string } {
  if (!dateString) {
    return { valid: false, error: 'Date is required' }
  }

  const date = new Date(dateString)

  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Invalid date format' }
  }

  // Check if the date was auto-corrected by JavaScript
  // For example, '2024-02-30' becomes '2024-03-01'
  // We want to reject such dates
  if (dateString.includes('-')) {
    // For ISO format dates like '2024-02-30' or '2024-02-30T12:00:00Z'
    const datePart = dateString.split('T')[0]
    const parts = datePart.split('-')
    if (parts.length >= 3) {
      const year = parseInt(parts[0])
      const month = parseInt(parts[1])
      const day = parseInt(parts[2])

      // Use UTC methods for ISO dates with time component
      const actualYear = dateString.includes('T') ? date.getUTCFullYear() : date.getFullYear()
      const actualMonth = dateString.includes('T') ? date.getUTCMonth() + 1 : date.getMonth() + 1
      const actualDay = dateString.includes('T') ? date.getUTCDate() : date.getDate()

      if (actualYear !== year || actualMonth !== month || actualDay !== day) {
        return { valid: false, error: 'Invalid date' }
      }
    }
  }

  return { valid: true }
}
