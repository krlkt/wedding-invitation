/**
 * T034: Wedding Configuration Service
 *
 * Service layer for wedding configuration management.
 * Handles CRUD operations for wedding configs, features, and publishing.
 */

import { eq, and, asc } from 'drizzle-orm'

import {
  weddingConfigurations,
  featureToggles,
  loveStorySegments,
  locationDetails,
  galleryItems,
  faqItems,
  dressCodes,
  bankDetails,
  type NewWeddingConfiguration,
  type WeddingConfiguration,
  type FeatureToggle,
  type LoveStorySegment,
  type LocationDetails,
  type GalleryItem,
  type FAQItem,
  type DressCode,
  type BankDetails,
} from '@/app/db/schema'

import { db } from './database'

/**
 * Generate URL-safe subdomain from names
 */
function generateSubdomain(groomName: string, brideName: string): string {
  const combined = `${groomName.toLowerCase()}-${brideName.toLowerCase()}`
  // Remove special characters, keep only alphanumeric and hyphens
  const cleaned = combined
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 63) // DNS limit

  // Add random suffix to ensure uniqueness
  const randomSuffix = Math.random().toString(36).substring(2, 6)
  return `${cleaned}-${randomSuffix}`
}

/**
 * Check if subdomain is already taken
 */
export async function isSubdomainAvailable(subdomain: string): Promise<boolean> {
  const existing = await getWeddingConfigBySubdomain(subdomain)
  return !existing
}

/**
 * Create wedding configuration for a new user
 */
export async function createWeddingConfiguration(
  userId: string,
  groomName: string,
  brideName: string
): Promise<WeddingConfiguration> {
  // Try to generate unique subdomain with retry logic
  let subdomain: string
  let attempts = 0
  const maxAttempts = 5

  while (attempts < maxAttempts) {
    subdomain = generateSubdomain(groomName, brideName)
    const available = await isSubdomainAvailable(subdomain)

    if (available) {
      break
    }

    attempts++
    if (attempts >= maxAttempts) {
      throw new Error('Unable to generate unique subdomain. Please try again.')
    }
  }

  // Create wedding configuration
  const newConfig: NewWeddingConfiguration = {
    userId,
    subdomain: subdomain!,
    groomName,
    brideName,
    weddingDate: new Date(), // Default to today, user will update
    isPublished: false,
  }

  const [config] = await db.insert(weddingConfigurations).values(newConfig).returning()

  // Create default feature toggles (all enabled by default)
  // Import all features from schema for consistency
  const { FEATURE_NAMES } = await import('@/app/db/schema/features')

  await db.insert(featureToggles).values(
    FEATURE_NAMES.map((featureName) => ({
      weddingConfigId: config.id,
      featureName,
      isEnabled: true,
    }))
  )

  return config
}

/**
 * Get wedding configuration by user ID
 */
export async function getWeddingConfigByUserId(
  userId: string
): Promise<WeddingConfiguration | null> {
  const [config] = await db
    .select()
    .from(weddingConfigurations)
    .where(eq(weddingConfigurations.userId, userId))
    .limit(1)

  return config || null
}

/**
 * Get wedding configuration by subdomain
 */
export async function getWeddingConfigBySubdomain(
  subdomain: string
): Promise<WeddingConfiguration | null> {
  const [config] = await db
    .select()
    .from(weddingConfigurations)
    .where(eq(weddingConfigurations.subdomain, subdomain))
    .limit(1)

  return config || null
}

/**
 * Get wedding configuration by ID
 */
export async function getWeddingConfigById(configId: string): Promise<WeddingConfiguration | null> {
  const [config] = await db
    .select()
    .from(weddingConfigurations)
    .where(eq(weddingConfigurations.id, configId))
    .limit(1)

  return config || null
}

/**
 * Update wedding configuration
 */
export async function updateWeddingConfiguration(
  configId: string,
  updates: Partial<Omit<WeddingConfiguration, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<WeddingConfiguration> {
  const [updated] = await db
    .update(weddingConfigurations)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(weddingConfigurations.id, configId))
    .returning()

  return updated
}

/**
 * Get feature toggles for wedding configuration
 */
export async function getFeatureToggles(weddingConfigId: string): Promise<FeatureToggle[]> {
  return db.select().from(featureToggles).where(eq(featureToggles.weddingConfigId, weddingConfigId))
}

/**
 * Toggle a feature on/off
 */
export async function toggleFeature(
  weddingConfigId: string,
  featureName: string,
  isEnabled: boolean
): Promise<FeatureToggle> {
  // Import FeatureName type for validation
  type FeatureName = (typeof import('@/app/db/schema/features').FEATURE_NAMES)[number]

  // Check if feature toggle exists
  const [existing] = await db
    .select()
    .from(featureToggles)
    .where(
      and(
        eq(featureToggles.weddingConfigId, weddingConfigId),
        eq(featureToggles.featureName, featureName as FeatureName)
      )
    )
    .limit(1)

  if (existing) {
    // Update existing toggle
    const [updated] = await db
      .update(featureToggles)
      .set({
        isEnabled,
        updatedAt: new Date(),
      })
      .where(eq(featureToggles.id, existing.id))
      .returning()

    return updated
  }
  // Create new toggle
  const [created] = await db
    .insert(featureToggles)
    .values({
      weddingConfigId,
      featureName: featureName as FeatureName,
      isEnabled,
    })
    .returning()

  return created
}

/**
 * Publish wedding configuration
 */
export async function publishWeddingConfig(configId: string): Promise<WeddingConfiguration> {
  return updateWeddingConfiguration(configId, { isPublished: true })
}

/**
 * Unpublish wedding configuration
 */
export async function unpublishWeddingConfig(configId: string): Promise<WeddingConfiguration> {
  return updateWeddingConfiguration(configId, { isPublished: false })
}

/**
 * Get love story segments for a wedding
 */
export async function getLoveStorySegments(weddingConfigId: string): Promise<LoveStorySegment[]> {
  return db
    .select()
    .from(loveStorySegments)
    .where(eq(loveStorySegments.weddingConfigId, weddingConfigId))
    .orderBy(asc(loveStorySegments.order))
}

/**
 * Get location details for a wedding
 */
export async function getLocationDetails(weddingConfigId: string): Promise<LocationDetails[]> {
  return db
    .select()
    .from(locationDetails)
    .where(eq(locationDetails.weddingConfigId, weddingConfigId))
    .orderBy(asc(locationDetails.order))
}

/**
 * Get gallery items for a wedding
 */
export async function getGalleryItems(weddingConfigId: string): Promise<GalleryItem[]> {
  return db
    .select()
    .from(galleryItems)
    .where(eq(galleryItems.weddingConfigId, weddingConfigId))
    .orderBy(asc(galleryItems.order))
}

/**
 * Get FAQ items for a wedding
 */
export async function getFAQItems(weddingConfigId: string): Promise<FAQItem[]> {
  return db
    .select()
    .from(faqItems)
    .where(eq(faqItems.weddingConfigId, weddingConfigId))
    .orderBy(asc(faqItems.order))
}

/**
 * Get dress code for a wedding
 */
export async function getDressCode(weddingConfigId: string): Promise<DressCode | null> {
  const [dressCode] = await db
    .select()
    .from(dressCodes)
    .where(eq(dressCodes.weddingConfigId, weddingConfigId))
    .limit(1)

  return dressCode || null
}

/**
 * Get bank details for a wedding
 */
export async function getBankDetails(weddingConfigId: string): Promise<BankDetails | null> {
  const [details] = await db
    .select()
    .from(bankDetails)
    .where(eq(bankDetails.weddingConfigId, weddingConfigId))
    .limit(1)

  return details || null
}
