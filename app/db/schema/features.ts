/**
 * T021: FeatureToggle Schema
 *
 * Drizzle ORM schema for wedding feature toggles.
 * Allows users to enable/disable optional features like love story, gallery, etc.
 */

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { createId } from '@paralleldrive/cuid2'
import { weddingConfigurations } from './weddings'

export const featureToggles = sqliteTable('feature_toggles', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  weddingConfigId: text('wedding_config_id')
    .notNull()
    .references(() => weddingConfigurations.id, { onDelete: 'cascade' }),
  featureName: text('feature_name', {
    enum: [
      'love_story',
      'rsvp',
      'gallery',
      'prewedding_videos',
      'faqs',
      'dress_code',
      'instagram_link',
    ],
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
