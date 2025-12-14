import 'dotenv/config';
import { query } from '../app/db/client';

async function discoverSchema() {
  try {
    console.log('🔍 Discovering current database schema...\n');

    // Get all tables
    const tables = await query<{ name: string; sql: string }>(`
      SELECT name, sql FROM sqlite_master
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name;
    `);

    console.log(`📋 Found ${tables.rows.length} tables:\n`);

    for (const table of tables.rows) {
      console.log(`🗂️  Table: ${table.name}`);
      console.log(`   SQL: ${table.sql}\n`);

      // Get sample data count
      try {
        const count = await query<{ count: number }>(`SELECT COUNT(*) as count FROM ${table.name}`);
        console.log(`   📊 Records: ${count.rows[0].count}`);

        // Show sample record if data exists
        if (count.rows[0].count > 0) {
          const sample = await query(`SELECT * FROM ${table.name} LIMIT 1`);
          console.log(`   📝 Sample:`, JSON.stringify(sample.rows[0], null, 2));
        }
      } catch (e) {
        console.log(`   ⚠️  Could not query table: ${e}`);
      }

      console.log('─'.repeat(50));
    }
  } catch (error) {
    console.error('❌ Error discovering schema:', error);
  }
}

discoverSchema();
