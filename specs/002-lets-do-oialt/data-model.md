# Data Model: Template-Based Live Preview

**Feature**: OIALT-8 | **Date**: 2025-10-12
**Note**: This feature primarily uses existing database entities. New types are TypeScript interfaces only.

---

## Existing Database Entities (Reference Only)

### WeddingConfiguration
**Table**: `wedding_configurations`
**Source**: `app/db/schema/weddings.ts`

Fields used by preview:
- `id`: text (CUID2) - Primary key
- `subdomain`: text - For preview header display
- `groomName`: text - Hero section
- `brideName`: text - Hero section
- `weddingDate`: timestamp - Hero section
- `monogramFilename`: text - Hero section (optional)
- `groomFather`: text - Hero section (optional)
- `groomMother`: text - Hero section (optional)
- `brideFather`: text - Hero section (optional)
- `brideMother`: text - Hero section (optional)
- `instagramLink`: text - Footer (if feature enabled)
- `footerText`: text - Footer
- `isPublished`: boolean - Preview header status

### FeatureToggle
**Table**: `feature_toggles`
**Source**: `app/db/schema/features.ts`

Fields:
- `id`: text (CUID2) - Primary key
- `weddingConfigId`: text - Foreign key to wedding_configurations
- `featureName`: enum - One of: `love_story`, `rsvp`, `gallery`, `prewedding_videos`, `faqs`, `dress_code`, `instagram_link`
- `isEnabled`: boolean - Controls section visibility in preview

---

## New TypeScript Interfaces (Frontend Only)

### FeatureName
**File**: `app/models/template.ts`
**Purpose**: Type-safe feature toggle names

```typescript
export type FeatureName =
  | 'love_story'
  | 'rsvp'
  | 'gallery'
  | 'prewedding_videos'
  | 'faqs'
  | 'dress_code'
  | 'instagram_link';
```

### TemplateId
**File**: `app/models/template.ts`
**Purpose**: Template identifier for future multi-template support

```typescript
export type TemplateId = 'template-1'; // Future: | 'template-2' | 'template-3'
```

### PreviewWeddingConfig
**File**: `app/models/preview.ts`
**Purpose**: Subset of WeddingConfiguration needed for preview

```typescript
export interface PreviewWeddingConfig {
  id: string;
  subdomain: string;
  groomName: string;
  brideName: string;
  weddingDate: Date;
  monogramFilename?: string | null;
  groomFather?: string | null;
  groomMother?: string | null;
  brideFather?: string | null;
  brideMother?: string | null;
  instagramLink?: string | null;
  footerText?: string | null;
  isPublished: boolean;
}
```

### PreviewContent
**File**: `app/models/preview.ts`
**Purpose**: Aggregated content for all preview sections

```typescript
export interface PreviewContent {
  loveStory?: LoveStoryItem[];
  gallery?: GalleryPhoto[];
  faqs?: FAQ[];
  dressCode?: DressCode;
  locations?: Location[];
  bankDetails?: BankDetail[];
}
```

### LoveStoryItem
**File**: `app/models/preview.ts` (if not exists elsewhere)
**Purpose**: Timeline item for love story section

```typescript
export interface LoveStoryItem {
  id: string;
  weddingConfigId: string;
  date: string; // e.g., "2018-05-15"
  title: string;
  description: string;
  order: number;
}
```

### GalleryPhoto
**File**: `app/models/preview.ts` (if not exists elsewhere)
**Purpose**: Photo for gallery section

```typescript
export interface GalleryPhoto {
  id: string;
  weddingConfigId: string;
  filename: string;
  url: string;
  order: number;
  createdAt: Date;
}
```

### FAQ
**File**: `app/models/preview.ts` (if not exists elsewhere)
**Purpose**: FAQ item

```typescript
export interface FAQ {
  id: string;
  weddingConfigId: string;
  question: string;
  answer: string;
  order: number;
}
```

### DressCode
**File**: `app/models/preview.ts` (if not exists elsewhere)
**Purpose**: Dress code information

```typescript
export interface DressCode {
  id: string;
  weddingConfigId: string;
  description: string;
  photoFilename?: string | null;
  photoUrl?: string | null;
}
```

### Location
**File**: `app/models/preview.ts` (if not exists elsewhere)
**Purpose**: Wedding location details

```typescript
export interface Location {
  id: string;
  weddingConfigId: string;
  type: 'ceremony' | 'reception';
  name: string;
  address: string;
  dateTime: Date;
  mapsUrl?: string | null;
}
```

### BankDetail
**File**: `app/models/preview.ts` (if not exists elsewhere)
**Purpose**: Bank account for gift section

```typescript
export interface BankDetail {
  id: string;
  weddingConfigId: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  order: number;
}
```

### PreviewConfig
**File**: `app/models/preview.ts`
**Purpose**: Complete preview data structure

```typescript
export interface PreviewConfig {
  config: PreviewWeddingConfig;
  features: Record<FeatureName, boolean>;
  content: PreviewContent;
}
```

### TemplateProps
**File**: `app/models/template.ts`
**Purpose**: Props for template components

```typescript
export interface TemplateProps {
  config: PreviewConfig;
  templateId: TemplateId;
}
```

### TemplateRendererProps
**File**: `app/models/template.ts`
**Purpose**: Props for TemplateRenderer component

```typescript
export interface TemplateRendererProps {
  templateId?: TemplateId;
  config: PreviewConfig;
  containerClassName?: string;
}
```

### Template1PreviewProps
**File**: `app/models/template.ts`
**Purpose**: Props for Template1Preview component

```typescript
export interface Template1PreviewProps {
  config: PreviewConfig;
}
```

---

## Component Relationships

```
LivePreview (existing)
  └─> TemplateRenderer (new)
        └─> Template1Preview (new)
              ├─> Hero (existing)
              ├─> Timeline (existing) - if features.love_story
              ├─> RSVPForm (existing) - if features.rsvp
              ├─> ImageGallery (existing) - if features.gallery
              ├─> YouTubeEmbed (existing) - if features.prewedding_videos
              ├─> FAQ (existing) - if features.faqs
              ├─> DressCode (existing) - if features.dress_code
              ├─> Gift (existing) - always shown
              ├─> Wishes (existing) - always shown
              └─> Footer (custom) - shows instagram_link if enabled
```

---

## Data Flow

```
1. User opens admin dashboard with LivePreview
   ↓
2. LivePreview fetches /api/wedding/preview
   ↓
3. API returns PreviewConfig (config + features + content)
   ↓
4. LivePreview passes to TemplateRenderer
   ↓
5. TemplateRenderer selects Template1Preview
   ↓
6. Template1Preview conditionally renders sections based on features
   ↓
7. User toggles feature in dashboard
   ↓
8. RefreshTrigger increments → re-fetch → re-render
```

---

## Validation Rules

### PreviewWeddingConfig
- `groomName`: Required, non-empty string
- `brideName`: Required, non-empty string
- `weddingDate`: Required, valid date
- `subdomain`: Required, non-empty string

### PreviewContent
- All fields optional (graceful handling if missing)
- `loveStory`: Array, ordered by `order` field
- `gallery`: Array, ordered by `order` field
- `faqs`: Array, ordered by `order` field
- `locations`: Array, grouped by type

### Feature Toggles
- Must be one of 7 valid FeatureName values
- Boolean state (enabled/disabled)
- If feature disabled, corresponding content ignored

---

## Empty State Handling

When content is missing for an enabled feature:

1. **Love Story**: Show "Add your love story" message
2. **Gallery**: Show "Upload photos" message
3. **FAQs**: Show "Add FAQs" message
4. **Dress Code**: Show "Configure dress code" message
5. **RSVP**: Show mock form with placeholder data
6. **Prewedding Videos**: Show "Add video URL" message
7. **Instagram Link**: Show "Add Instagram link" message

Hero section ALWAYS shows (required fields).

---

## Notes

- No database migrations needed for this feature
- All new types are TypeScript interfaces for type safety
- Existing database schema remains unchanged
- API endpoint returns data in PreviewConfig format
- Component props follow existing patterns (see RSVPForm, Timeline)
