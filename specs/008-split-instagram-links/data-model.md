# Data Model: Reorganize Instagram Links and Footer Text

**Date**: 2025-10-14
**Feature**: 008-split-instagram-links

## Entity Changes

### WeddingConfiguration (Modified)

**Table**: `wedding_configurations`
**File**: `app/db/schema/weddings.ts`

#### Schema Changes

**Added Fields**:
```typescript
groomsInstagramLink: text('grooms_instagram_link'),
brideInstagramLink: text('bride_instagram_link'),
```

**Deprecated Fields** (keep for backward compatibility):
```typescript
instagramLink: text('instagram_link'),  // DEPRECATED - no longer used
```

**Unchanged** Fields:
```typescript
footerText: text('footer_text'),  // Remains in schema, moved in UI only
```

#### Complete Updated Schema
```typescript
export const weddingConfigurations = sqliteTable('wedding_configurations', {
  id: text('id').$defaultFn(() => createId()).primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userAccounts.id, { onDelete: 'cascade' })
    .unique(),
  subdomain: text('subdomain').notNull().unique(),
  groomName: text('groom_name').notNull(),
  brideName: text('bride_name').notNull(),
  weddingDate: integer('wedding_date', { mode: 'timestamp' }).notNull(),

  monogramFilename: text('monogram_filename'),
  monogramFileSize: integer('monogram_file_size'),
  monogramMimeType: text('monogram_mime_type'),

  groomFather: text('groom_father'),
  groomMother: text('groom_mother'),
  brideFather: text('bride_father'),
  brideMother: text('bride_mother'),

  // Social Media Links (NEW)
  groomsInstagramLink: text('grooms_instagram_link'),
  brideInstagramLink: text('bride_instagram_link'),

  // Content Fields
  footerText: text('footer_text'),

  // Deprecated (keep for compatibility)
  instagramLink: text('instagram_link'),  // DEPRECATED

  isPublished: integer('is_published', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdateFn(() => new Date()).notNull(),
})
```

#### Validation Rules
- **groomsInstagramLink**:
  - Optional (nullable)
  - Must be valid URL format if provided (https://instagram.com/... or https://www.instagram.com/...)
  - Max length: 500 characters

- **brideInstagramLink**:
  - Optional (nullable)
  - Must be valid URL format if provided (https://instagram.com/... or https://www.instagram.com/...)
  - Max length: 500 characters

- **footerText**:
  - Optional (nullable)
  - Max length: 500 characters
  - No HTML allowed (plain text only)

#### Migration Notes
- Existing `instagramLink` values will NOT be migrated (per clarification - testing data only)
- New fields default to NULL
- Application will ignore `instagramLink` column (deprecated)
- Column can be dropped in future major version

---

### FeatureToggle (Modified)

**Table**: `feature_toggles`
**File**: `app/db/schema/features.ts`

#### Schema Changes

**Renamed Enum Value**:
```typescript
featureName: text('feature_name', {
  enum: [
    'love_story',
    'rsvp',
    'gallery',
    'prewedding_videos',
    'faqs',
    'dress_code',
    'instagram_links',        // RENAMED from 'instagram_link'
    'wishes'
  ]
}).notNull(),
```

#### Migration Strategy
Since SQLite enums are implemented as text with CHECK constraints:
1. Update CHECK constraint to allow both old and new values temporarily
2. Update existing rows: `UPDATE feature_toggles SET feature_name = 'instagram_links' WHERE feature_name = 'instagram_link'`
3. Update schema enum to only include new value
4. Deploy application code with new value

**Alternatively** (simpler):
- Direct schema change (Drizzle will handle)
- Existing data updated automatically on first save
- Feature toggle will default to enabled (existing behavior)

---

## TypeScript Interface Changes

### WeddingConfiguration Type

**Updated Type** (auto-inferred from schema):
```typescript
export type WeddingConfiguration = {
  id: string
  userId: string
  subdomain: string
  groomName: string
  brideName: string
  weddingDate: Date

  monogramFilename: string | null
  monogramFileSize: number | null
  monogramMimeType: string | null

  groomFather: string | null
  groomMother: string | null
  brideFather: string | null
  brideMother: string | null

  groomsInstagramLink: string | null      // NEW
  brideInstagramLink: string | null       // NEW
  footerText: string | null

  instagramLink: string | null            // DEPRECATED

  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}
```

### PreviewData Interface

**File**: `app/components/preview/types.ts`

**Current**:
```typescript
export interface PreviewData {
    config: WeddingConfiguration  // Already includes new fields via type inference
    features: Record<FeatureName, boolean>
    content: { ... }
}
```

**Updated FeatureName Type**:
```typescript
export type FeatureName =
    | 'love_story'
    | 'rsvp'
    | 'gallery'
    | 'prewedding_videos'
    | 'faqs'
    | 'dress_code'
    | 'instagram_links'     // RENAMED
    | 'wishes'
```

---

## API Contract Changes

### PUT /api/wedding/config

**Request Body** (partial update):
```typescript
{
  groomsInstagramLink?: string | null    // NEW - optional URL
  brideInstagramLink?: string | null     // NEW - optional URL
  footerText?: string | null             // EXISTING - moved in UI only
  // ... other fields unchanged
}
```

**Validation Rules**:
```typescript
if (groomsInstagramLink !== undefined) {
  // Validate URL format if not null
  if (groomsInstagramLink !== null && !isValidInstagramUrl(groomsInstagramLink)) {
    return { error: 'Invalid Instagram URL for groom', status: 400 }
  }
}

if (brideInstagramLink !== undefined) {
  // Validate URL format if not null
  if (brideInstagramLink !== null && !isValidInstagramUrl(brideInstagramLink)) {
    return { error: 'Invalid Instagram URL for bride', status: 400 }
  }
}
```

**Response**:
```typescript
{
  success: true,
  data: WeddingConfiguration  // Includes new fields
}
```

### GET /api/wedding/preview

**No changes to contract** - Response already includes full `WeddingConfiguration` which will now have new fields.

---

## State Management Changes

### WeddingDataProvider Context

**Already updated** in prior work - no changes needed:
```typescript
interface WeddingDataContextValue {
    config: WeddingConfiguration;     // Includes new fields automatically
    features: Record<FeatureName, boolean>;  // Will use renamed 'instagram_links'
}
```

---

## Database Migration Script

**File**: To be created as `app/db/migrations/008-split-instagram-links.sql`

```sql
-- Add new columns for separate Instagram links
ALTER TABLE wedding_configurations
ADD COLUMN grooms_instagram_link TEXT;

ALTER TABLE wedding_configurations
ADD COLUMN bride_instagram_link TEXT;

-- Optional: Clear deprecated instagram_link data (per clarification)
UPDATE wedding_configurations
SET instagram_link = NULL
WHERE instagram_link IS NOT NULL;

-- Update feature toggle naming
UPDATE feature_toggles
SET feature_name = 'instagram_links'
WHERE feature_name = 'instagram_link';

-- Note: Column instagram_link kept for backward compatibility
-- Can be dropped in future major version with:
-- ALTER TABLE wedding_configurations DROP COLUMN instagram_link;
```

---

## Summary

### Changes Required
1. **Schema Files**:
   - `app/db/schema/weddings.ts` - Add 2 columns, mark 1 deprecated
   - `app/db/schema/features.ts` - Rename enum value

2. **Type Files**:
   - `app/components/preview/types.ts` - Update FeatureName type

3. **Migration**:
   - SQL script to add columns and update feature toggle

4. **No Breaking Changes**:
   - New fields are nullable (backward compatible)
   - Old `instagramLink` kept in schema
   - API accepts optional fields

### Validation Strategy
- URL validation for Instagram links (optional but recommended)
- Length constraints (500 chars max)
- Plain text only for footer text (no HTML injection)

### Testing Focus
- Schema migration applies cleanly
- New fields accept null and valid URLs
- Old `instagramLink` ignored by application
- Feature toggle rename doesn't break existing toggles
