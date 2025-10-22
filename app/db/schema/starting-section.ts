/**
 * T028: Starting Section Content Schema
 *
 * Drizzle ORM schema for starting section (hero) content management.
 * One-to-one relationship with WeddingConfiguration.
 * Feature 009: Starting Section Content Management
 */

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { createId } from '@paralleldrive/cuid2'
import { weddingConfigurations } from './weddings'

export const startingSectionContent = sqliteTable('starting_section_content', {
    id: text('id')
        .$defaultFn(() => createId())
        .primaryKey(),
    weddingConfigId: text('wedding_config_id')
        .notNull()
        .references(() => weddingConfigurations.id, { onDelete: 'cascade' })
        .unique(), // One-to-one relationship

    // Display Names (can override basic info groomName/brideName)
    groomDisplayName: text('groom_display_name'),
    brideDisplayName: text('bride_display_name'),

    // Parent Information
    showParentInfo: integer('show_parent_info', { mode: 'boolean' }).notNull().default(false),
    groomFatherName: text('groom_father_name'),
    groomMotherName: text('groom_mother_name'),
    brideFatherName: text('bride_father_name'),
    brideMotherName: text('bride_mother_name'),

    // Wedding Date Display
    showWeddingDate: integer('show_wedding_date', { mode: 'boolean' }).notNull().default(true),

    // Background Media
    backgroundType: text('background_type', { enum: ['image', 'video'] }),
    backgroundFilename: text('background_filename'),
    backgroundOriginalName: text('background_original_name'),
    backgroundFileSize: integer('background_file_size'),
    backgroundMimeType: text('background_mime_type'),

    // Timestamps
    createdAt: integer('created_at', { mode: 'timestamp' })
        .$defaultFn(() => new Date())
        .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
        .$onUpdateFn(() => new Date())
        .notNull(),
})

// TypeScript types inferred from schema
export type StartingSectionContent = typeof startingSectionContent.$inferSelect
export type NewStartingSectionContent = typeof startingSectionContent.$inferInsert
