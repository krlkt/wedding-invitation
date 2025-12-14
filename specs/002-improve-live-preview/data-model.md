# Data Model

**Feature**: Improve Live Preview with Full-Screen View and Subdomain Uniqueness Validation

## Entities

### Wedding Configuration (Existing)

**File**: `app/db/schema/weddings.ts`

**Fields**:

```typescript
{
  id: string (cuid2, primary key)
  userId: string (foreign key to user_accounts, unique)
  subdomain: string (unique, indexed) ← KEY FIELD FOR THIS FEATURE
  groomName: string
  brideName: string
  weddingDate: timestamp
  monogramFilename: string?
  groomFather: string?
  groomMother: string?
  brideFather: string?
  brideMother: string?
  instagramLink: string?
  footerText: string?
  isPublished: boolean (default false)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Existing Constraints**:

- `subdomain` has UNIQUE constraint (line 18 in schema)
- `userId` is unique (one wedding per user)
- Foreign key cascade delete on user

**Validation Rules** (for this feature):

- Subdomain must be DNS-compliant:
  - Length: 1-63 characters
  - Characters: `[a-z0-9-]` only
  - Cannot start or end with hyphen
  - Case-insensitive (stored lowercase)
- Subdomain must be globally unique across all wedding configurations

###

Preview Session (Conceptual)

**Implementation**: Uses existing session authentication

**Not a database entity** - leverages current cookie-based auth:

```typescript
// Session structure (existing)
{
  userId: string;
  weddingConfigId: string;
  email: string;
}
```

**Access Pattern**:

1. User authenticates → session created
2. Preview route reads session → fetches wedding config
3. Renders preview using config data

## Relationships

```
UserAccount (1) ──── (1) WeddingConfiguration
                         │
                         └─ subdomain (unique)
```

**No new relationships required** - feature uses existing one-to-one user-to-wedding mapping.

## State Transitions

### Subdomain Generation Lifecycle

```
Registration Request
        ↓
Generate subdomain from names
        ↓
Check availability ←──┐
   ↓ (available)      │ (taken)
   │                  │
Create config      Retry with new
   ↓               random suffix
Success               ↓
                  Max attempts?
                      ↓ (yes)
                    Error
```

**States**:

- `Generating`: Initial subdomain creation from couple names
- `Checking`: Querying database for existing subdomain
- `Retrying`: Collision detected, generating new variant
- `Created`: Unique subdomain assigned and persisted
- `Failed`: Max retry attempts exceeded

### Preview Access States

```
User navigates to /preview
        ↓
Session check
   ↓ (valid)        ↓ (invalid)
   │                │
Fetch config    Redirect to login
   ↓
Render preview
```

## Data Integrity Rules

### Database Level

- **Unique constraint** on `subdomain` field (existing)
- **Foreign key** from `userId` to `user_accounts` with cascade delete
- **Not null** constraint on subdomain

### Application Level

- **Pre-insertion validation**: Check subdomain availability before INSERT
- **Retry logic**: Up to 5 attempts to generate unique subdomain
- **Format validation**: Ensure DNS compliance before storage
- **Error handling**: Graceful failure with user-friendly messages

## Queries

### New Query (to be added)

**Check Subdomain Availability**:

```typescript
// In wedding-service.ts
async function isSubdomainAvailable(subdomain: string): Promise<boolean> {
  const existing = await db
    .select()
    .from(weddingConfigurations)
    .where(eq(weddingConfigurations.subdomain, subdomain))
    .limit(1);

  return existing.length === 0;
}
```

**Performance**:

- Uses existing unique index on subdomain
- O(log n) lookup time
- < 5ms expected query time

### Modified Query

**Create Wedding Configuration** (existing function - add retry logic):

```typescript
// In wedding-service.ts
async function createWeddingConfiguration(
  userId: string,
  groomName: string,
  brideName: string
): Promise<WeddingConfiguration> {
  // NEW: Retry loop for subdomain uniqueness
  let subdomain: string;
  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    subdomain = generateSubdomain(groomName, brideName);
    const available = await isSubdomainAvailable(subdomain);
    if (available) break;
    attempts++;
  }

  if (attempts >= maxAttempts) {
    throw new Error('Unable to generate unique subdomain. Please try again.');
  }

  // Existing creation logic...
}
```

## No Schema Migrations Required

**Reason**: Subdomain field already has unique constraint in existing schema.

**Database Status**: ✅ Ready - no migrations needed
