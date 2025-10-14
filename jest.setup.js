// Basic Jest setup for Node.js environment
import { TextEncoder, TextDecoder } from 'util'
import '@testing-library/jest-dom'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Note: MSW setup requires additional ESM configuration
// For now, API mocking is disabled but handlers are available for manual testing
// To enable MSW, configure Jest with proper ESM support or downgrade to MSW v1
// import { server } from './__tests__/mocks/server'
// beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
// afterEach(() => server.resetHandlers())
// afterAll(() => server.close())

// Mock environment variables
process.env.TURSO_DATABASE_URL = 'libsql://test-db.turso.io'
process.env.TURSO_AUTH_TOKEN = 'test-token'
process.env.NEXT_PUBLIC_DASHBOARD_USERNAME = 'test-user'
process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD = 'test-pass'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: jest.fn(),
    pop: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(() => Promise.resolve()),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  }),
}))

// Mock Next.js navigation (App Router)
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
    getAll: jest.fn(),
  }),
  usePathname: () => '/',
}))

// Increase timeout for tests
jest.setTimeout(10000)
