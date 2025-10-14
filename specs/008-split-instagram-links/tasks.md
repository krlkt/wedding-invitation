# Tasks: Reorganize Instagram Links and Footer Text

**Feature**: 008-split-instagram-links
**Branch**: OIALT-8-templating-feature
**Input**: Design documents from `/specs/008-split-instagram-links/`
**Prerequisites**: plan.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓, quickstart.md ✓

## Execution Summary

This task list implements the split Instagram links feature with TDD workflow:
- Split `instagramLink` → `groomsInstagramLink` + `brideInstagramLink`
- Rename feature toggle: `instagram_link` → `instagram_links`
- Move fields from Basic Info to Content tab
- Update template rendering for multiple links

**Tech Stack**: Next.js 14.2.4, TypeScript, React 18, Drizzle ORM, Jest, Playwright
**Estimated Tasks**: 35
**Critical Path**: Database schema → API layer → UI components → Template updates

---

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no shared dependencies)
- All file paths are absolute from repository root
- Tests MUST be written and failing before implementation

---

## Phase 3.1: Setup & Database Schema

### T001: Update database schema - wedding configurations
**File**: `app/db/schema/weddings.ts`
**Description**: Add two new columns to `weddingConfigurations` table:
- Add `groomsInstagramLink: text('grooms_instagram_link')`
- Add `brideInstagramLink: text('bride_instagram_link')`
- Keep existing `instagramLink: text('instagram_link')` (mark as deprecated in comments)
- Keep existing `footerText: text('footer_text')`
- Verify TypeScript types auto-infer correctly

**Acceptance**:
- Schema compiles without errors
- Types include `groomsInstagramLink` and `brideInstagramLink` (nullable)
- No breaking changes to existing fields

---

### T002: Update database schema - feature toggles
**File**: `app/db/schema/features.ts`
**Description**: Rename feature toggle enum value:
- Change `'instagram_link'` to `'instagram_links'` in the featureName enum
- Update all 8 enum values to ensure correctness

**Acceptance**:
- Schema compiles without errors
- Enum includes `'instagram_links'` (not `'instagram_link'`)
- All other enum values unchanged

---

### T003: Create database migration script
**File**: `app/db/migrations/008-split-instagram-links.sql`
**Description**: Write SQL migration script to:
- Add `grooms_instagram_link` column (TEXT, nullable)
- Add `bride_instagram_link` column (TEXT, nullable)
- Update existing feature toggle: `UPDATE feature_toggles SET feature_name = 'instagram_links' WHERE feature_name = 'instagram_link'`
- Clear deprecated data: `UPDATE wedding_configurations SET instagram_link = NULL WHERE instagram_link IS NOT NULL`

**Acceptance**:
- SQL script executes without errors
- New columns exist and are nullable
- Feature toggle renamed correctly
- Old data cleared

---

### T004: Update TypeScript preview types
**File**: `app/components/preview/types.ts`
**Description**: Update `FeatureName` type:
- Change `'instagram_link'` to `'instagram_links'` in the union type
- Verify all 8 feature names are present

**Acceptance**:
- Type compiles without errors
- `FeatureName` includes `'instagram_links'`
- No TypeScript errors in files using this type

---

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation in Phase 3.3**

### T005 [P]: Contract test - PUT /api/wedding/config with new fields
**File**: `tests/integration/api/wedding-config-update.test.ts`
**Description**: Write integration test for updating wedding config with new Instagram fields:
- Test valid request with both `groomsInstagramLink` and `brideInstagramLink`
- Test partial update (only groom's link)
- Test partial update (only bride's link)
- Test clearing both links (set to null)
- Verify response includes new fields
- Reference contract: `specs/008-split-instagram-links/contracts/api-wedding-config.yaml`

**Expected**: Test FAILS (API doesn't handle new fields yet)

---

### T006 [P]: Contract test - PUT /api/wedding/config URL validation
**File**: `tests/integration/api/wedding-config-validation.test.ts`
**Description**: Write integration test for Instagram URL validation:
- Test invalid URL format for groom's link → expect 400 error
- Test invalid URL format for bride's link → expect 400 error
- Test non-Instagram URL → expect 400 error
- Test valid Instagram URLs → expect 200 success
- Test null values → expect 200 success (optional fields)
- Verify error messages are clear

**Expected**: Test FAILS (validation not implemented yet)

---

### T007 [P]: Contract test - PUT /api/wedding/config/features with renamed toggle
**File**: `tests/integration/api/feature-toggle-rename.test.ts`
**Description**: Write integration test for renamed feature toggle:
- Test enabling `instagram_links` → expect 200 success
- Test disabling `instagram_links` → expect 200 success
- Test old name `instagram_link` → expect 400 error (invalid feature name)
- Verify response includes correct feature name
- Reference contract: `specs/008-split-instagram-links/contracts/api-feature-toggle.yaml`

**Expected**: Test FAILS (API uses old feature name)

---

### T008 [P]: Component test - ConfigDashboard Basic Info tab (fields removed)
**File**: `tests/components/ConfigDashboard-BasicInfo.test.tsx`
**Description**: Write component test to verify fields removed from Basic Info:
- Render ConfigDashboard with mock config
- Switch to Basic Information tab
- Assert Instagram Link field does NOT exist
- Assert Footer Text field does NOT exist
- Assert other fields still present (groom name, bride name, etc.)

**Expected**: Test FAILS (fields still in Basic Info tab)

---

### T009 [P]: Component test - ConfigDashboard Content tab (new form)
**File**: `tests/components/ConfigDashboard-ContentForm.test.tsx`
**Description**: Write component test for new ContentForm in Content tab:
- Render ConfigDashboard with mock config
- Switch to Content tab
- Assert "Groom's Instagram Link" field exists
- Assert "Bride's Instagram Link" field exists
- Assert "Footer Text" field exists
- Test form submission with all fields filled
- Test form submission with partial data
- Test URL validation errors display

**Expected**: Test FAILS (ContentForm doesn't exist yet)

---

### T010 [P]: Component test - Template1Preview footer with both links
**File**: `tests/components/Template1Preview-footer.test.tsx`
**Description**: Write component test for footer rendering with Instagram links:
- Test with both groom and bride Instagram links → both display
- Test with only groom's link → only groom displays
- Test with only bride's link → only bride displays
- Test with no links → Instagram section hidden
- Test personalized text includes groom/bride names
- Test feature toggle OFF → Instagram section hidden
- Test feature toggle renamed to `instagram_links`

**Expected**: Test FAILS (template uses old single link field)

---

### T011 [P]: Integration test - Save both Instagram links via dashboard
**File**: `tests/e2e/admin-dashboard-instagram-links.spec.ts`
**Description**: Write E2E test for complete dashboard flow (Playwright):
- Navigate to admin dashboard
- Go to Content tab
- Fill in groom's Instagram: `https://instagram.com/test_groom`
- Fill in bride's Instagram: `https://instagram.com/test_bride`
- Fill in footer text
- Click Save
- Verify success message
- Refresh page
- Verify all fields retained values
- Reference quickstart.md Scenario 3

**Expected**: Test FAILS (Content tab not implemented)

---

### T012 [P]: Integration test - Template renders both links
**File**: `tests/e2e/template-instagram-rendering.spec.ts`
**Description**: Write E2E test for template rendering (Playwright):
- Set up test config with both Instagram links
- Enable `instagram_links` feature toggle
- Navigate to preview page
- Scroll to footer
- Assert "Follow {groomName} on Instagram" exists
- Assert "Follow {brideName} on Instagram" exists
- Assert both links are clickable
- Assert links open in new tab
- Test with only one link set
- Test with no links set
- Reference quickstart.md Scenarios 6, 7, 8

**Expected**: Test FAILS (template not updated)

---

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### T013: Implement URL validation utility
**File**: `app/lib/validation.ts` (create if doesn't exist)
**Description**: Create Instagram URL validation function:
- Function `isValidInstagramUrl(url: string): boolean`
- Accept `https://instagram.com/username` format
- Accept `https://www.instagram.com/username` format
- Reject non-Instagram URLs
- Reject malformed URLs
- Export function for use in API routes

**Acceptance**:
- Function works with valid Instagram URLs
- Rejects invalid formats
- T006 validation tests start passing

---

### T014: Update PUT /api/wedding/config to accept new fields
**File**: `app/api/wedding/config/route.ts`
**Description**: Modify PUT handler to:
- Accept `groomsInstagramLink` in request body (optional, nullable)
- Accept `brideInstagramLink` in request body (optional, nullable)
- Validate URLs using `isValidInstagramUrl` from T013
- Return 400 with clear error if validation fails
- Update database with new fields
- Keep `footerText` handling unchanged
- Ignore old `instagramLink` field (deprecated)

**Acceptance**:
- T005 contract tests pass (new fields handled)
- T006 validation tests pass (validation working)
- Existing fields still work

---

### T015: Update GET /api/wedding/config response
**File**: `app/api/wedding/config/route.ts`
**Description**: Modify GET handler to:
- Include `groomsInstagramLink` in response
- Include `brideInstagramLink` in response
- Include `footerText` in response (unchanged)
- Omit deprecated `instagramLink` from response (or include but document as deprecated)

**Acceptance**:
- Response includes new fields
- No breaking changes for existing fields

---

### T016: Update wedding service layer
**File**: `app/lib/wedding-service.ts`
**Description**: Update service functions if needed:
- Ensure `getWeddingConfigById` returns new fields
- Ensure update functions handle new fields
- No changes needed if service already passes through all fields

**Acceptance**:
- Service layer handles new fields correctly
- No TypeScript errors

---

### T017: Update PUT /api/wedding/config/features to use new toggle name
**File**: `app/api/wedding/config/features/route.ts`
**Description**: Update VALID_FEATURES array:
- Change `'instagram_link'` to `'instagram_links'`
- Verify all 8 valid features present

**Acceptance**:
- T007 feature toggle tests pass
- Old feature name rejected with 400
- New feature name accepted

---

### T018: Update API preview endpoint
**File**: `app/api/wedding/preview/route.ts`
**Description**: Ensure preview endpoint includes new fields:
- Response includes `groomsInstagramLink`
- Response includes `brideInstagramLink`
- Verify no changes needed (likely already includes all config fields)

**Acceptance**:
- Preview response includes new fields
- No breaking changes

---

### T019: Remove Instagram Link field from BasicInfoForm
**File**: `app/components/ConfigDashboard.tsx`
**Description**: Modify `BasicInfoForm` component:
- Remove `instagramLink` from formData state
- Remove Instagram Link input field from JSX
- Keep all other fields unchanged (groom name, bride name, date, parents, etc.)
- Remove `instagramLink` from form submission

**Acceptance**:
- Basic Info tab no longer shows Instagram Link field
- Other fields still work
- Form submission works
- T008 test starts passing

---

### T020: Remove Footer Text field from BasicInfoForm
**File**: `app/components/ConfigDashboard.tsx`
**Description**: Modify `BasicInfoForm` component:
- Remove `footerText` from formData state
- Remove Footer Text textarea from JSX
- Remove `footerText` from form submission
- Keep all other Basic Info fields working

**Acceptance**:
- Basic Info tab no longer shows Footer Text field
- Other fields unaffected
- T008 test fully passes

---

### T021: Create ContentForm component
**File**: `app/components/ConfigDashboard.tsx`
**Description**: Create new `ContentForm` component in same file (or extract to separate file):
- Accept `config` and `onUpdate` props (mirror BasicInfoForm pattern)
- Create form state with `groomsInstagramLink`, `brideInstagramLink`, `footerText`
- Create form JSX:
  - Grid layout: two Instagram fields side-by-side
  - Label: "Groom's Instagram Link" (URL input)
  - Label: "Bride's Instagram Link" (URL input)
  - Label: "Footer Text" (textarea)
- Implement form submission with `onUpdate`
- Add URL format validation with error display
- Add Save button with loading state
- Follow same pattern as BasicInfoForm (React Hook Form if used, or controlled components)

**Acceptance**:
- Component renders all three fields
- Form submission works
- URL validation prevents invalid submissions
- Success feedback after save

---

### T022: Add ContentForm to Content tab
**File**: `app/components/ConfigDashboard.tsx`
**Description**: Update Content tab rendering:
- Replace placeholder text with `<ContentForm config={config} onUpdate={updateConfig} saving={saving} />`
- Pass correct props

**Acceptance**:
- Content tab shows ContentForm
- T009 component tests pass
- Form is functional

---

### T023: Update FeaturesForm toggle description
**File**: `app/components/ConfigDashboard.tsx`
**Description**: Update `FeaturesForm` component:
- Find feature object with `name: 'instagram_link'`
- Change `name` to `'instagram_links'`
- Update `label` to `'Instagram Links'` (plural)
- Update `description` to better reflect both links (e.g., "Show social media links of bride and groom")

**Acceptance**:
- Features tab shows "Instagram Links" (plural)
- Toggle works correctly
- Description is accurate

---

### T024: Update Template1Preview footer rendering
**File**: `app/components/preview/Template1Preview.tsx`
**Description**: Modify footer section to render both Instagram links:
- Change feature toggle check from `features.instagram_link` to `features.instagram_links`
- Replace single Instagram link rendering with:
  ```tsx
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
- Remove old single `config.instagramLink` reference

**Acceptance**:
- Footer displays 0, 1, or 2 Instagram links correctly
- Personalized with groom/bride names
- T010 component tests pass

---

### T025: Update admin preview page
**File**: `app/preview/page.tsx`
**Description**: Verify preview page includes new fields (likely no changes needed):
- Check that data fetching includes `groomsInstagramLink` and `brideInstagramLink`
- Verify no changes needed (getWeddingConfigById should return all fields)

**Acceptance**:
- Preview page works with new fields
- No TypeScript errors

---

## Phase 3.4: Polish & Validation

### T026 [P]: Unit test - URL validation utility
**File**: `tests/unit/validation.test.ts`
**Description**: Write comprehensive unit tests for `isValidInstagramUrl`:
- Test valid Instagram URLs (with and without www)
- Test invalid URLs (wrong domain, malformed, etc.)
- Test edge cases (empty string, null, special characters)
- Achieve 100% coverage for this utility

**Acceptance**:
- All test cases pass
- 100% coverage for validation function

---

### T027 [P]: Unit test - wedding service with new fields
**File**: `tests/unit/wedding-service.test.ts`
**Description**: Write unit tests for service layer:
- Test `getWeddingConfigById` returns new fields
- Test update operations with new fields
- Mock database calls

**Acceptance**:
- Service layer fully tested
- Tests pass

---

### T028 [P]: Update API documentation
**File**: `docs/api.md` or inline JSDoc comments
**Description**: Document API changes:
- Document new `groomsInstagramLink` and `brideInstagramLink` fields
- Document renamed feature toggle `instagram_links`
- Mark `instagramLink` as deprecated
- Update request/response examples

**Acceptance**:
- API documentation is accurate and up-to-date

---

### T029: Run full test suite
**Command**: `npm test`
**Description**: Run all tests to ensure nothing broke:
- All unit tests pass
- All integration tests pass
- All component tests pass
- No TypeScript errors
- No ESLint errors

**Acceptance**:
- Test suite passes 100%
- No errors or warnings

---

### T030: Run E2E test suite
**Command**: `npx playwright test`
**Description**: Run all E2E tests:
- T011 dashboard flow passes
- T012 template rendering passes
- All other existing E2E tests still pass

**Acceptance**:
- E2E tests pass 100%
- No flaky tests

---

### T031: Execute manual quickstart validation
**File**: `specs/008-split-instagram-links/quickstart.md`
**Description**: Manually execute all 12 quickstart scenarios:
- Verify database schema (Scenario 1)
- Verify UI reorganization (Scenario 2)
- Test saving both links (Scenario 3)
- Test saving one link (Scenario 4)
- Test URL validation (Scenario 5)
- Test template rendering - both links (Scenario 6)
- Test template rendering - single link (Scenario 7)
- Test template rendering - no links (Scenario 8)
- Test feature toggle (Scenario 9)
- Test backward compatibility (Scenario 10)
- Test API contracts (Scenarios 11, 12)

**Acceptance**:
- All 12 scenarios pass
- Checklist in quickstart.md fully checked

---

### T032: Performance validation
**Description**: Verify performance requirements:
- Dashboard save operation < 200ms (T005)
- Preview page load includes new fields without slowdown
- No N+1 queries introduced
- Database indexes sufficient (if needed)

**Acceptance**:
- Performance meets or exceeds targets
- No performance regressions

---

### T033: Code review and cleanup
**Description**: Final code quality pass:
- Remove any commented-out code
- Remove console.log statements
- Verify consistent code style (Prettier)
- Check for any TODO comments
- Ensure all files have proper TypeScript types
- No `any` types without justification

**Acceptance**:
- Code is clean and production-ready
- ESLint passes with no warnings
- Prettier formatted

---

### T034: Update CLAUDE.md if needed
**File**: `CLAUDE.md`
**Description**: Ensure agent context is current:
- Verify recent changes entry exists for this feature
- Update any relevant sections
- Keep file under 150 lines

**Acceptance**:
- CLAUDE.md is accurate and concise
- Entry already added during planning ✓

---

### T035: Create pull request
**Description**: Prepare for code review:
- Ensure all commits are clean and descriptive
- Verify branch is up-to-date with main/master
- Run final test suite
- Create PR with clear description
- Reference quickstart.md scenarios in PR description
- Include before/after screenshots of UI changes

**Acceptance**:
- PR created and ready for review
- All CI checks pass
- Comprehensive PR description

---

## Dependencies

### Critical Path
```
T001-T004 (Schema)
  ↓
T005-T012 (Tests - ALL MUST FAIL)
  ↓
T013-T018 (API Layer)
  ↓
T019-T023 (UI Components)
  ↓
T024-T025 (Template)
  ↓
T026-T035 (Polish & Validation)
```

### Detailed Dependencies
- **T013** (validation utility) blocks T014 (API validation)
- **T014** (API update) required for T005, T006 to pass
- **T017** (feature toggle rename) required for T007 to pass
- **T019, T020** (remove fields) required for T008 to pass
- **T021, T022** (ContentForm) required for T009 to pass
- **T024** (footer update) required for T010 to pass
- **T001-T025** block T029-T031 (testing phases)

---

## Parallel Execution Examples

### Phase 3.1: Schema changes can run sequentially (same files)
```bash
# Must run in order (same schema files)
1. T001 - Update weddings.ts
2. T002 - Update features.ts
3. T003 - Create migration
4. T004 - Update types.ts
```

### Phase 3.2: All tests can run in parallel [P]
```bash
# Launch T005-T012 together (different test files):
npx jest tests/integration/api/wedding-config-update.test.ts &
npx jest tests/integration/api/wedding-config-validation.test.ts &
npx jest tests/integration/api/feature-toggle-rename.test.ts &
npx jest tests/components/ConfigDashboard-BasicInfo.test.tsx &
npx jest tests/components/ConfigDashboard-ContentForm.test.tsx &
npx jest tests/components/Template1Preview-footer.test.tsx &
npx playwright test tests/e2e/admin-dashboard-instagram-links.spec.ts &
npx playwright test tests/e2e/template-instagram-rendering.spec.ts &
```

### Phase 3.3: Some tasks can parallelize
```bash
# After T013 completes, can run in parallel:
# T019-T020 (BasicInfoForm changes - same file, run sequentially)
# T021-T022 (ContentForm - same file, run sequentially)
# But these can run parallel to each other:
# Group 1: ConfigDashboard changes (T019-T023)
# Group 2: Template changes (T024-T025)
```

### Phase 3.4: Polish tasks mostly parallel [P]
```bash
# T026-T028 can run in parallel (different files):
npx jest tests/unit/validation.test.ts &
npx jest tests/unit/wedding-service.test.ts &
# Update docs manually in parallel
```

---

## Notes

- **TDD Critical**: Tests T005-T012 MUST fail before implementing T013-T025
- **[P] Marker**: Indicates tasks that can run in parallel (different files)
- **Same File Rule**: Tasks modifying the same file MUST run sequentially
- **Commit Strategy**: Commit after each task or logical group
- **Database**: Apply migration (T003) in development environment before testing
- **TypeScript**: Types auto-infer from Drizzle schema - verify with tsc
- **Testing**: Follow existing test patterns in codebase (Jest + React Testing Library + Playwright)

---

## Validation Checklist

**Generated Tasks Validation**:
- [x] All contracts have corresponding tests (T005-T007)
- [x] All schema changes have tasks (T001-T004)
- [x] All tests come before implementation (Phase 3.2 before 3.3)
- [x] Parallel tasks are truly independent (verified file paths)
- [x] Each task specifies exact file path
- [x] No [P] task modifies same file as another [P] task
- [x] TDD workflow enforced (tests MUST fail first)
- [x] All quickstart scenarios covered by tests

**Task Coverage**:
- [x] Database schema (T001-T004)
- [x] API layer (T013-T018)
- [x] UI components (T019-T023)
- [x] Template rendering (T024-T025)
- [x] Testing (T005-T012, T026-T027, T029-T031)
- [x] Documentation (T028, T034)
- [x] Deployment prep (T032-T033, T035)

---

## Success Criteria

**Feature Complete When**:
- All 35 tasks checked off
- All tests passing (unit, integration, e2e)
- Manual quickstart validation complete (12/12 scenarios)
- Performance targets met (<200ms for dashboard operations)
- Code review passed
- PR merged

**Status**: ☐ Ready to Execute

---

*Generated from design artifacts in /specs/008-split-instagram-links/*
*Based on Constitution v1.2.0 TDD requirements*
