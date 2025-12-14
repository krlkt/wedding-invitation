# Implementation Plan: Development and Testing Environment

**Branch**: `OIAL-9-Development-and-testing-environment` | **Date**: 2025-11-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/010-oial-9-development/spec.md`

## Execution Flow (/plan command scope)

```
1. Load feature spec from Input path
   → Loaded successfully
2. Fill Technical Context
   → TypeScript 5.x + Next.js 14.2.4 + Turso + Vercel
   → Project Type: Web (Next.js App Router)
3. Fill Constitution Check section
   → Evaluated against Wedding Invitation Constitution v1.2.0
4. Evaluate Constitution Check section
   → No violations detected
   → Progress: Initial Constitution Check ✓
5. Execute Phase 0 → research.md
   → Environment setup best practices
   → Turso multi-database patterns
   → Vercel environment configuration
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, CLAUDE.md
   → Data model: Environment configuration entities
   → Contracts: No new API endpoints (infrastructure feature)
   → Quickstart: Environment verification steps
7. Re-evaluate Constitution Check section
   → No new violations
   → Progress: Post-Design Constitution Check ✓
8. Plan Phase 2 → Describe task generation approach
   → TDD approach: Environment setup → verification tests → configuration
9. STOP - Ready for /tasks command
```

## Summary

This feature establishes a three-environment architecture (development, test, production) with isolated Turso database instances and Vercel deployment environments. The implementation will:

1. Create three separate Turso databases with independent schemas
2. Configure Vercel preview/production environments with environment-specific variables
3. Set up migration-based schema synchronization using Drizzle ORM
4. Implement environment detection and configuration management
5. Create verification tests to ensure environment isolation

**Technical Approach**: Leverage existing Drizzle ORM migration tooling, Vercel's built-in environment system, and Turso's multi-database capability to create fully isolated environments without requiring infrastructure changes to the Next.js application code.

## Technical Context

**Language/Version**: TypeScript 5.x with strict mode
**Primary Dependencies**: Next.js 14.2.4 (App Router), Drizzle ORM, Turso CLI, Vercel CLI
**Storage**: Turso (libSQL) - 3 separate database instances (dev, test, prod)
**Testing**: Jest (unit), Playwright (e2e), MSW (API mocking)
**Target Platform**: Vercel (hosting), Turso Cloud (database hosting)
**Project Type**: Web application (Next.js with App Router)
**Performance Goals**: Environment switching <1s, Migration execution <5s per file
**Constraints**: No application code changes for environment detection (use env vars only), Zero downtime for production migrations
**Scale/Scope**: 3 environments, ~5-10 developers, existing database schema with ~15 tables

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Technology Stack Consistency ✓

- ✅ Using TypeScript 5.x in strict mode (no `any` types)
- ✅ Using Next.js 14.2.4 App Router (no framework changes)
- ✅ Using Drizzle ORM for migrations (existing tool)
- ✅ Using Turso (libSQL) for all database instances
- ✅ No new UI components needed (infrastructure feature)

### Performance-First Development ✓

- ✅ Server-side environment detection (no client-side overhead)
- ✅ Migration scripts optimized for batch execution
- ✅ No impact on user-facing performance (configuration only)

### Component Architecture Standards ✓

- ✅ No new components required (infrastructure feature)
- ✅ Configuration management follows existing patterns

### Code Quality Requirements ✓

- ✅ All code will pass ESLint (next/core-web-vitals)
- ✅ Prettier formatting (4-space tabs, single quotes, 120 char width)
- ✅ TypeScript strict mode with no implicit any
- ✅ Environment configuration in standard location (.env patterns)

### Data & State Management ✓

- ✅ Database connection configuration in `/app/db/`
- ✅ TypeScript interfaces for environment configuration
- ✅ Server-side only (no client state for environment config)

### Testing Standards ✓

- ✅ Jest for database connection verification (unit tests)
- ✅ Playwright for environment isolation validation (e2e tests)
- ✅ MSW not required (no new API endpoints)
- ✅ TDD approach: Tests before implementation
- ✅ Target: 80% coverage for new configuration code

### Next.js 14 Data Fetching Patterns ✓

- ✅ Environment detection happens server-side only
- ✅ No client components needed for this feature
- ✅ No useEffect + fetch patterns (infrastructure only)

### Git Branch Naming Convention ✓

- ✅ Branch follows pattern: `OIAL-9-Development-and-testing-environment`
- ✅ Connects to JIRA ticket OIAL-9

**Status**: ✅ **PASS** - No constitution violations detected

## Project Structure

### Documentation (this feature)

```
specs/010-oial-9-development/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output - Environment setup research
├── data-model.md        # Phase 1 output - Environment configuration schema
├── quickstart.md        # Phase 1 output - Environment verification guide
├── contracts/           # Phase 1 output - N/A (no new API contracts)
└── tasks.md             # Phase 2 output - Created by /tasks command
```

### Source Code (repository root)

```
app/
├── db/
│   ├── schema/                   # Drizzle schema definitions (existing)
│   ├── index.ts                  # Database connection (UPDATED: multi-env support)
│   └── migrations/               # Migration files (NEW: env-aware migrations)
├── lib/
│   └── env-config.ts             # NEW: Environment detection and validation
└── api/
    └── health/
        └── route.ts              # NEW: Health check endpoint with env info

.env.local                         # Development environment variables (UPDATED)
.env.test                          # NEW: Test environment variables
.env.production                    # NEW: Production environment variables (Vercel only)

drizzle.config.ts                  # Drizzle configuration (UPDATED: multi-env)

tests/
├── integration/
│   └── environment-isolation.test.ts  # NEW: Environment isolation tests
└── e2e/
    └── environment-switching.spec.ts   # NEW: E2E environment validation

.github/
└── workflows/
    └── test.yml                   # UPDATED: Run tests against test environment

README.md                          # UPDATED: Environment setup documentation
```

**Structure Decision**: Single Next.js web application with environment-aware configuration. No separate backend/frontend split needed - all environment logic handled through Next.js App Router server components and environment variables.

## Phase 0: Outline & Research

**Status**: ✅ Complete

### Research Topics Completed

1. **Turso Multi-Database Setup**
   - Decision: Use Turso CLI to create 3 separate database instances
   - Rationale: Turso supports multiple databases under one account with isolated data
   - Alternatives: Single database with schema prefixes (rejected - not true isolation)

2. **Vercel Environment Configuration**
   - Decision: Use Vercel's built-in environment variables (Preview/Production)
   - Rationale: Automatic environment detection based on deployment context
   - Alternatives: Custom environment switching logic (rejected - adds complexity)

3. **Drizzle ORM Migration Strategy**
   - Decision: Single migration file set, applied to all environments sequentially
   - Rationale: Ensures schema consistency across environments
   - Alternatives: Environment-specific migrations (rejected - causes drift)

4. **Environment Detection Pattern**
   - Decision: Use `process.env.VERCEL_ENV` + custom `APP_ENV` variable
   - Rationale: Vercel provides automatic detection; fallback for local development
   - Alternatives: URL-based detection (rejected - fragile)

5. **Database Connection Pooling**
   - Decision: Single connection per environment, configured via env-specific URLs
   - Rationale: Turso handles connection pooling server-side
   - Alternatives: Application-level pooling (rejected - unnecessary complexity)

**Output**: See [research.md](./research.md) for detailed findings

## Phase 1: Design & Contracts

**Status**: ✅ Complete

### Data Model

**Environment Configuration Entity** (TypeScript interface, not database table):

```typescript
interface EnvironmentConfig {
  name: 'development' | 'test' | 'production';
  databaseUrl: string;
  databaseAuthToken: string;
  vercelEnv?: string;
  isProduction: boolean;
  canDestroyDatabase: boolean;
}
```

**Database Schema Changes**: None required - this is configuration only

See [data-model.md](./data-model.md) for complete schema documentation.

### API Contracts

**No new API endpoints required**. This is an infrastructure feature that works through:

- Environment variables (configured in Vercel/local)
- Database configuration (app/db/index.ts)
- Migration scripts (Drizzle CLI)

**Health Check Enhancement** (existing endpoint):

```
GET /api/health
Response: {
  status: 'ok',
  environment: 'development' | 'test' | 'production',
  database: 'connected' | 'error',
  timestamp: ISO8601
}
```

See [contracts/README.md](./contracts/README.md) for details.

### Quickstart Validation

**Environment Setup Verification**:

1. Create all three Turso databases
2. Configure environment variables locally and in Vercel
3. Run migrations against dev database
4. Verify environment detection: `npm run dev` shows "development"
5. Run integration tests: `npm test`
6. Deploy to Vercel preview: Verify "test" environment
7. Deploy to production: Verify "production" environment

See [quickstart.md](./quickstart.md) for step-by-step guide.

### Agent Context Update

Updated `CLAUDE.md` with:

- Three-environment architecture pattern
- Turso multi-database configuration
- Migration-based schema sync strategy
- Environment variable naming conventions

**Output**: data-model.md, quickstart.md, contracts/README.md, CLAUDE.md updated

## Phase 2: Task Planning Approach

_This section describes what the /tasks command will do - DO NOT execute during /plan_

**Task Generation Strategy**:

1. **Setup Tasks** (Foundation):
   - Create Turso databases (dev, test, prod)
   - Configure local environment variables
   - Update database connection logic for multi-env
   - Create environment detection utility

2. **Migration Tasks**:
   - Update Drizzle config for environment awareness
   - Test existing migrations on dev database
   - Document migration workflow
   - Create migration verification script

3. **Verification Tasks** (TDD approach):
   - Write environment isolation tests (FAILING)
   - Write database connection tests (FAILING)
   - Write migration sync tests (FAILING)
   - Implement environment detection (PASS tests)
   - Implement database switching (PASS tests)
   - Verify migration flow (PASS tests)

4. **Deployment Tasks**:
   - Configure Vercel environment variables (test)
   - Configure Vercel environment variables (production)
   - Update GitHub Actions for test environment
   - Document deployment process

5. **Documentation Tasks**:
   - Update README with environment setup
   - Create troubleshooting guide
   - Document rollback procedures

**Ordering Strategy**:

- Dependencies: Database creation → Env config → Migration → Tests → Deployment
- Parallel opportunities [P]:
  - Creating three databases can happen in parallel
  - Writing different test files can happen in parallel
  - Updating documentation can happen in parallel
- Serial requirements:
  - Database connection must work before migrations
  - Migrations must work before environment switching
  - Tests must pass before deployment configuration

**Estimated Output**: 20-25 numbered, dependency-ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation

_These phases are beyond the scope of the /plan command_

**Phase 3**: Task execution (/tasks command creates tasks.md)
**Phase 4**: Implementation (execute tasks.md following TDD principles)
**Phase 5**: Validation (all tests green, environment switching verified, deployment successful)

## Complexity Tracking

_No Constitution violations to document_

This implementation aligns fully with the Wedding Invitation Constitution:

- Uses existing tech stack (Next.js, TypeScript, Turso, Drizzle)
- Follows TDD testing standards
- No new architectural patterns introduced
- Leverages platform capabilities (Vercel, Turso) instead of custom solutions

## Progress Tracking

**Phase Status**:

- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning approach described (/plan command)
- [ ] Phase 3: Tasks generated (/tasks command) - NEXT STEP
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved (via /clarify session 2025-10-28)
- [x] Complexity deviations documented (none)

---

_Based on Wedding Invitation Constitution v1.2.0 - See `.specify/memory/constitution.md`_
