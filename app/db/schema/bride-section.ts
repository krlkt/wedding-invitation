/**
 * T030: Bride Section Content Schema
 *
 * Drizzle ORM schema for bride section content management.
 * One-to-one relationship with WeddingConfiguration.
 * Supports bride personal information and photo gallery.
 */

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { createId } from '@paralleldrive/cuid2'
import { weddingConfigurations } from './weddings'
import { GroomBrideSectionPhoto } from './section-photo-types'

export const brideSectionContent = sqliteTable('bride_section_content', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  weddingConfigId: text('wedding_config_id')
    .notNull()
    .references(() => weddingConfigurations.id, { onDelete: 'cascade' })
    .unique(), // One-to-one relationship

  // Display Name (can override basic info brideName)
  brideDisplayName: text('bride_display_name'),

  // Parent Information
  showParentInfo: integer('show_parent_info', { mode: 'boolean' }).notNull().default(false),
  fatherName: text('father_name'),
  motherName: text('mother_name'),

  // Instagram link
  brideInstagramLink: text('bride_instagram_link'),

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
export type BrideSectionContent = typeof brideSectionContent.$inferSelect
export type NewBrideSectionContent = typeof brideSectionContent.$inferInsert

// Helper type with parsed photos
export type BrideSectionContentWithPhotos = Omit<BrideSectionContent, 'photos'> & {
  photos: GroomBrideSectionPhoto[]
}
