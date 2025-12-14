/**
 * Safe Data Migration Script
 *
 * Migrates data from old tables to new _new tables.
 * Does NOT delete old tables - that happens in the swap step.
 */

import { config } from 'dotenv';
import { createClient } from '@libsql/client';
import { createId } from '@paralleldrive/cuid2';
import * as bcrypt from 'bcryptjs';

config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function migrateData() {
  console.log('🚀 Starting safe data migration...\n');

  // Step 1: Create default user account
  console.log('Step 1: Creating default user account...');
  const userId = createId();
  const defaultEmail = 'karel@wedding.com';
  const defaultPassword = 'changeme123'; // User should change this
  const passwordHash = await bcrypt.hash(defaultPassword, 10);
  const now = new Date();

  await client.execute({
    sql: `INSERT INTO user_accounts (id, email, password_hash, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?)`,
    args: [userId, defaultEmail, passwordHash, now.getTime(), now.getTime()],
  });
  console.log(`✅ Created user: ${defaultEmail} (password: ${defaultPassword})`);

  // Step 2: Create wedding configuration
  console.log('\nStep 2: Creating wedding configuration...');
  const weddingConfigId = createId();
  const subdomain = 'karelsabrina';
  const weddingDate = new Date('2024-09-28').getTime();

  await client.execute({
    sql: `INSERT INTO wedding_configurations
          (id, user_id, subdomain, groom_name, bride_name, wedding_date, is_published, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      weddingConfigId,
      userId,
      subdomain,
      'Karel',
      'Sabrina',
      weddingDate,
      1, // published
      now.getTime(),
      now.getTime(),
    ],
  });
  console.log(`✅ Created wedding config: ${subdomain}`);

  // Step 3: Migrate RSVPs (rsvp → rsvps_new)
  console.log('\nStep 3: Migrating RSVPs...');
  const oldRsvps = await client.execute('SELECT * FROM rsvp');
  const rsvpIdMap = new Map<number, string>(); // old ID → new UUID

  for (const row of oldRsvps.rows) {
    const newId = createId();
    rsvpIdMap.set(row.id as number, newId);

    // Map old 'attend' values to new 'response' enum
    let response = 'maybe';
    if (row.attend === 'yes' || row.attend === 'Ya') response = 'yes';
    else if (row.attend === 'no' || row.attend === 'Tidak') response = 'no';

    await client.execute({
      sql: `INSERT INTO rsvps_new
            (id, wedding_config_id, name, response, attendee_count, max_guests, food_choice, notes, location, invitation_link, "group", possibly_not_coming, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        newId,
        weddingConfigId,
        row.name || 'Unknown',
        response,
        row.guest_number || 1,
        row.max_guests || 1,
        row.food_choice,
        row.notes || '',
        row.location || 'jakarta',
        row.link || '',
        row.group,
        row.possibly_not_coming || 0,
        now.getTime(),
        now.getTime(),
      ],
    });
  }
  console.log(`✅ Migrated ${oldRsvps.rows.length} RSVPs`);

  // Step 4: Migrate Tables (tables → tables_new)
  console.log('\nStep 4: Migrating Tables...');
  const oldTables = await client.execute('SELECT * FROM tables');
  const tableIdMap = new Map<number, string>(); // old ID → new UUID

  for (const row of oldTables.rows) {
    const newId = createId();
    tableIdMap.set(row.id as number, newId);

    await client.execute({
      sql: `INSERT INTO tables_new
            (id, wedding_config_id, name, table_number, capacity, location, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        newId,
        weddingConfigId,
        row.name,
        row.id, // Use old ID as table number
        row.max_guests,
        row.location,
        now.getTime(),
        now.getTime(),
      ],
    });
  }
  console.log(`✅ Migrated ${oldTables.rows.length} tables`);

  // Step 5: Migrate Guests (guests → guests_new)
  console.log('\nStep 5: Migrating Guests...');
  const oldGuests = await client.execute('SELECT * FROM guests');

  for (const row of oldGuests.rows) {
    const newId = createId();
    const newRsvpId = rsvpIdMap.get(row.rsvp_id as number);
    const newTableId = row.table_id ? tableIdMap.get(row.table_id as number) : null;

    if (!newRsvpId) {
      console.warn(`⚠️  Skipping guest ${row.name} - RSVP ${row.rsvp_id} not found`);
      continue;
    }

    // Get RSVP name and location from rsvps_new
    const rsvpResult = await client.execute({
      sql: 'SELECT name, location FROM rsvps_new WHERE id = ?',
      args: [newRsvpId],
    });
    const rsvpName = rsvpResult.rows[0]?.name || 'Unknown';
    const location = rsvpResult.rows[0]?.location || 'jakarta';

    await client.execute({
      sql: `INSERT INTO guests_new
            (id, wedding_config_id, rsvp_id, table_id, name, rsvp_name, checked_in, location, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        newId,
        weddingConfigId,
        newRsvpId,
        newTableId,
        row.name,
        rsvpName,
        row.checked_in || 0,
        location,
        now.getTime(),
        now.getTime(),
      ],
    });
  }
  console.log(`✅ Migrated ${oldGuests.rows.length} guests`);

  // Step 6: Migrate Wishes (wish → wishes_new)
  console.log('\nStep 6: Migrating Wishes...');
  const oldWishes = await client.execute('SELECT * FROM wish');

  for (const row of oldWishes.rows) {
    const newId = createId();
    const createdAt = row.created_at ? new Date(row.created_at as string).getTime() : now.getTime();

    await client.execute({
      sql: `INSERT INTO wishes_new
            (id, wedding_config_id, guest_id, name, message, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        newId,
        weddingConfigId,
        null, // guest_id not available in old schema
        row.name,
        row.wish,
        createdAt,
        now.getTime(),
      ],
    });
  }
  console.log(`✅ Migrated ${oldWishes.rows.length} wishes`);

  // Step 7: Migrate Groups (groups → groups_new)
  console.log('\nStep 7: Migrating Groups...');
  const oldGroups = await client.execute('SELECT * FROM groups');

  for (const row of oldGroups.rows) {
    const newId = createId();

    await client.execute({
      sql: `INSERT INTO groups_new
            (id, wedding_config_id, name, description, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [newId, weddingConfigId, row.name, null, now.getTime(), now.getTime()],
    });
  }
  console.log(`✅ Migrated ${oldGroups.rows.length} groups`);

  console.log('\n✅ Migration complete!');
  console.log('\n📊 Summary:');
  console.log(`   User account: ${defaultEmail}`);
  console.log(`   Wedding config: ${subdomain}`);
  console.log(`   RSVPs: ${oldRsvps.rows.length}`);
  console.log(`   Tables: ${oldTables.rows.length}`);
  console.log(`   Guests: ${oldGuests.rows.length}`);
  console.log(`   Wishes: ${oldWishes.rows.length}`);
  console.log(`   Groups: ${oldGroups.rows.length}`);
  console.log('\n⚠️  IMPORTANT: Default credentials created:');
  console.log(`   Email: ${defaultEmail}`);
  console.log(`   Password: ${defaultPassword}`);
  console.log('   Please change this password immediately!');

  client.close();
}

migrateData().catch((error) => {
  console.error('❌ Migration failed:', error);
  client.close();
  process.exit(1);
});
