# Data Model: Starting Section Content Management

**Feature**: 009-i-want-to
**Date**: 2025-10-18
**Status**: Complete

## Overview

The starting section content extends the existing `WeddingConfiguration` entity with fields for customizable hero section display. All fields are nullable to support incremental content creation and optional features.

## Entity: WeddingConfiguration (Extended)

**Table**: `wedding_configurations`
**Strategy**: Add new columns to existing table (1:1 relationship)

### Existing Schema (Reference)

```typescript
export const weddingConfigurations = sqliteTable('wedding_configurations', {
  id: text('id').$defaultFn(() => createId()).primaryKey(),
  userId: text('user_id').notNull().references(() => userAccounts.id, { onDelete: 'cascade' }).unique(),
  subdomain: text('subdomain').notNull().unique(),
  groomName: text('groom_name').notNull(),
  brideName: text('bride_name').notNull(),
  weddingDate: integer('wedding_date', { mode: 'timestamp' }).notNull(),
  groomFather: text('groom_father'),
  groomMother: text('groom_mother'),
  brideFather: text('bride_father'),
  brideMother: text('bride_mother'),
  // ... other existing fields
})
```

### New Fields (Starting Section)

```typescript
// Names for display (can override groomName/brideName from basic info)
startingSectionGroomName: text('starting_section_groom_name'),
startingSectionBrideName: text('starting_section_bride_name'),

// Parent Information Toggle & Names
startingSectionShowParentInfo: integer('starting_section_show_parent_info', { mode: 'boolean' })
  .default(false),
startingSectionGroomFatherName: text('starting_section_groom_father_name'),  // X in "Son of X and Y"
startingSectionGroomMotherName: text('starting_section_groom_mother_name'),  // Y in "Son of X and Y"
startingSectionBrideFatherName: text('starting_section_bride_father_name'),  // Z in "Daughter of Z and A"
startingSectionBrideMotherName: text('starting_section_bride_mother_name'),  // A in "Daughter of Z and A"

// Wedding Date Toggle
startingSectionShowWeddingDate: integer('starting_section_show_wedding_date', { mode: 'boolean' })
  .default(true),  // Default to showing wedding date

// Background Media
startingSectionBackgroundType: text('starting_section_background_type', { enum: ['image', 'video'] }),
startingSectionBackgroundFilename: text('starting_section_background_filename'),
startingSectionBackgroundFileSize: integer('starting_section_background_file_size'),
startingSectionBackgroundMimeType: text('starting_section_background_mime_type'),
```

### Complete TypeScript Interface

```typescript
export interface WeddingConfiguration {
  // Existing fields
  id: string
  userId: string
  subdomain: string
  groomName: string
  brideName: string
  weddingDate: Date
  groomFather: string | null
  groomMother: string | null
  brideFather: string | null
  brideMother: string | null
  groomsInstagramLink: string | null
  brideInstagramLink: string | null
  footerText: string | null
  monogramFilename: string | null
  monogramFileSize: number | null
  monogramMimeType: string | null
  isPublished: boolean
  createdAt: Date
  updatedAt: Date

  // New: Starting Section fields
  startingSectionGroomName: string | null
  startingSectionBrideName: string | null
  startingSectionShowParentInfo: boolean
  startingSectionGroomFatherName: string | null
  startingSectionGroomMotherName: string | null
  startingSectionBrideFatherName: string | null
  startingSectionBrideMotherName: string | null
  startingSectionShowWeddingDate: boolean
  startingSectionBackgroundType: 'image' | 'video' | null
  startingSectionBackgroundFilename: string | null
  startingSectionBackgroundFileSize: number | null
  startingSectionBackgroundMimeType: string | null
}
```

## Validation Rules

### Field Constraints

| Field | Type | Max Length | Required | Default | Validation |
|-------|------|------------|----------|---------|------------|
| startingSectionGroomName | string | 100 chars | No | null | Non-empty if provided |
| startingSectionBrideName | string | 100 chars | No | null | Non-empty if provided |
| startingSectionShowParentInfo | boolean | N/A | No | false | Must be boolean |
| startingSectionGroomFatherName | string | 100 chars | No | null | Non-empty if provided |
| startingSectionGroomMotherName | string | 100 chars | No | null | Non-empty if provided |
| startingSectionBrideFatherName | string | 100 chars | No | null | Non-empty if provided |
| startingSectionBrideMotherName | string | 100 chars | No | null | Non-empty if provided |
| startingSectionShowWeddingDate | boolean | N/A | No | true | Must be boolean |
| startingSectionBackgroundType | enum | N/A | No | null | Must be 'image' or 'video' if set |
| startingSectionBackgroundFilename | string | 255 chars | No | null | Valid filename format |
| startingSectionBackgroundFileSize | integer | N/A | No | null | Positive integer (bytes) |
| startingSectionBackgroundMimeType | string | 50 chars | No | null | Valid MIME type |

### Business Rules

1. **Partial Parent Information** (FR-012, FR-013)
   - All four parent name fields are optional
   - System allows saving with 0, 1, 2, 3, or 4 parent names filled
   - Display logic: Show "Son of X and Y" only if both X and Y exist
   - Display logic: Show "Daughter of Z and A" only if both Z and A exist
   - Hide entire parent info section if showParentInfo = false (regardless of saved data)

2. **Name Fallback Logic**
   - If startingSectionGroomName is null, fall back to groomName (from basic info)
   - If startingSectionBrideName is null, fall back to brideName (from basic info)
   - Rationale: Allows reuse of basic info without duplication

3. **Wedding Date Display** (FR-007, FR-008, FR-009)
   - If startingSectionShowWeddingDate = true AND weddingDate exists, display formatted date
   - If startingSectionShowWeddingDate = true AND weddingDate is null, display "1 January 2050"
   - If startingSectionShowWeddingDate = false, hide date section entirely

4. **Background Media Constraints** (FR-014, FR-015, FR-016, FR-017)
   - Images: Maximum 10 MB (10,485,760 bytes)
   - Videos: Maximum 50 MB (52,428,800 bytes)
   - Supported image MIME types: image/jpeg, image/png, image/webp, image/gif
   - Supported video MIME types: video/mp4, video/webm
   - Only one background media file at a time (new upload replaces old)

5. **File Replacement** (FR-018)
   - If startingSectionBackgroundFilename exists, require user confirmation before replacement
   - Delete old file from filesystem after successful upload of new file
   - Update all three background fields atomically (filename, fileSize, mimeType)

## Database Migration

### Migration File

```typescript
// migrations/XXXX_add_starting_section_fields.ts
import { sql } from 'drizzle-orm'

export async function up(db) {
  await db.run(sql`
    ALTER TABLE wedding_configurations
    ADD COLUMN starting_section_groom_name TEXT;
  `)
  await db.run(sql`
    ALTER TABLE wedding_configurations
    ADD COLUMN starting_section_bride_name TEXT;
  `)
  await db.run(sql`
    ALTER TABLE wedding_configurations
    ADD COLUMN starting_section_show_parent_info INTEGER DEFAULT 0;
  `)
  await db.run(sql`
    ALTER TABLE wedding_configurations
    ADD COLUMN starting_section_groom_father_name TEXT;
  `)
  await db.run(sql`
    ALTER TABLE wedding_configurations
    ADD COLUMN starting_section_groom_mother_name TEXT;
  `)
  await db.run(sql`
    ALTER TABLE wedding_configurations
    ADD COLUMN starting_section_bride_father_name TEXT;
  `)
  await db.run(sql`
    ALTER TABLE wedding_configurations
    ADD COLUMN starting_section_bride_mother_name TEXT;
  `)
  await db.run(sql`
    ALTER TABLE wedding_configurations
    ADD COLUMN starting_section_show_wedding_date INTEGER DEFAULT 1;
  `)
  await db.run(sql`
    ALTER TABLE wedding_configurations
    ADD COLUMN starting_section_background_type TEXT;
  `)
  await db.run(sql`
    ALTER TABLE wedding_configurations
    ADD COLUMN starting_section_background_filename TEXT;
  `)
  await db.run(sql`
    ALTER TABLE wedding_configurations
    ADD COLUMN starting_section_background_file_size INTEGER;
  `)
  await db.run(sql`
    ALTER TABLE wedding_configurations
    ADD COLUMN starting_section_background_mime_type TEXT;
  `)
}

export async function down(db) {
  // SQLite doesn't support DROP COLUMN, would need table recreation
  // For development: Drop and recreate table
  // For production: Mark columns as deprecated, clean up in future major version
}
```

## Data Access Patterns

### Read Pattern (Server Component)

```typescript
// app/admin/page.tsx
import { db } from '@/app/lib/database'
import { weddingConfigurations } from '@/app/db/schema'
import { eq } from 'drizzle-orm'

const [config] = await db
  .select()
  .from(weddingConfigurations)
  .where(eq(weddingConfigurations.userId, session.userId))
  .limit(1)

// All starting section fields available on config object
// config.startingSectionGroomName, etc.
```

### Update Pattern (Server Action)

```typescript
// Server Action
'use server'
export async function updateStartingSection(data: StartingSectionUpdate) {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  await db
    .update(weddingConfigurations)
    .set({
      startingSectionGroomName: data.groomName,
      startingSectionBrideName: data.brideName,
      startingSectionShowParentInfo: data.showParentInfo,
      startingSectionGroomFatherName: data.groomFatherName,
      startingSectionGroomMotherName: data.groomMotherName,
      startingSectionBrideFatherName: data.brideFatherName,
      startingSectionBrideMotherName: data.brideMotherName,
      startingSectionShowWeddingDate: data.showWeddingDate,
      updatedAt: new Date(),
    })
    .where(eq(weddingConfigurations.userId, session.userId))

  revalidatePath('/admin')
  return { success: true }
}
```

## Zod Validation Schema

```typescript
// lib/validations/starting-section.ts
import { z } from 'zod'

export const startingSectionContentSchema = z.object({
  groomName: z.string().max(100).optional().nullable(),
  brideName: z.string().max(100).optional().nullable(),
  showParentInfo: z.boolean().optional(),
  groomFatherName: z.string().max(100).optional().nullable(),
  groomMotherName: z.string().max(100).optional().nullable(),
  brideFatherName: z.string().max(100).optional().nullable(),
  brideMotherName: z.string().max(100).optional().nullable(),
  showWeddingDate: z.boolean().optional(),
})

const MAX_IMAGE_SIZE = 10 * 1024 * 1024  // 10 MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024  // 50 MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm']

export const startingSectionMediaSchema = z.object({
  file: z.instanceof(File).refine((file) => {
    if (ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return file.size <= MAX_IMAGE_SIZE
    }
    if (ACCEPTED_VIDEO_TYPES.includes(file.type)) {
      return file.size <= MAX_VIDEO_SIZE
    }
    return false
  }, {
    message: 'Invalid file type or size exceeded (10MB for images, 50MB for videos)',
  }),
  replaceExisting: z.boolean().optional(),
})
```

## Relationships

### Existing Relationships
- `weddingConfigurations.userId` → `userAccounts.id` (1:1, cascade delete)

### Data Dependencies
- Starting section groom/bride names fall back to `groomName`/`brideName` if not set
- Wedding date display uses `weddingDate` field (existing)
- Parent names in starting section are independent from existing `groomFather`/`groomMother`/`brideFather`/`brideMother` fields

## Indexes

No new indexes required:
- All queries filter by `userId` (existing unique index)
- No queries on starting section fields individually
- No JOIN operations (1:1 relationship in same table)

## Storage Considerations

### Filesystem Organization

```
public/
└── uploads/
    └── {weddingConfigId}/
        └── starting-section/
            ├── background-image-{timestamp}.{ext}  // e.g., background-image-1697654321.jpg
            └── background-video-{timestamp}.{ext}  // e.g., background-video-1697654400.mp4
```

### File Naming Convention
- Pattern: `background-{type}-{timestamp}.{extension}`
- Timestamp: Unix timestamp (seconds since epoch)
- Extension: Derived from MIME type (jpg, png, webp, gif, mp4, webm)

### Cleanup Strategy
- On file replacement: Delete old file after successful new upload
- On wedding config deletion: Cascade delete handled by database, files cleaned via cron job or manual cleanup
- Orphaned file prevention: Always update DB before deleting old file

## Summary

- **Storage**: Extend existing `weddingConfigurations` table with 12 new nullable columns
- **Validation**: Zod schemas for content (string lengths) and media (file size/type)
- **Relationships**: No new tables, 1:1 extension of existing entity
- **Migration**: Single migration file adding 12 columns
- **Performance**: No JOINs, all data in single table query

This design aligns with constitutional principles of simplicity and performance while supporting all functional requirements including partial parent info and file size validation.
