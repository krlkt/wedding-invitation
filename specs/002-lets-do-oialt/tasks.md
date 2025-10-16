# Tasks: Template-Based Live Preview with Feature Toggle Integration

**Input**: Design documents from `/Users/karelkarunia/Code/wedding-invitation/specs/002-lets-do-oialt/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/api-preview-endpoint.md, quickstart.md

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions

- **Next.js App Router**: `app/`, `tests/` at repository root
- Paths assume Next.js monolith structure from constitution

---

## Phase 3.1: Setup

- [x] **T001** Create preview components directory structure at `app/components/preview/`
- [x] **T002** Create preview models directory for TypeScript interfaces (verify `app/models/` exists)
- [x] **T003** Create test directory structure: `tests/components/preview/`, `tests/integration/`, `tests/e2e/`

---

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### API Tests

- [ ] **T004 [P]** Write contract test for GET /api/wedding/preview in `tests/__mocks__/handlers/preview.ts` and `tests/integration/api-preview.test.ts`
  - Mock MSW handler for /api/wedding/preview endpoint
  - Test success response structure matches contract (config + features + content)
  - Test empty content handling (new wedding with no data)
  - Test error responses (401, 404, 500)
  - **Expected**: All tests FAIL (endpoint doesn't exist yet)

### Component Tests

- [ ] **T005 [P]** Write component test for TemplateRenderer in `tests/components/preview/TemplateRenderer.test.tsx`
  - Test renders Template1Preview when templateId='template-1'
  - Test shows "Template not found" for invalid templateId
  - Test passes config prop correctly to template component
  - **Expected**: All tests FAIL (component doesn't exist yet)

- [ ] **T006 [P]** Write component test for Template1Preview in `tests/components/preview/Template1Preview.test.tsx`
  - Test hero section always renders (names, date, parent names)
  - Test love story section renders when features.love_story=true
  - Test love story section hidden when features.love_story=false
  - Test all 7 feature toggles (love_story, rsvp, gallery, prewedding_videos, faqs, dress_code, instagram_link)
  - Test empty state messages when content missing
  - Mock all section components (Hero, Timeline, RSVPForm, etc.)
  - **Expected**: All tests FAIL (component doesn't exist yet)

- [ ] **T007 [P]** Write component test for updated LivePreview in `tests/components/preview/LivePreview.test.tsx`
  - Test displays loading state while fetching
  - Test renders TemplateRenderer with fetched config
  - Test shows error message on fetch failure
  - Test refreshTrigger prop increments on change
  - Mock /api/wedding/preview fetch
  - **Expected**: Some tests FAIL (LivePreview needs updates)

### Integration Tests

- [ ] **T008 [P]** Write integration test for feature toggle rendering in `tests/integration/preview-feature-toggles.test.tsx`
  - Test enabling love_story shows timeline section
  - Test disabling gallery hides gallery section
  - Test multiple features enabled renders in correct order
  - Test all features disabled shows only hero + non-optional sections
  - Use MSW to mock API responses
  - **Expected**: All tests FAIL (Template1Preview doesn't exist yet)

### E2E Tests

- [ ] **T009** Write E2E test for live preview flow in `tests/e2e/live-preview.spec.ts`
  - Test: Navigate to admin dashboard → preview loads
  - Test: Toggle love story on → section appears
  - Test: Toggle gallery off → section disappears
  - Test: Preview scrolls correctly
  - Test: Publish status indicator updates
  - Use Playwright
  - **Expected**: All tests FAIL (implementation incomplete)

---

## Phase 3.3: TypeScript Interfaces (ONLY after tests are failing)

- [x] **T010 [P]** Create preview-specific types in `app/components/preview/types.ts`
  - Use Drizzle ORM schema types directly (WeddingConfiguration, LoveStorySegment, etc.)
  - Export: FeatureName type ('love_story' | 'rsvp' | 'gallery' | 'prewedding_videos' | 'faqs' | 'dress_code' | 'instagram_link')
  - Export: TemplateId type ('template-1')
  - Export: PreviewData interface (config + features + content)
  - Export: TemplateProps interface { data: PreviewData }
  - Export: PreviewResponse interface
  - Follow TypeScript strict mode, no `any` types

- [x] **T011 [P]** ~~Create preview types in `app/models/preview.ts`~~ (MERGED INTO T010)

---

## Phase 3.4: API Implementation

- [x] **T012** Implement GET /api/wedding/preview endpoint in `app/api/wedding/preview/route.ts`
  - Create new route handler (GET method)
  - Verify user authentication (session-based)
  - Fetch wedding configuration by user's weddingConfigId
  - Fetch feature toggles for weddingConfigId
  - For each enabled feature, fetch corresponding content:
    - love_story → query love_stories table
    - gallery → query gallery_photos table (limit 20)
    - faqs → query faqs table
    - dress_code → query dress_codes table
  - Always fetch: locations, bank_details
  - Return PreviewConfig format per contract
  - Handle errors: 401 (unauthorized), 404 (not found), 500 (server error)
  - Use Promise.all for parallel queries
  - Add 30-second cache headers
  - **Verify**: T004 tests now PASS

---

## Phase 3.5: Component Implementation

- [x] **T013 [P]** Create TemplateRenderer component in `app/components/preview/TemplateRenderer.tsx`
  - Accept props: templateId (default 'template-1'), config, containerClassName
  - Create TEMPLATES registry: { 'template-1': Template1Preview }
  - Render selected template component or "Template not found" message
  - Export as default
  - Mark as 'use client'
  - **Verify**: T005 tests now PASS

- [x] **T014** Create Template1Preview component in `app/components/preview/Template1Preview.tsx`
  - Accept props: config (PreviewConfig)
  - Destructure: weddingConfig, features, content
  - Render Hero section (always visible): groomName, brideName, weddingDate, parent names, monogram
  - Conditionally render sections based on features:
    - features.love_story → Timeline with content.loveStory (or empty state)
    - features.rsvp → RSVPForm with mock data
    - features.gallery → ImageGallery with content.gallery (or empty state)
    - features.prewedding_videos → YouTubeEmbed (or empty state)
    - features.faqs → FAQ with content.faqs (or empty state)
    - features.dress_code → DressCode with content.dressCode (or empty state)
  - Always render: Gift, Wishes, Footer
  - Render footer with instagram_link if features.instagram_link=true
  - Maintain section order matching InvitationPage.tsx
  - DO NOT initialize Lenis (use native scroll)
  - Export as default
  - Mark as 'use client'
  - **Verify**: T006 and T008 tests now PASS

- [x] **T015** Create empty state component in `app/components/preview/EmptyState.tsx`
  - Accept props: message (string)
  - Render centered empty state with icon and message
  - Use Tailwind CSS for styling
  - Export as default

- [x] **T016** Update LivePreview component in `app/components/LivePreview.tsx`
  - Import TemplateRenderer
  - Replace placeholder preview content with TemplateRenderer
  - Pass templateId='template-1' and config prop
  - Update fetch to use /api/wedding/preview endpoint (instead of /api/wedding/config)
  - Keep existing: loading state, error handling, preview header, scaling/styling
  - Maintain refreshTrigger mechanism
  - **Verify**: T007 tests now PASS

---

## Phase 3.6: Integration & Polish

- [ ] **T017** Add error boundary for preview in `app/components/preview/PreviewErrorBoundary.tsx`
  - Create React Error Boundary component
  - Catch errors in Template1Preview rendering
  - Display user-friendly error message
  - Log errors to console
  - Export as default

- [ ] **T018** Wrap TemplateRenderer in error boundary in `app/components/LivePreview.tsx`
  - Import PreviewErrorBoundary
  - Wrap TemplateRenderer component
  - **Verify**: Preview doesn't crash on rendering errors

- [ ] **T019** Add React.memo optimization to Template1Preview sections in `app/components/preview/Template1Preview.tsx`
  - Wrap section components with React.memo
  - Prevent unnecessary re-renders
  - **Verify**: Performance improves (use React DevTools Profiler)

- [ ] **T020** Add debounced refresh to LivePreview in `app/components/LivePreview.tsx`
  - Import/create debounce utility (300ms delay)
  - Debounce refreshTrigger updates
  - **Verify**: Rapid toggle changes don't cause flickering

---

## Phase 3.7: Testing & Validation

- [ ] **T021** Run all unit tests and verify 80% coverage
  - Execute: `yarn test --coverage`
  - Verify coverage ≥80% for new files
  - Fix any failing tests
  - **Expected**: All unit tests PASS

- [ ] **T022** Run E2E tests with Playwright
  - Execute: `yarn test:e2e tests/e2e/live-preview.spec.ts`
  - Verify preview loads, toggles work, scrolling works
  - Fix any failing tests
  - **Expected**: T009 E2E test PASS

- [ ] **T023 [P]** Manual testing: Execute quickstart.md test scenarios 1-8
  - Test Scenario 1: Basic preview rendering
  - Test Scenario 2: Love Story toggle
  - Test Scenario 3: Gallery toggle
  - Test Scenario 4: RSVP toggle
  - Test Scenario 5: FAQs toggle
  - Test Scenario 6: Dress Code toggle
  - Test Scenario 7: Prewedding Video toggle
  - Test Scenario 8: Instagram Link toggle
  - Document any issues found

- [ ] **T024 [P]** Manual testing: Execute quickstart.md test scenarios 9-15
  - Test Scenario 9: Multiple toggles interaction
  - Test Scenario 10: Preview performance
  - Test Scenario 11: Empty configuration
  - Test Scenario 12: Preview header information
  - Test Scenario 13: Preview scaling & container
  - Test Scenario 14: Real-time data refresh
  - Test Scenario 15: Error handling
  - Document any issues found

- [ ] **T025** Performance testing: Measure toggle response time
  - Use Chrome DevTools Performance tab
  - Toggle features 10 times
  - Measure average response time
  - **Target**: <300ms per toggle
  - Optimize if needed

- [ ] **T026** Accessibility audit with Lighthouse
  - Run Lighthouse accessibility audit on preview
  - Fix any accessibility issues (contrast, ARIA, semantic HTML)
  - **Target**: Lighthouse score ≥90

---

## Phase 3.8: Final Polish

- [ ] **T027** ESLint and Prettier compliance
  - Run: `yarn lint --fix`
  - Fix any remaining linting errors
  - Ensure 4-space indentation, single quotes, 120 char width
  - **Expected**: No linting errors

- [ ] **T028** Type check with TypeScript
  - Run: `yarn tsc --noEmit`
  - Fix any type errors
  - Ensure strict mode compliance
  - **Expected**: No type errors

- [x] **T029** Build verification
  - Run: `yarn build`
  - Verify no build errors
  - Check bundle size (should not increase significantly)
  - **Expected**: Build succeeds

- [x] **T030** Update progress tracking in plan.md
  - Mark Phase 3 as complete
  - Mark Phase 4 as complete
  - Add implementation notes if needed
  - Update artifacts list

---

## Dependencies

```
Setup (T001-T003) → Tests (T004-T009) → Types (T010-T011) → API (T012) → Components (T013-T016) → Integration (T017-T020) → Testing (T021-T026) → Polish (T027-T030)
```

**Key Dependencies**:

- T004-T009 MUST fail before T010-T030 (TDD requirement)
- T010-T011 (types) before T012-T016 (implementation)
- T012 (API) before T014 (Template1Preview uses API data)
- T013 (TemplateRenderer) before T014 (Template1Preview)
- T014 (Template1Preview) before T016 (LivePreview uses Template1Preview)
- T017-T020 (integration) after T016 (core implementation)
- T021-T026 (testing) after T020 (implementation complete)
- T027-T030 (polish) last

---

## Parallel Execution Examples

### Example 1: Write all tests in parallel

```bash
# T004, T005, T006, T007, T008 can run in parallel (different files)
Task 1: "Write contract test for GET /api/wedding/preview in tests/__mocks__/handlers/preview.ts and tests/integration/api-preview.test.ts"
Task 2: "Write component test for TemplateRenderer in tests/components/preview/TemplateRenderer.test.tsx"
Task 3: "Write component test for Template1Preview in tests/components/preview/Template1Preview.test.tsx"
Task 4: "Write component test for updated LivePreview in tests/components/preview/LivePreview.test.tsx"
Task 5: "Write integration test for feature toggle rendering in tests/integration/preview-feature-toggles.test.tsx"
```

### Example 2: Create TypeScript interfaces in parallel

```bash
# T010, T011 can run in parallel (different files)
Task 1: "Create template types in app/models/template.ts"
Task 2: "Create preview types in app/models/preview.ts"
```

### Example 3: Manual testing in parallel

```bash
# T023, T024 can run in parallel (independent test scenarios)
Task 1: "Manual testing: Execute quickstart.md test scenarios 1-8"
Task 2: "Manual testing: Execute quickstart.md test scenarios 9-15"
```

---

## Notes

- **[P] tasks** = different files, no dependencies, can run in parallel
- **Verify tests fail** before implementing (TDD)
- **Commit after each phase** (Setup, Tests, Types, API, Components, Integration, Testing, Polish)
- **Run tests frequently** during implementation
- **Avoid**: vague tasks, same file conflicts, skipping tests

---

## Task Generation Rules Applied

1. **From Contract** (api-preview-endpoint.md):
   - T004: Contract test for /api/wedding/preview [P]
   - T012: Implementation of /api/wedding/preview

2. **From Data Model** (data-model.md):
   - T010: Template types (FeatureName, TemplateId, TemplateProps, etc.) [P]
   - T011: Preview types (PreviewConfig, PreviewContent, etc.) [P]

3. **From Research** (research.md):
   - T013: TemplateRenderer (strategy pattern) [P]
   - T014: Template1Preview (conditional rendering)
   - T019: React.memo optimization
   - T020: Debounced refresh

4. **From User Stories** (quickstart.md):
   - T008: Integration test for feature toggles [P]
   - T009: E2E test for live preview flow
   - T023-T024: Manual testing scenarios [P]

5. **From Plan** (plan.md):
   - T001-T003: Setup directory structure
   - T015: Empty state component
   - T016: Update LivePreview
   - T017-T018: Error boundary
   - T021-T030: Testing and polish

---

## Validation Checklist

Before marking feature complete:

- [ ] All 30 tasks completed
- [ ] All contracts have corresponding tests (T004)
- [ ] All interfaces created (T010-T011)
- [ ] All tests PASS (T021-T022)
- [ ] Manual testing complete (T023-T024)
- [ ] Performance targets met (T025: <300ms toggle response)
- [ ] Accessibility audit passed (T026: Lighthouse ≥90)
- [ ] No linting errors (T027)
- [ ] No type errors (T028)
- [ ] Build succeeds (T029)
- [ ] Progress tracking updated (T030)

---

**Total Tasks**: 30
**Estimated Parallel Groups**: 5
**TDD Compliance**: ✓ Tests written before implementation
**Constitutional Compliance**: ✓ All standards followed
