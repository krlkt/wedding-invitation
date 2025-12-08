/**
 * Preview-Specific Types
 *
 * Minimal types for live preview feature.
 * Uses Drizzle ORM schema types directly, only defines preview-specific structures.
 */

import {
  WeddingConfiguration,
  LoveStorySegment,
  GalleryItem,
  FAQItem,
  DressCode,
  LocationDetails,
  BankDetails,
  Wish,
  StartingSectionContent,
  GroomSectionContent,
  BrideSectionContent,
} from '@/db/schema'
import type { FeatureName } from '@/db/schema/features'

/**
 * Template identifier for future multi-template support
 */
export type TemplateId = 'template-1'

/**
 * Consolidated preview data structure
 * Combines wedding config, feature toggles, and content
 */
export interface PreviewData {
  config: WeddingConfiguration
  features: Record<FeatureName, boolean>
  content: {
    startingSection: StartingSectionContent | null
    groomSection: GroomSectionContent | null
    brideSection: BrideSectionContent | null
    loveStory: LoveStorySegment[]
    gallery: GalleryItem[]
    faqs: Partial<FAQItem>[]
    dressCode: DressCode | null
    locations: LocationDetails[]
    bankDetails: BankDetails | null
    wishes: Wish[]
  }
}

/**
 * Template component props
 */
export interface TemplateProps {
  data: PreviewData
  mode?: 'fullscreen' | 'embedded' // fullscreen shows desktop filler, embedded shows only mobile view
  scrollContainerRef?: React.RefObject<HTMLElement> // For embedded mode scroll animations
}

/**
 * API response structure
 */
export interface PreviewResponse {
  data: PreviewData
}
