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
