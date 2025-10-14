# Wedding Configuration API Contract

## GET /api/wedding/config

**Purpose**: Retrieve current user's wedding configuration

**Authorization**: Required (authenticated user)

**Response (Success - 200)**:

```typescript
{
  success: true;
  data: {
    id: string;
    subdomain: string;
    groomName: string;
    brideName: string;
    weddingDate: string; // ISO date
    monogram?: string;
    groomFather?: string;
    groomMother?: string;
    brideFather?: string;
    brideMother?: string;
    instagramLink?: string;
    footerText?: string;
    isPublished: boolean;
    features: {
      love_story: boolean;
      rsvp: boolean;
      gallery: boolean;
      prewedding_videos: boolean;
      faqs: boolean;
      dress_code: boolean;
      instagram_link: boolean;
    };
    createdAt: string;
    updatedAt: string;
  }
}
```

**Response (Error - 404)**:

```typescript
{
  success: false
  error: 'Wedding configuration not found'
}
```

---

## PUT /api/wedding/config

**Purpose**: Update wedding configuration details

**Authorization**: Required (authenticated user)

**Request**:

```typescript
{
  groomName?: string;
  brideName?: string;
  weddingDate?: string; // ISO date
  monogram?: string;
  groomFather?: string;
  groomMother?: string;
  brideFather?: string;
  brideMother?: string;
  instagramLink?: string;
  footerText?: string;
}
```

**Response (Success - 200)**:

```typescript
{
  success: true
  data: {
    // Updated wedding configuration object
    // Same structure as GET response
  }
}
```

**Response (Error - 400)**:

```typescript
{
  success: false
  error: 'Invalid date format' | 'Instagram link invalid' | 'Validation error'
}
```

---

## PUT /api/wedding/config/features

**Purpose**: Toggle feature availability on/off

**Authorization**: Required (authenticated user)

**Request**:

```typescript
{
  featureName: 'love_story' |
    'rsvp' |
    'gallery' |
    'prewedding_videos' |
    'faqs' |
    'dress_code' |
    'instagram_link'
  isEnabled: boolean
}
```

**Response (Success - 200)**:

```typescript
{
  success: true
  data: {
    featureName: string
    isEnabled: boolean
  }
}
```

---

## POST /api/wedding/publish

**Purpose**: Publish wedding configuration to make it live

**Authorization**: Required (authenticated user)

**Request**: No body required

**Response (Success - 200)**:

```typescript
{
  success: true
  data: {
    isPublished: true
    publishedAt: string // ISO timestamp
    weddingUrl: string // Full subdomain URL
  }
}
```

---

## POST /api/wedding/unpublish

**Purpose**: Unpublish wedding configuration (return to draft)

**Authorization**: Required (authenticated user)

**Request**: No body required

**Response (Success - 200)**:

```typescript
{
  success: true
  data: {
    isPublished: false
    unpublishedAt: string // ISO timestamp
  }
}
```
