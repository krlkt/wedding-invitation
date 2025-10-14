# Deployment Guide for oialt.vercel.app

## Prerequisites

- Vercel account
- Turso database (already configured)
- Domain: oialt.vercel.app

## Vercel Environment Variables

Add these environment variables in your Vercel project settings:

```bash
# Database
TURSO_DATABASE_URL=libsql://wedding-invitation-karelkarunia.turso.io
TURSO_AUTH_TOKEN=your_turso_auth_token

# Production Domain
NEXT_PUBLIC_BASE_URL=https://oialt.vercel.app
NEXT_PUBLIC_PRODUCTION_DOMAIN=oialt.vercel.app

# Legacy Dashboard Auth (Old Dashboard)
NEXT_PUBLIC_DASHBOARD_USERNAME=karelkarunia
NEXT_PUBLIC_DASHBOARD_PASSWORD=karel1

# File Storage (Optional - for gallery/monogram uploads)
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

## Subdomain Setup on Vercel

### Option 1: Vercel's Built-in Wildcard (Recommended)

Vercel automatically supports branch-based subdomains:

- Main site: `oialt.vercel.app`
- Subdomain format: `karelsabrina-oialt.vercel.app`

The middleware will automatically extract "karelsabrina" as the subdomain.

### Option 2: Custom Domain with Wildcard DNS

If you want to use a custom domain (e.g., `yourwedding.com`):

1. Add custom domain in Vercel project settings
2. Configure wildcard DNS record:

   ```
   Type: CNAME
   Name: *
   Value: cname.vercel-dns.com
   ```

3. Update environment variables:
   ```
   NEXT_PUBLIC_BASE_URL=https://yourwedding.com
   NEXT_PUBLIC_PRODUCTION_DOMAIN=yourwedding.com
   ```

## Deployment URLs

### Admin Dashboard (No Subdomain)

- Production: `https://oialt.vercel.app/admin/login`
- Login with: `karel@wedding.com` / `changeme123`

### Wedding Sites (With Subdomain)

- Karel & Sabrina: `https://karelsabrina-oialt.vercel.app`
- Format: `https://{subdomain}-oialt.vercel.app`

### Legacy Dashboard (Old)

- URL: `https://oialt.vercel.app/dashboard`
- Note: Uses old database schema, may have errors

## Deploy to Vercel

### Method 1: GitHub Integration (Recommended)

1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on git push

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Add environment variables
vercel env add TURSO_DATABASE_URL
vercel env add TURSO_AUTH_TOKEN
vercel env add NEXT_PUBLIC_BASE_URL
vercel env add NEXT_PUBLIC_PRODUCTION_DOMAIN
```

## Post-Deployment Checklist

1. ✅ Verify environment variables are set
2. ✅ Test admin login: `/admin/login`
3. ✅ Test wedding site with subdomain
4. ✅ Verify database connection (check admin dashboard loads data)
5. ✅ Test authentication flow
6. ⚠️ Setup Vercel Blob Storage for file uploads (optional)

## Current Status

- ✅ Database migrated to Drizzle ORM with UUIDs
- ✅ Multi-tenant admin dashboard working
- ✅ Session-based authentication implemented
- ✅ Middleware supports Vercel subdomain format
- ⚠️ Old public wedding pages need updating to new schema
- ⚠️ File uploads require Vercel Blob token

## Troubleshooting

### Admin dashboard not loading

- Check `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are set
- Verify database migration completed successfully

### Subdomain not working

- Ensure middleware is deployed
- Check browser URL format: `subdomain-oialt.vercel.app`
- Verify `NEXT_PUBLIC_PRODUCTION_DOMAIN=oialt.vercel.app`

### File uploads failing

- Add `BLOB_READ_WRITE_TOKEN` environment variable
- Get token from Vercel Blob Storage settings
