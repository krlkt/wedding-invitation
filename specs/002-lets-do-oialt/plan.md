# Implementation Plan: Template-Based Live Preview with Feature Toggle Integration

**Branch**: `OIALT-8-template-preview-integration` | **Date**: 2025-10-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/Users/karelkarunia/Code/wedding-invitation/specs/002-lets-do-oialt/spec.md`

## Execution Flow (/plan command scope)

```
1. Load feature spec from Input path ✓
2. Fill Technical Context ✓
3. Fill Constitution Check section ✓
4. Evaluate Constitution Check → Update Progress Tracking
5. Execute Phase 0 → research.md
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, CLAUDE.md
7. Re-evaluate Constitution Check → Update Progress Tracking
8. Plan Phase 2 → Describe task generation approach
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 8. Phases 2-4 are executed by other commands:

- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary

Transform the current LivePreview component from showing placeholder text to rendering the actual wedding invitation template (InvitationPage.tsx) with full feature toggle integration. The preview will conditionally display sections (Love Story, RSVP, Gallery, Prewedding Videos, FAQs, Dress Code, Instagram Link) based on their toggle states, showing real content and styling. This establishes Template 1 architecture to support multiple templates in the future.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 14.2.4 App Router
**Primary Dependencies**: React 18, Material-UI 7.x, Tailwind CSS, Framer Motion, Lenis (smooth scroll)
**Storage**: Turso (libSQL) with Drizzle ORM - existing schema (wedding_configurations, feature_toggles)
**Testing**: Jest + React Testing Library (component tests), Playwright (E2E), MSW (API mocking)
**Target Platform**: Web application (Next.js SSR/CSR hybrid)
**Project Type**: Web (Next.js monolith with app/ directory structure)
**Performance Goals**: Instant preview updates (<100ms), no lag when toggling features, smooth scrolling in preview
**Constraints**: Must reuse existing InvitationPage components without modification, preview scaled for dashboard viewing, support future template architecture
**Scale/Scope**: Single template (Template 1), 7 feature toggles, ~10-15 section components from InvitationPage.tsx

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### I. Technology Stack Consistency ✓

- Using Next.js 14.2.4 App Router ✓
- TypeScript strict mode ✓
- Tailwind CSS + Material-UI ✓
- Existing Turso/libSQL database ✓
- React Hook Form (not needed for preview - read-only) ✓

### II. Performance-First Development ✓

- Client component required ('use client') for interactive preview ✓
- Images use Next.js Image component (inheriting from template) ✓
- No new heavy dependencies required ✓

### III. Component Architecture Standards ✓

- Functional components only ✓
- Props interfaces defined ✓
- Component in `/app/components/` (LivePreview.tsx already exists) ✓
- No new context providers needed ✓

### IV. Code Quality Requirements ✓

- ESLint compliance required ✓
- Prettier formatting (4-space, single quotes, 120 char) ✓
- TypeScript strict mode ✓
- Feature-based organization ✓

### V. Data & State Management ✓

- No new database models required (using existing wedding_configurations, feature_toggles) ✓
- Client-side data fetching via existing API route (/api/wedding/config) ✓
- JSON serialization already implemented ✓

### VI. Testing Standards ✓

- Jest + React Testing Library for component tests REQUIRED ✓
- Playwright for E2E preview flow REQUIRED ✓
- MSW for API mocking REQUIRED ✓
- TDD approach: tests before implementation ✓
- 80% coverage threshold ✓

**Initial Gate Result**: PASS ✓ - No constitutional violations

## Project Structure

### Documentation (this feature)

```
specs/002-lets-do-oialt/
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
├── [location]/
│   └── InvitationPage.tsx           # Existing template (reused, not modified)
├── components/
│   ├── LivePreview.tsx              # UPDATE: Transform to use template
│   ├── preview/                     # NEW: Preview-specific components
│   │   ├── TemplateRenderer.tsx    # NEW: Template selector/renderer
│   │   ├── PreviewContainer.tsx    # NEW: Scaling/styling wrapper
│   │   └── Template1Preview.tsx    # NEW: Template 1 with feature toggles
│   ├── hero/                        # Existing: Hero components
│   ├── timeline/                    # Existing: Love Story Timeline
│   ├── rsvp/                        # Existing: RSVP form
│   ├── gallery/                     # Existing: Gallery
│   ├── prewedding/                  # Existing: YouTube embed
│   ├── faq/                         # Existing: FAQs
│   ├── dresscode/                   # Existing: Dress code
│   ├── gift/                        # Existing: Gift section
│   ├── wish/                        # Existing: Wishes
│   └── zoomGridPhotos/              # Existing: Groom/Bride photos
├── models/
│   ├── preview.ts                   # NEW: Preview-specific types
│   └── template.ts                  # NEW: Template types
└── api/
    └── wedding/
        └── config/                  # Existing: Already returns features

tests/
├── components/
│   └── preview/
│       ├── LivePreview.test.tsx            # NEW: Component tests
│       ├── TemplateRenderer.test.tsx       # NEW: Template renderer tests
│       └── Template1Preview.test.tsx       # NEW: Template 1 tests
├── integration/
│   └── preview-feature-toggles.test.tsx    # NEW: Feature toggle integration
└── e2e/
    └── live-preview.spec.ts                # NEW: E2E preview flow
```

**Structure Decision**: This is a Next.js 14 App Router web application following the constitution's directory structure. We're enhancing the existing `LivePreview.tsx` component and adding a new `/app/components/preview/` directory for template-specific preview components. The existing InvitationPage.tsx template components will be reused without modification to ensure visual consistency.

## Phase 0: Outline & Research

### Research Tasks

1. **Component Reusability Pattern**
   - Decision: Extract sections from InvitationPage.tsx as reusable components vs. conditionally render in preview wrapper
   - Research: Best practices for sharing components between different rendering contexts (guest view vs. admin preview)
   - Key question: How to handle dependencies like `wishes`, `rsvp`, `location` props that preview may not have?

2. **Feature Toggle to Component Mapping**
   - Decision: Map feature_name enum to component rendering logic
   - Research: Pattern for dynamic component rendering based on database flags
   - Key question: How to handle ordering and conditional sections efficiently?

3. **Preview Scaling & Styling**
   - Decision: CSS approach for scaling full template in dashboard container
   - Research: CSS transform vs. iframe vs. viewport techniques
   - Key question: How to maintain interactivity (scroll) while scaling?

4. **Template Architecture**
   - Decision: Future-proof architecture for multiple templates
   - Research: Plugin/strategy pattern for template selection
   - Key question: How to structure code for easy template addition?

5. **Data Fetching for Preview Content**
   - Decision: What additional data beyond config (love story items, gallery photos, FAQs, etc.)
   - Research: Existing API endpoints for content vs. new unified preview endpoint
   - Key question: Performance of multiple API calls vs. single preview endpoint?

### Research Output → research.md

(Will be generated in Phase 0 execution)

## Phase 1: Design & Contracts

### Data Model → data-model.md

**Note**: This feature primarily uses existing entities. New types are for frontend TypeScript only.

#### Existing Entities (Referenced)

- **WeddingConfiguration**: From wedding_configurations table
- **FeatureToggle**: From feature_toggles table

#### New TypeScript Types (No DB Changes)

**PreviewConfig**

```typescript
{
  weddingConfig: WeddingConfiguration
  features: Record<FeatureName, boolean>
  content: {
    loveStory?: LoveStoryItem[]
    gallery?: GalleryPhoto[]
    faqs?: FAQ[]
    dressCode?: DressCode
    // ... other content
  }
}
```

**TemplateProps**

```typescript
{
  config: PreviewConfig
  isPreview: boolean
  onSectionRender?: (sectionName: string) => void
}
```

**FeatureName**

```typescript
;'love_story' | 'rsvp' | 'gallery' | 'prewedding_videos' | 'faqs' | 'dress_code' | 'instagram_link'
```

### API Contracts → contracts/

**Existing Endpoint (Reference Only - No Changes)**

```
GET /api/wedding/config
Response: { data: WeddingConfiguration & { features: Record<string, boolean> } }
```

**Potential New Endpoint (if research determines need)**

```
GET /api/wedding/preview
Response: {
  data: {
    config: WeddingConfiguration
    features: Record<FeatureName, boolean>
    content: {
      loveStory: LoveStoryItem[]
      gallery: GalleryPhoto[]
      faqs: FAQ[]
      dressCode: DressCode
      // ... consolidated preview data
    }
  }
}
```

### Component Contracts

**TemplateRenderer Interface**

```typescript
interface TemplateRendererProps {
  templateId: 'template-1' | string
  config: PreviewConfig
  containerClassName?: string
}
```

**Template1Preview Interface**

```typescript
interface Template1PreviewProps {
  config: PreviewConfig
  // Inherits all section components from InvitationPage.tsx
}
```

### Test Scenarios → quickstart.md

(Will be generated with specific test steps)

### Update Agent Context → CLAUDE.md

(Will run update script in Phase 1)

## Phase 2: Task Planning Approach

_This section describes what the /tasks command will do - DO NOT execute during /plan_

**Task Generation Strategy**:

1. **Setup Tasks**:
   - Create new directory structure (`app/components/preview/`, `app/models/preview.ts`, etc.)
   - Install any missing dev dependencies (none expected)

2. **Test Tasks (TDD - Write First)**:
   - Component tests for LivePreview.tsx [P]
   - Component tests for TemplateRenderer.tsx [P]
   - Component tests for Template1Preview.tsx [P]
   - Integration test for feature toggle rendering [P]
   - E2E test for live preview flow
   - All tests MUST fail initially (no implementation yet)

3. **Implementation Tasks**:
   - Create TypeScript interfaces (preview.ts, template.ts) [P]
   - Create PreviewContainer component (scaling/styling wrapper)
   - Create TemplateRenderer component (template selector)
   - Create Template1Preview component (feature-conditional rendering)
   - Update LivePreview.tsx to use TemplateRenderer
   - Handle data fetching (research will determine approach)
   - Add error boundaries and loading states
   - Handle missing content gracefully

4. **Polish Tasks**:
   - Verify all tests pass
   - Performance testing (toggle response time)
   - Accessibility testing
   - Code review for constitutional compliance
   - Update documentation

**Ordering Strategy**:

- Setup → Tests → Types → Components (bottom-up: Container → Renderer → Template1 → LivePreview)
- Tests always before implementation
- Mark [P] where files are independent
- Integration tests after unit tests
- E2E tests after all implementation

**Estimated Output**: 20-25 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation

_These phases are beyond the scope of the /plan command_

**Phase 3**: Task execution (/tasks command creates tasks.md)
**Phase 4**: Implementation (execute tasks.md following constitutional principles)
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking

_Fill ONLY if Constitution Check has violations that must be justified_

No constitutional violations identified. This feature:

- Uses existing tech stack ✓
- Follows component architecture standards ✓
- Maintains performance standards ✓
- Includes comprehensive testing ✓
- No new database changes ✓

## Progress Tracking

_This checklist is updated during execution flow_

**Phase Status**:

- [x] Phase 0: Research complete (/plan command) ✓
- [x] Phase 1: Design complete (/plan command) ✓
- [x] Phase 2: Task planning complete (/plan command - describe approach only) ✓
- [x] Phase 3: Tasks generated (/tasks command) ✓
- [x] Phase 4: Implementation complete (/implement command) ✓
- [ ] Phase 5: Validation passed (manual testing via quickstart.md)

**Gate Status**:

- [x] Initial Constitution Check: PASS ✓
- [x] Post-Design Constitution Check: PASS ✓
- [x] All NEEDS CLARIFICATION resolved (none in spec) ✓
- [x] Complexity deviations documented (none) ✓

**Artifacts Generated**:

- ✓ research.md - Research decisions and architecture patterns
- ✓ data-model.md - TypeScript interfaces and data structures
- ✓ contracts/api-preview-endpoint.md - API contract for preview endpoint
- ✓ quickstart.md - Manual testing scenarios (15 test cases)
- ✓ CLAUDE.md - Updated agent context
- ✓ tasks.md - 30 ordered, testable tasks with TDD approach

---

_Based on Constitution v1.2.0 - See `/memory/constitution.md`_
