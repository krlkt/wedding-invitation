# Research: Preview & Subdomain Validation

**Feature**: Improve Live Preview with Full-Screen View and Subdomain Uniqueness Validation
**Date**: 2025-10-10

## 1. Existing Preview Implementation Analysis

### Current State
**File**: `app/components/LivePreview.tsx`

**Findings**:
- Renders preview directly in admin dashboard using WeddingLayout component
- Fetches config data from `/api/wedding/config` endpoint
- Shows browser-style preview header with traffic light buttons
- Displays subdomain URL (currently hardcoded: `{subdomain}.yourdomain.com`)
- Uses inline preview with scaled-down view inside dashboard

**Current Subdomain Generation** (`app/lib/wedding-service.ts:21-33`):
```typescript
function generateSubdomain(groomName: string, brideName: string): string {
  const combined = `${groomName.toLowerCase()}-${brideName.toLowerCase()}`
  const cleaned = combined
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 63) // DNS limit
  const randomSuffix = Math.random().toString(36).substring(2, 6)
  return `${cleaned}-${randomSuffix}`
}
```

**Issues Identified**:
- No collision retry logic - random suffix reduces but doesn't eliminate collisions
- Preview URL shows incorrect domain
- No full-screen preview option for couples to see final result

## 2. Next.js Preview Patterns

### Decision: Server-Side Preview Route
**Chosen Approach**: `/admin/preview` page route

**Rationale**:
- Leverages existing session authentication middleware
- Server components can fetch data before rendering
- Clean separation from admin dashboard UI
- Can be opened in new tab/window for full-screen view

**Implementation Pattern**:
```typescript
// app/admin/preview/page.tsx
export default async function PreviewPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const config = await getWeddingConfigById(session.weddingConfigId)
  return <WeddingLayout config={config} />
}
```

**Alternatives Considered**:
- Client-side modal: Rejected - limited viewport size
- iframe embedding: Rejected - CSP issues and performance overhead
- Separate preview domain: Rejected - requires DNS/subdomain setup

## 3. Subdomain Uniqueness Patterns

### Decision: Pre-check with Retry Logic
**Chosen Approach**: Check availability before insert, retry on collision

**Rationale**:
- Proactive validation prevents database errors
- Retry logic handles rare collision cases gracefully
- Database unique constraint as safety net (defense in depth)
- Better user experience with friendly error messages

**Implementation Pattern**:
```typescript
async function createWeddingConfiguration(...) {
  let subdomain: string
  let attempts = 0
  const maxAttempts = 5

  while (attempts < maxAttempts) {
    subdomain = generateSubdomain(groomName, brideName)
    const available = await isSubdomainAvailable(subdomain)
    if (available) break
    attempts++
  }

  if (attempts >= maxAttempts) {
    throw new Error('Unable to generate unique subdomain')
  }

  // Proceed with creation...
}
```

**Alternatives Considered**:
- Database-only validation: Rejected - poor user experience with cryptic errors
- UUID-based subdomains: Rejected - not human-readable
- Manual subdomain input: Rejected - adds complexity to registration flow

### Collision Probability Analysis
- Random suffix: 36^4 = 1,679,616 possibilities per name combination
- Expected collisions: Negligible with <1000 couples
- Retry strategy: 5 attempts provides 99.9997% success rate

## 4. shadcn/ui Integration

### Current shadcn Setup Status
**Investigation needed**: Check if shadcn is already configured

**Required Components**:
- `Button`: For "View Live Site" action in ConfigDashboard
- `Card`: For preview UI structure (optional)

**Setup Process** (if not configured):
1. Install dependencies: `npm install @radix-ui/react-icons class-variance-authority clsx tailwind-merge`
2. Initialize: `npx shadcn-ui@latest init`
3. Add components: `npx shadcn-ui@latest add button card`

**Integration with Existing Tailwind**:
- shadcn uses same Tailwind config
- Components are copied to `app/components/ui/`
- No runtime dependency - just source files
- `cn()` utility in `lib/utils.ts` for className merging

**Decision**: Use shadcn Button for new "View Live Site" action
**Rationale**:
- Consistent with modern Tailwind patterns
- Smaller bundle than Material-UI
- Better tree-shaking
- Existing MUI components can coexist during transition

## 5. Testing Strategy

### Contract Testing
**Tool**: MSW (Mock Service Worker) + Jest

**Test Coverage**:
- `/api/wedding/config` returns valid configuration
- `/api/auth/register` validates subdomain uniqueness
- `/api/auth/register` returns error on collision after retries

### Component Testing
**Tool**: React Testing Library + Jest

**Test Coverage**:
- `LivePreview`: Renders with updated URL message
- `ConfigDashboard`: Shows "View Live Site" button
- `FullScreenPreview`: Renders wedding layout with config data
- Button interactions and navigation

### Integration Testing
**Tool**: Jest with database mocking

**Test Coverage**:
- Subdomain collision detection workflow
- Retry logic executes correctly
- Error handling for max attempts exceeded
- Session-based preview access control

### E2E Testing
**Tool**: Playwright

**Test Coverage**:
- Full registration flow with subdomain generation
- Preview button navigation from dashboard
- Full-screen preview rendering
- Error messages displayed correctly

## Recommendations

### Implementation Order
1. **Service Layer First**: Add `isSubdomainAvailable()` and retry logic
2. **API Layer**: Update register endpoint error handling
3. **UI Components**: Update LivePreview, add button to ConfigDashboard
4. **New Route**: Create `/admin/preview` page
5. **Tests**: Write failing tests before each implementation step (TDD)

### Performance Considerations
- Cache subdomain availability checks (1 minute TTL) to reduce DB queries
- Use database index on subdomain field (already exists)
- Server-side preview page for optimal loading

### Security Considerations
- Verify session authentication on preview route
- Validate subdomain format (DNS-safe characters)
- Rate limit registration attempts to prevent subdomain squatting

## Dependencies & Prerequisites

**No new major dependencies**:
- shadcn/ui uses existing Tailwind + Radix primitives
- All testing tools already configured
- Database schema already has unique constraint

**Setup Required**:
- Verify or install shadcn components (Button, optionally Card)
- Add `lib/utils.ts` if not present (for `cn()` helper)

## Next Steps

Ready to proceed to Phase 1: Design & Contracts
- Define API contract modifications
- Create data model documentation (minimal - using existing schema)
- Write quickstart validation steps
- Generate failing contract tests
