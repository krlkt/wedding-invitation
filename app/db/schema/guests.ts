/**
 * T028-T030: Guest, RSVP, and Table Schemas
 *
 * Drizzle ORM schemas for guest management with multi-tenant support.
 * Enhanced from existing database schema with UUID primary keys and proper relationships.
 */

import { createId } from '@paralleldrive/cuid2'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

import { weddingConfigurations } from './weddings'

// T029: RSVP Schema (Enhanced)
// Note: RSVP (1) ←→ (many) Guest relationship
export const rsvps = sqliteTable('rsvps', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  weddingConfigId: text('wedding_config_id')
    .notNull()
    .references(() => weddingConfigurations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  response: text('response', { enum: ['yes', 'no', 'maybe'] })
    .notNull()
    .default('maybe'),
  attendeeCount: integer('attendee_count').notNull().default(1),
  maxGuests: integer('max_guests').notNull().default(1),
  foodChoice: text('food_choice', { enum: ['chicken', 'lamb'] }),
  notes: text('notes').notNull().default(''),
  location: text('location').notNull(),
  invitationLink: text('invitation_link').notNull(),
  group: text('group'),
  possiblyNotComing: integer('possibly_not_coming', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$onUpdateFn(() => new Date())
    .notNull(),
})

export type RSVP = typeof rsvps.$inferSelect
export type NewRSVP = typeof rsvps.$inferInsert

// T030: Table Schema (Enhanced)
export const tables = sqliteTable('tables', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  weddingConfigId: text('wedding_config_id')
    .notNull()
    .references(() => weddingConfigurations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  tableNumber: integer('table_number').notNull(),
  capacity: integer('capacity').notNull(),
  location: text('location').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$onUpdateFn(() => new Date())
    .notNull(),
})

export type Table = typeof tables.$inferSelect
export type NewTable = typeof tables.$inferInsert

// T028: Guest Schema (Enhanced)
// Note: Guest (many) ←→ (1) RSVP relationship via rsvpId foreign key
export const guests = sqliteTable('guests', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  weddingConfigId: text('wedding_config_id')
    .notNull()
    .references(() => weddingConfigurations.id, { onDelete: 'cascade' }),
  rsvpId: text('rsvp_id')
    .notNull()
    .references(() => rsvps.id, { onDelete: 'cascade' }),
  tableId: text('table_id').references(() => tables.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  rsvpName: text('rsvp_name').notNull(),
  checkedIn: integer('checked_in', { mode: 'boolean' }).notNull().default(false),
  location: text('location').notNull(),
  whatsapp: text('whatsapp'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$onUpdateFn(() => new Date())
    .notNull(),
})

export type Guest = typeof guests.$inferSelect
export type NewGuest = typeof guests.$inferInsert

// Wish Schema (bonus - not in T028-T030 but logically belongs here)
export const wishes = sqliteTable('wishes', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  weddingConfigId: text('wedding_config_id')
    .notNull()
    .references(() => weddingConfigurations.id, { onDelete: 'cascade' }),
  guestId: text('guest_id').references(() => guests.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  message: text('message').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$onUpdateFn(() => new Date())
    .notNull(),
})

export type Wish = typeof wishes.$inferSelect
export type NewWish = typeof wishes.$inferInsert
