/**
 * Simple test to verify Jest setup is working
 */

describe('Simple Testing Setup', () => {
  test('Jest is working', () => {
    expect(1 + 1).toBe(2)
  })

  test('Environment variables are loaded', () => {
    // Environment variables are loaded from .env.local (via Next.js jest config)
    // or fall back to mock values if not available
    expect(process.env.TURSO_DATABASE_URL).toBeDefined()
    expect(process.env.TURSO_AUTH_TOKEN).toBeDefined()
  })

  test('TypeScript is working', () => {
    interface TestInterface {
      name: string
      age: number
    }

    const testObj: TestInterface = {
      name: 'Test User',
      age: 25,
    }

    expect(testObj.name).toBe('Test User')
    expect(testObj.age).toBe(25)
  })
})
