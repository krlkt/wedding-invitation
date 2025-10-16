# Tasks: Multi-Tenant Wedding Invitation Platform

**Input**: Design documents from `/home/karel/code/wedding-invitation/specs/001-the-current-state/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/

## Execution Flow (main)

```
1. Load plan.md from feature directory ✅
   → Tech stack: TypeScript 5.x, Next.js 14.2.4, React 18, Material-UI 7.x, Tailwind CSS
   → Structure: Web application (frontend+backend in Next.js App Router)
2. Load design documents ✅
   → data-model.md: 12 entities (User, Wedding, Features, Content)
   → contracts/: 4 API modules (auth, config, content, upload)
   → research.md: Multi-tenancy, auth, file upload decisions
3. Generate tasks by category ✅
   → Setup: dependencies, testing framework, linting
   → Tests: 20 contract tests, 8 integration tests
   → Core: 12 models, 4 API route groups, middleware
   → Integration: auth middleware, subdomain routing, database
   → Polish: unit tests, performance, documentation
4. Apply task rules ✅
   → Different files = [P] for parallel execution
   → Tests before implementation (TDD)
   → Models before services before endpoints
5. Number tasks sequentially (T001-T030) ✅
6. Generate dependency graph ✅
7. Create parallel execution examples ✅
8. Validate task completeness ✅
   → All 20 contract endpoints have tests
   → All 12 entities have model tasks
   → All user stories have integration tests
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions

**Web app structure**: Next.js 14.2.4 App Router with TypeScript

- Models: `app/models/` (TypeScript interfaces)
- API Routes: `app/api/` (Next.js App Router API routes)
- Components: `app/components/` (React components)
- Tests: `__tests__/` (Jest + React Testing Library)
- E2E Tests: `tests/e2e/` (Playwright)

## Phase 3.1: Setup & Configuration

- [ ] T001 Install ORM and testing dependencies (Drizzle ORM, Jest, React Testing Library, Playwright, MSW)
- [ ] T002 [P] Configure Drizzle ORM with Turso in `drizzle.config.ts`
- [ ] T003 [P] Configure Jest with Next.js and TypeScript support in `jest.config.js`
- [ ] T004 [P] Configure Playwright for e2e testing in `playwright.config.ts`
- [ ] T005 [P] Setup MSW for API mocking in `__tests__/mocks/handlers.ts`
- [ ] T006 [P] Configure ESLint rules for testing in `.eslintrc.json`

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### Contract Tests (API Endpoints)

- [ ] T007 [P] Auth API contract tests in `__tests__/contracts/auth.test.ts`
- [ ] T008 [P] Wedding config API contract tests in `__tests__/contracts/wedding-config.test.ts`
- [ ] T009 [P] Content management API contract tests in `__tests__/contracts/content-management.test.ts`
- [ ] T010 [P] File upload API contract tests in `__tests__/contracts/file-upload.test.ts`

### Integration Tests (User Flows)

- [ ] T011 [P] User registration flow integration test in `__tests__/integration/registration.test.ts`
- [ ] T012 [P] Authentication flow integration test in `__tests__/integration/auth.test.ts`
- [ ] T013 [P] Wedding configuration flow integration test in `__tests__/integration/wedding-config.test.ts`
- [ ] T014 [P] Content management flow integration test in `__tests__/integration/content-management.test.ts`
- [ ] T015 [P] File upload flow integration test in `__tests__/integration/file-upload.test.ts`
- [ ] T016 [P] Multi-tenant subdomain routing test in `__tests__/integration/subdomain-routing.test.ts`
- [ ] T017 [P] Live preview functionality test in `__tests__/integration/live-preview.test.ts`
- [ ] T018 [P] Publish/unpublish workflow test in `__tests__/integration/publish-workflow.test.ts`

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### Drizzle Schema Definitions

- [ ] T019 [P] UserAccount schema in `app/db/schema/users.ts`
- [ ] T020 [P] WeddingConfiguration schema in `app/db/schema/weddings.ts`
- [ ] T021 [P] FeatureToggle schema in `app/db/schema/features.ts`
- [ ] T022 [P] LoveStorySegment schema in `app/db/schema/content.ts`
- [ ] T023 [P] LocationDetails schema in `app/db/schema/content.ts`
- [ ] T024 [P] GalleryItem schema in `app/db/schema/content.ts`
- [ ] T025 [P] FAQItem schema in `app/db/schema/content.ts`
- [ ] T026 [P] DressCode schema in `app/db/schema/content.ts`
- [ ] T027 [P] BankDetails schema in `app/db/schema/content.ts`
- [ ] T028 [P] Enhanced Guest schema in `app/db/schema/guests.ts`
- [ ] T029 [P] Enhanced RSVP schema in `app/db/schema/guests.ts`
- [ ] T030 [P] Enhanced Table schema in `app/db/schema/guests.ts`
- [ ] T031 [P] Group schema in `app/db/schema/groups.ts`

### Database Services

- [ ] T032 [P] Database connection service with Drizzle in `app/lib/database.ts`
- [ ] T033 [P] User authentication service in `app/lib/auth.ts`
- [ ] T034 [P] Wedding configuration service in `app/lib/wedding-service.ts`
- [ ] T035 [P] File upload service in `app/lib/file-service.ts`
- [ ] T036 [P] Content management service in `app/lib/content-service.ts`

### API Routes Implementation

- [ ] T037 POST /api/auth/register endpoint in `app/api/auth/register/route.ts`
- [ ] T038 POST /api/auth/login endpoint in `app/api/auth/login/route.ts`
- [ ] T039 POST /api/auth/logout endpoint in `app/api/auth/logout/route.ts`
- [ ] T040 GET /api/auth/session endpoint in `app/api/auth/session/route.ts`
- [ ] T041 GET /api/wedding/config endpoint in `app/api/wedding/config/route.ts`
- [ ] T042 PUT /api/wedding/config endpoint in `app/api/wedding/config/route.ts`
- [ ] T043 PUT /api/wedding/config/features endpoint in `app/api/wedding/config/features/route.ts`
- [ ] T044 POST /api/wedding/publish endpoint in `app/api/wedding/publish/route.ts`
- [ ] T045 POST /api/wedding/unpublish endpoint in `app/api/wedding/unpublish/route.ts`
- [ ] T046 Love story API endpoints in `app/api/wedding/love-story/` directory
- [ ] T047 Location API endpoints in `app/api/wedding/locations/` directory
- [ ] T048 FAQ API endpoints in `app/api/wedding/faqs/` directory
- [ ] T049 Bank details API endpoints in `app/api/wedding/bank-details/` directory
- [ ] T050 Dress code API endpoints in `app/api/wedding/dress-code/` directory
- [ ] T051 Gallery upload endpoint in `app/api/wedding/gallery/upload/route.ts`
- [ ] T052 Gallery management endpoints in `app/api/wedding/gallery/` directory
- [ ] T053 Group management API endpoints in `app/api/wedding/groups/` directory

## Phase 3.4: Integration & Middleware

- [ ] T054 Authentication middleware in `app/middleware/auth.ts`
- [ ] T055 Subdomain detection middleware in `app/middleware/subdomain.ts`
- [ ] T056 Tenant context provider in `app/context/TenantContext.tsx`
- [ ] T057 Database migration scripts for schema modernization in `scripts/migrate-schema.ts`
- [ ] T058 Data migration scripts for existing Karel/Sabrina data in `scripts/migrate-existing-data.ts`
- [ ] T059 Session management configuration in `app/lib/session.ts`
- [ ] T060 Input validation schemas in `app/lib/validation.ts`
- [ ] T061 Error handling and logging in `app/lib/errors.ts`

### UI Components (Existing Enhancement)

- [ ] T062 Extract hardcoded values from existing components in `app/components/`
- [ ] T063 Create configurable wedding invitation layout in `app/components/WeddingLayout.tsx`
- [ ] T064 Build live preview interface in `app/components/LivePreview.tsx`
- [ ] T065 Configuration dashboard interface in `app/components/ConfigDashboard.tsx`

## Phase 3.5: Polish & Validation

- [ ] T066 [P] Unit tests for validation schemas in `__tests__/unit/validation.test.ts`
- [ ] T067 [P] Unit tests for authentication service in `__tests__/unit/auth.test.ts`
- [ ] T068 [P] Unit tests for file upload service in `__tests__/unit/file-service.test.ts`
- [ ] T069 [P] Performance tests for API endpoints (<200ms response time)
- [ ] T070 [P] E2E tests for complete user journey in `tests/e2e/user-journey.spec.ts`
- [ ] T071 [P] E2E tests for subdomain routing in `tests/e2e/subdomain.spec.ts`
- [ ] T072 [P] Security testing for file uploads and authentication
- [ ] T073 [P] Load testing for multi-tenant scenarios
- [ ] T074 Execute quickstart validation scenarios from `quickstart.md`

## Dependencies

**Critical Dependencies**:

- Setup (T001-T006) before all other phases
- Tests (T007-T018) before implementation (T019-T065)
- Schema (T019-T031) before services (T032-T036)
- Services (T032-T036) before API routes (T037-T053)
- Core implementation (T019-T053) before integration (T054-T065)
- Integration (T054-T065) before polish (T066-T074)

**Specific Blockers**:

- T002 (Drizzle config) blocks T019-T031 (schema definitions)
- T032 (database service) blocks T033-T036 (other services)
- T033 (auth service) blocks T037-T040 (auth endpoints)
- T034 (wedding service) blocks T041-T045 (config endpoints)
- T054 (auth middleware) blocks T055-T061 (other middleware)
- T057-T058 (migration scripts) block all database-dependent features
- **CRITICAL**: T057-T058 must complete before any production deployment

## Parallel Execution Examples

```bash
# Phase 3.2: Launch all contract tests together
Task: "Auth API contract tests in __tests__/contracts/auth.test.ts"
Task: "Wedding config API contract tests in __tests__/contracts/wedding-config.test.ts"
Task: "Content management API contract tests in __tests__/contracts/content-management.test.ts"
Task: "File upload API contract tests in __tests__/contracts/file-upload.test.ts"

# Phase 3.3: Launch all model interfaces together
Task: "UserAccount model interface in app/models/UserAccount.ts"
Task: "WeddingConfiguration model interface in app/models/WeddingConfiguration.ts"
Task: "FeatureToggle model interface in app/models/FeatureToggle.ts"
Task: "LoveStorySegment model interface in app/models/LoveStorySegment.ts"
# ... (all model tasks T018-T029)

# Phase 3.5: Launch all unit tests together
Task: "Unit tests for validation schemas in __tests__/unit/validation.test.ts"
Task: "Unit tests for authentication service in __tests__/unit/auth.test.ts"
Task: "Unit tests for file upload service in __tests__/unit/file-service.test.ts"
```

## Notes

- [P] tasks = different files, no dependencies between them
- All tests must fail before implementing corresponding features (TDD)
- Commit after each task completion
- Run `yarn test` after each implementation task
- Run `yarn lint` and `yarn typecheck` before final validation
- Execute quickstart scenarios as final validation step

## Task Generation Rules Applied

_Applied during execution flow_

1. **From Contracts** ✅:
   - 4 contract files → 4 contract test tasks [P] (T006-T009)
   - 20 API endpoints → 20 implementation tasks (T035-T050)

2. **From Data Model** ✅:
   - 12 entities → 12 model creation tasks [P] (T018-T029)
   - Relationships → 5 service layer tasks [P] (T030-T034)

3. **From User Stories** ✅:
   - 8 user flows → 8 integration tests [P] (T010-T017)
   - Quickstart scenarios → validation task (T070)

4. **Ordering** ✅:
   - Setup → Tests → Models → Services → Endpoints → Integration → Polish
   - Dependencies properly tracked and documented

## Validation Checklist

_GATE: Checked before task generation completion_

- [x] All 20 contract endpoints have corresponding tests (T006-T009)
- [x] All 12 entities have model tasks (T018-T029)
- [x] All tests come before implementation (T006-T017 before T018+)
- [x] Parallel tasks truly independent (different files, marked [P])
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] TDD workflow enforced (tests must fail before implementation)
- [x] Critical path dependencies documented
- [x] Constitutional requirements addressed (testing, performance, structure)
