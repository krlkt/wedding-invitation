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
} from '@/app/db/schema'

/**
 * Feature names from database schema
 */
export type FeatureName =
    | 'love_story'
    | 'rsvp'
    | 'gallery'
    | 'prewedding_videos'
    | 'faqs'
    | 'dress_code'
    | 'instagram_link'

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
        loveStory: LoveStorySegment[]
        gallery: GalleryItem[]
        faqs: FAQItem[]
        dressCode: DressCode | null
        locations: LocationDetails[]
        bankDetails: BankDetails | null
    }
}

/**
 * Template component props
 */
export interface TemplateProps {
    data: PreviewData
}

/**
 * API response structure
 */
export interface PreviewResponse {
    data: PreviewData
}
