/**
 * T020: WeddingConfiguration Schema
 *
 * Drizzle ORM schema for wedding configuration and settings.
 * Core multi-tenant entity with one-to-one relationship to UserAccount.
 */

import { createId } from '@paralleldrive/cuid2'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

import { userAccounts } from './users'

export const weddingConfigurations = sqliteTable('wedding_configurations', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userAccounts.id, { onDelete: 'cascade' })
    .unique(), // One wedding config per user
  subdomain: text('subdomain').notNull().unique(),
  groomName: text('groom_name').notNull(),
  brideName: text('bride_name').notNull(),
  weddingDate: integer('wedding_date', { mode: 'timestamp' }).notNull(),

  // Monogram file upload fields (similar to dress code photo)
  monogramFilename: text('monogram_filename'),
  monogramFileSize: integer('monogram_file_size'),
  monogramMimeType: text('monogram_mime_type'),

  groomFather: text('groom_father'),
  groomMother: text('groom_mother'),
  brideFather: text('bride_father'),
  brideMother: text('bride_mother'),

  // Social Media Links
  groomsInstagramLink: text('grooms_instagram_link'),
  brideInstagramLink: text('bride_instagram_link'),

  // Content Fields
  footerText: text('footer_text'),

  // DEPRECATED: Use groomsInstagramLink and brideInstagramLink instead
  instagramLink: text('instagram_link'),

  isPublished: integer('is_published', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$onUpdateFn(() => new Date())
    .notNull(),
})

// TypeScript types inferred from schema
export type WeddingConfiguration = typeof weddingConfigurations.$inferSelect
export type NewWeddingConfiguration = typeof weddingConfigurations.$inferInsert
