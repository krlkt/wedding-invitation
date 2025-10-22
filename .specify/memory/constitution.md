<!--
Sync Impact Report:
Version change: 1.1.0 → 1.2.0
Modified principles:
- None
Added sections:
- Git Branch Naming Convention (under Development Workflow)
Removed sections:
- None
Templates requiring updates:
- ✅ plan-template.md - updated branch naming format in line 4
- ✅ spec-template.md - no updates needed (references feature branch generically)
- ✅ tasks-template.md - no updates needed (references feature directory, not branches)
- ✅ README.md - reviewed, no branch naming references
Follow-up TODOs:
- Refactor existing components using useEffect + fetch to use Server Components (WeddingLayout.tsx is a candidate)
-->

# Wedding Invitation Constitution

## Core Principles

### I. Technology Stack Consistency

All development must adhere to the established technology foundation:

- **Next.js 14.2.4** with App Router architecture
- **TypeScript** in strict mode (no `any` types without explicit justification)
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for new component implementations (Radix UI primitives)
- **Material-UI** for legacy components (avoid for new features)
- **Turso (libSQL)** for database operations
- **React Hook Form** for all form implementations

**Rationale**: Consistency ensures maintainability. shadcn/ui is preferred for new work due to better tree-shaking, TypeScript support, and alignment with Tailwind CSS.

### II. Performance-First Development

Every feature must prioritize user experience:

- Images must use Next.js `Image` component with `priority` for above-the-fold content
- Components must be server-side rendered by default; `'use client'` only when necessary
- Database queries must be optimized and use proper indexing
- Lazy loading for non-critical components and assets

**Rationale**: Performance directly impacts user experience and SEO. Server-first rendering reduces JavaScript bundle size and improves Time to Interactive.

### III. Component Architecture Standards

Consistent component design patterns:

- Functional components only (no class components)
- Props interfaces must be defined in `/app/models` when shared
- Components organized by feature in `/app/components/[feature-name]/`
- Context providers for shared state (following LocationProvider pattern)
- Default exports for primary components

**Rationale**: Functional components align with modern React patterns. Feature-based organization improves discoverability and reduces coupling.

### IV. Code Quality Requirements

Non-negotiable quality standards:

- All code must pass ESLint (next/core-web-vitals configuration)
- Prettier formatting with 4-space tabs, single quotes, 120 character line width
- TypeScript strict mode with no implicit any
- File organization follows feature-based structure

**Rationale**: Automated tooling ensures consistency across contributors. Strict TypeScript prevents runtime type errors.

### V. Data & State Management

Consistent data handling patterns:

- Database models defined as TypeScript interfaces in `/app/models/`
- Server Actions for mutations following Next.js App Router patterns
- Context providers for cross-component state sharing
- JSON serialization for server-to-client data transfer

**Rationale**: Server Actions reduce API boilerplate and provide automatic revalidation. Context prevents prop drilling while maintaining reactivity.

### VI. Testing Standards

Comprehensive testing must be implemented for all new features:

- **Jest** and **React Testing Library** MUST be used for component testing
- **Playwright** MUST be used for end-to-end testing of critical user flows
- **MSW (Mock Service Worker)** MUST be used for API mocking in tests
- Unit tests MUST be written for all utility functions and custom hooks
- Test coverage MUST meet minimum 80% threshold for new code
- All tests MUST follow TDD principles: write failing tests before implementation

**Rationale**: TDD prevents regressions, documents behavior, and ensures testability. 80% coverage threshold balances thoroughness with pragmatism.

### VII. Next.js 14 Data Fetching Patterns

Follow Next.js 14 App Router data fetching best practices:

- Server Components MUST fetch data using async/await directly in the component
- Client Components MUST receive data as props from parent Server Components
- `useEffect` + `fetch` pattern MUST NOT be used for initial data loading
- Server Actions MUST be used for mutations initiated from Client Components
- API routes (`/app/api/*`) should only be used when Server Components/Actions aren't suitable (webhooks, external API integrations, client-side polling)
- Data fetching errors MUST be handled with proper error boundaries or try/catch

**Rationale**: Server Components eliminate request waterfalls by fetching data on the server before hydration. The `useEffect` + `fetch` pattern creates unnecessary client-side requests, delays rendering, and increases bundle size. Server Actions provide type-safe mutations with automatic revalidation, reducing API boilerplate and improving performance.

**Migration Path**: Existing components using `useEffect` + `fetch` should be refactored during feature work or dedicated tech debt sprints.

## File Organization Standards

### Directory Structure

```
app/
├── [location]/           # Dynamic route pages
├── api/                  # API routes (use sparingly per Principle VII)
├── components/          # Feature-organized components
│   ├── [feature]/       # Feature-specific components
│   └── shared/          # Reusable components
├── db/                  # Database configuration and migrations
├── icons/               # Custom icon components
├── models/              # TypeScript interfaces
├── utils/               # Utility functions and hooks
└── globals.css          # Global styles and CSS variables

tests/
├── __mocks__/           # MSW mocks and test fixtures
├── components/          # React Testing Library component tests
├── e2e/                 # Playwright end-to-end tests
├── integration/         # Integration tests
└── unit/                # Jest unit tests
```

### Naming Conventions

- **Components**: PascalCase (e.g., `Hero.tsx`, `RSVPForm.tsx`)
- **Files**: kebab-case for CSS, camelCase for utilities
- **Database tables**: snake_case
- **CSS classes**: Tailwind utilities + kebab-case custom classes
- **Environment variables**: SCREAMING_SNAKE_CASE
- **Test files**: `*.test.ts` or `*.test.tsx` for unit/component tests, `*.spec.ts` for e2e tests

## Development Workflow

### Git Branch Naming Convention

All feature branches MUST follow this naming pattern:

```
OIAL-{ticket-number}-{brief-description}
```

**Requirements**:

- Prefix: `OIAL-` (connects branch to JIRA project)
- Ticket number: JIRA ticket ID (e.g., `8`, `15`, `142`)
- Brief description: kebab-case summary of the feature

**Examples**:

- `OIAL-8-login-page-redesign`
- `OIAL-15-rsvp-form-validation`
- `OIAL-42-gallery-upload-optimization`

**Rationale**: This convention enables automatic branch-to-JIRA linking, improving traceability and project management workflow integration.

### Code Style Requirements

- 4-space indentation (enforced by Prettier)
- Single quotes for strings
- Trailing commas in ES5-compatible locations
- 120 character line width maximum
- Semicolons required

### Component Development

1. Create feature directory under `/app/components/[feature]/`
2. Define TypeScript interfaces in `/app/models/` if shared
3. Write failing tests in `/tests/components/[feature]/` before implementation
4. Use CSS modules for component-specific styles
5. Implement responsive design using Tailwind's responsive utilities
6. Add proper error handling and loading states
7. Verify all tests pass before considering feature complete

### Data Fetching Implementation

1. **For Server Components** (default):

   ```typescript
   // ✅ CORRECT: Async Server Component
   export default async function Page() {
       const data = await fetchData();
       return <ClientComponent data={data} />;
   }
   ```

2. **For Client Components** (when interactivity needed):

   ```typescript
   // ✅ CORRECT: Receive data from parent Server Component
   'use client';
   export default function ClientComponent({ data }) {
       return <div>{data.name}</div>;
   }
   ```

3. **AVOID** (legacy pattern):
   ```typescript
   // ❌ WRONG: useEffect + fetch in Client Component
   'use client';
   export default function Component() {
       const [data, setData] = useState(null);
       useEffect(() => {
           fetch('/api/data')
               .then((r) => r.json())
               .then(setData);
       }, []);
       return <div>{data?.name}</div>;
   }
   ```

### Database Operations

- Use parameterized queries to prevent SQL injection
- Define models in `/app/db/schema` with proper Drizzle ORM
- Use JSON.parse(JSON.stringify()) pattern for server-to-client serialization
- Implement proper error handling for database operations

### Testing Workflow

- ALL new features MUST follow TDD: tests before implementation
- Component tests MUST use React Testing Library with proper accessibility queries
- API endpoints MUST have integration tests using MSW for mocking
- Critical user flows MUST have Playwright e2e tests
- Utility functions MUST have comprehensive unit tests with Jest
- Tests MUST be maintainable and readable with descriptive test names

## Performance Standards

### Image Optimization

- All images must use Next.js `Image` component
- WebP format preferred for web assets
- `priority` attribute for above-the-fold images
- `fetchPriority="high"` for critical images
- Proper `alt` attributes for accessibility

### Bundle Optimization

- Dynamic imports for heavy libraries
- Framer Motion animations only where necessary
- Material-UI components imported individually
- Custom fonts loaded via Google Fonts with `display=swap`

## Security Requirements

### Environment Configuration

- Sensitive data in `.env` file (excluded from git)
- Public environment variables prefixed with `NEXT_PUBLIC_`
- Secure cookie configuration for authentication
- HTTPS enforcement in production

### Authentication Patterns

- Simple cookie-based auth for dashboard access
- Environment-based credential management
- Secure cookie options (`httpOnly`, `secure`, `sameSite`)

## Accessibility Standards

### Requirements

- Semantic HTML structure
- Proper heading hierarchy (h1 → h6)
- Alt text for all images
- Keyboard navigation support
- Color contrast compliance
- Screen reader compatibility

## Governance

### Amendment Process

This constitution evolves with the project:

1. Proposed changes must be documented with reasoning
2. Breaking changes require migration plan
3. All team members must acknowledge updates
4. Version control for constitution changes

### Enforcement

- All code reviews must verify compliance with these standards
- Automated checks via ESLint, Prettier, and test coverage reports
- Performance monitoring for Core Web Vitals
- Regular architecture reviews for consistency
- CI/CD pipelines MUST run all tests and reject failing builds

### Exception Handling

Deviations from this constitution require:

1. Clear documentation of reasoning
2. Time-boxed implementation with review date
3. Plan for eventual compliance or constitution update

**Version**: 1.2.0 | **Ratified**: 2025-09-28 | **Last Amended**: 2025-10-12
