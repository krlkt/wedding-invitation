// Assign global polyfills FIRST, before requiring undici
// This is critical because undici's dependencies check for these at import time
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Now that globals are set, we can safely require undici
const { fetch, Headers, Request, Response } = require('undici');

// Polyfill fetch for jsdom environment (Node 18+ fetch via undici)
global.fetch = fetch;
global.Headers = Headers;
global.Request = Request;
global.Response = Response;

// Mock ResizeObserver for jsdom (used by Radix UI components)
if (typeof global.ResizeObserver === 'undefined') {
  global.ResizeObserver = class ResizeObserver {
    constructor(callback) {
      this.callback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Import testing library after polyfills are set up
require('@testing-library/jest-dom');

// Note: MSW setup requires additional ESM configuration
// For now, API mocking is disabled but handlers are available for manual testing
// To enable MSW, configure Jest with proper ESM support or downgrade to MSW v1
// import { server } from './__tests__/mocks/server'
// beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
// afterEach(() => server.resetHandlers())
// afterAll(() => server.close())

// Mock environment variables
// Use actual dev database from .env.local for integration tests
// Unit tests can override these as needed
if (!process.env.DATABASE_URL && !process.env.TURSO_DATABASE_URL) {
  // Fallback for tests without real database
  process.env.TURSO_DATABASE_URL = 'libsql://test-db.turso.io';
  process.env.TURSO_AUTH_TOKEN = 'test-token';
}
process.env.NEXT_PUBLIC_DASHBOARD_USERNAME = 'test-user';
process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD = 'test-pass';
process.env.APP_ENV = 'development'; // Ensure tests run in development mode

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
}));

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
}));

// Increase timeout for tests
jest.setTimeout(10000);
