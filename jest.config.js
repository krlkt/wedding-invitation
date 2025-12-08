const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/app/(.*)$': '<rootDir>/app/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/types/(.*)$': '<rootDir>/types/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/db/(.*)$': '<rootDir>/db/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@/context/(.*)$': '<rootDir>/context/$1',
    '^@/config/(.*)$': '<rootDir>/config/$1',
  },
  testEnvironment: 'jsdom',
  // Transform ESM modules for MSW compatibility
  transformIgnorePatterns: ['node_modules/(?!(msw|@mswjs|@bundled-es-modules|until-async)/)'],
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)', '**/?(*.)+(spec|test).(ts|tsx)'],
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/e2e-tests/', // Exclude Playwright tests
    // Skip integration tests that require live database connection
    '<rootDir>/__tests__/integration/subdomain-routing.test.ts',
    '<rootDir>/__tests__/integration/subdomain-validation.test.ts',
    '<rootDir>/__tests__/integration/auth.test.ts',
    '<rootDir>/__tests__/integration/publish-workflow.test.ts',
    '<rootDir>/__tests__/integration/wedding-config.test.ts',
    '<rootDir>/__tests__/contracts/auth.test.ts',
    '<rootDir>/__tests__/components/LivePreview.test.tsx',
    '<rootDir>/__tests__/components/ConfigDashboard.test.tsx',
  ],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    '!app/**/*.d.ts',
    '!app/api/**', // Skip API routes for unit testing coverage
    '!app/layout.tsx', // Skip layout
    '!app/page.tsx', // Skip page components (covered by e2e)
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
