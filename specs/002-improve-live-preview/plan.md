# Implementation Plan: Improve Live Preview with Full-Screen View and Subdomain Uniqueness Validation

**Branch**: `002-improve-live-preview` | **Date**: 2025-10-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-improve-live-preview/spec.md`

## Execution Flow (/plan command scope)

```
1. Load feature spec from Input path
   → ✓ Loaded successfully
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → ✓ Project Type: Web application (Next.js)
   → ✓ Structure Decision: App Router with feature-based components
3. Fill the Constitution Check section based on the content of the constitution document.
   → ✓ Constitution loaded
4. Evaluate Constitution Check section below
   → ✓ No violations - follows existing patterns with UI library update
   → Update Progress Tracking: Initial Constitution Check PASS
5. Execute Phase 0 → research.md
   → ✓ Research existing preview implementation
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, CLAUDE.md
   → In progress
7. Re-evaluate Constitution Check section
   → Will check after design
8. Plan Phase 2 → Describe task generation approach
   → Will document
9. STOP - Ready for /tasks command
```

## Summary

Enhance admin dashboard preview functionality with full-screen viewing capability and implement robust subdomain uniqueness validation to prevent URL collisions during couple registration. Using shadcn/ui components for new UI elements.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 14.2.4
**Primary Dependencies**: React 18, shadcn/ui (Radix UI primitives), Tailwind CSS, React Hook Form, Framer Motion
**Storage**: Turso (libSQL) with Drizzle ORM
**Testing**: Jest (unit), React Testing Library (components), Playwright (E2E), MSW (API mocking)
**Target Platform**: Web (Next.js App Router on Vercel)
**Project Type**: Web application (frontend + backend unified in Next.js)
**Performance Goals**: <100ms API responses, 60fps animations, real-time preview updates
**Constraints**: Subdomain must be DNS-compliant (63 char limit), unique database constraint
**Scale/Scope**: Multi-tenant SaaS, ~100 concurrent couples initially

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Technology Stack Consistency

- ✅ Using Next.js 14.2.4 App Router
- ✅ TypeScript strict mode
- ✅ Tailwind CSS for utility-first styling
- ⚠️ **UI Library Update**: Using shadcn/ui instead of Material-UI for new components
  - Rationale: Better alignment with Tailwind, smaller bundle size, better customization
  - Existing Material-UI components remain unchanged for now
- ✅ Turso (libSQL) with Drizzle ORM
- ✅ React Hook Form for forms (if needed)

### Performance-First Development

- ✅ Server components by default, client components only when needed
- ✅ Database queries optimized (existing unique index on subdomain)
- ✅ Preview loads via API without heavy computation
- ✅ shadcn/ui components are tree-shakeable and lightweight

### Component Architecture Standards

- ✅ Functional components only
- ✅ Feature-based organization in `/app/components/`
- ✅ Context providers for shared state (session-based auth)
- ✅ shadcn/ui components follow same patterns

### Code Quality Requirements

- ✅ ESLint configured (next/core-web-vitals)
- ✅ TypeScript strict mode
- ✅ Feature-based file organization

### Data & State Management

- ✅ Models in `/app/db/schema/`
- ✅ API routes for mutations
- ✅ JSON serialization for server-to-client data

### Testing Standards

- ✅ Jest + React Testing Library for components
- ✅ Playwright for E2E critical flows
- ✅ MSW for API mocking
- ✅ TDD approach: tests before implementation
- ⚠️ Target: 80% test coverage for new code

**Initial Constitution Check**: PASS (with UI library update noted)

## Project Structure

### Documentation (this feature)

```
specs/002-improve-live-preview/
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
│   ├── page.tsx                      # Admin dashboard (existing)
│   └── preview/
│       └── page.tsx                  # NEW: Full-screen preview route
├── api/
│   ├── auth/
│   │   └── register/
│   │       └── route.ts              # MODIFY: Add subdomain validation
│   └── wedding/
│       └── config/
│           └── route.ts              # MODIFY: Add preview data endpoint
├── components/
│   ├── ui/                           # shadcn/ui components (if not already exists)
│   │   ├── button.tsx                # shadcn Button component
│   │   └── card.tsx                  # shadcn Card component
│   ├── LivePreview.tsx               # MODIFY: Update URL display
│   ├── ConfigDashboard.tsx           # MODIFY: Add "View Live Site" button (shadcn Button)
│   └── preview/
│       └── FullScreenPreview.tsx     # NEW: Full-screen preview component (shadcn UI)
└── lib/
    ├── utils.ts                      # shadcn utils (cn helper)
    └── wedding-service.ts            # MODIFY: Add subdomain collision retry logic

__tests__/
├── integration/
│   ├── live-preview.test.ts          # MODIFY: Update existing tests
│   └── subdomain-validation.test.ts  # NEW: Subdomain uniqueness tests
├── components/
│   └── FullScreenPreview.test.tsx    # NEW: Component tests
└── contracts/
    ├── preview-api.test.ts           # NEW: Preview API contract tests
    └── register-api.test.ts          # MODIFY: Add subdomain validation tests
```

**Structure Decision**: Next.js App Router architecture with feature-based components. Preview functionality integrated into existing `/admin` route with new `/preview` subroute for full-screen viewing. Service layer modifications in `/lib/wedding-service.ts` for subdomain validation logic. New UI components use shadcn/ui with Radix UI primitives.

## Phase 0: Outline & Research

### Research Tasks

1. **Existing Preview Implementation Analysis**
   - Current LivePreview.tsx rendering approach
   - How configuration data is fetched and displayed
   - Current subdomain generation logic (random suffix approach)

2. **Next.js Preview Patterns**
   - Best practices for authenticated preview routes in App Router
   - Session handling across preview context
   - Data fetching patterns for real-time updates

3. **Subdomain Uniqueness Patterns**
   - Retry strategies for collision resolution
   - Database-level vs application-level validation
   - Error handling for unique constraint violations

4. **shadcn/ui Integration**
   - Setup process if not already configured
   - Button and Card components for preview UI
   - Best practices for shadcn with Next.js App Router

5. **Testing Strategy**
   - Contract testing for preview API endpoints
   - Component testing for new shadcn UI elements
   - Integration testing for subdomain validation flow

**Output**: research.md with consolidated findings

## Phase 1: Design & Contracts

### Entities (from existing schema)

**Wedding Configuration** (existing in `/app/db/schema/weddings.ts`)

- Already has unique constraint on subdomain field (line 18)
- Fields: id, userId, subdomain, groomName, brideName, weddingDate, etc.

**Preview Session** (conceptual - uses existing auth session)

- Leverages existing cookie-based session authentication
- No new entity needed - uses existing session structure

### API Contracts

1. **GET /api/wedding/config** (existing - no changes needed)
   - Returns current user's wedding configuration
   - Used by both inline preview and full-screen preview

2. **POST /api/auth/register** (modify)
   - Add subdomain uniqueness validation
   - Return friendly error messages on collision

3. **GET /preview** (new page route)
   - Server-side rendered preview page
   - Uses existing session authentication

### Contract Tests

- `__tests__/contracts/preview-api.test.ts`: Test preview data endpoint
- `__tests__/contracts/register-api.test.ts`: Test subdomain validation errors

### Integration Tests

- Subdomain collision detection and retry
- Full-screen preview rendering
- Preview button navigation

### Component Tests

- FullScreenPreview component rendering (with shadcn components)
- LivePreview URL display update
- ConfigDashboard button addition (shadcn Button)

### Agent File Update

- Update CLAUDE.md with new preview routes and subdomain validation logic
- Add shadcn/ui to active technologies
- Add recent changes: Preview improvements and subdomain uniqueness

**Output**: data-model.md, contracts/, failing tests, quickstart.md, CLAUDE.md

## Phase 2: Task Planning Approach

_This section describes what the /tasks command will do - DO NOT execute during /plan_

**Task Generation Strategy**:

1. **Setup Tasks** (if needed)
   - Verify shadcn/ui setup or install required components
   - Add Button and Card components if not present

2. **Contract Test Tasks** [P]
   - Write failing contract tests for preview API
   - Write failing contract tests for registration with subdomain validation

3. **Component Test Tasks** [P]
   - Write failing component tests for FullScreenPreview
   - Write failing component tests for updated LivePreview
   - Write failing component tests for ConfigDashboard button

4. **Integration Test Tasks**
   - Write failing integration test for subdomain collision retry
   - Write failing integration test for full-screen preview navigation

5. **Implementation Tasks** (ordered by dependency)
   - Update LivePreview.tsx URL display message
   - Add isSubdomainAvailable() helper function to wedding-service.ts
   - Add retry logic to createWeddingConfiguration() in wedding-service.ts
   - Update register route error handling for subdomain collisions
   - Create /preview page route
   - Create FullScreenPreview component (using shadcn components)
   - Add "View Live Site" button to ConfigDashboard (using shadcn Button)

6. **Verification Tasks**
   - Run all contract tests - verify pass
   - Run all component tests - verify pass
   - Run all integration tests - verify pass
   - Manual testing: Verify preview button works
   - Manual testing: Verify subdomain uniqueness on registration

**Ordering Strategy**:

- Tests first (TDD)
- Service layer before API routes before UI
- Mark [P] for parallel-executable tasks (independent files)

**Estimated Output**: 20-25 numbered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation

_These phases are beyond the scope of the /plan command_

**Phase 3**: Task execution (/tasks command creates tasks.md)
**Phase 4**: Implementation (execute tasks.md following constitutional principles)
**Phase 5**: Validation (run tests, execute quickstart.md, verify 80% coverage)

## Complexity Tracking

_No constitutional violations detected - UI library update is incremental improvement_

| Consideration                    | Decision                           | Rationale                                                                      |
| -------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------ |
| shadcn/ui instead of Material-UI | Use shadcn for new components only | Better Tailwind integration, smaller bundle, existing MUI components unchanged |

## Progress Tracking

_This checklist is updated during execution flow_

**Phase Status**:

- [x] Phase 0: Research complete (/plan command) - research.md created
- [x] Phase 1: Design complete (/plan command) - contracts/, data-model.md, quickstart.md, CLAUDE.md created
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [x] Phase 3: Tasks generated (/tasks command) - tasks.md created with 23 tasks
- [ ] Phase 4: Implementation complete - Ready for /implement
- [ ] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS (shadcn/ui update documented)
- [x] All NEEDS CLARIFICATION resolved (custom domain timeline deferred)
- [x] Complexity deviations documented (UI library update noted)

---

_Based on Constitution v1.1.0 - See `.specify/memory/constitution.md`_
