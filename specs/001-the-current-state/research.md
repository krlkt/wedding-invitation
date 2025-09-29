# Research: Multi-Tenant Wedding Invitation Platform

## Multi-Tenancy Architecture Patterns

### Decision: Subdomain-based tenant isolation with shared database
**Rationale**: Provides clean URL structure (couple.site.com) while maintaining cost efficiency with single database instance. Aligns with existing multi-location pattern and Vercel deployment capabilities.

**Alternatives considered**:
- Path-based routing: Less professional URLs, harder to customize
- Separate databases per tenant: Higher cost, operational complexity
- Custom domain per tenant: Complex DNS management, higher costs

### Implementation approach:
- Next.js middleware for subdomain detection and routing
- Tenant context provider for data filtering
- Database queries scoped by tenant_id foreign key

## User Authentication & Session Management

### Decision: Email/password registration with Next.js built-in auth
**Rationale**: Simple implementation using Next.js App Router patterns, secure cookie handling, integrates with existing session management for admin features.

**Alternatives considered**:
- NextAuth.js: Overkill for simple email/password needs
- Third-party auth (Auth0): Additional cost and complexity
- Magic links: Less user-friendly for non-technical users

### Implementation approach:
- Server Actions for registration/login
- Secure HTTP-only cookies for session management
- Middleware for route protection

## File Upload & Storage Strategy

### Decision: Hybrid approach - small files via Vercel, large files deferred
**Rationale**: Work within Vercel's 4MB request limit for initial implementation, plan for future external storage (S3/Cloudinary) for larger files.

**Alternatives considered**:
- Immediate external storage: Complex setup, additional costs
- Client-side compression: Quality degradation, limited format support
- Video uploads disabled: Simplifies initial implementation

### Implementation approach:
- Image uploads ≤4MB via Server Actions
- Client-side image compression before upload
- Video links only (YouTube/Vimeo embedding)
- Future: Direct-to-cloud upload for larger files

## Database Schema Evolution Strategy

### Decision: Extend existing schema with tenant support
**Rationale**: Preserve existing data and functionality while adding multi-tenancy. Minimal migration risk for current Karel/Sabrina setup.

**Alternatives considered**:
- Complete schema redesign: High risk, complex migration
- Separate tenant database: Operational complexity
- Keep current as-is: Doesn't support multi-tenancy goal

### Implementation approach:
- Add tenant_id to existing tables
- Create new tables for customization features
- Default tenant for existing Karel/Sabrina data
- Gradual migration of features to tenant-aware

## Live Preview Architecture

### Decision: React state + optimistic updates with debounced persistence
**Rationale**: Immediate visual feedback for users while preventing excessive server requests. Aligns with existing React patterns and Next.js App Router.

**Alternatives considered**:
- Real-time WebSocket updates: Overkill for single-user editing
- Server-side rendering for preview: Too slow for live updates
- Local storage only: Data loss risk

### Implementation approach:
- Context provider for draft state management
- Debounced auto-save to server (500ms delay)
- Optimistic UI updates for immediate feedback
- Manual publish/unpublish controls

## Testing Strategy for Legacy Integration

### Decision: Incremental testing implementation with existing code preservation
**Rationale**: Constitutional requirement for comprehensive testing while maintaining existing functionality. Focus on new features with gradual coverage expansion.

**Alternatives considered**:
- Full retroactive test coverage: Too time-consuming
- Testing only new features: Constitutional violation
- Complete rewrite with tests: High risk

### Implementation approach:
- Jest + React Testing Library setup
- MSW for API mocking
- Playwright for critical user flows
- Focus 80% coverage on new multi-tenant features
- Gradual expansion to existing code

## Component Reusability Strategy

### Decision: Extract existing UI components into reusable, configurable components
**Rationale**: Existing Karel/Sabrina components provide proven UX patterns. Make them data-driven for multi-tenant use while preserving design quality.

**Alternatives considered**:
- Build new components from scratch: Reinventing the wheel
- Keep components hardcoded: Doesn't support customization
- Third-party component library: Loss of unique design

### Implementation approach:
- Extract hardcoded values to props
- Create configuration interfaces for customization
- Maintain existing design system and styling
- Progressive enhancement of existing components

## Subdomain Routing Implementation

### Decision: Next.js middleware with hostname detection
**Rationale**: Native Next.js capability for subdomain routing, works with Vercel deployment, maintains SEO benefits of separate domains.

**Alternatives considered**:
- Custom Express server: Loses Vercel serverless benefits
- Client-side routing: SEO issues, complex state management
- Reverse proxy: Operational complexity

### Implementation approach:
- Middleware to detect subdomain and set tenant context
- Dynamic routing based on tenant configuration
- Fallback to main site for unrecognized subdomains
- Edge function for optimal performance