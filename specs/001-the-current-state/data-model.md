# Data Model: Multi-Tenant Wedding Invitation Platform

**ORM**: Drizzle ORM with TypeScript-first schema definition
**Database**: Turso (libSQL) with type-safe queries and automatic migrations

## Schema Definition Strategy

All models defined using **Drizzle ORM schema** as the single source of truth:
- Schema files in `app/db/schema/` directory
- Automatic TypeScript type generation
- Migration generation from schema changes
- Type-safe queries and relationships

## Core Entities

### User Account
```typescript
interface UserAccount {
  id: string;           // Primary key
  email: string;        // Unique, authentication
  passwordHash: string; // Bcrypt hashed
  createdAt: Date;
  updatedAt: Date;
}
```

**Validation Rules**:
- Email must be valid format and unique
- Password minimum 8 characters
- Account required for accessing wedding configuration

**Drizzle Schema**:
```typescript
// app/db/schema/users.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';

export const userAccounts = sqliteTable('user_accounts', {
  id: text('id').$defaultFn(() => createId()).primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdateFn(() => new Date()).notNull(),
});

export type UserAccount = typeof userAccounts.$inferSelect;
export type NewUserAccount = typeof userAccounts.$inferInsert;
```

### Wedding Configuration
```typescript
interface WeddingConfiguration {
  id: string;                 // Primary key
  userId: string;            // Foreign key to UserAccount
  subdomain: string;         // Unique subdomain identifier
  groomName: string;
  brideName: string;
  weddingDate: Date;
  monogram?: string;
  groomFather?: string;
  groomMother?: string;
  brideFather?: string;
  brideMother?: string;
  instagramLink?: string;
  footerText?: string;
  isPublished: boolean;      // Draft vs Live state
  createdAt: Date;
  updatedAt: Date;
}
```

**Validation Rules**:
- Subdomain must be unique and URL-safe (alphanumeric + hyphens)
- Groom and bride names required
- Wedding date required
- Single configuration per user account

**State Transitions**:
- Draft → Published (manual publish action)
- Published → Draft (manual unpublish action)

### Feature Toggle
```typescript
interface FeatureToggle {
  id: string;
  weddingConfigId: string;   // Foreign key
  featureName: FeatureType;  // Enum: love_story, rsvp, gallery, etc.
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

enum FeatureType {
  LOVE_STORY = 'love_story',
  RSVP = 'rsvp',
  GALLERY = 'gallery',
  PREWEDDING_VIDEOS = 'prewedding_videos',
  FAQS = 'faqs',
  DRESS_CODE = 'dress_code',
  INSTAGRAM_LINK = 'instagram_link'
}
```

### Love Story Segment
```typescript
interface LoveStorySegment {
  id: string;
  weddingConfigId: string;   // Foreign key
  title: string;
  description: string;
  date: Date;
  iconType: string;          // Reference to icon component
  order: number;             // Display sequence
  createdAt: Date;
  updatedAt: Date;
}
```

**Validation Rules**:
- Order must be unique within wedding configuration
- Title and description required
- Date must be valid

### Location Details
```typescript
interface LocationDetails {
  id: string;
  weddingConfigId: string;   // Foreign key
  locationIdentifier: string; // URL path segment
  name: string;
  address: string;
  googleMapsLink?: string;
  ceremonyTime?: string;
  receptionTime?: string;
  order: number;             // Display sequence
  createdAt: Date;
  updatedAt: Date;
}
```

**Validation Rules**:
- Location identifier must be URL-safe within wedding
- Name and address required
- Order must be unique within wedding configuration

### Gallery Item
```typescript
interface GalleryItem {
  id: string;
  weddingConfigId: string;   // Foreign key
  filename: string;
  originalName: string;
  fileSize: number;          // Bytes
  mimeType: string;         // image/jpeg, image/png, image/webp
  order: number;            // Display sequence
  alt?: string;             // Accessibility text
  createdAt: Date;
  updatedAt: Date;
}
```

**Validation Rules**:
- File size ≤ 4MB (Vercel constraint)
- MIME type must be image/jpeg, image/png, or image/webp
- Order must be unique within wedding configuration

### FAQ Item
```typescript
interface FAQItem {
  id: string;
  weddingConfigId: string;   // Foreign key
  question: string;
  answer: string;
  order: number;             // Display sequence
  createdAt: Date;
  updatedAt: Date;
}
```

### Dress Code
```typescript
interface DressCode {
  id: string;
  weddingConfigId: string;   // Foreign key (one-to-one)
  title?: string;
  description?: string;
  photoFilename?: string;    // Optional dress code image
  photoFileSize?: number;
  photoMimeType?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Bank Details
```typescript
interface BankDetails {
  id: string;
  weddingConfigId: string;   // Foreign key (one-to-one)
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  routingNumber?: string;
  instructions?: string;     // Custom payment instructions
  createdAt: Date;
  updatedAt: Date;
}
```

**Security Note**: Sensitive financial data - ensure proper access controls

## Extended Entities (Existing Tables with Multi-Tenant Support)

### Guest (Enhanced)
```typescript
interface Guest {
  id: string;               // MIGRATED: UUID primary key (was number)
  rsvpId: string;          // MIGRATED: Foreign key to RSVP (was rsvp_id: number)
  name: string;            // Existing
  tableId: string | null;  // MIGRATED: Foreign key to Table (was table_id: number)
  rsvpName: string;        // MIGRATED: camelCase (was rsvp_name)
  checkedIn: boolean;      // MIGRATED: camelCase (was checked_in)
  weddingConfigId: string; // NEW: Foreign key for multi-tenancy
  location: string;        // NEW: Location identifier for guest
  whatsapp?: string;       // NEW: Contact information
  createdAt: Date;         // NEW: Timestamp
  updatedAt: Date;         // NEW: Timestamp
}
```

### RSVP (Enhanced)
```typescript
interface RSVP {
  id: string;                    // MIGRATED: UUID primary key (was number)
  guestId: string;               // MIGRATED: Foreign key to Guest (derived from name matching)
  name: string;                  // Existing: Guest name
  response: RSVPResponse;        // MIGRATED: Enum type (was attend: string)
  attendeeCount: number;         // MIGRATED: camelCase (was guest_number)
  maxGuests: number;             // MIGRATED: camelCase (was max_guests)
  foodChoice: 'chicken' | 'lamb' | null; // MIGRATED: camelCase (was food_choice)
  notes: string;                 // Existing: Additional notes
  location: string;              // Existing: Event location
  invitationLink: string;        // MIGRATED: camelCase (was link)
  group?: string;                // Existing: Guest group
  possiblyNotComing: boolean;    // MIGRATED: camelCase (was possibly_not_coming)
  weddingConfigId: string;       // NEW: Foreign key for multi-tenancy
  createdAt: Date;               // NEW: Timestamp
  updatedAt: Date;               // NEW: Timestamp
}

enum RSVPResponse {
  YES = 'yes',
  NO = 'no',
  MAYBE = 'maybe'
}
```

### Wish (Enhanced)
```typescript
interface Wish {
  id: string;                // MIGRATED: UUID primary key (was number)
  guestId: string;           // MIGRATED: Foreign key to Guest (was created_by_id: number)
  name: string;              // Existing: Guest name
  message: string;           // MIGRATED: Renamed for clarity (was wish)
  weddingConfigId: string;   // NEW: Foreign key for multi-tenancy
  createdAt: Date;           // MIGRATED: Proper Date type (was created_at: string)
  updatedAt: Date;           // NEW: Timestamp
}
```

### Table (Enhanced)
```typescript
interface Table {
  id: string;                // MIGRATED: UUID primary key (was number)
  name: string;              // Existing: Table name
  tableNumber: number;       // NEW: Numeric identifier for display
  capacity: number;          // MIGRATED: Renamed for clarity (was max_guests)
  location: string;          // Existing: Event location
  guestIds: string[];        // MIGRATED: Array of Guest UUIDs (was guests: Guest[])
  weddingConfigId: string;   // NEW: Foreign key for multi-tenancy
  createdAt: Date;           // NEW: Timestamp
  updatedAt: Date;           // NEW: Timestamp
}
```

### Group (Enhanced)
```typescript
interface Group {
  id: string;                // MIGRATED: UUID primary key (was number)
  name: string;              // Existing: Group name (e.g., "Mama", "Papa", "Karel", "Sab")
  description?: string;      // NEW: Optional description for group purpose
  weddingConfigId: string;   // NEW: Foreign key for multi-tenancy
  createdAt: Date;           // NEW: Timestamp
  updatedAt: Date;           // NEW: Timestamp
}
```

**Group Usage**: Used for invitation distribution management - allows family members to filter and send invitations to their respective contacts (e.g., "Mama" group for mother's friends, "Karel" group for groom's contacts).

## Relationships

```
UserAccount (1) ←→ (1) WeddingConfiguration
WeddingConfiguration (1) ←→ (many) FeatureToggle
WeddingConfiguration (1) ←→ (many) LoveStorySegment
WeddingConfiguration (1) ←→ (many) LocationDetails
WeddingConfiguration (1) ←→ (many) GalleryItem
WeddingConfiguration (1) ←→ (many) FAQItem
WeddingConfiguration (1) ←→ (0..1) DressCode
WeddingConfiguration (1) ←→ (0..1) BankDetails
WeddingConfiguration (1) ←→ (many) RSVP
RSVP (1) ←→ (many) Guest
Guest (1) ←→ (many) Wish
WeddingConfiguration (1) ←→ (many) Table
WeddingConfiguration (1) ←→ (many) Group
Group (1) ←→ (many) RSVP (via group field)
```

## Migration Strategy

### Phase 1: Schema Modernization (Breaking Changes)
1. **ID Migration**: Convert all `id` fields from `number` to `string` (UUID)
   - Generate UUIDs for existing records
   - Update all foreign key references
   - Create migration scripts with proper mapping

2. **Naming Convention Migration**: Convert snake_case to camelCase
   - `rsvp_id` → `rsvpId`
   - `table_id` → `tableId`
   - `guest_number` → `attendeeCount`
   - `max_guests` → `maxGuests` (Tables) / `capacity` (Tables)
   - `food_choice` → `foodChoice`
   - `possibly_not_coming` → `possiblyNotComing`
   - `created_at` → `createdAt`
   - `created_by_id` → `guestId`

3. **Data Type Improvements**:
   - `created_at: string` → `createdAt: Date`
   - `attend: string` → `response: RSVPResponse` (enum)
   - Add proper timestamps (`createdAt`, `updatedAt`) to all entities

### Phase 2: Multi-Tenant Support
1. Add `weddingConfigId` to all existing tables
2. Create default WeddingConfiguration for Karel/Sabrina
3. Link all existing data to default wedding configuration
4. Update all queries to be tenant-aware

### Phase 3: New Tables Creation
1. Create UserAccount table with authentication
2. Create WeddingConfiguration table with customization fields
3. Create FeatureToggle, LoveStorySegment, LocationDetails tables
4. Create GalleryItem, FAQItem, DressCode, BankDetails tables

### Phase 4: Data Population
1. Extract Karel/Sabrina hardcoded values to WeddingConfiguration
2. Create default FeatureToggle records for existing features
3. Extract existing location data to LocationDetails table
4. Verify data integrity and relationships

### Migration Complexity
- **High Impact**: Complete schema restructure required
- **Breaking Changes**: All existing code must be updated
- **Benefits**: Modern, secure, scalable data model
- **Timeline**: Plan for comprehensive testing and gradual rollout

## Data Volume Assumptions

- **Users**: 100-500 couples initially, 5k target
- **Wedding Configurations**: 1:1 with users
- **Gallery Items**: 20-50 photos per wedding
- **Love Story Segments**: 3-8 segments per wedding
- **Location Details**: 1-3 locations per wedding
- **Guests**: 50-300 per wedding
- **Total Storage**: ~10GB images (100 weddings × 50 photos × 2MB avg)