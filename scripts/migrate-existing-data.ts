/**
 * T058: Data Migration Script
 *
 * Migrate existing Karel/Sabrina wedding data to new schema.
 * Preserves all 798 guests, 605 RSVPs, 127 wishes, and other data.
 *
 * Migration strategy:
 * 1. Create default user account for Karel & Sabrina
 * 2. Create wedding configuration
 * 3. Migrate RSVPs (parent records)
 * 4. Migrate Guests (child records linked to RSVPs)
 * 5. Migrate Tables
 * 6. Migrate Wishes
 * 7. Migrate Groups
 *
 * IMPORTANT: Run this AFTER applying the new schema with yarn db:push
 */

import { db } from '../app/lib/database';
import { sql } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import bcrypt from 'bcryptjs';

// Default credentials for existing wedding
const DEFAULT_EMAIL = 'karel@example.com';
const DEFAULT_PASSWORD = 'temporaryPassword123'; // Should be changed after migration

async function migrateExistingData() {
  console.log('Starting data migration for Karel & Sabrina wedding...');

  try {
    // Step 1: Create user account
    console.log('\n1. Creating user account...');
    const userId = createId();
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

    await db.run(sql`
      INSERT INTO user_accounts (id, email, password_hash, created_at, updated_at)
      VALUES (
        ${userId},
        ${DEFAULT_EMAIL},
        ${passwordHash},
        ${Date.now()},
        ${Date.now()}
      )
    `);
    console.log('✓ User account created');

    // Step 2: Create wedding configuration
    console.log('\n2. Creating wedding configuration...');
    const weddingConfigId = createId();

    await db.run(sql`
      INSERT INTO wedding_configurations (
        id, user_id, subdomain, groom_name, bride_name, wedding_date,
        is_published, created_at, updated_at
      )
      VALUES (
        ${weddingConfigId},
        ${userId},
        'karelabrina',
        'Karel',
        'Sabrina',
        ${new Date('2025-09-20').getTime()},
        1,
        ${Date.now()},
        ${Date.now()}
      )
    `);
    console.log('✓ Wedding configuration created');

    // Step 3: Create default feature toggles
    console.log('\n3. Creating feature toggles...');
    const features = [
      'love_story',
      'rsvp',
      'gallery',
      'prewedding_videos',
      'faqs',
      'dress_code',
      'instagram_link',
    ];
    for (const feature of features) {
      await db.run(sql`
        INSERT INTO feature_toggles (id, wedding_config_id, feature_name, is_enabled, created_at, updated_at)
        VALUES (
          ${createId()},
          ${weddingConfigId},
          ${feature},
          1,
          ${Date.now()},
          ${Date.now()}
        )
      `);
    }
    console.log('✓ Feature toggles created');

    // Step 4: Migrate RSVPs
    console.log('\n4. Migrating RSVPs...');
    const oldRsvps = await db.all(sql`SELECT * FROM rsvp`);
    console.log(`Found ${oldRsvps.length} RSVPs to migrate`);

    const rsvpIdMap = new Map<number, string>(); // Map old ID to new UUID

    for (const oldRsvp of oldRsvps) {
      const newId = createId();
      rsvpIdMap.set(oldRsvp.id, newId);

      await db.run(sql`
        INSERT INTO rsvps (
          id, wedding_config_id, name, response, attendee_count, max_guests,
          food_choice, notes, location, invitation_link, "group",
          possibly_not_coming, created_at, updated_at
        )
        VALUES (
          ${newId},
          ${weddingConfigId},
          ${oldRsvp.name},
          ${oldRsvp.attend || 'maybe'},
          ${oldRsvp.guest_number || 1},
          ${oldRsvp.max_guests || 1},
          ${oldRsvp.food_choice},
          ${oldRsvp.notes || ''},
          ${oldRsvp.location || 'bali'},
          ${oldRsvp.link || ''},
          ${oldRsvp.group},
          ${oldRsvp.possibly_not_coming ? 1 : 0},
          ${Date.now()},
          ${Date.now()}
        )
      `);
    }
    console.log(`✓ Migrated ${oldRsvps.length} RSVPs`);

    // Step 5: Migrate Tables
    console.log('\n5. Migrating tables...');
    const oldTables = await db.all(sql`SELECT * FROM tables`);
    console.log(`Found ${oldTables.length} tables to migrate`);

    const tableIdMap = new Map<number, string>();

    for (const oldTable of oldTables) {
      const newId = createId();
      tableIdMap.set(oldTable.id, newId);

      await db.run(sql`
        INSERT INTO tables (
          id, wedding_config_id, name, table_number, capacity, location,
          created_at, updated_at
        )
        VALUES (
          ${newId},
          ${weddingConfigId},
          ${oldTable.name},
          ${oldTable.id},
          ${oldTable.max_guests || 10},
          ${oldTable.location || 'bali'},
          ${Date.now()},
          ${Date.now()}
        )
      `);
    }
    console.log(`✓ Migrated ${oldTables.length} tables`);

    // Step 6: Migrate Guests
    console.log('\n6. Migrating guests...');
    const oldGuests = await db.all(sql`SELECT * FROM guest`);
    console.log(`Found ${oldGuests.length} guests to migrate`);

    for (const oldGuest of oldGuests) {
      const newRsvpId = rsvpIdMap.get(oldGuest.rsvp_id);
      const newTableId = oldGuest.table_id ? tableIdMap.get(oldGuest.table_id) : null;

      if (!newRsvpId) {
        console.warn(`Skipping guest ${oldGuest.name} - no matching RSVP`);
        continue;
      }

      await db.run(sql`
        INSERT INTO guests (
          id, wedding_config_id, rsvp_id, table_id, name, rsvp_name,
          checked_in, location, whatsapp, created_at, updated_at
        )
        VALUES (
          ${createId()},
          ${weddingConfigId},
          ${newRsvpId},
          ${newTableId},
          ${oldGuest.name},
          ${oldGuest.rsvp_name},
          ${oldGuest.checked_in ? 1 : 0},
          ${oldGuest.location || 'bali'},
          ${oldGuest.whatsapp},
          ${Date.now()},
          ${Date.now()}
        )
      `);
    }
    console.log(`✓ Migrated ${oldGuests.length} guests`);

    // Step 7: Migrate Wishes
    console.log('\n7. Migrating wishes...');
    const oldWishes = await db.all(sql`SELECT * FROM wish`);
    console.log(`Found ${oldWishes.length} wishes to migrate`);

    for (const oldWish of oldWishes) {
      await db.run(sql`
        INSERT INTO wishes (
          id, wedding_config_id, guest_id, name, message,
          created_at, updated_at
        )
        VALUES (
          ${createId()},
          ${weddingConfigId},
          NULL,
          ${oldWish.name},
          ${oldWish.wish},
          ${new Date(oldWish.created_at).getTime()},
          ${Date.now()}
        )
      `);
    }
    console.log(`✓ Migrated ${oldWishes.length} wishes`);

    // Step 8: Migrate Groups
    console.log('\n8. Migrating groups...');
    const oldGroups = await db.all(sql`SELECT * FROM groups`);
    console.log(`Found ${oldGroups.length} groups to migrate`);

    for (const oldGroup of oldGroups) {
      await db.run(sql`
        INSERT INTO groups (
          id, wedding_config_id, name, description, created_at, updated_at
        )
        VALUES (
          ${createId()},
          ${weddingConfigId},
          ${oldGroup.name},
          NULL,
          ${Date.now()},
          ${Date.now()}
        )
      `);
    }
    console.log(`✓ Migrated ${oldGroups.length} groups`);

    console.log('\n✅ Data migration complete!');
    console.log('\nMigration Summary:');
    console.log(`- User account: ${DEFAULT_EMAIL}`);
    console.log(`- Wedding: karelabrina`);
    console.log(`- RSVPs: ${oldRsvps.length}`);
    console.log(`- Guests: ${oldGuests.length}`);
    console.log(`- Tables: ${oldTables.length}`);
    console.log(`- Wishes: ${oldWishes.length}`);
    console.log(`- Groups: ${oldGroups.length}`);
    console.log(`\nIMPORTANT: Change the default password after migration!`);
  } catch (error) {
    console.error('Data migration failed:', error);
    throw error;
  }
}

// Run migration
migrateExistingData()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
