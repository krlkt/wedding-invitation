/**
 * Fast Data Migration Script
 *
 * Optimized version using batch operations
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
  console.log('🚀 Starting FAST data migration...\n');

  // Check if migration already started
  const userCheck = await client.execute('SELECT COUNT(*) as count FROM user_accounts');
  if ((userCheck.rows[0].count as number) > 0) {
    console.log('⚠️  User account already exists. Resuming migration...');
    const userResult = await client.execute('SELECT id FROM user_accounts LIMIT 1');
    const userId = userResult.rows[0].id as string;
    const weddingResult = await client.execute({
      sql: 'SELECT id FROM wedding_configurations WHERE user_id = ?',
      args: [userId],
    });
    const weddingConfigId = weddingResult.rows[0].id as string;

    await resumeMigration(weddingConfigId);
    return;
  }

  // Fresh migration
  await fullMigration();
}

async function fullMigration() {
  const userId = createId();
  const defaultEmail = 'karel@wedding.com';
  const defaultPassword = 'changeme123';
  const passwordHash = await bcrypt.hash(defaultPassword, 10);
  const now = new Date();

  console.log('Step 1: Creating user account...');
  await client.execute({
    sql: `INSERT INTO user_accounts (id, email, password_hash, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?)`,
    args: [userId, defaultEmail, passwordHash, now.getTime(), now.getTime()],
  });
  console.log(`✅ Created user: ${defaultEmail}`);

  const weddingConfigId = createId();
  const subdomain = 'karelsabrina';
  const weddingDate = new Date('2024-09-28').getTime();

  console.log('\nStep 2: Creating wedding configuration...');
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
      1,
      now.getTime(),
      now.getTime(),
    ],
  });
  console.log(`✅ Created wedding config: ${subdomain}`);

  await resumeMigration(weddingConfigId);

  console.log('\n⚠️  IMPORTANT: Default credentials:');
  console.log(`   Email: ${defaultEmail}`);
  console.log(`   Password: ${defaultPassword}`);
}

async function resumeMigration(weddingConfigId: string) {
  const now = new Date();

  // Clear partial data (restart from clean state)
  console.log('\nClearing partial migration data...');
  await client.execute('DELETE FROM rsvps_new');
  await client.execute('DELETE FROM tables_new');
  await client.execute('DELETE FROM guests_new');
  await client.execute('DELETE FROM wishes_new');
  await client.execute('DELETE FROM groups_new');

  // Step 3: Migrate RSVPs using batch
  console.log('\nStep 3: Migrating RSVPs (fast mode)...');
  const oldRsvps = await client.execute('SELECT * FROM rsvp');
  const rsvpIdMap = new Map<number, string>();

  const rsvpBatch = oldRsvps.rows.map((row) => {
    const newId = createId();
    rsvpIdMap.set(row.id as number, newId);

    let response = 'maybe';
    if (row.attend === 'yes' || row.attend === 'Ya') response = 'yes';
    else if (row.attend === 'no' || row.attend === 'Tidak') response = 'no';

    return `('${newId}', '${weddingConfigId}', '${(row.name || 'Unknown').replace(/'/g, "''")}', '${response}', ${row.guest_number || 1}, ${row.max_guests || 1}, ${row.food_choice ? `'${row.food_choice}'` : 'NULL'}, '${(row.notes || '').replace(/'/g, "''")}', '${row.location || 'jakarta'}', '${(row.link || '').replace(/'/g, "''")}', ${row.group ? `'${row.group}'` : 'NULL'}, ${row.possibly_not_coming || 0}, ${now.getTime()}, ${now.getTime()})`;
  });

  // Insert in chunks of 100
  for (let i = 0; i < rsvpBatch.length; i += 100) {
    const chunk = rsvpBatch.slice(i, i + 100);
    const sql = `INSERT INTO rsvps_new (id, wedding_config_id, name, response, attendee_count, max_guests, food_choice, notes, location, invitation_link, "group", possibly_not_coming, created_at, updated_at) VALUES ${chunk.join(', ')}`;
    await client.execute(sql);
    console.log(`   Inserted ${Math.min(i + 100, rsvpBatch.length)}/${rsvpBatch.length} RSVPs`);
  }
  console.log(`✅ Migrated ${oldRsvps.rows.length} RSVPs`);

  // Step 4: Migrate Tables
  console.log('\nStep 4: Migrating Tables...');
  const oldTables = await client.execute('SELECT * FROM tables');
  const tableIdMap = new Map<number, string>();

  const tableBatch = oldTables.rows.map((row) => {
    const newId = createId();
    tableIdMap.set(row.id as number, newId);
    return `('${newId}', '${weddingConfigId}', '${row.name.toString().replace(/'/g, "''")}', ${row.id}, ${row.max_guests}, '${row.location}', ${now.getTime()}, ${now.getTime()})`;
  });

  const tableSql = `INSERT INTO tables_new (id, wedding_config_id, name, table_number, capacity, location, created_at, updated_at) VALUES ${tableBatch.join(', ')}`;
  await client.execute(tableSql);
  console.log(`✅ Migrated ${oldTables.rows.length} tables`);

  // Step 5: Migrate Guests
  console.log('\nStep 5: Migrating Guests...');
  const oldGuests = await client.execute('SELECT * FROM guests');

  // Get all RSVP data for lookup
  const rsvpsData = await client.execute('SELECT id, name, location FROM rsvps_new');
  const rsvpLookup = new Map(
    rsvpsData.rows.map((r) => [r.id as string, { name: r.name, location: r.location }])
  );

  const guestBatch = [];
  for (const row of oldGuests.rows) {
    const newId = createId();
    const newRsvpId = rsvpIdMap.get(row.rsvp_id as number);
    const newTableId = row.table_id ? tableIdMap.get(row.table_id as number) : null;

    if (!newRsvpId) continue;

    const rsvpInfo = rsvpLookup.get(newRsvpId);
    const rsvpName = rsvpInfo?.name || 'Unknown';
    const location = rsvpInfo?.location || 'jakarta';

    guestBatch.push(
      `('${newId}', '${weddingConfigId}', '${newRsvpId}', ${newTableId ? `'${newTableId}'` : 'NULL'}, '${row.name.toString().replace(/'/g, "''")}', '${rsvpName.toString().replace(/'/g, "''")}', ${row.checked_in || 0}, '${location}', ${now.getTime()}, ${now.getTime()})`
    );
  }

  // Insert guests in chunks
  for (let i = 0; i < guestBatch.length; i += 100) {
    const chunk = guestBatch.slice(i, i + 100);
    const sql = `INSERT INTO guests_new (id, wedding_config_id, rsvp_id, table_id, name, rsvp_name, checked_in, location, created_at, updated_at) VALUES ${chunk.join(', ')}`;
    await client.execute(sql);
    console.log(`   Inserted ${Math.min(i + 100, guestBatch.length)}/${guestBatch.length} guests`);
  }
  console.log(`✅ Migrated ${guestBatch.length} guests`);

  // Step 6: Migrate Wishes
  console.log('\nStep 6: Migrating Wishes...');
  const oldWishes = await client.execute('SELECT * FROM wish');

  const wishBatch = oldWishes.rows.map((row) => {
    const newId = createId();
    const createdAt = row.created_at ? new Date(row.created_at as string).getTime() : now.getTime();
    return `('${newId}', '${weddingConfigId}', NULL, '${row.name.toString().replace(/'/g, "''")}', '${row.wish.toString().replace(/'/g, "''")}', ${createdAt}, ${now.getTime()})`;
  });

  const wishSql = `INSERT INTO wishes_new (id, wedding_config_id, guest_id, name, message, created_at, updated_at) VALUES ${wishBatch.join(', ')}`;
  await client.execute(wishSql);
  console.log(`✅ Migrated ${oldWishes.rows.length} wishes`);

  // Step 7: Migrate Groups
  console.log('\nStep 7: Migrating Groups...');
  const oldGroups = await client.execute('SELECT * FROM groups');

  const groupBatch = oldGroups.rows.map((row) => {
    const newId = createId();
    return `('${newId}', '${weddingConfigId}', '${row.name.toString().replace(/'/g, "''")}', NULL, ${now.getTime()}, ${now.getTime()})`;
  });

  const groupSql = `INSERT INTO groups_new (id, wedding_config_id, name, description, created_at, updated_at) VALUES ${groupBatch.join(', ')}`;
  await client.execute(groupSql);
  console.log(`✅ Migrated ${oldGroups.rows.length} groups`);

  console.log('\n✅ Migration complete!');
}

migrateData()
  .then(() => {
    client.close();
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error);
    client.close();
    process.exit(1);
  });
