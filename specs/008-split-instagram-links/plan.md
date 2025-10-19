# Implementation Plan: Reorganize Instagram Links and Footer Text

**Branch**: `OIALT-8-templating-feature` | **Date**: 2025-10-14 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/008-split-instagram-links/spec.md`

## Execution Flow (/plan command scope)

```
1. Load feature spec from Input path ✓
2. Fill Technical Context ✓
3. Fill the Constitution Check section ✓
4. Evaluate Constitution Check section ✓
5. Execute Phase 0 → research.md ⏳
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, CLAUDE.md
7. Re-evaluate Constitution Check section
8. Plan Phase 2 → Describe task generation approach
9. STOP - Ready for /tasks command
```

## Summary

Split the single `instagramLink` field into separate `groomsInstagramLink` and `brideInstagramLink` fields, and reorganize these fields along with `footerText` from the Basic Information tab to the Content tab in the admin dashboard. The existing instagram_link feature toggle will be renamed to be more descriptive while maintaining single control over both links. Existing data will be cleared (testing data only).

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 14.2.4
**Primary Dependencies**: React 18, Drizzle ORM, Turso (libSQL), shadcn/ui, Tailwind CSS
**Storage**: SQLite database via Turso with Drizzle ORM
**Testing**: Jest, React Testing Library, Playwright, MSW
**Target Platform**: Web (Server-side rendered Next.js App Router)
**Project Type**: web (Next.js with App Router - frontend and backend integrated)
**Performance Goals**: <200ms response time for dashboard operations, optimistic UI updates
**Constraints**: Must maintain backward compatibility with feature toggle system, zero data loss for footerText
**Scale/Scope**: Single-tenant configuration per user, low-frequency updates

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Technology Stack Compliance

- ✅ Next.js 14.2.4 with App Router architecture (existing)
- ✅ TypeScript strict mode (existing codebase standard)
- ✅ Drizzle ORM for database operations (existing)
- ✅ shadcn/ui for any new UI components (if needed)
- ✅ React Hook Form for form handling (existing in ConfigDashboard)

### Performance-First Development

- ✅ Server Components used for data fetching (existing pattern in app/preview/page.tsx)
- ✅ Client Components only where needed (ConfigDashboard is 'use client' for interactivity)
- ✅ Database operations optimized (simple column additions/renames)

### Component Architecture Standards

- ✅ Functional components (existing codebase standard)
- ✅ Feature-based organization (app/components/preview/, app/db/schema/)
- ✅ Context providers for shared state (useWeddingData already exists and will pass features)

### Code Quality Requirements

- ✅ ESLint and Prettier configured (existing)
- ✅ TypeScript strict mode (existing)
- ✅ File organization follows feature-based structure (existing)

### Data & State Management

- ✅ Database models defined in app/db/schema/ (existing)
- ✅ API routes for mutations (existing pattern in app/api/wedding/config/)
- ✅ Context providers for state (WeddingDataProvider exists)

### Testing Standards

- ⚠️ **REQUIRES ATTENTION**: TDD workflow must be followed for this feature
  - Unit tests for database migrations
  - Component tests for UI changes
  - Integration tests for API endpoints
  - E2E tests for admin dashboard flow

### Next.js 14 Data Fetching Patterns

- ✅ Server Components fetch data (existing in app/preview/page.tsx)
- ✅ API routes used appropriately (existing /api/wedding/config endpoints)
- ✅ No useEffect + fetch pattern for initial loads

### Git Branch Naming Convention

- ✅ Using existing OIALT-8-templating-feature branch (follows OIALT-{number}-{description} pattern)

**Constitution Check Status**: PASS with TDD requirement

## Project Structure

### Documentation (this feature)

```
specs/008-split-instagram-links/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/tasks command)
```

### Source Code (repository root)

```
app/
├── db/
│   └── schema/
│       └── weddings.ts          # Add groomsInstagramLink, brideInstagramLink columns
├── api/
│   └── wedding/
│       ├── config/
│       │   └── route.ts         # Update to handle new fields
│       └── preview/
│           └── route.ts         # Update to include new fields
├── components/
│   ├── ConfigDashboard.tsx      # Move fields from Basic to Content tab
│   └── preview/
│       ├── Template1Preview.tsx # Update to use both Instagram links
│       └── types.ts             # Update PreviewData interface
└── utils/
    └── useWeddingData.tsx       # Already updated to pass features

lib/
└── wedding-service.ts           # Update service layer for new fields

tests/
├── unit/
│   ├── schema-migration.test.ts # Test database migration
│   └── wedding-service.test.ts  # Test service layer
├── components/
│   └── ConfigDashboard.test.tsx # Test UI reorganization
├── integration/
│   └── api/
│       └── wedding-config.test.ts # Test API endpoints
└── e2e/
    └── admin-dashboard.spec.ts  # Test complete flow
```

**Structure Decision**: Next.js App Router monolithic structure with integrated frontend and backend. All routes under `app/` directory following Next.js 14 conventions.

## Phase 0: Outline & Research

### Research Tasks

1. **Database Schema Migration Strategy**
   - **Question**: How to safely add new columns and deprecate old column in Turso/libSQL?
   - **Research**: Drizzle ORM column operations, migration best practices
   - **Outcome**: Document migration script approach

2. **Feature Toggle Naming Convention**
   - **Question**: What should `instagram_link` be renamed to?
   - **Research**: Current toggle naming patterns in features.ts
   - **Outcome**: Consistent naming like `social_media_links` or `instagram_links`

3. **UI Tab Content Organization**
   - **Question**: How is Content tab currently structured in ConfigDashboard?
   - **Research**: Current ConfigDashboard.tsx implementation
   - **Outcome**: Document where to add new fields in Content tab

4. **Template Rendering Pattern**
   - **Question**: How does Template1Preview currently render Instagram link?
   - **Research**: Current footer/social media rendering
   - **Outcome**: Document pattern for displaying multiple links

**Output**: ✅ research.md completed

---

## Phase 1: Design & Contracts

_Prerequisites: research.md complete_ ✅

### Artifacts Generated

1. **data-model.md**: ✅ Complete
   - Schema changes for `weddingConfigurations` table
   - Added `groomsInstagramLink` and `brideInstagramLink` columns
   - Deprecated `instagramLink` column (kept for compatibility)
   - Feature toggle enum updated: `instagram_link` → `instagram_links`
   - TypeScript type updates
   - Validation rules specified

2. **API Contracts**: ✅ Complete
   - `contracts/api-wedding-config.yaml` - OpenAPI spec for config updates
   - `contracts/api-feature-toggle.yaml` - OpenAPI spec for renamed toggle
   - Both contracts include request/response schemas and validation rules

3. **Quickstart**: ✅ Complete
   - `quickstart.md` with 12 comprehensive test scenarios
   - Covers database, UI, template rendering, API, and feature toggle
   - Acceptance criteria checklist
   - Manual testing template

4. **Agent Context**: ✅ Updated
   - `CLAUDE.md` updated with recent changes entry

### Design Decisions Summary

**Database**:

- Two new nullable columns: `grooms_instagram_link`, `bride_instagram_link`
- Old `instagram_link` deprecated but retained (no data loss)
- Feature toggle renamed: `instagram_link` → `instagram_links`

**UI**:

- New `ContentForm` component replaces Content tab placeholder
- Follows `BasicInfoForm` pattern (React Hook Form)
- Three fields: Groom's Instagram, Bride's Instagram, Footer Text
- URL validation with clear error messages

**Template**:

- Footer shows 0, 1, or 2 Instagram links dynamically
- Personalized text: "Follow {name} on Instagram"
- Feature toggle `instagram_links` controls visibility

**API**:

- Backward compatible (new fields optional)
- URL validation on server side
- Old `instagramLink` ignored by application logic

### Constitution Re-check

**Technology Stack**: ✅ Pass

- Next.js 14.2.4 App Router (no changes)
- TypeScript strict mode (maintained)
- Drizzle ORM for schema changes (constitutional)

**Performance**: ✅ Pass

- Simple column additions (no performance impact)
- Optimistic UI in dashboard (planned)

**Testing**: ⚠️ Requires Implementation

- TDD workflow must be followed during Phase 4
- Contract tests, unit tests, integration tests, e2e tests planned

**Conclusion**: Design compliant with constitution. Ready for task generation.

---

## Phase 2: Task Planning Approach

_This section describes what the /tasks command will do - DO NOT execute during /plan_

### Task Generation Strategy

**From Data Model**:

1. Update database schema files (weddings.ts, features.ts)
2. Create migration script
3. Update TypeScript types (auto-inferred but verify)
4. Write unit tests for schema changes

**From API Contracts**: 5. Write contract tests for PUT /api/wedding/config (new fields) 6. Write contract tests for PUT /api/wedding/config/features (renamed toggle) 7. Update API route handlers to accept new fields 8. Add URL validation logic 9. Update service layer (wedding-service.ts)

**From UI Requirements**: 10. Remove fields from BasicInfoForm component 11. Create ContentForm component 12. Update ConfigDashboard to render ContentForm in Content tab 13. Write component tests for BasicInfoForm (fields removed) 14. Write component tests for ContentForm (new component)

**From Template Requirements**: 15. Update Template1Preview footer rendering logic 16. Handle 0, 1, or 2 Instagram links display 17. Update feature toggle check (instagram_link → instagram_links) 18. Update preview API to include new fields 19. Write component tests for Template1Preview footer

**From Quickstart Scenarios**: 20. Write integration test: Save both Instagram links 21. Write integration test: Save one Instagram link 22. Write integration test: URL validation 23. Write e2e test: Complete dashboard flow 24. Write e2e test: Template rendering with various link combinations 25. Write e2e test: Feature toggle behavior

**Task Ordering**:

- Phase A: Schema & Migration [P1] (blocking)
- Phase B: Contract tests [P2, P3, P4] (parallel, need Phase A)
- Phase C: API implementation [P5, P6, P7] (sequential, need Phase B)
- Phase D: Service layer [P8] (need Phase C)
- Phase E: UI components [P9, P10, P11] (parallel, need Phase A)
- Phase F: Template updates [P12, P13] (sequential, need Phase A)
- Phase G: Component tests [P14, P15, P16] (parallel, need Phases E & F)
- Phase H: Integration tests [P17-P22] (parallel, need all prior phases)
- Phase I: E2E tests [P23-P25] (sequential, need all prior phases)

**Estimated Output**: 30-35 numbered tasks in tasks.md

**Dependencies**:

- TDD principle: Tests written before implementation where possible
- Database changes must be first (blocking)
- Contract tests before implementation
- Component tests after component changes
- Integration/e2e tests last

**IMPORTANT**: This phase will be executed by the /tasks command, NOT by /plan

---

## Phase 3+: Future Implementation

_These phases are beyond the scope of the /plan command_

**Phase 3**: Task execution (/tasks command creates tasks.md with dependency-ordered list)
**Phase 4**: Implementation (execute tasks following TDD workflow)
**Phase 5**: Validation (run all tests, execute quickstart.md, verify acceptance criteria)

---

## Complexity Tracking

No constitutional violations. Feature follows established patterns:

- Standard Drizzle ORM schema changes
- React Hook Form for UI (existing pattern)
- Next.js API routes (existing pattern)
- Simple UI reorganization (no new dependencies)

---

## Progress Tracking

**Phase Status**:

- [x] Phase 0: Research complete
- [x] Phase 1: Design complete
- [x] Phase 2: Task planning approach described
- [x] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none)

**Artifacts Generated**:

- [x] research.md (Phase 0)
- [x] data-model.md (Phase 1)
- [x] contracts/api-wedding-config.yaml (Phase 1)
- [x] contracts/api-feature-toggle.yaml (Phase 1)
- [x] quickstart.md (Phase 1)
- [x] CLAUDE.md updated (Phase 1)
- [x] tasks.md (Phase 3 - /tasks command)

---

## Next Steps

**Ready for**: Implementation (Phase 4)

All planning and task generation phases are complete:

- ✅ Research findings documented
- ✅ Data model specified
- ✅ API contracts defined (OpenAPI specs)
- ✅ Quickstart validation scenarios written
- ✅ Agent context updated
- ✅ Tasks generated (35 dependency-ordered tasks)

Begin implementation by executing tasks in `tasks.md` following TDD principles:

1. Start with T001-T004 (database schema)
2. Write failing tests T005-T012 (MUST fail before implementation)
3. Implement T013-T025 (API, UI, template)
4. Polish and validate T026-T035 (tests, docs, PR)

**Command to start**: Review and execute tasks from `specs/008-split-instagram-links/tasks.md`

---

_Based on Constitution v1.2.0 - See `.specify/memory/constitution.md`_
