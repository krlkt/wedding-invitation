# Quickstart: Preview & Subdomain Validation Testing

**Feature**: Improve Live Preview with Full-Screen View and Subdomain Uniqueness Validation

## Prerequisites

```bash
# Ensure development environment is running
yarn dev

# Ensure database is accessible
# Turso database should be configured in .env
```

## Test Scenarios

### 1. Subdomain Uniqueness Validation

**Objective**: Verify subdomain collision detection and retry logic

**Steps**:

```bash
# 1. Register first couple
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john1@test.com",
    "password": "password123",
    "groomName": "John",
    "brideName": "Mary"
  }'

# Expected: Success with subdomain like "john-mary-a8f2"
# Note the subdomain returned

# 2. Register second couple with same names
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john2@test.com",
    "password": "password123",
    "groomName": "John",
    "brideName": "Mary"
  }'

# Expected: Success with DIFFERENT subdomain like "john-mary-x9k3"
# Subdomain should differ due to random suffix

# 3. Verify both subdomains are unique
# Query database or check via API
```

**Success Criteria**:

- ✅ Both registrations succeed
- ✅ Subdomains are different despite same names
- ✅ No database constraint errors
- ✅ Response time < 500ms per registration

---

### 2. Full-Screen Preview Access

**Objective**: Verify full-screen preview route works for authenticated users

**Steps**:

```bash
# 1. Login as registered user
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john1@test.com",
    "password": "password123"
  }' \
  -c cookies.txt

# 2. Access preview page
curl -X GET http://localhost:3000/preview \
  -b cookies.txt

# Expected: HTML page with wedding layout
# Should include couple names, wedding date, etc.

# 3. Access without authentication
curl -X GET http://localhost:3000/preview

# Expected: Redirect to /login (302)
```

**Success Criteria**:

- ✅ Authenticated users see full wedding preview
- ✅ Unauthenticated users redirected to login
- ✅ Preview reflects current configuration
- ✅ No admin UI elements visible in preview

---

### 3. Preview URL Display Update

**Objective**: Verify LivePreview component shows correct subdomain message

**Steps**:

1. Login to admin dashboard at `/admin`
2. Check the preview section header
3. Verify URL display shows appropriate message (not broken `yourdomain.com`)

**Expected Display**:

```
Preview: Your wedding site (Available with custom domain)
```

Or:

```
Preview: oial.vercel.app (shared domain)
```

**Success Criteria**:

- ✅ No reference to non-existent `{subdomain}-oial.vercel.app`
- ✅ Message is clear and non-misleading
- ✅ Visual preview still renders correctly below

---

### 4. "View Live Site" Button

**Objective**: Verify new button navigates to full-screen preview

**Manual Test**:

1. Login to `/admin`
2. Locate "View Live Site" button in ConfigDashboard
3. Click button
4. Verify opens `/preview` (preferably in new tab)
5. Verify full wedding site is displayed
6. Verify no admin interface elements

**Success Criteria**:

- ✅ Button is visible and properly styled (shadcn Button component)
- ✅ Click opens preview route
- ✅ Preview shows complete wedding layout
- ✅ Browser back button returns to dashboard

---

### 5. Registration Error Handling

**Objective**: Verify friendly error messages on subdomain generation failure

**Simulated Failure Test** (for contract tests):

```typescript
// Mock isSubdomainAvailable to always return false
jest.mock('@/app/lib/wedding-service', () => ({
  ...jest.requireActual('@/app/lib/wedding-service'),
  isSubdomainAvailable: jest.fn().mockResolvedValue(false),
}))

// Attempt registration
// Expected: Error after 5 retry attempts
```

**Expected Response**:

```json
{
  "success": false,
  "error": "Unable to generate unique subdomain. Please try again."
}
```

**Success Criteria**:

- ✅ User-friendly error message (no technical jargon)
- ✅ No database constraint errors exposed
- ✅ Retry logic attempts exactly 5 times
- ✅ User can retry registration successfully

---

## Performance Validation

### Subdomain Availability Check

```bash
# Measure query performance
time curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123","groomName":"Test","brideName":"User"}'
```

**Target**: < 200ms total registration time (including subdomain check)

### Preview Page Load

```bash
# Measure preview page render time
time curl -X GET http://localhost:3000/preview -b cookies.txt
```

**Target**: < 300ms server response time

---

## Cleanup

```bash
# Remove test users from database (optional)
# Delete via database admin or SQL:
# DELETE FROM user_accounts WHERE email LIKE '%@test.com';
```

---

## Automated Test Execution

```bash
# Run contract tests
yarn test __tests__/contracts/

# Run component tests
yarn test __tests__/components/FullScreenPreview

# Run integration tests
yarn test __tests__/integration/subdomain-validation

# Run all tests
yarn test
```

**Expected**: All tests pass ✅

---

## Rollback Plan

If issues are detected:

1. **Preview issues**: Revert LivePreview.tsx changes
2. **Subdomain collision**: Disable retry logic, use existing random suffix only
3. **Full database rollback**: No schema changes, so no migrations to revert

---

## Success Checklist

- [ ] Two couples with same names get unique subdomains
- [ ] Subdomain retry logic executes on collision
- [ ] Full-screen preview accessible at `/preview`
- [ ] Unauthenticated users redirected from preview
- [ ] LivePreview URL display updated (no broken links)
- [ ] "View Live Site" button added to dashboard
- [ ] Button navigates to full-screen preview
- [ ] Error messages are user-friendly
- [ ] All automated tests pass
- [ ] Performance targets met (<200ms registration, <300ms preview)
