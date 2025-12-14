# Research: Starting Section Content Management

**Feature**: 009-i-want-to
**Date**: 2025-10-18
**Status**: Complete

## Research Areas

### 1. File Upload Patterns in Next.js 14 App Router

**Question**: What's the best approach for handling file uploads (images/videos) in Next.js 14 App Router?

**Options Evaluated**:

1. **Server Actions with FormData** (Recommended)
   - Native Next.js 14 pattern
   - Type-safe with TypeScript
   - Automatic revalidation
   - Built-in streaming support
   - No need for separate API routes

2. **API Routes (route.ts)**
   - Traditional approach
   - More boilerplate
   - Requires manual revalidation
   - Better for external API consumption

3. **tRPC**
   - Type-safe end-to-end
   - Adds significant complexity
   - Overkill for this scope

**Decision**: Use Server Actions with FormData

**Rationale**:

- Aligns with Next.js 14 App Router best practices
- Constitution Principle VII mandates Server Actions for mutations
- Reduces boilerplate compared to API routes
- Built-in streaming handles large video files efficiently
- Automatic cache revalidation

**Implementation Pattern**:

```typescript
'use server';
export async function uploadBackgroundMedia(formData: FormData) {
  const file = formData.get('file') as File;
  // Validate, save, update DB
  revalidatePath('/admin');
  return { success: true, data: { filename, fileSize, mimeType } };
}
```

**References**:

- Next.js Server Actions docs: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
- Constitution VII: "Server Actions MUST be used for mutations initiated from Client Components"

---

### 2. File Storage Strategy

**Question**: Where should uploaded background media files be stored?

**Options Evaluated**:

1. **Local filesystem (public/uploads/)** (Recommended)
   - Simple implementation
   - No external dependencies
   - Fast local access
   - Works with Next.js static file serving
   - Suitable for single-server deployment

2. **Cloud Storage (AWS S3, Cloudinary)**
   - Scalable for multi-server
   - CDN integration
   - Additional cost
   - More complexity
   - Not needed for current scale

3. **Database BLOBs**
   - Simple single storage location
   - Not scalable for large files
   - Poor performance for streaming
   - Database bloat

**Decision**: Store in `public/uploads/{weddingConfigId}/starting-section/`

**Rationale**:

- Current project is single-server deployment
- Keeps infrastructure simple (Constitution IV: avoid premature abstraction)
- Next.js automatically serves files from public/ directory
- Easy to migrate to cloud storage later if needed
- Wedding-specific folders provide good organization

**File Organization**:

```
public/
└── uploads/
    └── {weddingConfigId}/
        └── starting-section/
            ├── background-image-{timestamp}.jpg
            └── background-video-{timestamp}.mp4
```

**Migration Path**: If multi-server deployment needed, add cloud storage adapter without changing application logic.

---

### 3. Form State Management with React Hook Form + shadcn/ui

**Question**: How to manage complex form state with validation for the starting section?

**Options Evaluated**:

1. **React Hook Form + Zod** (Recommended)
   - Already in tech stack (Constitution I)
   - Perfect shadcn/ui integration
   - Type-safe validation
   - Automatic error handling
   - Minimal re-renders

2. **Formik**
   - Popular alternative
   - Less TypeScript support
   - More boilerplate
   - Not in current stack

3. **Plain React State**
   - Maximum control
   - Extremely verbose
   - Manual validation
   - Error-prone

**Decision**: React Hook Form with Zod validation schema

**Rationale**:

- Constitution I mandates React Hook Form for all form implementations
- shadcn/ui form components built specifically for React Hook Form
- Zod provides runtime + compile-time type safety
- Existing codebase patterns already use this approach
- Validates on blur, submit, or change (configurable)

**Implementation Pattern**:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { startingSectionSchema } from '@/lib/validations/starting-section';

const form = useForm({
  resolver: zodResolver(startingSectionSchema),
  defaultValues: { groomName: config.groomName || '' },
});
```

**References**:

- Constitution I: "React Hook Form for all form implementations"
- shadcn/ui form docs: https://ui.shadcn.com/docs/components/form

---

### 4. Database Schema Extension Strategy

**Question**: Should starting section content be a separate table or extend weddingConfigurations?

**Options Evaluated**:

1. **Extend weddingConfigurations table** (Recommended)
   - One-to-one relationship
   - All fields nullable
   - Simple queries (no JOIN needed)
   - Matches existing pattern (monogram, parent names already in this table)

2. **Separate startingSections table**
   - Normalized data model
   - Requires JOIN for every query
   - Over-normalized for simple fields
   - Adds complexity without benefit

**Decision**: Add columns to existing `weddingConfigurations` table

**Rationale**:

- Starting section is 1:1 with wedding configuration
- Existing table already has similar fields (groomName, brideName, weddingDate)
- Matches pattern: monogramFilename, groomFather, etc. already in this table
- Simpler queries improve performance (Constitution II: performance-first)
- No normalization benefit for fields that always load together

**New Columns**:

```sql
ALTER TABLE wedding_configurations ADD COLUMN
  starting_section_groom_name TEXT,
  starting_section_bride_name TEXT,
  starting_section_show_parent_info INTEGER DEFAULT 0,  -- boolean
  starting_section_groom_father_name TEXT,
  starting_section_groom_mother_name TEXT,
  starting_section_bride_father_name TEXT,
  starting_section_bride_mother_name TEXT,
  starting_section_show_wedding_date INTEGER DEFAULT 1,  -- boolean, default true
  starting_section_background_type TEXT,  -- 'image' | 'video'
  starting_section_background_filename TEXT,
  starting_section_background_file_size INTEGER,
  starting_section_background_mime_type TEXT;
```

**References**:

- Existing schema pattern: app/db/schema/weddings.ts lines 30-42

---

### 5. Preview Update Mechanism

**Question**: How to provide instant preview feedback when users change starting section content?

**Options Evaluated**:

1. **Draft state passed to LivePreview** (Recommended)
   - Matches existing ConfigDashboard pattern
   - No network calls for preview
   - Instant feedback
   - Simple implementation

2. **WebSocket/Server-Sent Events**
   - Real-time updates
   - Overkill for single-user editing
   - Additional infrastructure
   - Complexity without benefit

3. **Polling**
   - Periodic API calls
   - Network overhead
   - Delay in updates
   - Inefficient

**Decision**: Pass draft state object to LivePreview component (similar to draftFeatures pattern)

**Rationale**:

- Existing ConfigDashboard already implements this pattern for feature toggles
- Zero network latency for preview updates
- Simple prop passing (Constitution IV: avoid unnecessary complexity)
- Users expect instant feedback (<100ms per Performance Goals)

**Implementation Pattern**:

```typescript
// In StartingSectionForm
const [draftContent, setDraftContent] = useState(initialContent)

function handleChange(field, value) {
  const newDraft = { ...draftContent, [field]: value }
  setDraftContent(newDraft)
  onLocalChange(newDraft)  // Pass to parent
}

// In ConfigDashboard
<LivePreview draftFeatures={draftFeatures} draftStartingSection={draftStartingSection} />
```

**References**:

- Existing pattern: ConfigDashboard.tsx lines 193-196, 206

---

## Summary of Decisions

| Area            | Decision                     | Primary Rationale                          |
| --------------- | ---------------------------- | ------------------------------------------ |
| File Upload     | Server Actions with FormData | Constitutional mandate, built-in streaming |
| File Storage    | public/uploads/{configId}/   | Simple, performant, easy migration path    |
| Form Management | React Hook Form + Zod        | Already in stack, shadcn/ui integration    |
| Database Schema | Extend weddingConfigurations | 1:1 relationship, matches existing pattern |
| Preview Updates | Draft state prop passing     | Zero latency, matches existing pattern     |

## Technology Stack Validation

All decisions comply with Constitution v1.2.0:

- ✅ **Principle I**: Using React Hook Form, shadcn/ui, Tailwind, Drizzle ORM
- ✅ **Principle II**: Performance-first (instant preview, local storage)
- ✅ **Principle IV**: Minimal complexity (no unnecessary abstractions)
- ✅ **Principle VI**: TDD approach for all implementations
- ✅ **Principle VII**: Server Actions for mutations, Server Components for data fetching

## Next Steps

Proceed to Phase 1: Design & Contracts

- Create data-model.md with schema details
- Generate API contracts for all endpoints
- Write failing contract tests
- Create quickstart.md with integration test scenarios
