# Preview API Contract

## GET /api/wedding/config

**Status**: Existing endpoint - no changes required

**Purpose**: Fetch wedding configuration for authenticated user

### Request

**Method**: `GET`
**URL**: `/api/wedding/config`
**Authentication**: Required (session cookie)

**Headers**:

```
Cookie: session={...}
```

### Response

**Success (200)**:

```json
{
    "success": true,
    "data": {
        "id": "clxxx....",
        "subdomain": "john-mary-a8f2",
        "groomName": "John",
        "brideName": "Mary",
        "weddingDate": "2025-12-25T00:00:00.000Z",
        "monogramFilename": "monogram.png",
        "groomFather": "John Sr.",
        "groomMother": "Jane",
        "brideFather": "Robert",
        "brideMother": "Sarah",
        "instagramLink": "https://instagram.com/johnandmary",
        "footerText": "Thank you for celebrating with us!",
        "isPublished": true,
        "features": {
            "love_story": true,
            "rsvp": true,
            "gallery": true,
            "prewedding_videos": false,
            "faqs": true,
            "dress_code": true,
            "instagram_link": true
        },
        "createdAt": "2025-10-01T00:00:00.000Z",
        "updatedAt": "2025-10-10T00:00:00.000Z"
    }
}
```

**Unauthorized (401)**:

```json
{
    "success": false,
    "error": "Unauthorized"
}
```

**Not Found (404)**:

```json
{
    "success": false,
    "error": "Wedding configuration not found"
}
```

### Usage Context

**Used by**:

1. `LivePreview` component in admin dashboard (inline preview)
2. `/preview` page route (full-screen preview)

**Caching**: None - always fetch fresh data for preview accuracy

---

## GET /preview

**Status**: New page route

**Purpose**: Render full-screen preview of wedding site

### Request

**Method**: `GET`
**URL**: `/preview`
**Authentication**: Required (session cookie)

**Headers**:

```
Cookie: session={...}
```

### Response

**Success (200)**:
Returns HTML page with:

-   Full wedding site layout (WeddingLayout component)
-   User's wedding configuration data
-   No admin UI elements (clean preview)

**Unauthorized (302)**:
Redirects to `/admin/login`

### Implementation

**File**: `app/preview/page.tsx`

**Server Component**:

```typescript
export default async function PreviewPage() {
    const session = await getSession();
    if (!session) redirect('/admin/login');

    const config = await getWeddingConfigById(session.weddingConfigId);
    if (!config) {
        return <div>No configuration found</div>;
    }

    return <WeddingLayout config={config} />;
}
```

### User Flow

```
Admin Dashboard → Click "View Live Site" button → Opens /preview in new tab
```
