# Environment Troubleshooting Guide

This guide covers common issues with the three-environment setup (development, test, production) and their solutions.

---

## Database Connection Issues

### Problem: "Database URL not found on env variable"

**Symptoms:**

```
Error: Database URL not found on env variable!
```

**Solution:**

1. Check that `.env.local` (or `.env`) exists in your project root
2. Verify it contains either:
   - `DATABASE_URL` and `DATABASE_AUTH_TOKEN` (new naming), OR
   - `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` (legacy naming)
3. Restart your development server (`npm run dev`)

**Quick fix:**

```bash
# Copy from example
cp .env.example .env.local

# Add your actual credentials
# Edit .env.local with your database URL and token
```

---

### Problem: "LibsqlError: SERVER_ERROR: Server returned HTTP status 404"

**Symptoms:**

```
LibsqlError: SERVER_ERROR: Server returned HTTP status 404
```

**Causes:**

- Database doesn't exist
- Wrong database URL
- Database was deleted

**Solution:**

1. Verify database exists:

   ```bash
   turso db list
   ```

2. If missing, recreate it:

   ```bash
   turso db create wedding-invitation-dev
   ```

3. Update your `.env.local` with the new credentials

4. Reapply migrations:
   ```bash
   npm run db:push
   ```

---

### Problem: "Invalid auth token" or 401/403 errors

**Symptoms:**

```
LibsqlError: UNAUTHORIZED: Invalid auth token
```

**Solution:**

1. Generate a fresh token:

   ```bash
   turso db tokens create wedding-invitation-dev
   ```

2. Update `DATABASE_AUTH_TOKEN` in `.env.local`

3. Restart dev server

**Note:** Tokens don't expire by default, but if rotated they need updating.

---

## Environment Detection Issues

### Problem: Wrong environment detected

**Symptoms:**

- `/api/health` shows wrong environment
- Connecting to wrong database
- Changes appearing in wrong environment

**Solution:**

1. **Check environment detection priority:**
   - `APP_ENV` (highest priority) > `VERCEL_ENV` > default (`development`)

2. **For local development:**

   ```bash
   # In .env.local, set explicitly:
   APP_ENV=development
   ```

3. **For Vercel deployments:**
   - Preview deployments automatically use `test` (via `VERCEL_ENV=preview`)
   - Production automatically uses `production` (via `VERCEL_ENV=production`)
   - Do NOT set `APP_ENV` in Vercel - let it auto-detect

4. **Verify current environment:**
   ```bash
   curl http://localhost:3000/api/health
   # Should return: {"status":"ok","environment":"development",...}
   ```

---

### Problem: Production data appearing in development

**Symptoms:**

- Seeing production data locally
- Changes in dev affecting production

**Root cause:** Using production database credentials in `.env.local`

**Solution:**

1. Check your `.env.local`:

   ```bash
   cat .env.local | grep DATABASE_URL
   ```

2. Verify it points to dev database:

   ```
   DATABASE_URL=libsql://wedding-invitation-dev-...
   # NOT wedding-invitation-prod!
   ```

3. If wrong, update to dev credentials:

   ```bash
   turso db show wedding-invitation-dev --url
   turso db tokens create wedding-invitation-dev
   ```

4. Update `.env.local` and restart server

**Prevention:** Never commit `.env.local` to git (it's gitignored by default)

---

## Migration Issues

### Problem: Migrations not applying on Vercel

**Symptoms:**

- Vercel build succeeds but tables missing
- "Table does not exist" errors in production
- Schema out of sync

**Solution:**

1. **Verify `vercel.json` build command:**

   ```json
   {
     "buildCommand": "npm run db:push && npm run build"
   }
   ```

2. **Check Vercel build logs:**
   - Go to Vercel dashboard → Deployments → [your deployment] → Build Logs
   - Look for "drizzle-kit push" output
   - Verify no errors during migration

3. **Manually apply migrations** (if needed):

   ```bash
   # For test environment
   export $(cat .env.test.tmp | xargs) && npm run db:push

   # For production environment
   export $(cat .env.prod.tmp | xargs) && npm run db:push
   ```

4. **Verify Vercel environment variables are set:**
   ```bash
   vercel env ls
   ```
   Should show:
   - `DATABASE_URL` in Preview and Production scopes
   - `DATABASE_AUTH_TOKEN` in Preview and Production scopes

---

### Problem: "You are about to execute..." prompt on Vercel

**Symptoms:**

- Vercel build hangs waiting for confirmation
- Build timeout

**Solution:**
This shouldn't happen in CI/CD. If it does:

1. Check if `drizzle-kit` version supports `--yes` flag:

   ```bash
   npm run db:push -- --yes
   ```

2. Update `vercel.json`:
   ```json
   {
     "buildCommand": "npm run db:push -- --yes && npm run build"
   }
   ```

---

## Schema Sync Issues

### Problem: Dev and production schemas out of sync

**Symptoms:**

- Code works locally but fails in production
- Missing columns/tables in production

**Solution:**

1. **Check current schema in each environment:**

   ```bash
   # Dev
   turso db shell wedding-invitation-dev
   > .schema

   # Test
   turso db shell wedding-invitation-test
   > .schema

   # Production
   turso db shell wedding-invitation-prod
   > .schema
   ```

2. **Apply migrations in sequence** (dev → test → prod):

   ```bash
   # 1. Dev (from .env.local automatically)
   npm run db:push

   # 2. Test
   DATABASE_URL="libsql://wedding-invitation-test..." \
   DATABASE_AUTH_TOKEN="..." \
   npm run db:push

   # 3. Production
   DATABASE_URL="libsql://wedding-invitation-prod..." \
   DATABASE_AUTH_TOKEN="..." \
   npm run db:push
   ```

3. **Generate new migration if needed:**
   ```bash
   npm run db:generate
   # Commits changes to app/db/migrations/
   ```

---

## Security Issues

### Problem: Database credentials exposed to client

**Symptoms:**

```
⚠️ SECURITY WARNING: NEXT_PUBLIC_DATABASE_URL detected!
```

**Impact:** Database credentials leaked to browser (critical security issue)

**Solution:**

1. **Remove `NEXT_PUBLIC_` prefix:**

   ```bash
   # WRONG - exposes to client
   NEXT_PUBLIC_DATABASE_URL=...

   # CORRECT - server-only
   DATABASE_URL=...
   ```

2. **Check your `.env` files:**

   ```bash
   grep "NEXT_PUBLIC_DATABASE" .env* .env.local
   # Should return nothing
   ```

3. **Verify in browser console:**

   ```javascript
   console.log(process.env.NEXT_PUBLIC_DATABASE_URL);
   // Should be: undefined
   ```

4. **Rotate credentials immediately if exposed:**
   ```bash
   turso db tokens create wedding-invitation-dev
   # Update .env.local with new token
   ```

**Prevention:** Never use `NEXT_PUBLIC_` prefix for sensitive variables.

---

## Testing Issues

### Problem: Tests failing with "Cannot find module '@/app/lib/env-config'"

**Solution:**

1. Ensure file exists: `app/lib/env-config.ts`
2. Check TypeScript compilation: `npm run build`
3. Clear Jest cache: `npx jest --clearCache`

---

### Problem: Integration tests using wrong database

**Solution:**

1. Check `jest.setup.js` - it should NOT override `DATABASE_URL` if already set
2. Ensure `.env` points to dev database (not test/prod)
3. Run tests:
   ```bash
   npm test
   ```

---

## Quick Diagnostics

### Health Check

```bash
curl http://localhost:3000/api/health | jq
```

**Expected output:**

```json
{
  "status": "ok",
  "environment": "development",
  "database": "connected",
  "timestamp": "2025-11-03T..."
}
```

### Environment Variables Check

```bash
node -e "require('dotenv').config(); console.log({
  DATABASE_URL: process.env.DATABASE_URL?.substring(0, 40) + '...',
  HAS_TOKEN: !!process.env.DATABASE_AUTH_TOKEN,
  APP_ENV: process.env.APP_ENV
})"
```

### Database Connection Test

```bash
turso db shell wedding-invitation-dev "SELECT 1 as test"
```

---

## Getting Help

If you're still experiencing issues:

1. **Check environment status:**

   ```bash
   npm run dev
   # Visit http://localhost:3000/api/health
   ```

2. **Review logs:**
   - Development: Check terminal output
   - Vercel: Check deployment logs in dashboard

3. **Verify environment isolation:**
   - Dev should use `wedding-invitation-dev`
   - Test should use `wedding-invitation-test`
   - Prod should use `wedding-invitation-prod`

4. **Last resort - clean slate:**
   ```bash
   rm -rf node_modules .next
   npm install
   npm run dev
   ```

---

## Related Documentation

- [Environment Quickstart](../specs/010-oial-9-development/quickstart.md) - Setup guide
- [README.md](../README.md) - Main documentation
- [DEPLOYMENT.md](../DEPLOYMENT.md) - Deployment instructions
