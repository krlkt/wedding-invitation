/**
 * Section Photos Helper Functions
 *
 * Utilities for managing photo arrays in groom/bride section content.
 * Handles JSON parsing, manipulation, and serialization.
 */

import type { GroomBrideSectionPhoto } from '@/db/schema';

/**
 * Parse photos JSON string from database
 */
export function parsePhotos(photosJson: string | null | undefined): GroomBrideSectionPhoto[] {
  if (!photosJson) return [];

  try {
    const parsed = JSON.parse(photosJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Stringify photos array for database storage
 */
export function stringifyPhotos(photos: GroomBrideSectionPhoto[]): string {
  return JSON.stringify(photos);
}

/**
 * Add or replace a photo in the array
 */
export function upsertPhoto(
  photos: GroomBrideSectionPhoto[],
  newPhoto: GroomBrideSectionPhoto
): GroomBrideSectionPhoto[] {
  const existingIndex = photos.findIndex((p) => p.slot === newPhoto.slot);

  if (existingIndex >= 0) {
    // Replace existing photo at this slot
    const updated = [...photos];
    updated[existingIndex] = newPhoto;
    return updated;
  }

  // Add new photo
  return [...photos, newPhoto].sort((a, b) => a.slot - b.slot);
}

/**
 * Remove a photo by slot number
 */
export function removePhoto(
  photos: GroomBrideSectionPhoto[],
  slot: number
): GroomBrideSectionPhoto[] {
  return photos.filter((p) => p.slot !== slot);
}

/**
 * Get a specific photo by slot number
 */
export function getPhotoBySlot(
  photos: GroomBrideSectionPhoto[],
  slot: number
): GroomBrideSectionPhoto | null {
  return photos.find((p) => p.slot === slot) ?? null;
}

/**
 * Reorder photos (update slot numbers)
 * @param photos - Current photos array
 * @param newOrder - Array of slot numbers in desired order (e.g., [3, 1, 2])
 */
export function reorderPhotos(
  photos: GroomBrideSectionPhoto[],
  newOrder: number[]
): GroomBrideSectionPhoto[] {
  // Create a map of old slot -> photo
  const photoMap = new Map(photos.map((p) => [p.slot, p]));

  // Build new array with updated slot numbers
  return newOrder.map((oldSlot, index) => {
    const photo = photoMap.get(oldSlot);
    if (!photo) {
      throw new Error(`Photo with slot ${oldSlot} not found`);
    }
    return {
      ...photo,
      slot: index + 1, // New slot is position in array (1-based)
    };
  });
}

/**
 * Get photos sorted by slot number
 */
export function getSortedPhotos(photos: GroomBrideSectionPhoto[]): GroomBrideSectionPhoto[] {
  return [...photos].sort((a, b) => a.slot - b.slot);
}

/**
 * Validate that photo array meets template requirements
 */
export function validatePhotoCount(
  photos: GroomBrideSectionPhoto[],
  min: number,
  max: number
): { valid: boolean; error?: string } {
  const count = photos.length;

  if (count < min) {
    return {
      valid: false,
      error: `Minimum ${min} photo${min > 1 ? 's' : ''} required (currently ${count})`,
    };
  }

  if (count > max) {
    return {
      valid: false,
      error: `Maximum ${max} photo${max > 1 ? 's' : ''} allowed (currently ${count})`,
    };
  }

  return { valid: true };
}
