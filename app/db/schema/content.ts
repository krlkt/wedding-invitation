/**
 * T022-T027: Content Schemas
 *
 * Drizzle ORM schemas for wedding content management:
 * - Love Story Segments
 * - Location Details
 * - Gallery Items
 * - FAQ Items
 * - Dress Code
 * - Bank Details
 */

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { createId } from '@paralleldrive/cuid2'
import { weddingConfigurations } from './weddings'

// T022: Love Story Segment Schema
export const loveStorySegments = sqliteTable('love_story_segments', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  weddingConfigId: text('wedding_config_id')
    .notNull()
    .references(() => weddingConfigurations.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  iconType: text('icon_type').notNull(),
  order: integer('order').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$onUpdateFn(() => new Date())
    .notNull(),
})

export type LoveStorySegment = typeof loveStorySegments.$inferSelect
export type NewLoveStorySegment = typeof loveStorySegments.$inferInsert

// T023: Location Details Schema
export const locationDetails = sqliteTable('location_details', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  weddingConfigId: text('wedding_config_id')
    .notNull()
    .references(() => weddingConfigurations.id, { onDelete: 'cascade' }),
  locationIdentifier: text('location_identifier').notNull(),
  name: text('name').notNull(),
  address: text('address').notNull(),
  googleMapsLink: text('google_maps_link'),
  ceremonyTime: text('ceremony_time'),
  receptionTime: text('reception_time'),
  order: integer('order').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$onUpdateFn(() => new Date())
    .notNull(),
})

export type LocationDetails = typeof locationDetails.$inferSelect
export type NewLocationDetails = typeof locationDetails.$inferInsert

// T024: Gallery Item Schema
export const galleryItems = sqliteTable('gallery_items', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  weddingConfigId: text('wedding_config_id')
    .notNull()
    .references(() => weddingConfigurations.id, { onDelete: 'cascade' }),
  filename: text('filename').notNull(),
  originalName: text('original_name').notNull(),
  fileSize: integer('file_size').notNull(),
  mimeType: text('mime_type').notNull(),
  order: integer('order').notNull(),
  alt: text('alt'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$onUpdateFn(() => new Date())
    .notNull(),
})

export type GalleryItem = typeof galleryItems.$inferSelect
export type NewGalleryItem = typeof galleryItems.$inferInsert

// T025: FAQ Item Schema
export const faqItems = sqliteTable('faq_items', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  weddingConfigId: text('wedding_config_id')
    .notNull()
    .references(() => weddingConfigurations.id, { onDelete: 'cascade' }),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  order: integer('order').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$onUpdateFn(() => new Date())
    .notNull(),
})

export type FAQItem = typeof faqItems.$inferSelect
export type NewFAQItem = typeof faqItems.$inferInsert

// T026: Dress Code Schema
export const dressCodes = sqliteTable('dress_codes', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  weddingConfigId: text('wedding_config_id')
    .notNull()
    .references(() => weddingConfigurations.id, { onDelete: 'cascade' })
    .unique(), // One-to-one relationship
  title: text('title'),
  description: text('description'),
  photoFilename: text('photo_filename'),
  photoFileSize: integer('photo_file_size'),
  photoMimeType: text('photo_mime_type'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$onUpdateFn(() => new Date())
    .notNull(),
})

export type DressCode = typeof dressCodes.$inferSelect
export type NewDressCode = typeof dressCodes.$inferInsert

// T027: Bank Details Schema
export const bankDetails = sqliteTable('bank_details', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  weddingConfigId: text('wedding_config_id')
    .notNull()
    .references(() => weddingConfigurations.id, { onDelete: 'cascade' })
    .unique(), // One-to-one relationship
  bankName: text('bank_name'),
  accountName: text('account_name'),
  accountNumber: text('account_number'),
  routingNumber: text('routing_number'),
  instructions: text('instructions'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$onUpdateFn(() => new Date())
    .notNull(),
})

export type BankDetails = typeof bankDetails.$inferSelect
export type NewBankDetails = typeof bankDetails.$inferInsert
