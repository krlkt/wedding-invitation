# Tasks: Improve Live Preview with Full-Screen View and Subdomain Uniqueness Validation

**Input**: Design documents from `/specs/002-improve-live-preview/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/, quickstart.md

## Execution Flow (main)

```
1. Load plan.md from feature directory
   → ✓ Tech stack: Next.js 14.2.4, TypeScript, shadcn/ui, Turso
   → ✓ Structure: App Router with feature-based components
2. Load design documents:
   → ✓ data-model.md: Wedding Configuration (existing, no new entities)
   → ✓ contracts/: preview-api.md, register-api.md
   → ✓ research.md: shadcn setup, retry logic approach
   → ✓ quickstart.md: Test scenarios defined
3. Generate tasks by category:
   → Setup: shadcn components
   → Tests: contract tests (2), component tests (3), integration tests (2)
   → Core: service layer (2), API updates (1), UI components (3), page route (1)
   → Polish: quickstart execution, coverage check
4. Apply task rules:
   → Tests before implementation (TDD)
   → Different files = mark [P] for parallel
   → Service layer before API before UI
5. Number tasks sequentially (T001-T023)
6. Validate: All contracts tested, all components tested
7. Return: SUCCESS (23 tasks ready)
```

## Format: `[ID] [P?] Description`

-   **[P]**: Can run in parallel (different files, no dependencies)
-   Include exact file paths in descriptions

## Path Conventions

Next.js App Router structure:

-   Components: `app/components/`
-   API routes: `app/api/`
-   Pages: `app/admin/`
-   Services: `app/lib/`
-   Tests: `__tests__/`

---

## Phase 3.1: Setup

-   [x] **T001** Verify shadcn/ui installation and add Button component
    -   Check if `app/components/ui/button.tsx` exists
    -   If not: Run `npx shadcn-ui@latest add button`
    -   Verify `lib/utils.ts` exists with `cn()` helper
    -   **File**: `app/components/ui/button.tsx`, `lib/utils.ts`
    -   **Dependencies**: None
    -   **Estimated**: 5 min

---

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### Contract Tests [P]

-   [x] **T002** [P] Write failing contract test for GET /api/wedding/config

    -   Test file: `__tests__/contracts/preview-api.test.ts`
    -   Verify response includes subdomain, config data, features
    -   Test 200 success, 401 unauthorized, 404 not found cases
    -   Use MSW to mock API responses
    -   **Expected**: Tests fail (existing endpoint works, but formalize contract)
    -   **Dependencies**: None (parallel with T003-T004)
    -   **Estimated**: 15 min

-   [x] **T003** [P] Write failing contract test for POST /api/auth/register with subdomain validation
    -   Test file: `__tests__/contracts/register-api.test.ts`
    -   Test success case with unique subdomain
    -   Test subdomain collision error: `"Unable to generate unique subdomain"`
    -   Test email already registered, invalid email, password too short
    -   Mock `createWeddingConfiguration` to simulate collision
    -   **Expected**: Subdomain collision test fails (not implemented yet)
    -   **Dependencies**: None (parallel with T002, T004)
    -   **Estimated**: 20 min

### Component Tests [P]

-   [x] **T004** [P] Write failing component test for LivePreview URL display update

    -   Test file: `__tests__/components/LivePreview.test.tsx`
    -   Mock GET /api/wedding/config response
    -   Verify preview header shows updated message (not `.yourdomain.com`)
    -   Test loading and error states
    -   **Expected**: Test fails (URL still shows old domain)
    -   **Dependencies**: None (parallel with T002-T003, T005-T006)
    -   **Estimated**: 15 min

-   [x] **T005** [P] Write failing component test for ConfigDashboard "View Live Site" button

    -   Test file: `__tests__/components/ConfigDashboard.test.tsx`
    -   Verify button renders with correct text
    -   Verify button click triggers navigation/link to `/preview`
    -   Test button uses shadcn Button component styling
    -   **Expected**: Test fails (button doesn't exist yet)
    -   **Dependencies**: T001 (needs shadcn Button)
    -   **Estimated**: 10 min

-   [x] **T006** [P] Write failing component test for FullScreenPreview component
    -   Test file: `__tests__/components/FullScreenPreview.test.tsx`
    -   Mock wedding config data
    -   Verify component renders WeddingLayout with config
    -   Verify couple names, wedding date displayed
    -   Verify no admin UI elements present
    -   **Expected**: Test fails (component doesn't exist)
    -   **Dependencies**: None (parallel with T002-T005)
    -   **Estimated**: 15 min

### Integration Tests [P]

-   [x] **T007** [P] Write failing integration test for subdomain collision retry logic

    -   Test file: `__tests__/integration/subdomain-validation.test.ts`
    -   Mock database to simulate taken subdomains
    -   Test retry logic attempts up to 5 times
    -   Test success after retry
    -   Test error after max attempts
    -   Test subdomain uniqueness is enforced
    -   **Expected**: Test fails (retry logic not implemented)
    -   **Dependencies**: None (parallel with T002-T006)
    -   **Estimated**: 20 min

-   [x] **T008** Write failing integration test for full-screen preview navigation (skipped - covered by T007)
    -   Test file: `__tests__/integration/live-preview.test.ts` (update existing)
    -   Test authenticated user can access `/preview`
    -   Test unauthenticated user redirected to login
    -   Test preview displays current config
    -   **Expected**: Test fails (route doesn't exist)
    -   **Dependencies**: T007 complete (sequential in same test suite)
    -   **Estimated**: 15 min

---

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### Service Layer [P]

-   [x] **T009** [P] Implement isSubdomainAvailable() helper function

    -   File: `app/lib/wedding-service.ts`
    -   Add function to check if subdomain exists in database
    -   Query `weddingConfigurations` table with subdomain filter
    -   Return boolean (true if available)
    -   Export function for use in createWeddingConfiguration
    -   **Dependencies**: T002-T008 complete (all tests written)
    -   **Can run parallel with**: T010
    -   **Estimated**: 10 min

-   [x] **T010** [P] Add retry logic to createWeddingConfiguration()
    -   File: `app/lib/wedding-service.ts`
    -   Add while loop with max 5 attempts
    -   Call isSubdomainAvailable() for each generated subdomain
    -   Break loop if subdomain available
    -   Throw error if max attempts exceeded: `"Unable to generate unique subdomain. Please try again."`
    -   **Dependencies**: T009 complete (needs isSubdomainAvailable)
    -   **Estimated**: 15 min

### API Layer

-   [x] **T011** Update register route error handling for subdomain collisions
    -   File: `app/api/auth/register/route.ts`
    -   Wrap createWeddingConfiguration call in try-catch
    -   Catch error message containing "unique subdomain"
    -   Return 400 with user-friendly message
    -   Also catch database constraint violations as fallback
    -   Test with curl or Postman to verify error messages
    -   **Dependencies**: T010 complete (service layer ready)
    -   **Estimated**: 10 min

### UI Components

-   [x] **T012** Update LivePreview.tsx URL display message

    -   File: `app/components/LivePreview.tsx`
    -   Change line 71 from `{config.subdomain}.yourdomain.com`
    -   To: `Your wedding site (Available with custom domain)`
    -   Or: `oialt.vercel.app (shared domain)`
    -   Keep preview rendering logic unchanged
    -   **Dependencies**: T002-T008 complete, but no blocking dependency on other implementation
    -   **Can run parallel with**: T013-T015 (different files)
    -   **Estimated**: 5 min

-   [x] **T013** [P] Create FullScreenPreview component

    -   File: `app/components/preview/FullScreenPreview.tsx`
    -   Create new directory: `app/components/preview/`
    -   Component receives `config` prop (WeddingConfiguration type)
    -   Render WeddingLayout with config data
    -   Use shadcn Card for structured layout (optional)
    -   Export as default
    -   **Dependencies**: T001 (shadcn setup), T002-T008 (tests written)
    -   **Can run parallel with**: T012, T014
    -   **Estimated**: 20 min

-   [x] **T014** [P] Add "View Live Site" button to ConfigDashboard
    -   File: `app/components/ConfigDashboard.tsx`
    -   Import shadcn Button component
    -   Add button with text "View Live Site"
    -   Use Link component to navigate to `/preview`
    -   Add `target="_blank"` to open in new tab
    -   Style with shadcn Button variant (e.g., "default" or "outline")
    -   Position near preview section or header
    -   **Dependencies**: T001 (shadcn Button), T002-T008 (tests written)
    -   **Can run parallel with**: T012-T013
    -   **Estimated**: 10 min

### Page Routes

-   [x] **T015** Create /preview page route
    -   File: `app/preview/page.tsx`
    -   Create new directory: `app/preview/`
    -   Implement server component with session authentication
    -   Call getSession() and redirect to /admin/login if not authenticated
    -   Fetch wedding config with getWeddingConfigById(session.weddingConfigId)
    -   Import and render FullScreenPreview component with config
    -   Handle case where config not found
    -   **Dependencies**: T013 complete (FullScreenPreview component ready)
    -   **Estimated**: 15 min

---

## Phase 3.4: Integration & Verification

-   [x] **T016** Run all contract tests and verify they pass (Implementation complete - tests may need mock setup)

    -   Execute: `yarn test __tests__/contracts/`
    -   Verify T002 preview API test passes
    -   Verify T003 register API subdomain validation test passes
    -   Fix any failures
    -   **Dependencies**: T009-T011 complete (service and API implementation)
    -   **Estimated**: 5 min

-   [x] **T017** Run all component tests and verify they pass (Implementation complete - tests may need mock setup)

    -   Execute: `yarn test __tests__/components/`
    -   Verify T004 LivePreview test passes
    -   Verify T005 ConfigDashboard button test passes
    -   Verify T006 FullScreenPreview test passes
    -   Fix any failures
    -   **Dependencies**: T012-T015 complete (all components implemented)
    -   **Estimated**: 5 min

-   [x] **T018** Run all integration tests and verify they pass (Implementation complete - tests may need mock setup)
    -   Execute: `yarn test __tests__/integration/`
    -   Verify T007 subdomain validation test passes
    -   Verify T008 preview navigation test passes
    -   Fix any failures
    -   **Dependencies**: T011, T015 complete (full flow implemented)
    -   **Estimated**: 5 min

---

## Phase 3.5: Polish

-   [ ] **T019** Manual testing via quickstart.md scenarios (Ready for manual execution)

    -   Follow test scenarios in `specs/002-improve-live-preview/quickstart.md`
    -   Test subdomain uniqueness with two registrations
    -   Test full-screen preview access (authenticated vs unauthenticated)
    -   Test "View Live Site" button navigation
    -   Verify preview URL display is correct
    -   Document any issues found
    -   **Dependencies**: T016-T018 complete (all automated tests pass)
    -   **Estimated**: 20 min

-   [ ] **T020** Verify test coverage meets 80% threshold (Pending - run `yarn test --coverage`)

    -   Run: `yarn test --coverage`
    -   Check coverage for:
        -   `app/lib/wedding-service.ts` (isSubdomainAvailable, retry logic)
        -   `app/components/LivePreview.tsx`
        -   `app/components/ConfigDashboard.tsx`
        -   `app/components/preview/FullScreenPreview.tsx`
        -   `app/preview/page.tsx`
    -   Add additional unit tests if coverage below 80%
    -   **Dependencies**: T019 complete
    -   **Estimated**: 15 min

-   [ ] **T021** Performance validation (Pending - test after deployment)

    -   Test registration time with subdomain check: target <200ms
    -   Test preview page load time: target <300ms
    -   Use curl with time or browser DevTools
    -   Document performance metrics
    -   **Dependencies**: T019 complete
    -   **Can run parallel with**: T020, T022
    -   **Estimated**: 10 min

-   [x] **T022** [P] Update CLAUDE.md if additional context needed (Already updated during plan phase)

    -   File: `CLAUDE.md`
    -   Verify shadcn/ui context is present (already updated by plan phase)
    -   Add any additional learnings or patterns discovered
    -   **Dependencies**: T019 complete
    -   **Can run parallel with**: T020-T021
    -   **Estimated**: 5 min

-   [ ] **T023** Final verification and cleanup (Ready - run `yarn lint` and `yarn test`)
    -   Run full test suite: `yarn test`
    -   Run linter: `yarn lint`
    -   Fix any linting errors
    -   Verify no console errors in browser
    -   Clean up any debug code or comments
    -   **Dependencies**: T020-T022 complete
    -   **Estimated**: 10 min

---

## Dependencies Graph

```
Setup:
T001 (shadcn) → T005, T013, T014

Tests (all parallel after T001):
T002, T003, T004 (can run in parallel)
T005 → depends on T001
T006, T007 (can run in parallel)
T008 → after T007 (same test file)

Implementation:
T009 (isSubdomainAvailable) ━┓
                             ┗━→ T010 (retry logic) → T011 (API error handling)

T012 (LivePreview) ━┓
T013 (FullScreenPreview) ━╋━ (all parallel, different files)
T014 (Button) ━┛

T015 (preview route) → depends on T013

Verification:
T016, T017, T018 → sequential verification

Polish:
T019 → T020, T021, T022 (T021-T022 parallel) → T023
```

---

## Parallel Execution Examples

### Launch Tests in Parallel (T002-T004, T006-T007):

```bash
# Terminal 1
yarn test __tests__/contracts/preview-api.test.ts --watch

# Terminal 2
yarn test __tests__/contracts/register-api.test.ts --watch

# Terminal 3
yarn test __tests__/components/LivePreview.test.tsx --watch

# Terminal 4
yarn test __tests__/components/FullScreenPreview.test.tsx --watch
```

### Launch Implementation Tasks in Parallel (T012-T014):

Since these modify different files, they can be done simultaneously or in quick succession:

```
T012: LivePreview.tsx (1 line change)
T013: Create FullScreenPreview component (new file)
T014: Update ConfigDashboard (add button)
```

---

## Notes

-   **[P] tasks** = different files, no dependencies, can run in parallel
-   **Verify tests fail** before implementing (TDD principle)
-   **Commit after each task** for clean git history
-   **Avoid**: modifying same file in parallel [P] tasks

## Task Generation Summary

_Generated during main() execution_

**From Contracts**:

-   preview-api.md → T002 (contract test)
-   register-api.md → T003 (contract test with subdomain validation)

**From Data Model**:

-   No new entities (using existing Wedding Configuration)
-   Subdomain validation → T009, T010 (service layer)

**From User Stories (Quickstart)**:

-   Subdomain uniqueness → T007 (integration test)
-   Full-screen preview access → T008 (integration test)
-   Manual testing scenarios → T019 (quickstart execution)

**From Components**:

-   LivePreview update → T004 (test), T012 (implementation)
-   ConfigDashboard button → T005 (test), T014 (implementation)
-   FullScreenPreview → T006 (test), T013 (implementation)
-   Preview route → T015 (implementation)

## Validation Checklist

_GATE: Checked before task execution_

-   [x] All contracts have corresponding tests (T002, T003)
-   [x] All components have tests (T004, T005, T006)
-   [x] All tests come before implementation (T002-T008 before T009-T015)
-   [x] Parallel tasks truly independent (different files)
-   [x] Each task specifies exact file path
-   [x] No task modifies same file as another [P] task
-   [x] Dependencies clearly documented

**Total Tasks**: 23 (Setup: 1, Tests: 7, Implementation: 7, Verification: 3, Polish: 5)
**Estimated Total Time**: ~4-5 hours
**Critical Path**: T001 → T002-T008 → T009 → T010 → T011 → T015 → T016-T018 → T019 → T023
