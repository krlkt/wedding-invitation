/**
 * Shared Type Definitions for Admin Dashboard
 *
 * Only types that are used across multiple files should be here.
 * Single-use types should live in the same file as their usage.
 */

import type { WeddingConfiguration } from '@/db/schema/weddings'

// Wedding configuration with properly typed features
// Used by: useWeddingDashboardData, FeaturesForm
export interface WeddingConfigWithFeatures extends WeddingConfiguration {
  features: Record<string, boolean>
}

// Refetch actions structure
// Used by: useWeddingDashboardData (defines it), useContentHandlers (uses it)
export interface RefetchActions {
  all: () => Promise<void>
  config: () => Promise<void>
  startingSection: () => Promise<void>
  groomSection: () => Promise<void>
  brideSection: () => Promise<void>
  faqs: () => Promise<void>
}

// Hook return type for useContentHandlers
// Used by: useContentHandlers (defines it), FeaturesForm (uses it)
export type { UseContentHandlersReturn } from '@/hooks/useContentHandlers'

// Hook return type for usePhotoUploadHandlers
// Used by: usePhotoUploadHandlers (defines it), FeaturesForm (uses it)
export type { UsePhotoUploadHandlersReturn } from '@/hooks/usePhotoUploadHandlers'
