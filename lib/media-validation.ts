/**
 * Media Validation Utilities
 *
 * Utility functions for validating media files (images and videos).
 * Provides client-side validation before upload.
 */

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm'];

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates an image file
 *
 * @param file - The file to validate
 * @returns Validation result with error message if invalid
 */
export function validateImageFile(file: File): ValidationResult {
  // Check file type
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid image type. Accepted formats: JPEG, PNG, WebP, GIF',
    };
  }

  // Check file size
  if (file.size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      error: `Image file size exceeds the maximum limit of 10 MB`,
    };
  }

  return { valid: true };
}

/**
 * Validates a video file
 *
 * @param file - The file to validate
 * @returns Validation result with error message if invalid
 */
export function validateVideoFile(file: File): ValidationResult {
  // Check file type
  if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid video type. Accepted formats: MP4, WebM',
    };
  }

  // Check file size
  if (file.size > MAX_VIDEO_SIZE) {
    return {
      valid: false,
      error: `Video file size exceeds the maximum limit of 50 MB`,
    };
  }

  return { valid: true };
}

/**
 * Determines the media type from MIME type
 *
 * @param mimeType - The MIME type to check
 * @returns 'image', 'video', or null if unsupported
 */
export function getMediaType(mimeType: string): 'image' | 'video' | null {
  const normalizedType = mimeType.toLowerCase();

  if (ACCEPTED_IMAGE_TYPES.includes(normalizedType)) {
    return 'image';
  }

  if (ACCEPTED_VIDEO_TYPES.includes(normalizedType)) {
    return 'video';
  }

  return null;
}

/**
 * Validates a media file (image or video)
 * Automatically determines type and applies appropriate validation
 *
 * @param file - The file to validate
 * @returns Validation result with error message if invalid
 */
export function validateMediaFile(file: File): ValidationResult {
  const isImage = ACCEPTED_IMAGE_TYPES.includes(file.type);
  const isVideo = ACCEPTED_VIDEO_TYPES.includes(file.type);

  if (!isImage && !isVideo) {
    return {
      valid: false,
      error:
        'Invalid file type. Please upload an image (JPEG, PNG, WebP, GIF) or video (MP4, WebM)',
    };
  }

  // Delegate to specific validator
  return isImage ? validateImageFile(file) : validateVideoFile(file);
}

/**
 * Formats file size in human-readable format
 *
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "5.0 MB", "1.5 KB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const kb = 1024;
  const mb = kb * 1024;
  const gb = mb * 1024;

  if (bytes >= gb) {
    return `${(bytes / gb).toFixed(1)} GB`;
  }

  if (bytes >= mb) {
    return `${(bytes / mb).toFixed(1)} MB`;
  }

  if (bytes >= kb) {
    return `${(bytes / kb).toFixed(1)} KB`;
  }

  return `${bytes} B`;
}
