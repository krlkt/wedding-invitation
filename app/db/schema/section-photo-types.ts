/**
 * Shared Types for Section Photos
 *
 * Common photo structure used across groom and bride sections.
 * Centralized to avoid duplicate type definitions.
 */

/**
 * Photo object structure stored in JSON arrays
 * Used by both groom and bride section content
 */
export interface GroomBrideSectionPhoto {
  filename: string
  fileSize: number
  mimeType: string
  slot: number // Which slot/position (1-based)
  uploadedAt: string // ISO timestamp
}
