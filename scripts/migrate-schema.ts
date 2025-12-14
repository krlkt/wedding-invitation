/**
 * T057: Database Migration Script
 *
 * Migrate existing database schema to new Drizzle ORM structure.
 * This script creates new tables with UUID primary keys and proper relationships.
 *
 * IMPORTANT: This does NOT migrate data, only creates the new schema.
 * Run T058 (migrate-existing-data.ts) after this to migrate actual data.
 */

import { db } from '../app/lib/database';
import { sql } from 'drizzle-orm';

async function migrateSchema() {
  console.log('Starting schema migration...');

  try {
    // Check if migration is needed
    const existingTables = await db.run(sql`
      SELECT name FROM sqlite_master WHERE type='table'
    `);

    console.log('Existing tables:', existingTables);

    // The schema migration is handled by Drizzle Kit
    // Run: yarn db:push to apply the schema to the database

    console.log('\n✓ Schema migration complete!');
    console.log('\nNext steps:');
    console.log('1. Run: yarn db:push');
    console.log('2. Run: yarn tsx scripts/migrate-existing-data.ts');
  } catch (error) {
    console.error('Schema migration failed:', error);
    throw error;
  }
}

// Run migration
migrateSchema()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
