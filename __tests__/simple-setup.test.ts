/**
 * Simple test to verify Jest setup is working
 */

describe('Simple Testing Setup', () => {
  test('Jest is working', () => {
    expect(1 + 1).toBe(2)
  })

  test('Environment variables are mocked', () => {
    expect(process.env.TURSO_DATABASE_URL).toBe('libsql://test-db.turso.io')
    expect(process.env.TURSO_AUTH_TOKEN).toBe('test-token')
  })

  test('TypeScript is working', () => {
    interface TestInterface {
      name: string;
      age: number;
    }

    const testObj: TestInterface = {
      name: 'Test User',
      age: 25
    }

    expect(testObj.name).toBe('Test User')
    expect(testObj.age).toBe(25)
  })
})