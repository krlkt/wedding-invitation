# Database Migration Strategy

## Current State Analysis

### Existing Tables (Old Schema)

- `rsvp` - 605 rows (singular name)
- `wish` - 127 rows (singular name)
- `guests` - 798 rows (already plural, but different columns)
- `tables` - 43 rows (already plural, but different columns)
- `groups` - 14 rows (already plural, matches new schema)

### New Drizzle Schema Tables

- `user_accounts` - NEW
- `wedding_configurations` - NEW
- `feature_toggles` - NEW
- `love_stories` - NEW
- `locations` - NEW
- `gallery_photos` - NEW
- `faqs` - NEW
- `dress_codes` - NEW
- `bank_details` - NEW
- `rsvps` - RENAMED from `rsvp` + new columns
- `wishes` - RENAMED from `wish` + new columns
- `guests` - MODIFIED (add wedding_config_id, rsvp_name, location, etc.)
- `tables` - MODIFIED (add wedding_config_id, table_number, capacity, etc.)
- `groups` - MATCHES existing (may need modification)

## The Problem

Running `drizzle-kit push` will:

1. Try to rename `rsvp` → `rsvps` (loses data)
2. Try to rename `wish` → `wishes` (loses data)
3. Try to add NOT NULL columns to existing `guests` and `tables` without defaults (FAILS)

## Safe Migration Strategy

### Phase 1: Create New Tables Only

1. Temporarily rename conflicting tables in Drizzle schema:
   - `rsvps` → `rsvps_new`
   - `wishes` → `wishes_new`
   - `guests` → `guests_new`
   - `tables` → `tables_new`
   - `groups` → `groups_new`
2. Run `drizzle-kit push` to create new tables
3. This creates all new tables alongside old ones (no data loss)

### Phase 2: Migrate Data

1. Create default user account and wedding configuration
2. Migrate data from old → new tables:
   - `rsvp` → `rsvps_new` (add wedding_config_id, timestamps)
   - `wish` → `wishes_new` (add wedding_config_id, timestamps)
   - `guests` → `guests_new` (add wedding_config_id, rsvp_name, location, timestamps)
   - `tables` → `tables_new` (add wedding_config_id, table_number, capacity, timestamps)
   - `groups` → `groups_new` (if needed)

### Phase 3: Swap Tables (Atomic)

1. Begin transaction
2. Drop old tables: `DROP TABLE rsvp, wish, guests, tables, groups`
3. Rename new tables:
   - `ALTER TABLE rsvps_new RENAME TO rsvps`
   - `ALTER TABLE wishes_new RENAME TO wishes`
   - `ALTER TABLE guests_new RENAME TO guests`
   - `ALTER TABLE tables_new RENAME TO tables`
   - `ALTER TABLE groups_new RENAME TO groups`
4. Commit transaction

### Phase 4: Verification

1. Verify row counts match
2. Verify relationships are intact
3. Test API endpoints
4. Keep backup until verified

## Alternative: In-Place Migration

Instead of rename approach, we could:

1. Create all new tables with final names in a separate migration database
2. Export old data
3. Clear production database
4. Import new schema
5. Import migrated data

This is RISKIER but simpler.

## Recommendation

Use **Phase 1-4 approach** for maximum safety:

- Zero downtime
- No data loss
- Easy rollback (just drop `_new` tables)
- Atomic swap ensures consistency
