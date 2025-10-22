# Implementation Plan: Starting Section Content Management

**Branch**: `009-i-want-to` | **Date**: 2025-10-18 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/home/karel/code/wedding-invitation/specs/009-i-want-to/spec.md`

## Execution Flow (/plan command scope)

```
1. Load feature spec from Input path ✓
   → Spec loaded successfully
2. Fill Technical Context ✓
   → Project Type: Next.js 14 web application (App Router)
   → Structure Decision: Single app/ directory
3. Fill the Constitution Check section ✓
4. Evaluate Constitution Check section
   → No violations detected ✓
   → Update Progress Tracking: Initial Constitution Check ✓
5. Execute Phase 0 → research.md ✓
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, CLAUDE.md ✓
7. Re-evaluate Constitution Check section
   → No new violations ✓
   → Update Progress Tracking: Post-Design Constitution Check ✓
8. Plan Phase 2 → Describe task generation approach ✓
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 8. Phases 2-4 are executed by other commands:

- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary

Add content management capabilities for the Starting section (formerly "Hero" section) in the wedding invitation admin dashboard. Administrators can configure couple names, parent information (with partial support), wedding date display with fallback, and background media (image or video) with file size validation. All content is persisted to database with real-time preview updates.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 14.2.4 App Router
**Primary Dependencies**: React 18, shadcn/ui (Radix UI primitives), Tailwind CSS, React Hook Form, Drizzle ORM
**Storage**: Turso (libSQL) with Drizzle ORM
**Testing**: Jest, React Testing Library, Playwright, MSW
**Target Platform**: Web (modern browsers)
**Project Type**: Web application (single app/ directory structure)
**Performance Goals**: <200ms UI updates, <100ms form validation, smooth 60fps animations
**Constraints**: 50MB max video files, 10MB max image files, file confirmation on replacement
**Scale/Scope**: Single-tenant per wedding config, ~10-20 form fields, real-time preview updates

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Technology Stack Compliance

- [x] Next.js 14.2.4 App Router architecture
- [x] TypeScript strict mode
- [x] shadcn/ui for new components (form inputs, toggles, file upload)
- [x] Tailwind CSS for styling
- [x] Turso/Drizzle ORM for database operations
- [x] React Hook Form for form management

### Performance Standards

- [x] Server Components for data fetching (admin page already uses async/await)
- [x] Client Components only where interactivity needed (form components)
- [x] Proper file size validation before upload (10MB images, 50MB videos)
- [x] Optimized image/video handling

### Data Fetching Patterns

- [x] Server Components fetch data directly (admin page pattern)
- [x] Client Components receive data as props
- [x] Server Actions for mutations (file uploads, config updates)
- [x] No useEffect + fetch pattern for initial load

### Testing Requirements

- [x] Jest + React Testing Library for component tests (TDD approach)
- [x] Playwright for e2e admin dashboard flows
- [x] MSW for API mocking
- [x] 80% minimum coverage target

### Code Quality

- [x] ESLint (next/core-web-vitals)
- [x] Prettier (4-space, single quotes, 120 char width)
- [x] TypeScript strict mode
- [x] Feature-based file organization

**Initial Check**: PASS ✓
**Post-Design Check**: PASS ✓

## Project Structure

### Documentation (this feature)

```
specs/009-i-want-to/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)

```
app/
├── admin/
│   └── page.tsx                                  # Admin dashboard (Server Component)
├── components/
│   ├── ConfigDashboard.tsx                       # Main dashboard container (Client)
│   ├── admin/
│   │   └── sections/
│   │       └── StartingSectionForm.tsx          # NEW: Starting section form (Client)
│   ├── ui/                                       # shadcn/ui components
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── switch.tsx
│   │   ├── label.tsx
│   │   └── file-upload.tsx                      # NEW: File upload component
│   └── LivePreview.tsx                           # Preview iframe component
├── db/
│   ├── schema/
│   │   ├── weddings.ts                           # MODIFY: Add starting section fields
│   │   └── content.ts                            # Reference for pattern
│   └── migrations/                                # NEW: Migration files
├── api/
│   └── wedding/
│       ├── config/
│       │   └── route.ts                          # MODIFY: Handle starting section updates
│       └── media/
│           └── upload/
│               └── route.ts                      # NEW: File upload endpoint
├── lib/
│   ├── validations/
│   │   └── starting-section.ts                  # NEW: Zod schemas
│   └── file-upload.ts                            # NEW: File upload utilities
└── utils/
    └── media-validation.ts                       # NEW: File size/type validation

tests/
├── unit/
│   ├── validations/
│   │   └── starting-section.test.ts             # NEW: Validation tests
│   └── utils/
│       └── media-validation.test.ts             # NEW: Media validation tests
├── components/
│   └── admin/
│       └── StartingSectionForm.test.tsx         # NEW: Component tests
└── e2e/
    └── admin/
        └── starting-section-management.spec.ts  # NEW: E2E tests
```

**Structure Decision**: Next.js App Router single application structure. Using existing app/ directory with feature-based component organization under app/components/admin/sections/. Database schema modifications in app/db/schema/weddings.ts. Following constitutional pattern of Server Components for pages and Client Components for interactive forms.

## Phase 0: Outline & Research

**Status**: ✓ Complete

### Research Tasks Completed

1. **File Upload Patterns in Next.js 14 App Router**
   - Decision: Use Server Actions with FormData for file uploads
   - Rationale: Built-in streaming support, automatic revalidation, type-safe
   - Alternatives considered: API routes (legacy, more boilerplate), tRPC (overkill for this scope)

2. **File Storage Strategy**
   - Decision: Store files in public/uploads/{weddingConfigId}/starting-section/ directory
   - Rationale: Simple, works with existing infrastructure, easy to serve via Next.js static files
   - Alternatives considered: Cloud storage (S3, Cloudinary - adds complexity), database BLOBs (not scalable)

3. **Form State Management with React Hook Form + shadcn/ui**
   - Decision: Use React Hook Form with Zod validation schema
   - Rationale: Type-safe, integrates perfectly with shadcn/ui form components, already in tech stack
   - Alternatives considered: Formik (less TypeScript support), plain React state (too verbose)

4. **Database Schema Extension Strategy**
   - Decision: Extend weddingConfigurations table with new nullable columns for starting section
   - Rationale: One-to-one relationship, all starting section data belongs to wedding config
   - Alternatives considered: Separate startingSections table (over-normalized for simple fields)

5. **Preview Update Mechanism**
   - Decision: Pass draftFeatures-style state to LivePreview component for immediate updates
   - Rationale: Matches existing ConfigDashboard pattern for instant feedback
   - Alternatives considered: WebSocket/SSE (overkill), polling (inefficient)

**Output**: research.md (contains detailed findings)

## Phase 1: Design & Contracts

**Status**: ✓ Complete

### 1. Data Model (data-model.md)

**Extended Entity**: WeddingConfiguration

**New Fields**:
```typescript
// Starting Section Content
startingSectionGroomName: string | null          // Editable groom name for display
startingSectionBrideName: string | null          // Editable bride name for display
startingSectionShowParentInfo: boolean           // Toggle for parent info display
startingSectionGroomFatherName: string | null    // X in "Son of X and Y"
startingSectionGroomMotherName: string | null    // Y in "Son of X and Y"
startingSectionBrideFatherName: string | null    // Z in "Daughter of Z and A"
startingSectionBrideMotherName: string | null    // A in "Daughter of Z and A"
startingSectionShowWeddingDate: boolean          // Toggle for wedding date display
startingSectionBackgroundType: 'image' | 'video' | null  // Background media type
startingSectionBackgroundFilename: string | null  // Stored filename
startingSectionBackgroundFileSize: number | null  // File size in bytes
startingSectionBackgroundMimeType: string | null  // MIME type
```

**Validation Rules**:
- Groom/bride names: Max 100 chars, required if section enabled
- Parent names: Max 100 chars, optional (partial save allowed)
- Background media: 10MB max for images, 50MB max for videos
- Supported image types: image/jpeg, image/png, image/webp, image/gif
- Supported video types: video/mp4, video/webm

**Relationships**:
- One-to-one with WeddingConfiguration (extends existing table)
- References basicInfo.weddingDate for date fallback

### 2. API Contracts (contracts/)

**Contract 1: Update Starting Section Content**
```typescript
PUT /api/wedding/config/starting-section
Request: {
  groomName?: string
  brideName?: string
  showParentInfo?: boolean
  groomFatherName?: string | null
  groomMotherName?: string | null
  brideFatherName?: string | null
  brideMotherName?: string | null
  showWeddingDate?: boolean
}
Response: {
  success: boolean
  data: WeddingConfiguration
}
Validation:
  - Names max 100 chars
  - Boolean flags must be boolean type
  - Partial parent info allowed (null for missing names)
Error Codes:
  - 400: Validation error
  - 401: Unauthorized
  - 500: Server error
```

**Contract 2: Upload Background Media**
```typescript
POST /api/wedding/media/starting-section
Content-Type: multipart/form-data
Request: {
  file: File (FormData)
  replaceExisting?: boolean  // Confirmation flag
}
Response: {
  success: boolean
  data: {
    filename: string
    fileSize: number
    mimeType: string
    type: 'image' | 'video'
  }
  requiresConfirmation?: boolean  // If existing file and no confirmation
  existingFile?: string           // Existing filename if confirmation needed
}
Validation:
  - Image: max 10MB, types: jpeg/png/webp/gif
  - Video: max 50MB, types: mp4/webm
  - Prompt for confirmation if replacing existing file
Error Codes:
  - 400: File size exceeded, invalid type
  - 401: Unauthorized
  - 413: Payload too large
  - 500: Upload failed
```

**Contract 3: Delete Background Media**
```typescript
DELETE /api/wedding/media/starting-section
Response: {
  success: boolean
}
Error Codes:
  - 401: Unauthorized
  - 404: No media to delete
  - 500: Deletion failed
```

### 3. Contract Tests (tests/contract/)

Generated failing contract tests:
- `starting-section-content.contract.test.ts` - Tests content update API
- `starting-section-media.contract.test.ts` - Tests media upload/delete APIs

### 4. Integration Test Scenarios (quickstart.md)

Extracted from user stories:
1. Admin edits groom and bride names → Names persist and preview updates
2. Admin toggles parent info → Four input fields appear/hide
3. Admin fills partial parent info → Only filled info displays
4. Admin uploads background image → File validates, confirms replacement, saves
5. Admin uploads oversized video → Clear error message, file rejected
6. Admin toggles wedding date → Date from basic info or "1 January 2050" placeholder

### 5. Agent Context Update

Executed: `.specify/scripts/bash/update-agent-context.sh claude`

Updated CLAUDE.md with:
- New feature: Starting section content management (009-i-want-to)
- Technologies: React Hook Form, Zod validation, shadcn/ui forms
- Recent changes: Added starting section fields to wedding config schema

## Phase 2: Task Planning Approach

_This section describes what the /tasks command will do - DO NOT execute during /plan_

**Task Generation Strategy**:

1. **Load Base Template**
   - Use `.specify/templates/tasks-template.md` as structure
   - Follow TDD order: tests before implementation

2. **Generate from Artifacts**
   - From `contracts/` → Generate contract test tasks
   - From `data-model.md` → Generate migration and schema tasks
   - From `quickstart.md` → Generate integration test tasks

3. **Task Categories**:

   **A. Database & Schema (Priority 1)**
   - [P] Write migration for starting section fields
   - [P] Update weddings.ts schema with new fields
   - [P] Write schema validation tests

   **B. Server Layer - Tests First (Priority 2)**
   - Write failing contract test: PUT /api/wedding/config/starting-section
   - Write failing contract test: POST /api/wedding/media/starting-section
   - Write failing contract test: DELETE /api/wedding/media/starting-section
   - Write failing validation tests for Zod schemas
   - Write failing media validation util tests

   **C. Server Layer - Implementation (Priority 3)**
   - Implement Zod validation schema (lib/validations/starting-section.ts)
   - Implement media validation utils (utils/media-validation.ts)
   - Implement file upload utilities (lib/file-upload.ts)
   - Implement starting section content API route
   - Implement media upload API route with confirmation logic
   - Implement media delete API route

   **D. UI Components - Tests First (Priority 4)**
   - Write failing component test: StartingSectionForm basic rendering
   - Write failing component test: Parent info toggle behavior
   - Write failing component test: File upload with size validation
   - Write failing component test: File replacement confirmation
   - Write failing component test: Partial parent info save

   **E. UI Components - Implementation (Priority 5)**
   - Create FileUpload shadcn component
   - Create StartingSectionForm component
   - Integrate StartingSectionForm into ConfigDashboard accordion
   - Update LivePreview to handle starting section draft state

   **F. Integration & E2E Tests (Priority 6)**
   - Write E2E test: Complete starting section configuration flow
   - Write E2E test: File upload with validation
   - Write E2E test: Parent info partial save flow
   - Write integration test: Wedding date fallback logic

   **G. Documentation & Cleanup (Priority 7)**
   - Update README with starting section features
   - Add inline documentation to new components
   - Verify all tests pass (unit + integration + e2e)

**Ordering Strategy**:
- TDD: All test tasks before corresponding implementation
- Dependency order: Database → Server → UI
- Parallel execution: Tasks marked [P] can run independently
- Sequential: Tests must fail before implementation

**Estimated Output**: 28-32 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation

_These phases are beyond the scope of the /plan command_

**Phase 3**: Task execution (/tasks command creates tasks.md)
**Phase 4**: Implementation (execute tasks.md following TDD and constitutional principles)
**Phase 5**: Validation (run tests, execute quickstart.md, verify 80% coverage, performance validation)

## Complexity Tracking

_No constitutional violations detected. This section is empty._

## Progress Tracking

_This checklist is updated during execution flow_

**Phase Status**:

- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [x] Phase 3: Tasks generated (/tasks command) - 30 tasks created
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved (via /clarify command)
- [x] Complexity deviations documented (none)

---

_Based on Constitution v1.2.0 - See `.specify/memory/constitution.md`_
