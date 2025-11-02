# Tasks: Starting Section Content Management

**Input**: Design documents from `/home/karel/code/wedding-invitation/specs/009-i-want-to/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/, quickstart.md

## Execution Flow (main)

```
1. Load plan.md from feature directory ✓
   → Tech stack: TypeScript 5.x, Next.js 14.2.4, React 18, shadcn/ui, Drizzle ORM
   → Structure: Single app/ directory (Next.js App Router)
2. Load optional design documents ✓
   → data-model.md: WeddingConfiguration entity with 12 new fields
   → contracts/: 2 YAML files (content API, media API)
   → research.md: Server Actions, local file storage, React Hook Form
3. Generate tasks by category ✓
   → Setup: Schema migration, directories
   → Tests: 3 contract tests, 5 component tests, 4 E2E tests
   → Core: Validation, file utilities, API routes, UI components
   → Integration: ConfigDashboard integration, LivePreview updates
   → Polish: Documentation, test verification
4. Apply task rules ✓
   → Different files = [P] for parallel
   → Same file = sequential
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001-T030) ✓
6. Dependencies validated ✓
7. Parallel execution examples included ✓
8. SUCCESS: 30 tasks ready for execution
```

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- All paths are absolute from repository root

## Phase 3.1: Setup & Database Schema

**ARCHITECTURE CHANGE**: Refactored to use separate `starting_section_content` table instead of adding columns to `wedding_configurations`. This follows existing pattern (dressCodes, loveStorySegments, etc.) and scales better for future content management features.

### T001 [P] Create directory structure for new files
**Status**: ✅ COMPLETE
**Description**: Create directories for new components and tests
**Files**:
- `mkdir -p /home/karel/code/wedding-invitation/app/components/admin/sections`
- `mkdir -p /home/karel/code/wedding-invitation/app/lib/validations`
- `mkdir -p /home/karel/code/wedding-invitation/app/utils`
- `mkdir -p /home/karel/code/wedding-invitation/tests/unit/validations`
- `mkdir -p /home/karel/code/wedding-invitation/tests/unit/utils`
- `mkdir -p /home/karel/code/wedding-invitation/tests/components/admin`
- `mkdir -p /home/karel/code/wedding-invitation/tests/e2e/admin`
- `mkdir -p /home/karel/code/wedding-invitation/public/uploads`
**No dependencies**

### T002 [P] Create starting_section_content table schema
**Status**: ✅ COMPLETE (REFACTORED)
**Description**: Create new Drizzle schema for starting_section_content table (separate from wedding_configurations)
**File**: `/home/karel/code/wedding-invitation/app/db/schema/starting-section.ts`
**Table structure**:
- id (TEXT PRIMARY KEY)
- wedding_config_id (TEXT UNIQUE FK to wedding_configurations)
- groom_display_name (TEXT)
- bride_display_name (TEXT)
- show_parent_info (INTEGER, default 0)
- groom_father_name (TEXT)
- groom_mother_name (TEXT)
- bride_father_name (TEXT)
- bride_mother_name (TEXT)
- show_wedding_date (INTEGER, default 1)
- background_type (TEXT enum 'image'|'video')
- background_filename (TEXT)
- background_file_size (INTEGER)
- background_mime_type (TEXT)
- created_at, updated_at (timestamps)
**Pattern**: Follows existing content tables (dressCodes, loveStorySegments, etc.)
**No dependencies**

### T003 [P] Create database migration for starting_section_content table
**Status**: ✅ COMPLETE (REFACTORED)
**Description**: Create SQL migration file to create starting_section_content table
**File**: `/home/karel/code/wedding-invitation/app/db/migrations/009-create-starting-section-content.sql`
**Creates**: starting_section_content table with 1:1 relationship to wedding_configurations
**Index**: idx_starting_section_content_wedding_config_id for fast lookups
**No dependencies**

### T004 Run database migration
**Status**: ✅ COMPLETE
**Description**: Execute migration to create starting_section_content table
**Command**: `yarn db:push --force` (pushed schema changes to Turso database)
**Result**: Table created successfully with all fields and unique index
**Depends on**: T002, T003 (schema and migration must exist)

---

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### T005 [P] Write Zod validation schema unit tests (MUST FAIL)
**Description**: Create failing tests for startingSectionContentSchema and media validation
**File**: `/home/karel/code/wedding-invitation/tests/unit/validations/starting-section.test.ts`
**Test cases**:
- Valid content update with all fields
- Valid partial parent info (groomFather + groomMother only)
- Invalid: groomName exceeds 100 chars → validation error
- Invalid: showParentInfo not boolean → validation error
- Invalid: null values handled correctly
**Expected**: All tests FAIL (validation schema doesn't exist yet)
**No dependencies** (can run parallel with other test tasks)

### T006 [P] Write media validation utility unit tests (MUST FAIL)
**Description**: Create failing tests for file size/type validation functions
**File**: `/home/karel/code/wedding-invitation/tests/unit/utils/media-validation.test.ts`
**Test cases**:
- Valid JPEG image (5MB) → passes validation
- Invalid image (15MB) → fails with "exceeds 10MB" error
- Valid MP4 video (40MB) → passes validation
- Invalid video (60MB) → fails with "exceeds 50MB" error
- Invalid file type (text/plain) → fails with "unsupported type" error
- MIME type detection for jpg, png, webp, gif, mp4, webm
**Expected**: All tests FAIL (utils/media-validation.ts doesn't exist yet)
**No dependencies**

### T007 [P] Write StartingSectionForm component tests (MUST FAIL)
**Description**: Create failing React Testing Library tests for form component
**File**: `/home/karel/code/wedding-invitation/tests/components/admin/StartingSectionForm.test.tsx`
**Test cases**:
- Renders form with groom/bride name inputs
- Parent info toggle shows/hides four input fields
- Form validation triggers on blur (100 char limit)
- Draft state updates preview on change (via onLocalChange callback)
- Save button disabled when no changes
- Save button calls onSave with correct data structure
- Discard button resets form to initial values
**Expected**: All tests FAIL (component doesn't exist yet)
**Setup**: Mock React Hook Form, mock config data
**No dependencies**

### T008 [P] Write E2E test for complete starting section flow (MUST FAIL)
**Description**: Create failing Playwright test for full user journey
**File**: `/home/karel/code/wedding-invitation/tests/e2e/admin/starting-section-management.spec.ts`
**Test flow**:
1. Login to admin dashboard
2. Expand "Starting section" accordion (verify renamed from "Hero")
3. Enter groom name "Alexander Johnson"
4. Enter bride name "Sophia Martinez"
5. Toggle "Show parent information" ON
6. Fill groom's parents (Robert, Mary)
7. Leave bride's parents empty
8. Click Save
9. Verify API call to PUT /api/wedding/config/starting-section
10. Verify preview updates with new names and partial parent info
11. Refresh page
12. Verify data persisted
**Expected**: Test FAILS (UI doesn't exist yet)
**No dependencies**

### T009 [P] Write E2E test for file upload with validation (MUST FAIL)
**Description**: Create failing Playwright test for background media upload
**File**: `/home/karel/code/wedding-invitation/tests/e2e/admin/starting-section-media-upload.spec.ts`
**Test flow**:
1. Login to admin dashboard
2. Navigate to starting section
3. Click "Upload Background Media"
4. Select oversized video (mock 60MB file)
5. Verify error message: "Video file size exceeds maximum of 50 MB"
6. Select valid image (mock 5MB JPEG)
7. Verify upload progress
8. Verify preview shows new background
9. Select new video (mock 30MB MP4)
10. Verify confirmation dialog appears
11. Click "Replace"
12. Verify old file deleted, new file shown
**Expected**: Test FAILS (upload functionality doesn't exist)
**No dependencies**

---

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### T010 [P] Implement Zod validation schemas
**Description**: Create validation schemas for starting section content and media
**File**: `/home/karel/code/wedding-invitation/app/lib/validations/starting-section.ts`
**Exports**:
- `startingSectionContentSchema` - Zod schema for text content
  - groomName: string max 100, optional, nullable
  - brideName: string max 100, optional, nullable
  - showParentInfo: boolean optional
  - groomFatherName, groomMotherName, brideFatherName, brideMotherName: string max 100, optional, nullable
  - showWeddingDate: boolean optional
- `startingSectionMediaSchema` - Zod schema for file upload
  - file: File instance with size/type refinements
  - replaceExisting: boolean optional
**Constants**: MAX_IMAGE_SIZE (10MB), MAX_VIDEO_SIZE (50MB), ACCEPTED_IMAGE_TYPES, ACCEPTED_VIDEO_TYPES
**Reference**: data-model.md Zod schema section
**Verification**: npm test tests/unit/validations/starting-section.test.ts (should now PASS)
**Depends on**: T005 (tests must exist and fail first)

### T011 [P] Implement media validation utilities
**Description**: Create utility functions for validating file size and MIME types
**File**: `/home/karel/code/wedding-invitation/app/utils/media-validation.ts`
**Functions**:
- `validateImageFile(file: File): { valid: boolean; error?: string }` - Checks size ≤10MB, type in [jpeg, png, webp, gif]
- `validateVideoFile(file: File): { valid: boolean; error?: string }` - Checks size ≤50MB, type in [mp4, webm]
- `getMediaType(mimeType: string): 'image' | 'video' | null` - Determines category from MIME
- `formatFileSize(bytes: number): string` - Human-readable size (e.g., "5.2 MB")
**Error messages**: Match quickstart.md expectations
**Verification**: npm test tests/unit/utils/media-validation.test.ts (should now PASS)
**Depends on**: T006 (tests must exist and fail first)

### T012 [P] Implement file upload utilities
**Description**: Create helper functions for saving/deleting files on filesystem
**File**: `/home/karel/code/wedding-invitation/app/lib/file-upload.ts`
**Functions**:
- `saveBackgroundMedia(file: File, configId: string): Promise<{ filename, fileSize, mimeType, type }>` - Saves to public/uploads/{configId}/starting-section/, generates timestamped filename
- `deleteBackgroundMedia(filename: string, configId: string): Promise<void>` - Deletes file from uploads directory
- `ensureUploadDirectory(configId: string): Promise<void>` - Creates directory if missing
**Storage path**: `public/uploads/{configId}/starting-section/background-{type}-{timestamp}.{ext}`
**Error handling**: Wrap fs operations in try/catch, return descriptive errors
**No tests** (covered by integration/E2E tests)
**No dependencies** (can run parallel with validation tasks)

### T013 Create starting section content API route
**Description**: Implement PUT endpoint for updating starting section text content
**File**: `/home/karel/code/wedding-invitation/app/api/wedding/config/starting-section/route.ts`
**Method**: PUT
**Logic**:
1. Validate session (get userId from cookie)
2. Parse request body
3. Validate with startingSectionContentSchema
4. Update database via Drizzle ORM (update weddingConfigurations set {...} where userId = ?)
5. Revalidate /admin path
6. Return success response with updated config
**Error handling**: 401 (no session), 400 (validation), 500 (DB error)
**Reference**: contracts/starting-section-content.yaml
**Verification**: Manual test with curl or Postman
**Depends on**: T010 (Zod schema must exist)

### T014 Create background media upload API route
**Description**: Implement POST endpoint for uploading background images/videos
**File**: `/home/karel/code/wedding-invitation/app/api/wedding/media/starting-section/route.ts`
**Method**: POST
**Logic**:
1. Validate session
2. Parse FormData to get file and replaceExisting flag
3. Validate file with media validation utils
4. Check if existing background media in DB
5. If existing file && !replaceExisting → return requiresConfirmation: true
6. Save file with file-upload utils
7. Delete old file if replacing
8. Update DB with new filename/size/mimeType/type
9. Revalidate /admin
10. Return success with file metadata
**Error handling**: 400 (file size/type), 401 (no session), 413 (payload too large), 500 (upload failed)
**Reference**: contracts/starting-section-media.yaml
**Verification**: Manual test with form upload
**Depends on**: T011 (media validation utils), T012 (file upload utils)

### T015 Create background media delete API route
**Description**: Implement DELETE endpoint for removing background media
**File**: Same file as T014: `/home/karel/code/wedding-invitation/app/api/wedding/media/starting-section/route.ts`
**Method**: DELETE
**Logic**:
1. Validate session
2. Get wedding config from DB
3. If no background filename → return 404
4. Delete file from filesystem
5. Update DB to null out background fields (type, filename, fileSize, mimeType)
6. Revalidate /admin
7. Return success
**Error handling**: 401 (no session), 404 (no media), 500 (deletion failed)
**Verification**: Manual test after uploading a file
**Depends on**: T014 (same file, add DELETE export)

### T016 [P] Create shadcn FileUpload component
**Description**: Create reusable file upload component with drag-drop and validation
**File**: `/home/karel/code/wedding-invitation/app/components/ui/file-upload.tsx`
**Props**:
- accept: string (MIME types)
- maxSize: number (bytes)
- onUpload: (file: File) => void
- onError: (error: string) => void
- existingFile?: string (show current file if present)
- onDelete?: () => void (delete button)
**Features**:
- Drag and drop support
- File size preview
- Validation before onUpload callback
- Progress indicator (optional, can be added later)
**Styling**: Tailwind CSS, matches shadcn/ui design system
**No test file** (covered by StartingSectionForm tests)
**No dependencies**

### T017 Create StartingSectionForm component
**Description**: Implement main form component for starting section configuration
**File**: `/home/karel/code/wedding-invitation/app/components/admin/sections/StartingSectionForm.tsx`
**Props**:
- config: WeddingConfiguration (includes all starting section fields)
- onSave: (data: StartingSectionUpdate) => Promise<void>
- onLocalChange: (draftContent: Partial<StartingSectionContent>) => void (for preview)
- saving: boolean
**State management**: React Hook Form with zodResolver(startingSectionContentSchema)
**UI sections**:
1. Groom and Bride names (text inputs)
2. Parent information toggle + 4 name inputs (conditional rendering)
3. Wedding date display toggle
4. Background media upload (uses FileUpload component)
**Features**:
- Draft state tracking (highlight unsaved changes)
- Save/Discard buttons (only show when changes exist)
- Instant preview updates via onLocalChange
- Confirmation dialog for file replacement
**Styling**: shadcn/ui form components, Tailwind CSS
**Verification**: npm test tests/components/admin/StartingSectionForm.test.tsx (should now PASS)
**Depends on**: T007 (tests must exist), T010 (Zod schema), T016 (FileUpload component)

### T018 Integrate StartingSectionForm into ConfigDashboard
**Description**: Add Starting section accordion item with form in ConfigDashboard
**File**: `/home/karel/code/wedding-invitation/app/components/ConfigDashboard.tsx`
**Changes**:
1. Import StartingSectionForm
2. Add state for draftStartingSection (similar to draftFeatures pattern)
3. Update features array: Change 'hero' label from "Hero" to "Starting section"
4. Update accordion item for 'hero' feature:
   - Replace placeholder content with <StartingSectionForm />
   - Pass config, onSave handler, onLocalChange handler, saving prop
5. Update onLocalChange to set draftStartingSection state
6. Pass draftStartingSection to LivePreview component
**Reference**: Existing ConfigDashboard.tsx lines 216-437 for accordion pattern
**Verification**: Load /admin page, expand "Starting section", verify form renders
**Depends on**: T017 (StartingSectionForm component must exist)

### T019 Update LivePreview component to handle starting section draft state
**Description**: Modify LivePreview to accept and display draft starting section content
**File**: `/home/karel/code/wedding-invitation/app/components/LivePreview.tsx`
**Changes**:
1. Add prop: draftStartingSection?: Partial<StartingSectionContent>
2. Merge draftStartingSection into preview URL params or pass via postMessage
3. Preview iframe should render starting section with draft values immediately
**Implementation note**: May require updating preview page to accept draft params
**Verification**: Change starting section form values, verify preview updates within <100ms
**Depends on**: T018 (draft state must be passed from ConfigDashboard)

---

## Phase 3.4: Integration & E2E Test Verification

### T020 Verify E2E test: Complete starting section configuration flow
**Description**: Run E2E test and ensure it passes with implemented UI and API
**Command**: `npx playwright test tests/e2e/admin/starting-section-management.spec.ts`
**Expected**: Test PASSES (previously failed at T008)
**Fixes**: If test fails, debug and fix UI/API issues until green
**Verification**: All assertions pass, no errors in console
**Depends on**: T018 (UI integrated), T013 (API implemented)

### T021 Verify E2E test: File upload with validation
**Description**: Run E2E test for media upload and ensure it passes
**Command**: `npx playwright test tests/e2e/admin/starting-section-media-upload.spec.ts`
**Expected**: Test PASSES (previously failed at T009)
**Fixes**: If test fails, debug file upload, validation, confirmation dialog
**Verification**: File upload works, validation messages correct, replacement confirmed
**Depends on**: T018 (UI integrated), T014 (upload API), T015 (delete API)

### T022 [P] Write integration test for wedding date fallback logic
**Description**: Create test verifying placeholder date when weddingDate is null
**File**: `/home/karel/code/wedding-invitation/tests/integration/wedding-date-fallback.test.ts`
**Test cases**:
1. weddingDate exists → displays formatted date
2. weddingDate null, showWeddingDate true → displays "1 January 2050" placeholder
3. showWeddingDate false → hides date section entirely
**Mock**: Database with various weddingDate values
**Run**: npm test tests/integration/wedding-date-fallback.test.ts
**Verification**: All cases pass
**No dependencies** (can run parallel with other tests)

### T023 [P] Write integration test for partial parent info display
**Description**: Create test verifying partial parent info rendering logic
**File**: `/home/karel/code/wedding-invitation/tests/integration/partial-parent-info.test.ts`
**Test cases**:
1. All four parent names filled → shows both "Son of..." and "Daughter of..."
2. Only groom parents filled → shows only "Son of...", hides bride's line
3. Only bride parents filled → shows only "Daughter of...", hides groom's line
4. No parent names filled → hides both lines
5. One parent name per couple (e.g., only father) → hides that couple's line (needs both)
**Verification**: Display logic matches FR-013 requirements
**No dependencies**

---

## Phase 3.5: Polish & Documentation

### T024 [P] Run full test suite and verify 80% coverage
**Description**: Execute all unit, component, integration, and E2E tests
**Commands**:
- `npm test` (runs all Jest tests)
- `npx playwright test` (runs all E2E tests)
- `npm run test:coverage` (check coverage report)
**Expected**:
- All tests PASS
- Coverage ≥80% for new files (starting-section.ts, media-validation.ts, StartingSectionForm.tsx)
**Fixes**: Add missing tests if coverage below 80%
**Verification**: Generate and review coverage report
**No dependencies** (final verification step)

### T025 [P] Update README with starting section features
**Description**: Document new starting section content management feature
**File**: `/home/karel/code/wedding-invitation/README.md`
**Section to add**: Under "Features" or "Admin Dashboard" section
**Content**:
- Starting section configuration (names, parent info, wedding date, background media)
- File size limits (10MB images, 50MB videos)
- Supported file types
- Real-time preview
**Keep brief**: 3-4 bullet points
**No dependencies**

### T026 [P] Add inline documentation to StartingSectionForm component
**Description**: Add JSDoc comments to component and key functions
**File**: `/home/karel/code/wedding-invitation/app/components/admin/sections/StartingSectionForm.tsx`
**Add comments for**:
- Component purpose and props
- Key state variables (draftContent, changedFields)
- Complex logic (partial parent info validation, file replacement confirmation)
**Format**: TSDoc/JSDoc style
**Verification**: Comments are clear and helpful
**No dependencies**

### T027 [P] Add inline documentation to API routes
**Description**: Add comments explaining API contract and business logic
**Files**:
- `/home/karel/code/wedding-invitation/app/api/wedding/config/starting-section/route.ts`
- `/home/karel/code/wedding-invitation/app/api/wedding/media/starting-section/route.ts`
**Add comments for**:
- Request/response format
- Validation logic
- File replacement confirmation flow
- Error codes
**Reference**: contracts/*.yaml for API specifications
**No dependencies**

### T028 Manual testing: Upload real files and verify storage
**Description**: Perform manual QA of file upload with actual image and video files
**Steps**:
1. Login to admin dashboard
2. Upload real JPEG image (< 10MB)
3. Verify file saved to public/uploads/{configId}/starting-section/
4. Verify database updated with correct filename, size, MIME type
5. Verify preview shows image
6. Upload real MP4 video (< 50MB)
7. Confirm replacement
8. Verify old image deleted, new video saved
9. Test file deletion
10. Verify file removed from disk and DB cleared
**Checklist**: All file operations work correctly, no errors
**Depends on**: T021 (E2E tests pass)

### T029 Verify quickstart.md scenarios manually
**Description**: Run through all 10 scenarios in quickstart.md as manual QA
**File**: `/home/karel/code/wedding-invitation/specs/009-i-want-to/quickstart.md`
**Scenarios to verify**:
1. Edit groom and bride names ✓
2. Toggle parent information display ✓
3. Save partial parent information ✓
4. Upload background image with validation ✓
5. Upload oversized video with error ✓
6. Replace existing background media ✓
7. Toggle wedding date display ✓
8. Rename "Hero Content" to "Starting section" ✓
9. Preview updates instantly ✓
10. Name fallback from basic info ✓
**Checklist**: All scenarios pass, no bugs found
**Verification**: All FRs validated (FR-001 through FR-018)
**Depends on**: T028 (manual file testing complete)

### T030 Final cleanup and commit
**Description**: Review all changes, remove debug code, format code, commit
**Steps**:
1. Run ESLint: `npm run lint`
2. Run Prettier: `npm run format` (or equivalent)
3. Remove any console.log debug statements
4. Remove unused imports
5. Verify TypeScript strict mode compliance: `npm run type-check`
6. Git commit all changes with message:
   ```
   feat(admin): add Starting section content management

   - Add 12 fields to wedding_configurations schema
   - Implement content update API (PUT /api/wedding/config/starting-section)
   - Implement media upload/delete APIs (POST/DELETE /api/wedding/media/starting-section)
   - Create StartingSectionForm component with React Hook Form + Zod validation
   - Add file upload with size validation (10MB images, 50MB videos)
   - Support partial parent information saves
   - Real-time preview updates with draft state
   - Rename "Hero Content" to "Starting section" in UI
   - Tests: unit + component + integration + E2E (80%+ coverage)

   Closes #009-i-want-to

   🤖 Generated with Claude Code
   Co-Authored-By: Claude <noreply@anthropic.com>
   ```
**Verification**: Clean git status, all tests pass, no linter errors
**Depends on**: T029 (all scenarios verified)

---

## Dependencies

### Critical Path
1. **Setup** (T001-T004) → Database ready
2. **Tests** (T005-T009) → All tests written and FAILING
3. **Core** (T010-T019) → Implementation makes tests PASS
4. **Verification** (T020-T023) → All tests GREEN
5. **Polish** (T024-T030) → Documentation and cleanup

### Blocking Dependencies
- T004 blocks T013, T014, T015 (API routes need schema)
- T005 blocks T010 (tests must fail before implementation)
- T006 blocks T011 (tests must fail before implementation)
- T007 blocks T017 (tests must fail before implementation)
- T010 blocks T013, T017 (Zod schemas needed)
- T011 blocks T014 (validation utils needed)
- T012 blocks T014 (file utils needed)
- T014 blocks T015 (same file, sequential)
- T016 blocks T017 (FileUpload component needed)
- T017 blocks T018 (form component needed)
- T018 blocks T019, T020, T021 (integration needed)
- T020, T021 block T028, T029 (automated tests before manual QA)
- T029 blocks T030 (verify all scenarios before commit)

### Parallel Opportunities
- **Setup phase**: T001, T002, T003 (different files)
- **Test phase**: T005, T006, T007, T008, T009 (different test files)
- **Implementation**: T010, T011, T012, T016 (different files)
- **Integration tests**: T022, T023 (different test files)
- **Documentation**: T024, T025, T026, T027 (different files)

---

## Parallel Execution Examples

### Launch all test-writing tasks together:
```bash
# T005, T006, T007, T008, T009 - Write failing tests
# These can all run in parallel since they write to different files
```

### Launch parallel implementation tasks:
```bash
# T010, T011, T012, T016 - Implement utilities and base components
# These can run in parallel (different files, no dependencies)
```

### Launch parallel documentation tasks:
```bash
# T024, T025, T026, T027 - Coverage check, README, inline docs
# These can run in parallel as final polish
```

---

## Notes

- **TDD Enforcement**: Tasks T005-T009 MUST complete and FAIL before T010-T019 begin
- **File Paths**: All paths are absolute from `/home/karel/code/wedding-invitation/`
- **[P] Tags**: 14 tasks can run in parallel (different files)
- **Sequential Tasks**: 16 tasks must run sequentially (same file or dependencies)
- **Test Coverage**: Target 80% for all new files (validated in T024)
- **Performance**: Verify <200ms API responses, <100ms preview updates
- **File Uploads**: Test with real files in T028 before considering complete

---

## Task Generation Rules Applied

1. **From Contracts** ✓
   - starting-section-content.yaml → T013 (API route)
   - starting-section-media.yaml → T014, T015 (upload/delete APIs)

2. **From Data Model** ✓
   - WeddingConfiguration extension → T002 (migration), T003 (schema)
   - 12 new fields → Database tasks

3. **From User Stories (quickstart.md)** ✓
   - Scenario 1 (edit names) → T008, T020 (E2E tests)
   - Scenario 4 (upload file) → T009, T021 (E2E tests)
   - Scenarios 3, 7, 10 → T022, T023 (integration tests)
   - All scenarios → T029 (manual verification)

4. **Ordering** ✓
   - Setup (T001-T004) → Tests (T005-T009) → Core (T010-T019) → Verification (T020-T023) → Polish (T024-T030)

---

## Validation Checklist

_GATE: Verified during task generation_

- [x] All contracts have corresponding tests (T005-T009 cover both YAML contracts)
- [x] All entities have model tasks (T002 migration, T003 schema for WeddingConfiguration)
- [x] All tests come before implementation (T005-T009 before T010-T019)
- [x] Parallel tasks truly independent (14 [P] tasks use different files)
- [x] Each task specifies exact file path (all tasks include full paths)
- [x] No task modifies same file as another [P] task (validated: no conflicts)
- [x] TDD enforced (tests MUST FAIL before implementation)
- [x] 80% coverage target included (T024)
- [x] All FR-001 through FR-018 covered by tests

---

**Total Tasks**: 30
**Parallel Tasks**: 14 marked [P]
**Sequential Tasks**: 16 (dependencies or same-file edits)
**Estimated Completion**: 8-12 hours (with parallel execution)

🚀 Ready for execution with `/implement` or manual task completion
