# Quickstart: Development and Testing Environment

**Feature**: OIAL-9 Development and Testing Environment
**Phase**: Phase 1 - Design
**Date**: 2025-11-03
**Time to Complete**: ~30 minutes

## Overview

This guide will help you set up and verify the three-environment architecture (development, test, production) for the wedding invitation application. Follow these steps in order.

---

## Prerequisites

Before starting, ensure you have:

- [x] Turso CLI installed (`curl -sSfL https://get.tur.so/install.sh | bash`)
- [x] Vercel CLI installed (`npm i -g vercel`)
- [x] Node.js 18+ installed
- [x] Git repository cloned locally
- [x] Access to Turso organization (login with `turso auth login`)
- [x] Access to Vercel project (login with `vercel login`)

---

## Step 1: Create Turso Databases (5 min)

Create three separate database instances for each environment:

```bash
# Navigate to project root
cd /path/to/wedding-invitation

# Create development database
turso db create wedding-dev
# Output: Created database wedding-dev at [region]

# Create test database
turso db create wedding-test
# Output: Created database wedding-test at [region]

# Create production database
turso db create wedding-prod
# Output: Created database wedding-prod at [region]

# Verify all databases created
turso db list
# Should show: wedding-dev, wedding-test, wedding-prod
```

**✅ Checkpoint**: You should see all three databases listed when running `turso db list`.

---

## Step 2: Get Database Credentials (5 min)

For each database, get the connection URL and authentication token:

### Development Database

```bash
# Get database URL
turso db show wedding-dev --url
# Copy output (e.g., libsql://wedding-dev-org.turso.io)

# Generate auth token
turso db tokens create wedding-dev
# Copy output (e.g., eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...)
```

### Test Database

```bash
# Get database URL
turso db show wedding-test --url

# Generate auth token
turso db tokens create wedding-test
```

### Production Database

```bash
# Get database URL
turso db show wedding-prod --url

# Generate auth token
turso db tokens create wedding-prod
```

**📋 Save these credentials** - you'll need them in the next step.

**✅ Checkpoint**: You should have 6 values total (3 URLs + 3 tokens).

---

## Step 3: Configure Local Development Environment (5 min)

Create or update your local environment file with development database credentials:

```bash
# Create .env.local file (if it doesn't exist)
touch .env.local

# Edit .env.local (use your actual values from Step 2)
cat > .env.local << EOF
# Development Database (Turso)
DATABASE_URL=libsql://wedding-dev-[your-org].turso.io
DATABASE_AUTH_TOKEN=eyJhbG...your-dev-token

# Environment Override (optional)
APP_ENV=development

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF

# Verify file created
cat .env.local
```

**⚠️ Security Note**: Never commit `.env.local` to Git. It should already be in `.gitignore`.

**✅ Checkpoint**: Running `cat .env.local` should show your development database credentials.

---

## Step 4: Run Initial Migrations (5 min)

Apply the existing database schema to your development database:

```bash
# Generate migration files (if not already generated)
npm run db:generate

# Apply migrations to development database
npm run db:push
# Output: Applying migrations...
#         ✓ Migration 0001_xxx applied
#         ✓ Migration 0002_xxx applied
#         ...

# Verify migrations applied
turso db shell wedding-dev

# In the Turso shell:
sqlite> .tables
# Should list: users, wedding_configurations, rsvps, guests, photos, __drizzle_migrations

sqlite> SELECT COUNT(*) FROM __drizzle_migrations;
# Should show number of applied migrations (e.g., 15)

sqlite> .exit
```

**✅ Checkpoint**: Development database should have all tables from the existing schema.

---

## Step 5: Test Local Development Environment (5 min)

Verify the application runs correctly with the development database:

```bash
# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
# You should see the wedding invitation homepage

# Check server logs for environment confirmation:
# Should see: "Running in development environment"
# Should see: "Database connected: wedding-dev-[org].turso.io"
```

**Test Database Connection**:

```bash
# In another terminal, check health endpoint
curl http://localhost:3000/api/health

# Expected response:
# {
#   "status": "ok",
#   "environment": "development",
#   "database": "connected",
#   "timestamp": "2025-11-03T..."
# }
```

**✅ Checkpoint**: Application runs locally and connects to development database.

---

## Step 6: Configure Vercel Test Environment (5 min)

Set up environment variables in Vercel for the test (preview) environment:

```bash
# Option A: Using Vercel CLI
vercel env add DATABASE_URL preview
# Paste the TEST database URL when prompted

vercel env add DATABASE_AUTH_TOKEN preview
# Paste the TEST database auth token when prompted

# Option B: Using Vercel Dashboard
# 1. Go to https://vercel.com/[your-team]/[wedding-project]/settings/environment-variables
# 2. Add DATABASE_URL with scope "Preview"
# 3. Add DATABASE_AUTH_TOKEN with scope "Preview"
```

**Apply migrations to test database** (one-time setup):

```bash
# Temporarily switch to test database locally
export DATABASE_URL="libsql://wedding-test-[your-org].turso.io"
export DATABASE_AUTH_TOKEN="eyJhbG...your-test-token"

# Apply migrations
npm run db:push

# Unset temporary variables
unset DATABASE_URL
unset DATABASE_AUTH_TOKEN

# Verify migrations applied
turso db shell wedding-test
sqlite> .tables
# Should show same tables as dev database
sqlite> .exit
```

**✅ Checkpoint**: Test database has schema applied, Vercel preview environment configured.

---

## Step 7: Configure Vercel Production Environment (5 min)

Set up environment variables in Vercel for the production environment:

```bash
# Option A: Using Vercel CLI
vercel env add DATABASE_URL production
# Paste the PRODUCTION database URL when prompted

vercel env add DATABASE_AUTH_TOKEN production
# Paste the PRODUCTION database auth token when prompted

# Option B: Using Vercel Dashboard
# 1. Go to https://vercel.com/[your-team]/[wedding-project]/settings/environment-variables
# 2. Add DATABASE_URL with scope "Production"
# 3. Add DATABASE_AUTH_TOKEN with scope "Production"
```

**Apply migrations to production database** (one-time setup):

```bash
# Temporarily switch to production database locally
export DATABASE_URL="libsql://wedding-prod-[your-org].turso.io"
export DATABASE_AUTH_TOKEN="eyJhbG...your-prod-token"

# Apply migrations
npm run db:push

# Unset temporary variables
unset DATABASE_URL
unset DATABASE_AUTH_TOKEN

# Verify migrations applied
turso db shell wedding-prod
sqlite> .tables
# Should show same tables as dev and test databases
sqlite> .exit
```

**⚠️ Production Safety**: After this initial setup, migrations to production will run automatically during deployments. Manual migration application to production should be avoided.

**✅ Checkpoint**: Production database has schema applied, Vercel production environment configured.

---

## Step 8: Verify Environment Isolation (5 min)

Test that each environment is truly isolated:

### Test 1: Local Development

```bash
# Start local dev server
npm run dev

# Check environment
curl http://localhost:3000/api/health
# Should return: "environment": "development"

# Insert test data (will only affect dev database)
# (Use your application's UI or API to create a test record)
```

### Test 2: Preview Deployment (Test Environment)

```bash
# Create a test branch
git checkout -b test-environment-verification

# Make a trivial change (to trigger deployment)
echo "# Test" >> README.md
git add README.md
git commit -m "Test: Verify environment isolation"

# Push to trigger preview deployment
git push origin test-environment-verification

# Wait for Vercel to deploy (check Vercel dashboard)
# Once deployed, check the preview URL
curl https://wedding-invitation-[hash].vercel.app/api/health
# Should return: "environment": "test"
```

### Test 3: Production Deployment

```bash
# Merge to main (or push directly if allowed)
git checkout main
git merge test-environment-verification
git push origin main

# Wait for Vercel production deployment
# Once deployed, check production URL
curl https://your-domain.com/api/health
# Should return: "environment": "production"
```

### Test 4: Data Isolation Verification

```bash
# Check that test data is NOT in production
turso db shell wedding-dev
sqlite> SELECT COUNT(*) FROM users;
# Note the count (e.g., 5 test users)
sqlite> .exit

turso db shell wedding-prod
sqlite> SELECT COUNT(*) FROM users;
# Should show different count (e.g., 0 or real production users)
sqlite> .exit
```

**✅ Checkpoint**: Each environment returns correct environment name, data is isolated.

---

## Step 9: Run Integration Tests (Optional, 5 min)

If integration tests exist, run them against the test environment:

```bash
# Set environment to test
export APP_ENV=test
export DATABASE_URL="libsql://wedding-test-[your-org].turso.io"
export DATABASE_AUTH_TOKEN="eyJhbG...your-test-token"

# Run integration tests
npm test

# Unset variables
unset APP_ENV
unset DATABASE_URL
unset DATABASE_AUTH_TOKEN
```

**✅ Checkpoint**: Tests pass against test database without affecting production.

---

## Validation Checklist

Verify all requirements are met:

- [x] **FR-001**: Three separate environments exist (dev, test, prod)
- [x] **FR-002**: Each environment has isolated database (verified in Step 8)
- [x] **FR-003**: Schema changes testable in dev before prod (migrations applied sequentially)
- [x] **FR-004**: Can reset dev/test databases (turso db destroy wedding-dev)
- [x] **FR-005**: Production protected (Vercel deployment from main branch only)
- [x] **FR-006**: Tests run against test env (Step 9)
- [x] **FR-007**: Environments identifiable (verified in Step 8)
- [x] **FR-008**: Environment-specific config (Vercel env vars set)
- [x] **FR-009**: Can identify environment (curl /api/health shows env name)
- [x] **FR-010**: Dev/test databases destroyable (canDestroyDatabase flag)
- [x] **FR-011**: Open access configured (all devs can deploy via Git push)
- [x] **FR-012**: Shared dev database (single wedding-dev for all developers)
- [x] **FR-013**: Migration-based sync (Drizzle migrations applied in sequence)

---

## Common Issues & Troubleshooting

### Issue: "Database connection failed" locally

**Solution**:

```bash
# Check .env.local has correct values
cat .env.local

# Test database URL directly
turso db shell wedding-dev
# If this works, the URL is correct

# Verify auth token hasn't expired
turso db tokens create wedding-dev
# Generate new token and update .env.local
```

### Issue: Migrations not applying on Vercel deployment

**Solution**:

```bash
# Check Vercel build logs for errors
vercel logs [deployment-url]

# Ensure environment variables are set correctly
vercel env ls

# Manually trigger a deployment
vercel --prod
```

### Issue: Wrong environment detected in deployment

**Solution**:

```bash
# Check VERCEL_ENV is set correctly (automatic)
# If overriding with APP_ENV, verify it's set correctly in Vercel

# Remove APP_ENV from Vercel if you want automatic detection
vercel env rm APP_ENV production
vercel env rm APP_ENV preview
```

### Issue: Production database accidentally modified in development

**Solution**:

```bash
# This should be impossible if environment variables are correct
# Verify .env.local points to wedding-dev, not wedding-prod
cat .env.local | grep DATABASE_URL
# Should show: wedding-dev, NOT wedding-prod

# If production was modified, restore from Turso backup (if available)
# Or manually revert changes via SQL
```

---

## Rollback Procedure

If you need to revert this environment setup:

### Rollback Application Code

```bash
# Revert to previous commit before environment changes
git revert [commit-hash]
git push origin main
```

### Rollback Vercel Configuration

```bash
# Remove environment variables
vercel env rm DATABASE_URL production
vercel env rm DATABASE_URL preview
vercel env rm DATABASE_AUTH_TOKEN production
vercel env rm DATABASE_AUTH_TOKEN preview

# Revert to single database setup (original DATABASE_URL)
vercel env add DATABASE_URL production
# Enter original single database URL
```

### Keep Databases (Recommended)

```bash
# Do NOT destroy databases immediately
# Keep them as backups for 30 days

# Only destroy if absolutely certain:
# turso db destroy wedding-dev
# turso db destroy wedding-test
```

---

## Next Steps

After completing this quickstart:

1. ✅ **Commit Environment Configuration**:

   ```bash
   # Update .env.example with placeholders
   cat > .env.example << EOF
   DATABASE_URL=libsql://wedding-dev-YOUR-ORG.turso.io
   DATABASE_AUTH_TOKEN=YOUR-DEV-TOKEN-HERE
   APP_ENV=development
   EOF

   git add .env.example
   git commit -m "docs: Add environment configuration template"
   ```

2. ✅ **Update Documentation**:
   - Add environment setup section to README.md
   - Document migration workflow for other developers
   - Create troubleshooting guide

3. ✅ **Team Onboarding**:
   - Share Turso organization access with team
   - Provide each developer with development database credentials
   - Walk through this quickstart guide with new team members

4. ✅ **Monitor Environments**:
   - Set up Vercel deployment notifications
   - Monitor Turso database usage/performance
   - Review migration logs for each deployment

---

## Verification Complete ✅

If you've completed all steps successfully:

- ✅ Development environment running locally with isolated database
- ✅ Test environment deployed on Vercel preview with isolated database
- ✅ Production environment deployed on Vercel with isolated database
- ✅ All databases have identical schema (via migrations)
- ✅ Data is completely isolated between environments
- ✅ Migrations flow sequentially: dev → test → prod

**Time Taken**: ~30 minutes
**Status**: Environment setup complete, ready for development!

---

**Need Help?** Check the troubleshooting section above or refer to:

- [Turso Documentation](https://docs.turso.tech/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Drizzle ORM Migrations](https://orm.drizzle.team/kit-docs/overview)
