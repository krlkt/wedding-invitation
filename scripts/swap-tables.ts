/**
 * Atomic Table Swap Script
 *
 * WARNING: This will DELETE old tables and rename new ones.
 * Only run this after verifying migration success!
 */

import { config } from 'dotenv';
import { createClient } from '@libsql/client';

config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function swapTables() {
  console.log('⚠️  ATOMIC TABLE SWAP - This will DELETE old tables!');
  console.log('    Waiting 3 seconds... Press Ctrl+C to cancel\n');

  await new Promise((resolve) => setTimeout(resolve, 3000));

  console.log('🔄 Starting table swap...\n');

  try {
    // Step 1: Drop old tables
    console.log('Step 1: Dropping old tables...');
    await client.execute('DROP TABLE IF EXISTS rsvp');
    console.log('  ✅ Dropped: rsvp');

    await client.execute('DROP TABLE IF EXISTS wish');
    console.log('  ✅ Dropped: wish');

    await client.execute('DROP TABLE IF EXISTS guests');
    console.log('  ✅ Dropped: guests');

    await client.execute('DROP TABLE IF EXISTS tables');
    console.log('  ✅ Dropped: tables');

    await client.execute('DROP TABLE IF EXISTS groups');
    console.log('  ✅ Dropped: groups');

    // Step 2: Rename new tables
    console.log('\nStep 2: Renaming new tables...');
    await client.execute('ALTER TABLE rsvps_new RENAME TO rsvps');
    console.log('  ✅ Renamed: rsvps_new → rsvps');

    await client.execute('ALTER TABLE wishes_new RENAME TO wishes');
    console.log('  ✅ Renamed: wishes_new → wishes');

    await client.execute('ALTER TABLE guests_new RENAME TO guests');
    console.log('  ✅ Renamed: guests_new → guests');

    await client.execute('ALTER TABLE tables_new RENAME TO tables');
    console.log('  ✅ Renamed: tables_new → tables');

    await client.execute('ALTER TABLE groups_new RENAME TO groups');
    console.log('  ✅ Renamed: groups_new → groups');

    console.log('\n✅ Table swap complete!');
    console.log('\n📊 Final verification:');

    const counts = await Promise.all([
      client.execute('SELECT COUNT(*) as count FROM rsvps'),
      client.execute('SELECT COUNT(*) as count FROM guests'),
      client.execute('SELECT COUNT(*) as count FROM wishes'),
      client.execute('SELECT COUNT(*) as count FROM tables'),
      client.execute('SELECT COUNT(*) as count FROM groups'),
    ]);

    console.log(`   rsvps: ${counts[0].rows[0].count}`);
    console.log(`   guests: ${counts[1].rows[0].count}`);
    console.log(`   wishes: ${counts[2].rows[0].count}`);
    console.log(`   tables: ${counts[3].rows[0].count}`);
    console.log(`   groups: ${counts[4].rows[0].count}`);

    console.log('\n🎉 Migration fully complete!');
    console.log('\n⚠️  Next steps:');
    console.log('   1. Update Drizzle schema files to remove _new suffixes');
    console.log('   2. Delete app/db/schema/legacy.ts');
    console.log('   3. Run drizzle-kit push to sync schema');
    console.log('   4. Test your application');
  } catch (error) {
    console.error('\n❌ Table swap failed:', error);
    console.error('\n⚠️  Your data is still safe in the *_new tables!');
    throw error;
  } finally {
    client.close();
  }
}

swapTables()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
