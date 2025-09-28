<!--
Sync Impact Report:
Version change: 1.0.0 → 1.1.0
Modified principles:
- Testing Strategy: elevated from recommendations to mandatory requirements
Added sections:
- None
Removed sections:
- None
Templates requiring updates:
- ✅ plan-template.md - reviewed, testing references aligned
- ✅ spec-template.md - reviewed, no testing-specific updates needed
- ✅ tasks-template.md - reviewed, testing task generation aligned
Follow-up TODOs:
- None
-->

# Wedding Invitation Constitution

## Core Principles

### I. Technology Stack Consistency
All development must adhere to the established technology foundation:
- **Next.js 14.2.4** with App Router architecture
- **TypeScript** in strict mode (no `any` types without explicit justification)
- **Tailwind CSS** for utility-first styling with **Material-UI** for complex components
- **Turso (libSQL)** for database operations
- **React Hook Form** for all form implementations

### II. Performance-First Development
Every feature must prioritize user experience:
- Images must use Next.js `Image` component with `priority` for above-the-fold content
- Components must be server-side rendered by default; `'use client'` only when necessary
- Database queries must be optimized and use proper indexing
- Lazy loading for non-critical components and assets

### III. Component Architecture Standards
Consistent component design patterns:
- Functional components only (no class components)
- Props interfaces must be defined in `/app/models` when shared
- Components organized by feature in `/app/components/[feature-name]/`
- Context providers for shared state (following LocationProvider pattern)
- Default exports for primary components

### IV. Code Quality Requirements
Non-negotiable quality standards:
- All code must pass ESLint (next/core-web-vitals configuration)
- Prettier formatting with 4-space tabs, single quotes, 120 character line width
- TypeScript strict mode with no implicit any
- File organization follows feature-based structure

### V. Data & State Management
Consistent data handling patterns:
- Database models defined as TypeScript interfaces in `/app/models/`
- Server Actions for mutations following Next.js App Router patterns
- Context providers for cross-component state sharing
- JSON serialization for server-to-client data transfer

### VI. Testing Standards
Comprehensive testing must be implemented for all new features:
- **Jest** and **React Testing Library** MUST be used for component testing
- **Playwright** MUST be used for end-to-end testing of critical user flows
- **MSW (Mock Service Worker)** MUST be used for API mocking in tests
- Unit tests MUST be written for all utility functions and custom hooks
- Test coverage MUST meet minimum 80% threshold for new code
- All tests MUST follow TDD principles: write failing tests before implementation

## File Organization Standards

### Directory Structure
```
app/
├── [location]/           # Dynamic route pages
├── api/                  # API routes
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

### Database Operations
- Use parameterized queries to prevent SQL injection
- Define models in `/app/models/` with proper TypeScript types
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

**Version**: 1.1.0 | **Ratified**: 2025-09-28 | **Last Amended**: 2025-09-28