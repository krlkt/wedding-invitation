/**
 * T029: Groom Section Content Schema
 *
 * Drizzle ORM schema for groom section content management.
 * One-to-one relationship with WeddingConfiguration.
 * Supports groom personal information and photo gallery.
 */

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { createId } from '@paralleldrive/cuid2'
import { weddingConfigurations } from './weddings'
import { GroomBrideSectionPhoto } from './section-photo-types'

export const groomSectionContent = sqliteTable('groom_section_content', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  weddingConfigId: text('wedding_config_id')
    .notNull()
    .references(() => weddingConfigurations.id, { onDelete: 'cascade' })
    .unique(), // One-to-one relationship

  // Display Name (can override basic info groomName)
  groomDisplayName: text('groom_display_name'),

  // Parent Information
  showParentInfo: integer('show_parent_info', { mode: 'boolean' }).notNull().default(false),
  fatherName: text('father_name'),
  motherName: text('mother_name'),

  // Instagram link
  showInstagramLink: integer('show_instagram_link', { mode: 'boolean' }).notNull().default(false),
  groomInstagramLink: text('groom_instagram_link'),

  // Photo Gallery (flexible count for different templates)
  // JSON array of photo objects: [{filename, fileSize, mimeType, slot, uploadedAt}]
  photos: text('photos').default('[]'),

  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$onUpdateFn(() => new Date())
    .notNull(),
})

// TypeScript types inferred from schema
export type GroomSectionContent = typeof groomSectionContent.$inferSelect
export type NewGroomSectionContent = typeof groomSectionContent.$inferInsert

// Helper type with parsed photos
export type GroomSectionContentWithPhotos = Omit<GroomSectionContent, 'photos'> & {
  photos: GroomBrideSectionPhoto[]
}
