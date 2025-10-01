/**
 * T034: Wedding Configuration Service
 *
 * Service layer for wedding configuration management.
 * Handles CRUD operations for wedding configs, features, and publishing.
 */

import { db } from './database'
import {
  weddingConfigurations,
  featureToggles,
  type NewWeddingConfiguration,
  type WeddingConfiguration,
  type FeatureToggle,
} from '@/db/schema'
import { eq, and } from 'drizzle-orm'

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
 * Create wedding configuration for a new user
 */
export async function createWeddingConfiguration(
  userId: string,
  groomName: string,
  brideName: string
): Promise<WeddingConfiguration> {
  // Generate unique subdomain
  const subdomain = generateSubdomain(groomName, brideName)

  // Create wedding configuration
  const newConfig: NewWeddingConfiguration = {
    userId,
    subdomain,
    groomName,
    brideName,
    weddingDate: new Date(), // Default to today, user will update
    isPublished: false,
  }

  const [config] = await db.insert(weddingConfigurations).values(newConfig).returning()

  // Create default feature toggles (all enabled by default)
  const defaultFeatures = [
    'love_story',
    'rsvp',
    'gallery',
    'prewedding_videos',
    'faqs',
    'dress_code',
    'instagram_link',
  ] as const

  await db.insert(featureToggles).values(
    defaultFeatures.map((featureName) => ({
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
export async function getWeddingConfigByUserId(userId: string): Promise<WeddingConfiguration | null> {
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
export async function getWeddingConfigBySubdomain(subdomain: string): Promise<WeddingConfiguration | null> {
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
  return db
    .select()
    .from(featureToggles)
    .where(eq(featureToggles.weddingConfigId, weddingConfigId))
}

/**
 * Toggle a feature on/off
 */
export async function toggleFeature(
  weddingConfigId: string,
  featureName: string,
  isEnabled: boolean
): Promise<FeatureToggle> {
  // Check if feature toggle exists
  const [existing] = await db
    .select()
    .from(featureToggles)
    .where(
      and(
        eq(featureToggles.weddingConfigId, weddingConfigId),
        eq(featureToggles.featureName, featureName as any)
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
  } else {
    // Create new toggle
    const [created] = await db
      .insert(featureToggles)
      .values({
        weddingConfigId,
        featureName: featureName as any,
        isEnabled,
      })
      .returning()

    return created
  }
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