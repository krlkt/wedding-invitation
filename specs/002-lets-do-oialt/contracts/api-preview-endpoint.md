# API Contract: Wedding Preview Endpoint

**Endpoint**: `GET /api/wedding/preview`
**Purpose**: Fetch consolidated preview data for LivePreview component
**Authentication**: Required (session-based)

---

## Request

### Method

```
GET /api/wedding/preview
```

### Headers

```
Cookie: session=<session-token>
```

### Query Parameters

None

### Authentication

- Must be authenticated user with active session
- Wedding config is determined from session user's `weddingConfigId`

---

## Response

### Success Response (200 OK)

```json
{
  "data": {
    "config": {
      "id": "cuid2_abc123",
      "subdomain": "karel-sabrina",
      "groomName": "Karel",
      "brideName": "Sabrina",
      "weddingDate": "2025-09-09T10:00:00.000Z",
      "monogramFilename": "monogram.png",
      "groomFather": "John Doe",
      "groomMother": "Jane Doe",
      "brideFather": "Bob Smith",
      "brideMother": "Alice Smith",
      "instagramLink": "https://instagram.com/karelsabrina",
      "footerText": "Thank you for celebrating with us!",
      "isPublished": true
    },
    "features": {
      "love_story": true,
      "rsvp": true,
      "gallery": true,
      "prewedding_videos": true,
      "faqs": true,
      "dress_code": true,
      "instagram_link": true
    },
    "content": {
      "loveStory": [
        {
          "id": "cuid2_ls1",
          "weddingConfigId": "cuid2_abc123",
          "date": "2018-05-15",
          "title": "First Met",
          "description": "We met at a coffee shop...",
          "order": 1
        }
      ],
      "gallery": [
        {
          "id": "cuid2_gal1",
          "weddingConfigId": "cuid2_abc123",
          "filename": "photo1.jpg",
          "url": "https://blob.vercel-storage.com/...",
          "order": 1,
          "createdAt": "2025-01-01T00:00:00.000Z"
        }
      ],
      "faqs": [
        {
          "id": "cuid2_faq1",
          "weddingConfigId": "cuid2_abc123",
          "question": "What should I wear?",
          "answer": "Semi-formal attire is recommended",
          "order": 1
        }
      ],
      "dressCode": {
        "id": "cuid2_dc1",
        "weddingConfigId": "cuid2_abc123",
        "description": "Semi-formal, garden party vibes",
        "photoFilename": "dresscode.jpg",
        "photoUrl": "https://blob.vercel-storage.com/..."
      },
      "locations": [
        {
          "id": "cuid2_loc1",
          "weddingConfigId": "cuid2_abc123",
          "type": "ceremony",
          "name": "Garden Chapel",
          "address": "123 Garden St, Bali",
          "dateTime": "2025-09-09T14:00:00.000Z",
          "mapsUrl": "https://maps.google.com/..."
        },
        {
          "id": "cuid2_loc2",
          "weddingConfigId": "cuid2_abc123",
          "type": "reception",
          "name": "Beach Resort",
          "address": "456 Beach Rd, Bali",
          "dateTime": "2025-09-09T18:00:00.000Z",
          "mapsUrl": "https://maps.google.com/..."
        }
      ],
      "bankDetails": [
        {
          "id": "cuid2_bank1",
          "weddingConfigId": "cuid2_abc123",
          "bankName": "Bank ABC",
          "accountName": "Karel & Sabrina",
          "accountNumber": "1234567890",
          "order": 1
        }
      ]
    }
  }
}
```

### Field Descriptions

#### config

- **id**: Wedding configuration unique identifier
- **subdomain**: Wedding subdomain (for preview header)
- **groomName**: Groom's first name (required)
- **brideName**: Bride's first name (required)
- **weddingDate**: ISO 8601 date string (required)
- **monogramFilename**: Monogram file name (nullable)
- **groomFather**: Groom's father name (nullable)
- **groomMother**: Groom's mother name (nullable)
- **brideFather**: Bride's father name (nullable)
- **brideMother**: Bride's mother name (nullable)
- **instagramLink**: Instagram profile URL (nullable)
- **footerText**: Custom footer text (nullable)
- **isPublished**: Publication status for preview header

#### features

- **love_story**: Boolean - Show/hide love story timeline
- **rsvp**: Boolean - Show/hide RSVP form
- **gallery**: Boolean - Show/hide photo gallery
- **prewedding_videos**: Boolean - Show/hide prewedding video
- **faqs**: Boolean - Show/hide FAQs section
- **dress_code**: Boolean - Show/hide dress code section
- **instagram_link**: Boolean - Show/hide Instagram link in footer

#### content

All fields are optional and only populated if corresponding feature is enabled:

- **loveStory**: Array of timeline items (ordered by `order`)
- **gallery**: Array of photos (ordered by `order`, max 20 for preview)
- **faqs**: Array of FAQ items (ordered by `order`)
- **dressCode**: Single dress code object (nullable)
- **locations**: Array of locations (ceremony + reception)
- **bankDetails**: Array of bank accounts (ordered by `order`)

### Minimal Response (New Wedding, No Content)

```json
{
  "data": {
    "config": {
      "id": "cuid2_xyz789",
      "subdomain": "new-wedding",
      "groomName": "John",
      "brideName": "Jane",
      "weddingDate": "2026-01-01T00:00:00.000Z",
      "monogramFilename": null,
      "groomFather": null,
      "groomMother": null,
      "brideFather": null,
      "brideMother": null,
      "instagramLink": null,
      "footerText": null,
      "isPublished": false
    },
    "features": {
      "love_story": true,
      "rsvp": true,
      "gallery": true,
      "prewedding_videos": true,
      "faqs": true,
      "dress_code": true,
      "instagram_link": false
    },
    "content": {
      "loveStory": [],
      "gallery": [],
      "faqs": [],
      "dressCode": null,
      "locations": [],
      "bankDetails": []
    }
  }
}
```

### Error Responses

#### 401 Unauthorized

```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

#### 404 Not Found

```json
{
  "error": "Not Found",
  "message": "Wedding configuration not found for this user"
}
```

#### 500 Internal Server Error

```json
{
  "error": "Internal Server Error",
  "message": "Failed to fetch preview data"
}
```

---

## Implementation Notes

### Data Fetching Strategy

1. Query `wedding_configurations` by user's weddingConfigId
2. Query `feature_toggles` for weddingConfigId
3. For each enabled feature, query corresponding table:
   - `love_story` → `love_stories` table
   - `gallery` → `gallery_photos` table
   - `faqs` → `faqs` table
   - `dress_code` → `dress_codes` table
   - `locations` → Always fetch (needed for "When & Where" section)
   - `bank_details` → Always fetch (needed for "Gift" section)
4. Consolidate into PreviewConfig format
5. Return response

### Performance Considerations

- Use Promise.all for parallel queries
- Limit gallery to 20 photos for preview (performance)
- Cache response for 30 seconds (preview doesn't need real-time)
- Use database indexes on weddingConfigId

### SQL Query Pattern (Example)

```sql
-- 1. Get config
SELECT * FROM wedding_configurations WHERE id = ?

-- 2. Get features
SELECT feature_name, is_enabled FROM feature_toggles WHERE wedding_config_id = ?

-- 3. Get love story (if enabled)
SELECT * FROM love_stories WHERE wedding_config_id = ? ORDER BY order ASC

-- 4. Get gallery (if enabled)
SELECT * FROM gallery_photos WHERE wedding_config_id = ? ORDER BY order ASC LIMIT 20

-- Similar for other content types
```

---

## Testing Contract

### Unit Tests

- Mock database responses
- Verify response structure matches contract
- Test with missing content
- Test with all features disabled
- Test with all features enabled
- Test unauthorized access
- Test missing wedding config

### Integration Tests

- Test end-to-end with real database
- Verify data consistency
- Test performance (<500ms response time)
- Test concurrent requests

---

## Migration from Current Endpoint

Current endpoint: `GET /api/wedding/config`
Returns: `{ data: WeddingConfiguration & { features: Record<string, boolean> } }`

New endpoint adds:

- Consolidated content for all sections
- Optimized for preview use case
- Single request vs. multiple requests

Existing `/api/wedding/config` remains unchanged for backward compatibility.
