# Implementation Plan: Multi-Tenant Wedding Invitation Platform

**Branch**: `001-the-current-state` | **Date**: 2025-09-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/home/karel/code/wedding-invitation/specs/001-the-current-state/spec.md`

## Execution Flow (/plan command scope)

```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:

- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary

Transform the existing single-couple wedding invitation webapp (Karel & Sabrina) into a multi-tenant platform where any couple can register, customize their wedding invitation with personal details, toggle optional features, and receive a unique subdomain URL. The platform maintains existing functionality (RSVP, multi-location support, admin dashboards) while adding comprehensive customization capabilities including live preview editing, file uploads, and manual publish controls.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 14.2.4 App Router architecture
**Primary Dependencies**: React 18, Material-UI 7.x, Tailwind CSS, React Hook Form, Framer Motion
**Storage**: Turso (libSQL) database with Drizzle ORM, file uploads to Vercel (4MB limit)
**ORM**: Drizzle ORM for type-safe database operations and schema management
**Testing**: Jest + React Testing Library (component), Playwright (e2e), MSW (API mocking)
**Target Platform**: Vercel deployment with subdomain routing capability
**Project Type**: web - Next.js full-stack application with existing frontend+backend
**Performance Goals**: Live preview updates <100ms, image uploads <5s, page loads <3s
**Constraints**: Vercel 4MB request limit, existing database schema, maintain backward compatibility
**Scale/Scope**: Support 100+ couples initially, 10k+ wedding guests, preserve existing 3-location structure

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

**I. Technology Stack Consistency**: ✅ PASS

- Using Next.js 14.2.4 with App Router (matches constitution)
- TypeScript strict mode required (existing setup)
- Tailwind CSS + Material-UI for styling (existing dependencies)
- Turso (libSQL) for database (current setup)
- React Hook Form for forms (existing dependency)

**II. Performance-First Development**: ✅ PASS

- Next.js Image components for photo galleries (constitutional requirement)
- Server-side rendering by default with selective 'use client' (App Router pattern)
- Database optimization required for multi-tenant queries
- Lazy loading for non-critical components (gallery, optional features)

**III. Component Architecture Standards**: ✅ PASS

- Functional components only (existing codebase pattern)
- Props interfaces in `/app/models` (existing structure)
- Feature-based organization in `/app/components/[feature]/` (constitutional)
- Context providers for shared state (existing LocationProvider pattern)

**IV. Code Quality Requirements**: ✅ PASS

- ESLint next/core-web-vitals configuration (existing)
- Prettier with 4-space tabs, single quotes, 120 char width (existing)
- TypeScript strict mode (constitutional requirement)
- Feature-based file organization (aligns with structure)

**V. Data & State Management**: ✅ PASS

- Database models as TypeScript interfaces in `/app/models/` (existing pattern)
- Server Actions for mutations (Next.js App Router constitutional requirement)
- Context providers for cross-component state (existing pattern)
- JSON serialization pattern for server-to-client data (existing)

**VI. Testing Standards**: ⚠️ NEW REQUIREMENT

- Jest + React Testing Library for component testing (must implement)
- Playwright for e2e testing of critical user flows (must implement)
- MSW for API mocking (must implement)
- 80% test coverage threshold for new code (must implement)
- TDD principles: write failing tests before implementation (must follow)

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)

<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Phase 0: Outline & Research

1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:

   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts

_Prerequisites: research.md complete_

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh claude`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/\*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach

_This section describes what the /tasks command will do - DO NOT execute during /plan_

**Task Generation Strategy**:

- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract → contract test task [P]
- Each entity → model creation task [P]
- Each user story → integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:

- TDD order: Tests before implementation
- Dependency order: Models before services before UI
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 25-30 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation

_These phases are beyond the scope of the /plan command_

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking

_Fill ONLY if Constitution Check has violations that must be justified_

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |

## Progress Tracking

_This checklist is updated during execution flow_

**Phase Status**:

- [ ] Phase 0: Research complete (/plan command)
- [ ] Phase 1: Design complete (/plan command)
- [ ] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:

- [ ] Initial Constitution Check: PASS
- [ ] Post-Design Constitution Check: PASS
- [ ] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---

_Based on Constitution v2.1.1 - See `/memory/constitution.md`_
