# Tasks: Development and Testing Environment

**Input**: Design documents from `/specs/010-oial-9-development/`
**Prerequisites**: plan.md, research.md, data-model.md, quickstart.md, contracts/README.md

## Execution Flow (main)

```
1. Load plan.md from feature directory
   → Loaded: TypeScript 5.x, Next.js 14.2.4, Turso, Drizzle ORM, Vercel
2. Load design documents:
   → data-model.md: EnvironmentConfig interface (no DB schema changes)
   → contracts/: No new API endpoints (enhanced /api/health only)
   → research.md: Turso multi-database, Vercel env vars, migration strategy
   → quickstart.md: 9-step verification process
3. Generate tasks by category:
   → Setup: 3 Turso databases, env vars, dependencies
   → Tests: environment detection, database connection, isolation
   → Core: env-config.ts, database connection, health endpoint
   → Integration: migration automation, Vercel configuration
   → Polish: documentation, verification, cleanup
4. Apply task rules:
   → Different files = [P] for parallel
   → Tests before implementation (TDD)
   → Database setup before configuration
5. Number tasks sequentially (T001-T027, plus T015.5 for security)
6. Dependencies: Setup → Tests → Implementation → Integration → Polish
7. Validation: All requirements covered, TDD approach followed, security validated
8. SUCCESS: 28 tasks ready for execution
```

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Phase 3.1: Setup

**Goal**: Create infrastructure (databases, environment configuration) before any code changes

- [ ] T001 Create Turso development database using `turso db create wedding-dev` and save connection URL and auth token
- [ ] T002 Create Turso test database using `turso db create wedding-test` and save connection URL and auth token
- [ ] T003 Create Turso production database using `turso db create wedding-prod` and save connection URL and auth token
- [ ] T004 Create `.env.local` file in repository root with development database credentials (DATABASE_URL, DATABASE_AUTH_TOKEN, APP_ENV=development)
- [ ] T005 Create `.env.example` file in repository root with placeholder environment variable structure for team reference
- [ ] T006 Update `.gitignore` to ensure `.env.local`, `.env.test`, and `.env.production` are never committed

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

- [ ] T007 [P] Write unit test for environment detection logic in `__tests__/unit/env-config.test.ts` (test getEnvironment function with different env vars)
- [ ] T008 Write unit test for config validation in `__tests__/unit/env-config.test.ts` (test validateConfig function catches invalid URLs, missing tokens) - **depends on T007**
- [ ] T009 [P] Write integration test for database connection in `__tests__/integration/database-connection.test.ts` (test connection to each environment's database)
- [ ] T010 [P] Write integration test for environment isolation in `__tests__/integration/environment-isolation.test.ts` (test data doesn't leak between environments)
- [ ] T011 [P] Write contract test for enhanced health endpoint in `__tests__/contracts/health-endpoint.test.ts` (test GET /api/health returns environment info)
- [ ] T012 [P] Write e2e test for environment switching in `tests/e2e/environment-switching.spec.ts` (test Playwright can verify environment in deployed preview)

## Phase 3.3: Core Implementation (ONLY after tests are failing)

**Goal**: Implement environment detection and configuration management to make tests pass

- [ ] T013 Create `app/lib/env-config.ts` with AppEnvironment type, EnvironmentConfig interface, getEnvironment function, and getConfig function (per data-model.md specification)
- [ ] T014 Add environment detection logic in `app/lib/env-config.ts` using VERCEL_ENV and APP_ENV with proper fallbacks (development default)
- [ ] T015 Add config validation function in `app/lib/env-config.ts` to validate DATABASE_URL format, auth token presence, and production safety checks
- [ ] T015.5 Add security validation in `app/lib/env-config.ts` to ensure DATABASE*URL and DATABASE_AUTH_TOKEN are server-only (verify no NEXT_PUBLIC* prefix, add runtime check)
- [ ] T016 Update `app/db/index.ts` to use environment-aware configuration from getConfig() instead of hardcoded env vars
- [ ] T017 Create or update `app/api/health/route.ts` to return environment information (status, environment name, database status, timestamp) with error handling (try/catch for DB connection, return 500 on failure)

## Phase 3.4: Integration

**Goal**: Connect all pieces (migrations, deployment, CI/CD)

- [ ] T018 Update `drizzle.config.ts` to use environment-aware DATABASE_URL and DATABASE_AUTH_TOKEN from process.env
- [ ] T019 Apply existing migrations to development database using `npm run db:push` and verify tables created
- [ ] T020 Apply existing migrations to test database (temporarily set env vars, run `npm run db:push`, then unset)
- [ ] T021 Apply existing migrations to production database (temporarily set env vars, run `npm run db:push`, then unset)
- [ ] T022 Configure Vercel environment variables for Preview scope (DATABASE_URL and DATABASE_AUTH_TOKEN for test database) via Vercel dashboard or CLI
- [ ] T023 Configure Vercel environment variables for Production scope (DATABASE_URL and DATABASE_AUTH_TOKEN for production database) via Vercel dashboard or CLI
- [ ] T024 Update Vercel build command in `vercel.json` or project settings to `npm run db:push && npm run build` to auto-apply migrations on deploy

## Phase 3.5: Polish

**Goal**: Documentation, verification, and cleanup

- [ ] T025 [P] Update README.md with environment setup section explaining three-environment architecture, database creation, and local configuration
- [ ] T026 [P] Create troubleshooting guide in `docs/TROUBLESHOOTING.md` documenting common environment issues (connection errors, wrong env detection, migration failures)
- [ ] T027 Run complete verification workflow from quickstart.md Steps 1-9 to ensure all environments working correctly

## Dependencies

**Critical Path**:

1. **T001-T003** (database creation) must complete before **T004** (local env config)
2. **T004-T006** (setup) must complete before **T007-T012** (tests)
3. **T007-T012** (tests must FAIL) before **T013-T017** (implementation)
4. **T007** (env detection tests) must complete before **T008** (config validation tests) - same file
5. **T013** (env-config.ts) must complete before **T014-T015.5** (depends on base file)
6. **T013** (env-config.ts) must complete before **T016** (db/index.ts imports it)
7. **T017** (health endpoint) depends on **T013** (uses getConfig)
8. **T018-T021** (migrations) depend on **T013-T016** (database connection working)
9. **T022-T024** (Vercel config) depend on **T018-T021** (databases have schema)
10. **T025-T027** (polish) depend on **all previous tasks**

**Parallel Opportunities**:

- T001, T002, T003 can run in parallel (different databases)
- T007, T009, T010, T011, T012 can run in parallel (different test files) - NOTE: T008 depends on T007
- T025, T026 can run in parallel (different documentation files)

## Parallel Execution Examples

### Example 1: Create all three databases simultaneously

```bash
# Launch T001-T003 together (3 terminal windows or background jobs):
turso db create wedding-dev &
turso db create wedding-test &
turso db create wedding-prod &
wait
```

### Example 2: Write test files (respecting dependencies)

```bash
# Launch T007, T009-T012 together using Task tool (T008 runs after T007):
Task: "Write unit test for environment detection in __tests__/unit/env-config.test.ts"
Task: "Write integration test for database connection in __tests__/integration/database-connection.test.ts"
Task: "Write integration test for environment isolation in __tests__/integration/environment-isolation.test.ts"
Task: "Write contract test for health endpoint in __tests__/contracts/health-endpoint.test.ts"
Task: "Write e2e test for environment switching in tests/e2e/environment-switching.spec.ts"

# After T007 completes, run T008:
Task: "Write unit test for config validation in __tests__/unit/env-config.test.ts"
```

### Example 3: Write documentation in parallel

```bash
# Launch T025-T026 together:
Task: "Update README.md with environment setup section"
Task: "Create troubleshooting guide in docs/TROUBLESHOOTING.md"
```

## Task Details

### T001: Create Turso Development Database

**Files**: None (CLI command)
**Command**: `turso db create wedding-dev`
**Output**: Save database URL and auth token for T004
**Verification**: `turso db list` shows `wedding-dev`

### T002: Create Turso Test Database

**Files**: None (CLI command)
**Command**: `turso db create wedding-test`
**Output**: Save database URL and auth token for T022
**Verification**: `turso db list` shows `wedding-test`

### T003: Create Turso Production Database

**Files**: None (CLI command)
**Command**: `turso db create wedding-prod`
**Output**: Save database URL and auth token for T023
**Verification**: `turso db list` shows `wedding-prod`

### T004: Create Local Environment File

**Files**: `.env.local` (create)
**Content**:

```bash
DATABASE_URL=libsql://wedding-dev-[org].turso.io
DATABASE_AUTH_TOKEN=eyJhbGc...
APP_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Verification**: File exists, not tracked by Git

### T005: Create Environment Example File

**Files**: `.env.example` (create)
**Content**:

```bash
DATABASE_URL=libsql://wedding-dev-YOUR-ORG.turso.io
DATABASE_AUTH_TOKEN=YOUR-DEV-TOKEN-HERE
APP_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Verification**: File committed to Git for team reference

### T006: Update .gitignore

**Files**: `.gitignore` (update)
**Add lines**:

```
.env.local
.env.test
.env.production
```

**Verification**: `.env.local` not shown in `git status`

### T007: Write Environment Detection Unit Test

**Files**: `__tests__/unit/env-config.test.ts` (create)
**Test cases**:

- `getEnvironment()` returns 'development' when APP_ENV=development
- `getEnvironment()` returns 'test' when VERCEL_ENV=preview
- `getEnvironment()` returns 'production' when VERCEL_ENV=production
- `getEnvironment()` defaults to 'development' when no env vars set
  **Status**: Must FAIL initially (getEnvironment doesn't exist yet)

### T008: Write Config Validation Unit Test

**Files**: `__tests__/unit/env-config.test.ts` (append)
**Test cases**:

- `validateConfig()` throws error for invalid DATABASE_URL format
- `validateConfig()` throws error for missing auth token on remote DB
- `validateConfig()` throws error if production DB marked as destroyable
- `validateConfig()` passes for valid configuration
  **Status**: Must FAIL initially (validateConfig doesn't exist yet)

### T009: Write Database Connection Integration Test

**Files**: `__tests__/integration/database-connection.test.ts` (create)
**Test cases**:

- Can connect to development database with valid credentials
- Can execute simple query (SELECT 1)
- Connection uses correct database URL per environment
- Connection fails gracefully with invalid credentials
  **Status**: Must FAIL initially (env-aware connection doesn't exist yet)

### T010: Write Environment Isolation Integration Test

**Files**: `__tests__/integration/environment-isolation.test.ts` (create)
**Test cases**:

- Data inserted in dev database doesn't appear in test database
- Schema changes in dev don't affect test or production
- Each environment has independent migration tracking
  **Status**: Must FAIL initially (environment separation not implemented)

### T011: Write Health Endpoint Contract Test

**Files**: `__tests__/contracts/health-endpoint.test.ts` (create)
**Test cases**:

- GET /api/health returns 200 status
- Response includes `status: 'ok'`
- Response includes `environment` field matching current env
- Response includes `database: 'connected'` when DB working
- Response includes ISO timestamp
  **Status**: Must FAIL initially (enhanced endpoint doesn't exist yet)

### T012: Write Environment Switching E2E Test

**Files**: `tests/e2e/environment-switching.spec.ts` (create)
**Test cases** (Playwright):

- Local dev server shows "development" environment
- Vercel preview deployment shows "test" environment
- Health endpoint returns correct environment name
  **Status**: Must FAIL initially (environment detection not implemented)

### T013: Create Environment Configuration Module

**Files**: `app/lib/env-config.ts` (create)
**Exports**:

- `AppEnvironment` type (literal: 'development' | 'test' | 'production')
- `EnvironmentConfig` interface (per data-model.md spec)
- `getEnvironment()` function (returns AppEnvironment)
- `getConfig()` function (returns EnvironmentConfig)
  **Implementation**: Base structure only, no logic yet
  **Verification**: File compiles without TypeScript errors

### T014: Implement Environment Detection Logic

**Files**: `app/lib/env-config.ts` (update)
**Logic**:

1. Check `process.env.APP_ENV` first (explicit override)
2. Check `process.env.VERCEL_ENV` second (Vercel automatic)
   - 'production' → return 'production'
   - 'preview' → return 'test'
3. Default to 'development'
   **Verification**: T007 tests should pass

### T015: Implement Config Validation

**Files**: `app/lib/env-config.ts` (update)
**Add**:

- `validateConfig(config: EnvironmentConfig): void` function
- Validate DATABASE_URL starts with `libsql://` or `http://`
- Validate DATABASE_AUTH_TOKEN present for remote databases
- Validate `canDestroyDatabase` is false when `isProduction` is true
- Throw descriptive errors for violations
  **Verification**: T008 tests should pass

### T015.5: Implement Security Validation

**Files**: `app/lib/env-config.ts` (update)
**Add**:

- Security check in `validateConfig` or `getConfig` to prevent client-side exposure
- Verify environment variable names don't use `NEXT_PUBLIC_` prefix for sensitive data
- Add runtime warning if `NEXT_PUBLIC_DATABASE_URL` or similar detected
- Document security requirement: DATABASE_URL and DATABASE_AUTH_TOKEN must be server-only
  **Verification**:
- Sensitive env vars not exposed in browser bundle
- Build succeeds with proper server-side-only configuration
  **Rationale**: Constitution principle #6 (Security) requires explicit validation

### T016: Update Database Connection

**Files**: `app/db/index.ts` (update)
**Changes**:

- Import `getConfig` from `@/app/lib/env-config`
- Call `getConfig()` to get environment-aware configuration
- Use `config.databaseUrl` and `config.databaseAuthToken` instead of `process.env` directly
- Remove hardcoded environment variable reads
  **Verification**: T009 tests should pass, existing app still works

### T017: Enhance Health Endpoint

**Files**: `app/api/health/route.ts` (create or update)
**Implementation**:

```typescript
import { NextResponse } from 'next/server';
import { getConfig } from '@/app/lib/env-config';

export async function GET() {
  const config = getConfig();

  return NextResponse.json({
    status: 'ok',
    environment: config.environment,
    database: config.databaseUrl ? 'connected' : 'error',
    timestamp: new Date().toISOString(),
  });
}
```

**Verification**: T011 tests should pass

### T018: Update Drizzle Configuration

**Files**: `drizzle.config.ts` (update)
**Changes**:

- Ensure `dbCredentials.url` uses `process.env.DATABASE_URL!`
- Ensure `dbCredentials.authToken` uses `process.env.DATABASE_AUTH_TOKEN!`
- No hardcoded database URLs
  **Verification**: `npm run db:generate` still works

### T019-T021: Apply Migrations to All Databases

**Commands**:

```bash
# T019: Development (uses .env.local)
npm run db:push

# T020: Test (temporary env override)
export DATABASE_URL="libsql://wedding-test-[org].turso.io"
export DATABASE_AUTH_TOKEN="[test-token]"
npm run db:push
unset DATABASE_URL DATABASE_AUTH_TOKEN

# T021: Production (temporary env override)
export DATABASE_URL="libsql://wedding-prod-[org].turso.io"
export DATABASE_AUTH_TOKEN="[prod-token]"
npm run db:push
unset DATABASE_URL DATABASE_AUTH_TOKEN
```

**Verification**: `turso db shell wedding-{env}` then `.tables` shows all tables in each database

### T022-T023: Configure Vercel Environment Variables

**Method**: Vercel Dashboard or CLI
**T022 (Preview/Test)**:

```bash
vercel env add DATABASE_URL preview
# Paste test database URL
vercel env add DATABASE_AUTH_TOKEN preview
# Paste test database token
```

**T023 (Production)**:

```bash
vercel env add DATABASE_URL production
# Paste production database URL
vercel env add DATABASE_AUTH_TOKEN production
# Paste production database token
```

**Verification**: `vercel env ls` shows variables in correct scopes

### T024: Update Build Command

**Files**: `vercel.json` (create or update) OR Vercel dashboard settings
**Option A (vercel.json)**:

```json
{
  "buildCommand": "npm run db:push && npm run build"
}
```

**Option B (Vercel Dashboard)**:

- Go to Project Settings → Build & Development Settings
- Set Build Command: `npm run db:push && npm run build`
  **Verification**: Next deployment runs migrations automatically

### T025: Update README Documentation

**Files**: `README.md` (update)
**Add section**: "Environment Setup"
**Content**:

- Explain three-environment architecture
- Link to quickstart.md for detailed setup
- Document environment variable requirements
- Explain migration workflow
  **Verification**: Team members can follow README to set up locally

### T026: Create Troubleshooting Guide

**Files**: `docs/TROUBLESHOOTING.md` (create)
**Sections**:

- "Database connection failed" → check .env.local
- "Wrong environment detected" → check VERCEL_ENV vs APP_ENV
- "Migrations not applying on Vercel" → check build command
- "Production data in development" → verify environment variables
  **Verification**: Common issues have documented solutions

### T027: Run Complete Verification

**Procedure**: Follow `specs/010-oial-9-development/quickstart.md` Steps 1-9
**Checklist**:

- [x] All 3 databases created and accessible
- [x] Local development uses wedding-dev database
- [x] Health endpoint returns "development" locally
- [x] Vercel preview shows "test" environment
- [x] Production shows "production" environment
- [x] Data isolated between environments
- [x] Migrations work in all environments
      **Verification**: All 13 functional requirements (FR-001 through FR-013) verified

## Notes

- **[P] tasks** = different files, no dependencies, can run in parallel
- **Verify tests FAIL** before implementing (T007-T012 must fail first)
- **Commit after each task** for incremental progress tracking
- **Avoid**: Skipping tests, implementing before tests written, modifying same file in parallel tasks
- **Environment safety**: Always double-check which database you're connected to before running destructive commands

## Task Generation Rules Applied

1. **From Research.md**:
   - T001-T003: Database creation (Turso multi-database pattern)
   - T014: Environment detection (Vercel ENV mapping)
   - T018-T021: Migration workflow (Drizzle sequential application)

2. **From Data Model**:
   - T013: EnvironmentConfig interface
   - T015: Config validation rules

3. **From Quickstart.md**:
   - T027: Complete verification (9-step process)
   - T019-T021: Migration application steps

4. **From Contracts**:
   - T011: Health endpoint contract test
   - T017: Enhanced health endpoint implementation

5. **TDD Ordering**:
   - Setup (T001-T006) → Tests (T007-T012) → Implementation (T013-T017) → Integration (T018-T024) → Polish (T025-T027)

## Validation Checklist

_GATE: Checked before execution_

- [x] All design documents have corresponding tasks (research, data-model, quickstart, contracts)
- [x] All requirements from spec.md covered (FR-001 through FR-013)
- [x] Tests come before implementation (T007-T012 before T013-T017)
- [x] Parallel tasks are truly independent (different files, no shared dependencies)
- [x] Each task specifies exact file path or command
- [x] No task modifies same file as another [P] task
- [x] Dependencies clearly documented
- [x] TDD approach followed (tests must fail first)
- [x] Infrastructure setup before code changes
- [x] Documentation tasks at end (polish phase)

---

**Status**: ✅ 28 tasks generated and ready for execution
**Estimated Time**: ~8-10 hours (with database creation, testing, and verification)
**Parallelizable Tasks**: 10 tasks can run in parallel (T001-T003, T007, T009-T012, T025-T026)
**Next Step**: Begin execution with Phase 3.1 (T001-T006)
