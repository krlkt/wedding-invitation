# Authentication API Contract

## POST /api/auth/register

**Purpose**: Register new user account for wedding configuration access

**Request**:

```typescript
{
  email: string // Valid email format, unique
  password: string // Minimum 8 characters
  groomName: string // Required for initial wedding config
  brideName: string // Required for initial wedding config
}
```

**Response (Success - 201)**:

```typescript
{
  success: true
  data: {
    userId: string
    weddingConfigId: string
    subdomain: string // Auto-generated from names
  }
}
```

**Response (Error - 400)**:

```typescript
{
  success: false
  error: 'Email already registered' |
    'Invalid email format' |
    'Password too short' |
    'Names required'
}
```

---

## POST /api/auth/login

**Purpose**: Authenticate user and establish session

**Request**:

```typescript
{
  email: string
  password: string
}
```

**Response (Success - 200)**:

```typescript
{
  success: true
  data: {
    userId: string
    weddingConfigId: string
    subdomain: string
  }
}
```

**Response (Error - 401)**:

```typescript
{
  success: false
  error: 'Invalid email or password'
}
```

---

## POST /api/auth/logout

**Purpose**: Clear user session

**Request**: No body required

**Response (Success - 200)**:

```typescript
{
  success: true
  message: 'Logged out successfully'
}
```

---

## GET /api/auth/session

**Purpose**: Check current authentication status

**Request**: No body required

**Response (Authenticated - 200)**:

```typescript
{
  success: true
  data: {
    userId: string
    weddingConfigId: string
    subdomain: string
  }
}
```

**Response (Not Authenticated - 401)**:

```typescript
{
  success: false
  error: 'Not authenticated'
}
```
