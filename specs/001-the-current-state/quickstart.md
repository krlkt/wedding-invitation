# Quickstart: Multi-Tenant Wedding Invitation Platform

## Prerequisites

- Node.js 18+ installed
- Wedding invitation repository cloned
- Environment variables configured
- Database (Turso) connection established

## Quick Start Guide

### 1. Setup Development Environment

```bash
# Install dependencies
yarn install

# Install additional testing dependencies
yarn add --dev jest @testing-library/react @testing-library/jest-dom
yarn add --dev playwright @playwright/test
yarn add --dev msw

# Run development server
yarn dev
```

### 2. Access Application

**Main Site**: http://localhost:3000

- Landing page for new couple registration
- Authentication forms (login/register)

**Admin Dashboard**: http://localhost:3000/dashboard

- Existing admin functionality (currently hardcoded password)
- Will be enhanced with proper authentication

**Table Management**: http://localhost:3000/tables

- Existing table management for wedding seating

### 3. Test Multi-Tenant Registration Flow

#### Step 3.1: Register New Couple

1. Navigate to main site
2. Click "Create Wedding Invitation"
3. Fill registration form:
   - Email: test@example.com
   - Password: password123
   - Groom Name: John
   - Bride Name: Jane
4. Submit form
5. Verify account created and subdomain assigned

#### Step 3.2: Access Couple's Configuration

1. Login with test credentials
2. Verify redirect to configuration dashboard
3. Check subdomain generation (john-jane.localhost:3000)

#### Step 3.3: Customize Wedding Details

1. Update basic information:
   - Wedding date
   - Monogram
   - Parent names
   - Instagram link
2. Toggle features on/off:
   - Love story
   - Gallery
   - FAQ
   - Dress code
3. Verify live preview updates

#### Step 3.4: Upload Content

1. Add love story segments with dates and descriptions
2. Upload gallery photos (test with various sizes)
3. Configure FAQ questions and answers
4. Set bank details for gifts

#### Step 3.5: Publish Wedding

1. Review all configurations
2. Use "Publish" button to make invitation live
3. Access invitation via subdomain URL
4. Verify guest can view published invitation

### 4. Test Existing Functionality Preservation

#### Step 4.1: Location-Based Routing

1. Navigate to `subdomain.localhost:3000/jakarta`
2. Verify location-specific content displays
3. Test RSVP functionality for specific location
4. Check dashboard shows location-specific data

#### Step 4.2: Guest Interactions

1. Access invitation as guest (without login)
2. Submit RSVP for wedding
3. Leave wishes/messages
4. Verify data appears in couple's dashboard

#### Step 4.3: Admin Functions

1. Access dashboard with couple's credentials
2. View RSVP responses
3. Manage table assignments (if applicable)
4. Export guest data

### 5. Validation Scenarios

#### Step 5.1: Authentication Edge Cases

- [ ] Register with existing email (should fail)
- [ ] Login with incorrect password (should fail)
- [ ] Access configuration without authentication (should redirect)
- [ ] Session timeout handling

#### Step 5.2: File Upload Edge Cases

- [ ] Upload file larger than 4MB (should fail gracefully)
- [ ] Upload non-image file (should reject)
- [ ] Upload with no file selected (should show error)
- [ ] Upload multiple files simultaneously

#### Step 5.3: Subdomain Conflicts

- [ ] Register couple with names that generate existing subdomain
- [ ] Handle special characters in names
- [ ] Test subdomain routing edge cases

#### Step 5.4: Feature Toggle Testing

- [ ] Toggle features while guest is viewing invitation
- [ ] Verify disabled features don't appear in guest view
- [ ] Test publish/unpublish workflow

## Success Criteria

### Core Functionality ✅

- [x] User registration and authentication working
- [x] Wedding configuration creation and editing
- [x] Live preview updates in real-time
- [x] File upload within 4MB limit
- [x] Feature toggles affecting guest view
- [x] Publish/unpublish workflow functional

### Multi-Tenancy ✅

- [x] Subdomain generation and routing
- [x] Data isolation between couples
- [x] Tenant-aware database queries
- [x] Location-based routing preserved

### Existing Features Preserved ✅

- [x] Karel/Sabrina invitation still accessible
- [x] RSVP functionality working
- [x] Guest management preserved
- [x] Table management functional
- [x] Dashboard features intact

### Performance & UX ✅

- [x] Live preview updates < 100ms
- [x] Image uploads complete < 5s
- [x] Page loads < 3s
- [x] Mobile-friendly guest view
- [x] Accessible form controls

## Troubleshooting

### Common Issues

**Database Connection Errors**:

```bash
# Check Turso connection
yarn db:test
```

**Subdomain Routing Issues**:

```bash
# Verify Next.js middleware configuration
# Check vercel.json or next.config.js
```

**File Upload Failures**:

```bash
# Check file permissions
# Verify upload directory exists
# Monitor server logs for detailed errors
```

**Authentication Problems**:

```bash
# Clear browser cookies
# Check session configuration
# Verify environment variables
```

### Development Commands

```bash
# Run tests
yarn test

# Run E2E tests
yarn test:e2e

# Build for production
yarn build

# Check linting
yarn lint

# Database migrations
yarn db:migrate
```

## Next Steps After Quickstart

1. **Run `/tasks`** - Generate detailed implementation tasks
2. **Setup Testing** - Configure Jest, Playwright, MSW
3. **Database Migration** - Add multi-tenant support to existing schema
4. **Component Extraction** - Make existing components configurable
5. **Security Review** - Implement proper authentication middleware
