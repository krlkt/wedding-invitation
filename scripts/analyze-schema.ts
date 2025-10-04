/**
 * Analyze existing database schema
 */

import { config } from 'dotenv'
import { createClient } from '@libsql/client'

config()

async function analyzeSchema() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  })

  console.log('📊 Analyzing existing database schema...\n')

  // Get all tables
  const tablesResult = await client.execute(`
    SELECT name FROM sqlite_master
    WHERE type='table'
    AND name NOT LIKE 'sqlite_%'
    AND name NOT LIKE '_litestream_%'
    AND name NOT LIKE '__drizzle_%'
    ORDER BY name
  `)

  console.log('Existing tables:')
  for (const row of tablesResult.rows) {
    const tableName = row.name as string
    console.log(`\n📋 Table: ${tableName}`)

    // Get schema for each table
    const schemaResult = await client.execute(`PRAGMA table_info(${tableName})`)
    console.log('  Columns:')
    for (const col of schemaResult.rows) {
      console.log(`    - ${col.name} (${col.type}) ${col.notnull ? 'NOT NULL' : 'NULL'} ${col.dflt_value ? `DEFAULT ${col.dflt_value}` : ''}`)
    }

    // Get row count
    const countResult = await client.execute(`SELECT COUNT(*) as count FROM ${tableName}`)
    console.log(`  Row count: ${countResult.rows[0].count}`)
  }

  client.close()
}

analyzeSchema().catch(console.error)
