/**
 * T036: Content Management Service
 *
 * Service layer for wedding content management.
 * Handles love story, locations, FAQs, bank details, and dress code content.
 */

import { eq, desc } from 'drizzle-orm'

import {
  loveStorySegments,
  locationDetails,
  faqItems,
  bankDetails,
  dressCodes,
  wishes,
  startingSectionContent,
  type NewLoveStorySegment,
  type NewLocationDetails,
  type NewFAQItem,
  type NewBankDetails,
  type NewDressCode,
  type NewWish,
  type NewStartingSectionContent,
} from '@/app/db/schema'

import { db } from './database'

// ============================================================================
// Love Story Management
// ============================================================================

export async function createLoveStorySegment(data: NewLoveStorySegment) {
  const [segment] = await db.insert(loveStorySegments).values(data).returning()
  return segment
}

export async function getLoveStorySegments(weddingConfigId: string) {
  return db
    .select()
    .from(loveStorySegments)
    .where(eq(loveStorySegments.weddingConfigId, weddingConfigId))
    .orderBy(loveStorySegments.order)
}

export async function updateLoveStorySegment(
  segmentId: string,
  updates: Partial<Omit<NewLoveStorySegment, 'weddingConfigId'>>
) {
  const [updated] = await db
    .update(loveStorySegments)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(loveStorySegments.id, segmentId))
    .returning()

  return updated
}

export async function deleteLoveStorySegment(segmentId: string) {
  await db.delete(loveStorySegments).where(eq(loveStorySegments.id, segmentId))
}

// ============================================================================
// Location Management
// ============================================================================

export async function createLocation(data: NewLocationDetails) {
  const [location] = await db.insert(locationDetails).values(data).returning()
  return location
}

export async function getLocations(weddingConfigId: string) {
  return db
    .select()
    .from(locationDetails)
    .where(eq(locationDetails.weddingConfigId, weddingConfigId))
    .orderBy(locationDetails.order)
}

export async function updateLocation(
  locationId: string,
  updates: Partial<Omit<NewLocationDetails, 'weddingConfigId'>>
) {
  const [updated] = await db
    .update(locationDetails)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(locationDetails.id, locationId))
    .returning()

  return updated
}

export async function deleteLocation(locationId: string) {
  await db.delete(locationDetails).where(eq(locationDetails.id, locationId))
}

// ============================================================================
// FAQ Management
// ============================================================================

export async function createFAQ(data: NewFAQItem) {
  const [faq] = await db.insert(faqItems).values(data).returning()
  return faq
}

export async function getFAQs(weddingConfigId: string) {
  return db
    .select()
    .from(faqItems)
    .where(eq(faqItems.weddingConfigId, weddingConfigId))
    .orderBy(faqItems.order)
}

export async function updateFAQ(
  faqId: string,
  updates: Partial<Omit<NewFAQItem, 'weddingConfigId'>>
) {
  const [updated] = await db
    .update(faqItems)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(faqItems.id, faqId))
    .returning()

  return updated
}

export async function deleteFAQ(faqId: string) {
  await db.delete(faqItems).where(eq(faqItems.id, faqId))
}

// ============================================================================
// Bank Details Management
// ============================================================================

export async function getBankDetails(weddingConfigId: string) {
  const [details] = await db
    .select()
    .from(bankDetails)
    .where(eq(bankDetails.weddingConfigId, weddingConfigId))
    .limit(1)

  return details || null
}

export async function updateBankDetails(
  weddingConfigId: string,
  data: Omit<NewBankDetails, 'weddingConfigId'>
) {
  // Check if bank details exist
  const existing = await getBankDetails(weddingConfigId)

  if (existing) {
    // Update existing
    const [updated] = await db
      .update(bankDetails)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(bankDetails.id, existing.id))
      .returning()

    return updated
  }
  // Create new
  const [created] = await db
    .insert(bankDetails)
    .values({
      ...data,
      weddingConfigId,
    })
    .returning()

  return created
}

// ============================================================================
// Dress Code Management
// ============================================================================

export async function getDressCode(weddingConfigId: string) {
  const [dressCode] = await db
    .select()
    .from(dressCodes)
    .where(eq(dressCodes.weddingConfigId, weddingConfigId))
    .limit(1)

  return dressCode || null
}

export async function updateDressCode(
  weddingConfigId: string,
  data: Partial<Omit<NewDressCode, 'weddingConfigId'>>
) {
  // Check if dress code exists
  const existing = await getDressCode(weddingConfigId)

  if (existing) {
    // Update existing
    const [updated] = await db
      .update(dressCodes)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(dressCodes.id, existing.id))
      .returning()

    return updated
  }
  // Create new
  const [created] = await db
    .insert(dressCodes)
    .values({
      ...data,
      weddingConfigId,
    })
    .returning()

  return created
}

// ============================================================================
// Wishes Management
// ============================================================================

export async function createWish(data: NewWish) {
  const [wish] = await db.insert(wishes).values(data).returning()
  return wish
}

export async function getWishes(weddingConfigId: string, limit: number = 50) {
  return db
    .select()
    .from(wishes)
    .where(eq(wishes.weddingConfigId, weddingConfigId))
    .orderBy(desc(wishes.createdAt))
    .limit(limit)
}

export async function deleteWish(wishId: string) {
  await db.delete(wishes).where(eq(wishes.id, wishId))
}

// ============================================================================
// Starting Section Content Management
// ============================================================================

export async function getStartingSectionContent(weddingConfigId: string) {
  const [content] = await db
    .select()
    .from(startingSectionContent)
    .where(eq(startingSectionContent.weddingConfigId, weddingConfigId))
    .limit(1)

  return content || null
}

export async function updateStartingSectionContent(
  weddingConfigId: string,
  data: Partial<Omit<NewStartingSectionContent, 'weddingConfigId'>>
) {
  // Check if starting section content exists
  const existing = await getStartingSectionContent(weddingConfigId)

  if (existing) {
    // Update existing
    const [updated] = await db
      .update(startingSectionContent)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(startingSectionContent.id, existing.id))
      .returning()

    return updated
  } else {
    // Create new
    const [created] = await db
      .insert(startingSectionContent)
      .values({
        ...data,
        weddingConfigId,
      })
      .returning()

    return created
  }
}
