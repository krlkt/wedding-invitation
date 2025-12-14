# Registration API Contract (Modified)

## POST /api/auth/register

**Status**: Existing endpoint - **adding subdomain uniqueness validation**

**Purpose**: Register new user and create wedding configuration with unique subdomain

### Request

**Method**: `POST`
**URL**: `/api/auth/register`
**Content-Type**: `application/json`

**Body**:

```json
{
  "email": "john@example.com",
  "password": "securepassword123",
  "groomName": "John",
  "brideName": "Mary"
}
```

**Validation Rules**:

- `email`: Valid email format, not already registered
- `password`: Minimum 8 characters
- `groomName`: Non-empty string, trimmed
- `brideName`: Non-empty string, trimmed

### Response

**Success (201)**:

```json
{
  "success": true,
  "data": {
    "userId": "clxxx....",
    "weddingConfigId": "clyyyy....",
    "subdomain": "john-mary-a8f2"
  }
}
```

**Email Already Registered (400)**:

```json
{
  "success": false,
  "error": "Email already registered"
}
```

**Invalid Email (400)**:

```json
{
  "success": false,
  "error": "Invalid email format"
}
```

**Password Too Short (400)**:

```json
{
  "success": false,
  "error": "Password too short"
}
```

**Names Required (400)**:

```json
{
  "success": false,
  "error": "Names required"
}
```

**NEW: Subdomain Generation Failed (400)**:

```json
{
  "success": false,
  "error": "Unable to generate unique subdomain. Please try again."
}
```

### Subdomain Generation Logic

**Process**:

1. Generate subdomain from `groomName` and `brideName`:
   - Combine: `"{groomName}-{brideName}"`
   - Lowercase
   - Remove special characters (keep only `[a-z0-9-]`)
   - Truncate to 63 characters (DNS limit)
   - Append random 4-character suffix
2. Check if subdomain is available (query database)
3. If taken, retry with new random suffix
4. Max 5 attempts
5. If all attempts fail, return error

**Example Subdomains**:

- Input: John & Mary → `john-mary-a8f2`
- Input: José & María → `jose-maria-x3k9`
- Input: John Smith & Mary Jones → `john-smith-mary-jones-p2r7`

### Modified Implementation

**File**: `app/api/auth/register/route.ts`

**Changes**:

```typescript
// Add error handling for subdomain generation
try {
  const weddingConfig = await createWeddingConfiguration(userId, groomName, brideName);
} catch (error: any) {
  if (error.message.includes('unique subdomain')) {
    return NextResponse.json(
      { success: false, error: 'Unable to generate unique subdomain. Please try again.' },
      { status: 400 }
    );
  }
  throw error;
}
```

### Error Handling

**Database Constraint Violation**:
If retry logic fails to catch collision and database throws unique constraint error:

- Catch LibsqlError
- Return same user-friendly message
- Log error for monitoring

**Recovery**:
Users can simply retry registration - new random suffix will be generated.

### Testing Scenarios

1. **Happy Path**: Registration succeeds with unique subdomain
2. **Collision Retry**: First subdomain taken, retries and succeeds
3. **Max Attempts**: All retries fail (very rare), returns error
4. **Special Characters**: Names with accents/symbols are cleaned properly
5. **Long Names**: Names exceeding 63 chars are truncated correctly
