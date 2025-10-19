# Research: Reorganize Instagram Links and Footer Text

**Date**: 2025-10-14
**Feature**: 008-split-instagram-links

## Research Questions & Findings

### 1. Database Schema Migration Strategy

**Question**: How to safely add new columns and deprecate old column in Turso/libSQL with Drizzle ORM?

**Current Schema** (app/db/schema/weddings.ts:32-33):

```typescript
instagramLink: text('instagram_link'),
footerText: text('footer_text'),
```

**Research Findings**:

- Drizzle ORM uses schema-first approach - schema changes drive migrations
- SQLite/libSQL supports `ALTER TABLE ADD COLUMN` for adding nullable columns
- Column removal requires careful handling (can keep deprecated column or drop it)
- No automatic migration generation in current setup - manual migration scripts in app/db/

**Decision**:
Add two new columns (`groomsInstagramLink`, `brideInstagramLink`) and deprecate (but keep) `instagramLink` column for backward compatibility. The deprecated column will be nullable and ignored by application logic.

**Migration Approach**:

1. Add `groomsInstagramLink: text('grooms_instagram_link')`
2. Add `brideInstagramLink: text('bride_instagram_link')`
3. Keep `instagramLink` column (deprecated, no longer used)
4. Update TypeScript types to reflect new schema

**Rationale**:

- Keeping deprecated column prevents migration complexity
- Nullable columns added safely without breaking existing records
- Clear naming convention: `grooms_instagram_link` and `bride_instagram_link` (snake_case for database)
- No data migration needed (clarification confirmed testing data can be cleared)

**Alternatives Considered**:

- Drop old column: Rejected - requires explicit migration script and data handling
- Migrate existing data: Rejected - clarification confirmed no production data exists

---

### 2. Feature Toggle Naming Convention

**Question**: What should `instagram_link` be renamed to for better clarity?

**Current Pattern** (app/db/schema/features.ts:17-28):

```typescript
featureName: text('feature_name', {
  enum: [
    'love_story', // Multi-word features use underscore
    'rsvp', // Single acronym
    'gallery', // Single word
    'prewedding_videos', // Multi-word with underscore
    'faqs', // Plural acronym
    'dress_code', // Multi-word with underscore
    'instagram_link', // Current name (singular link)
    'wishes', // Single word plural
  ],
})
```

**Research Findings**:

- Naming convention: snake_case, descriptive, matches feature purpose
- Multi-word features use underscores (e.g., `love_story`, `dress_code`)
- Current name `instagram_link` is singular but now controls TWO links

**Decision**:
Rename `instagram_link` to `instagram_links` (plural) to accurately reflect that it controls both groom's and bride's Instagram links.

**Rationale**:

- Plural form indicates multiple links
- Minimal change (just add 's') reduces migration complexity
- Maintains snake_case convention
- Still clearly descriptive

**Alternatives Considered**:

- `social_media_links`: Rejected - too broad, feature only supports Instagram
- `couple_instagram`: Rejected - deviates from existing naming pattern
- Keep `instagram_link`: Rejected - inaccurate since it now controls two links

---

### 3. UI Tab Content Organization

**Question**: How is Content tab currently structured in ConfigDashboard?

**Current Implementation** (app/components/ConfigDashboard.tsx:182-204):

```typescript
<button
    onClick={() => setActiveTab('content')}
    className={`flex-1 py-3 text-sm font-medium ${
        activeTab === 'content'
            ? 'border-b-2 border-pink-600 text-pink-600'
            : 'text-gray-500 hover:text-gray-700'
    }`}
>
    Content
</button>
```

Content tab body:

```typescript
{activeTab === 'content' && (
    <div className="space-y-4">
        <p className="text-gray-600">Content management coming soon...</p>
        <p className="text-sm text-gray-500">
            Manage love story, locations, FAQs, and other content here.
        </p>
    </div>
)}
```

**Research Findings**:

- Content tab currently shows placeholder text only
- No actual form implementation exists yet
- Basic Info tab uses `BasicInfoForm` component with React Hook Form
- Form structure: labeled inputs in `space-y-4` container

**Decision**:
Create new `ContentForm` component following the same pattern as `BasicInfoForm`:

- React Hook Form for form handling
- Labeled text inputs for Instagram links with URL validation
- Textarea for footer text
- Save button with loading state
- Grid layout for paired fields (groom/bride Instagram links side-by-side)

**Rationale**:

- Consistent with existing dashboard UX
- Follows established form pattern in codebase
- Natural organization: social links together, footer separate
- Validation at form level prevents invalid data

**Alternatives Considered**:

- Add to existing BasicInfoForm: Rejected - violates the requirement to move OUT of Basic Info
- Separate tab for social media: Rejected - over-engineering for just Instagram links

---

### 4. Template Rendering Pattern

**Question**: How does Template1Preview currently render Instagram link in footer?

**Current Implementation** (app/components/preview/Template1Preview.tsx:388-404):

```typescript
<footer className="p-6 bg-primary-main text-secondary-main">
    <p className="text-md text-center">
        Thank you for being part of our journey and celebrating this special day with us.
    </p>
    {features.instagram_link && config.instagramLink && (
        <p className="text-sm text-center mt-4">
            Follow us on{' '}
            <a
                href={config.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
            >
                Instagram
            </a>
        </p>
    )}
    {config.footerText && (
        <p className="text-sm text-center mt-2 text-gray-300">{config.footerText}</p>
    )}
</footer>
```

**Research Findings**:

- Footer displays single Instagram link with "Follow us on Instagram" text
- Feature toggle check: `features.instagram_link` controls visibility
- Null-safe: only renders if `config.instagramLink` exists
- Footer text rendered separately below Instagram link

**Decision**:
Update footer to display both Instagram links separately:

```typescript
{features.instagram_links && (config.groomsInstagramLink || config.brideInstagramLink) && (
    <div className="text-sm text-center mt-4 space-y-1">
        {config.groomsInstagramLink && (
            <p>
                Follow {config.groomName} on{' '}
                <a href={config.groomsInstagramLink} target="_blank" rel="noopener noreferrer" className="underline">
                    Instagram
                </a>
            </p>
        )}
        {config.brideInstagramLink && (
            <p>
                Follow {config.brideName} on{' '}
                <a href={config.brideInstagramLink} target="_blank" rel="noopener noreferrer" className="underline">
                    Instagram
                </a>
            </p>
        )}
    </div>
)}
```

**Rationale**:

- Personalized: Uses actual names (groom/bride) from config
- Flexible: Shows 0, 1, or 2 links based on what's provided
- Consistent: Maintains same styling and link behavior
- Clear: Each person has their own "Follow X on Instagram" line
- Feature toggle now checks `features.instagram_links` (renamed)

**Alternatives Considered**:

- Single line with "Follow us on Instagram" and two links: Rejected - unclear which link is whose
- Icons instead of text: Rejected - adds complexity, not in current design system
- Comma-separated names: Rejected - awkward when only one link provided

---

## Summary of Technical Decisions

### Database Changes

- Add `groomsInstagramLink` and `brideInstagramLink` columns (nullable text)
- Keep deprecated `instagramLink` column (backward compatibility)
- Column names: `grooms_instagram_link`, `bride_instagram_link` (snake_case)

### Feature Toggle Changes

- Rename `instagram_link` → `instagram_links` (plural)
- Maintain single toggle controlling both links together
- Update enum in features.ts and all references

### UI Changes

- Remove `instagramLink` and `footerText` from BasicInfoForm
- Create new ContentForm component with:
  - Groom's Instagram Link (URL input, optional)
  - Bride's Instagram Link (URL input, optional)
  - Footer Text (textarea, optional)
- Replace Content tab placeholder with ContentForm

### Template Changes

- Update footer to show both Instagram links separately
- Personalize text with groom/bride names
- Handle 0, 1, or 2 links gracefully
- Update feature toggle check to `instagram_links`

### API Changes

- Update PUT /api/wedding/config to accept new fields
- Update GET /api/wedding/preview to include new fields
- Remove old `instagramLink` from request/response handling
- Validate URLs when provided (optional but recommended)

---

## Risk Assessment

**Low Risk**:

- Schema changes (adding nullable columns is safe)
- UI reorganization (isolated to ConfigDashboard component)

**Medium Risk**:

- Feature toggle rename (affects multiple files, but straightforward find/replace)
- Template rendering changes (visible to end users, needs careful testing)

**Mitigation**:

- Comprehensive test coverage (unit, integration, e2e)
- Keep deprecated column to avoid data loss
- Incremental deployment: schema first, then code changes

---

## Dependencies

**External**:

- None (all changes internal to codebase)

**Internal**:

- Drizzle ORM schema changes must be applied before code changes
- API updates must be deployed atomically with UI changes
- Template changes depend on data model updates

**Blocking**:

- None (all information gathered, ready for Phase 1 design)

---

**Status**: ✅ Research complete - All NEEDS CLARIFICATION resolved
