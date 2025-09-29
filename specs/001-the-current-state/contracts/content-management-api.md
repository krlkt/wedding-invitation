# Content Management API Contract

## Love Story API

### GET /api/wedding/love-story

**Purpose**: Retrieve all love story segments for current user's wedding

**Authorization**: Required (authenticated user)

**Response (Success - 200)**:
```typescript
{
  success: true;
  data: [
    {
      id: string;
      title: string;
      description: string;
      date: string; // ISO date
      iconType: string;
      order: number;
      createdAt: string;
      updatedAt: string;
    }
  ]
}
```

### POST /api/wedding/love-story

**Purpose**: Create new love story segment

**Authorization**: Required (authenticated user)

**Request**:
```typescript
{
  title: string;
  description: string;
  date: string; // ISO date
  iconType: string;
  order: number;
}
```

**Response (Success - 201)**:
```typescript
{
  success: true;
  data: {
    id: string;
    title: string;
    description: string;
    date: string;
    iconType: string;
    order: number;
    createdAt: string;
    updatedAt: string;
  }
}
```

### PUT /api/wedding/love-story/[id]

**Purpose**: Update existing love story segment

**Authorization**: Required (authenticated user)

**Request**:
```typescript
{
  title?: string;
  description?: string;
  date?: string; // ISO date
  iconType?: string;
  order?: number;
}
```

**Response (Success - 200)**:
```typescript
{
  success: true;
  data: {
    // Updated love story segment
  }
}
```

### DELETE /api/wedding/love-story/[id]

**Purpose**: Delete love story segment

**Authorization**: Required (authenticated user)

**Response (Success - 200)**:
```typescript
{
  success: true;
  message: "Love story segment deleted"
}
```

---

## Location API

### GET /api/wedding/locations

**Purpose**: Retrieve all wedding locations

**Authorization**: Required (authenticated user)

**Response (Success - 200)**:
```typescript
{
  success: true;
  data: [
    {
      id: string;
      locationIdentifier: string;
      name: string;
      address: string;
      googleMapsLink?: string;
      ceremonyTime?: string;
      receptionTime?: string;
      order: number;
      createdAt: string;
      updatedAt: string;
    }
  ]
}
```

### POST /api/wedding/locations

**Purpose**: Create new wedding location

**Authorization**: Required (authenticated user)

**Request**:
```typescript
{
  locationIdentifier: string; // URL-safe identifier
  name: string;
  address: string;
  googleMapsLink?: string;
  ceremonyTime?: string;
  receptionTime?: string;
  order: number;
}
```

**Response (Success - 201)**:
```typescript
{
  success: true;
  data: {
    // Created location object
  }
}
```

---

## FAQ API

### GET /api/wedding/faqs

**Purpose**: Retrieve all FAQ items

**Authorization**: Required (authenticated user)

**Response (Success - 200)**:
```typescript
{
  success: true;
  data: [
    {
      id: string;
      question: string;
      answer: string;
      order: number;
      createdAt: string;
      updatedAt: string;
    }
  ]
}
```

### POST /api/wedding/faqs

**Purpose**: Create new FAQ item

**Authorization**: Required (authenticated user)

**Request**:
```typescript
{
  question: string;
  answer: string;
  order: number;
}
```

**Response (Success - 201)**:
```typescript
{
  success: true;
  data: {
    // Created FAQ object
  }
}
```

---

## Bank Details API

### GET /api/wedding/bank-details

**Purpose**: Retrieve bank details for gifts

**Authorization**: Required (authenticated user)

**Response (Success - 200)**:
```typescript
{
  success: true;
  data: {
    id: string;
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
    routingNumber?: string;
    instructions?: string;
    createdAt: string;
    updatedAt: string;
  }
}
```

### PUT /api/wedding/bank-details

**Purpose**: Update bank details

**Authorization**: Required (authenticated user)

**Request**:
```typescript
{
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  routingNumber?: string;
  instructions?: string;
}
```

**Response (Success - 200)**:
```typescript
{
  success: true;
  data: {
    // Updated bank details object
  }
}
```

---

## Dress Code API

### GET /api/wedding/dress-code

**Purpose**: Retrieve dress code information

**Authorization**: Required (authenticated user)

**Response (Success - 200)**:
```typescript
{
  success: true;
  data: {
    id: string;
    title?: string;
    description?: string;
    photoFilename?: string;
    photoUrl?: string; // Presigned URL for photo access
    createdAt: string;
    updatedAt: string;
  }
}
```

### PUT /api/wedding/dress-code

**Purpose**: Update dress code information

**Authorization**: Required (authenticated user)

**Request**:
```typescript
{
  title?: string;
  description?: string;
}
```

**Response (Success - 200)**:
```typescript
{
  success: true;
  data: {
    // Updated dress code object
  }
}
```