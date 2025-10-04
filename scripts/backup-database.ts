/**
 * Database Backup Script
 *
 * Creates a SQL dump of the Turso database for backup purposes.
 */

import { config } from 'dotenv'
import { createClient } from '@libsql/client'
import { writeFileSync } from 'fs'

// Load environment variables
config()

async function backupDatabase() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  })

  console.log('📦 Starting database backup...')

  const tables = [
    'user_accounts',
    'wedding_configurations',
    'feature_toggles',
    'love_stories',
    'locations',
    'gallery_photos',
    'faqs',
    'dress_codes',
    'bank_details',
    'rsvps',
    'guests',
    'tables',
    'wishes',
    'groups',
  ]

  let sqlDump = `-- Turso Database Backup
-- Generated: ${new Date().toISOString()}
-- Database: ${process.env.TURSO_DATABASE_URL}

`

  for (const table of tables) {
    console.log(`  Backing up table: ${table}`)

    try {
      // Get all rows from table
      const result = await client.execute(`SELECT * FROM ${table}`)

      if (result.rows.length > 0) {
        sqlDump += `\n-- Table: ${table}\n`

        // Get column names
        const columns = result.columns

        for (const row of result.rows) {
          const values = columns.map((col) => {
            const val = row[col]
            if (val === null) return 'NULL'
            if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`
            if (typeof val === 'number') return val.toString()
            if (typeof val === 'boolean') return val ? '1' : '0'
            return `'${val}'`
          }).join(', ')

          sqlDump += `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${values});\n`
        }
      }
    } catch (error: any) {
      console.log(`  ⚠️  Warning: Could not backup ${table}: ${error.message}`)
    }
  }

  // Save to file with timestamp
  const timestamp = new Date().toISOString().split('T')[0]
  const filename = `backup-${timestamp}.sql`

  writeFileSync(filename, sqlDump)

  console.log(`✅ Backup completed: ${filename}`)
  console.log(`   File size: ${(sqlDump.length / 1024).toFixed(2)} KB`)

  client.close()
}

backupDatabase().catch(console.error)
