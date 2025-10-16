/**
 * T021: FeatureToggle Schema
 *
 * Drizzle ORM schema for wedding feature toggles.
 * Allows users to enable/disable optional features like love story, gallery, etc.
 */

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { createId } from '@paralleldrive/cuid2'
import { weddingConfigurations } from './weddings'

// Feature names enum - single source of truth
export const FEATURE_NAMES = [
  'hero',
  'groom_and_bride',
  'save_the_date',
  'location',
  'gift',
  'love_story',
  'rsvp',
  'gallery',
  'prewedding_videos',
  'faqs',
  'dress_code',
  'wishes',
  'footer',
] as const

// TypeScript type derived from the enum
export type FeatureName = (typeof FEATURE_NAMES)[number]

export const featureToggles = sqliteTable('feature_toggles', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  weddingConfigId: text('wedding_config_id')
    .notNull()
    .references(() => weddingConfigurations.id, { onDelete: 'cascade' }),
  featureName: text('feature_name', {
    enum: FEATURE_NAMES,
  }).notNull(),
  isEnabled: integer('is_enabled', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$onUpdateFn(() => new Date())
    .notNull(),
})

// TypeScript types inferred from schema
export type FeatureToggle = typeof featureToggles.$inferSelect
export type NewFeatureToggle = typeof featureToggles.$inferInsert
