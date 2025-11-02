# Quickstart: Starting Section Content Management

**Feature**: 009-i-want-to
**Date**: 2025-10-18
**Purpose**: Integration test scenarios validating all functional requirements

## Prerequisites

- Wedding configuration exists in database
- User authenticated with valid session
- Admin dashboard accessible at `/admin`
- Database migrated with starting section fields

## Test Scenarios

### Scenario 1: Edit Groom and Bride Names (FR-002)

**User Story**: Admin edits groom's and bride's names in starting section

**Given**:
- User logged into admin dashboard
- Starting section accordion is expanded

**When**:
1. User clicks on "Starting section" (renamed from "Hero") accordion item
2. User enters "Alexander Johnson" in "Groom's Name" field
3. User enters "Sophia Martinez" in "Bride's Name" field
4. User clicks "Save" button

**Then**:
- API PUT request to `/api/wedding/config/starting-section` with names
- Response status 200 with success: true
- Database updated with new names
- Preview pane updates immediately showing new names
- Success notification appears

**Acceptance**: Names persist after page refresh and display in preview

---

### Scenario 2: Toggle Parent Information Display (FR-003, FR-004)

**User Story**: Admin toggles parent information to show input fields

**Given**:
- User on starting section configuration
- "Show parent information" toggle is OFF

**When**:
1. User clicks "Show parent information" toggle to ON
2. Four input fields appear:
   - Groom's Father Name
   - Groom's Mother Name
   - Bride's Father Name
   - Bride's Mother Name

**Then**:
- Input fields are visible and enabled
- Preview pane shows placeholder parent information section
- Toggle state reflects ON position

**When** (toggle OFF):
1. User clicks toggle to OFF

**Then**:
- Input fields remain visible but grayed out
- Preview pane hides parent information
- Previously entered names remain saved in database (FR-005)

**Acceptance**: Toggle controls visibility, data persists when toggled OFF

---

### Scenario 3: Save Partial Parent Information (FR-012, FR-013)

**User Story**: Admin fills only groom's parent names, leaving bride's parents empty

**Given**:
- "Show parent information" toggle is ON
- All four parent name fields are empty

**When**:
1. User enters "Robert Johnson" in Groom's Father Name
2. User enters "Mary Johnson" in Groom's Mother Name
3. User leaves Bride's Father Name empty
4. User leaves Bride's Mother Name empty
5. User clicks "Save"

**Then**:
- API request includes:
  ```json
  {
    "showParentInfo": true,
    "groomFatherName": "Robert Johnson",
    "groomMotherName": "Mary Johnson",
    "brideFatherName": null,
    "brideMotherName": null
  }
  ```
- Response status 200 (partial save allowed)
- Database saves all four values (two filled, two null)
- Preview shows: "Son of Robert Johnson and Mary Johnson" for groom
- Preview does NOT show parent line for bride (both names missing)

**Acceptance**: System allows partial parent info, displays only complete pairs

---

### Scenario 4: Upload Background Image with Validation (FR-006, FR-016, FR-017)

**User Story**: Admin uploads a background image under 10MB

**Given**:
- User on starting section configuration
- No existing background media

**When**:
1. User clicks "Upload Background Media" button
2. User selects image file: `wedding-background.jpg` (5 MB, image/jpeg)
3. File picker closes

**Then**:
- Client validates file size < 10MB (passes)
- Client validates MIME type in [image/jpeg, image/png, image/webp, image/gif] (passes)
- Upload progress indicator appears
- API POST to `/api/wedding/media/starting-section` with FormData
- Response status 200 with:
  ```json
  {
    "success": true,
    "data": {
      "filename": "background-image-1697654321.jpg",
      "fileSize": 5242880,
      "mimeType": "image/jpeg",
      "type": "image"
    }
  }
  ```
- File saved to `public/uploads/{configId}/starting-section/background-image-1697654321.jpg`
- Database updated with filename, fileSize, mimeType
- Preview pane updates to show image as background
- Success notification: "Background image uploaded successfully"

**Acceptance**: Image uploads, validates size/type, updates preview

---

### Scenario 5: Upload Oversized Video with Error (FR-014, FR-015)

**User Story**: Admin attempts to upload a video exceeding 50MB

**Given**:
- User on starting section configuration
- No existing background media

**When**:
1. User clicks "Upload Background Media" button
2. User selects video file: `wedding-video.mp4` (65 MB, video/mp4)

**Then**:
- Client validates file size (65MB > 50MB limit)
- Upload is prevented before API call
- Error message appears: "Video file size exceeds maximum of 50 MB"
- No API request sent
- No file uploaded
- Preview remains unchanged

**Alternative** (server-side validation):
- If client validation bypassed, API returns 400 with error
- Same error message displayed to user

**Acceptance**: Files exceeding size limits are rejected with clear error

---

### Scenario 6: Replace Existing Background Media with Confirmation (FR-018)

**User Story**: Admin replaces existing background image with a video

**Given**:
- User on starting section configuration
- Existing background image: `background-image-1697654321.jpg`

**When**:
1. User clicks "Upload Background Media" button
2. User selects video file: `new-video.mp4` (30 MB, video/mp4)
3. Client detects existing media

**Then**:
- Confirmation dialog appears:
  - Title: "Replace existing background media?"
  - Message: "This will delete the current background image. This action cannot be undone."
  - Buttons: [Cancel] [Replace]

**When** (user clicks Cancel):
- Dialog closes
- No upload occurs
- Existing image remains

**When** (user clicks Replace):
- API POST to `/api/wedding/media/starting-section` with `replaceExisting: true`
- Response status 200 with new file data
- Old file `background-image-1697654321.jpg` deleted from filesystem
- New file `background-video-1697654400.mp4` saved
- Database updated with new filename, fileSize, mimeType, type
- Preview updates to show video background
- Success notification: "Background video uploaded successfully"

**Acceptance**: User must confirm before replacing existing media

---

### Scenario 7: Toggle Wedding Date Display (FR-007, FR-008, FR-009)

**User Story**: Admin toggles wedding date display with fallback placeholder

**Given**:
- User on starting section configuration
- Wedding date exists in basic info: June 15, 2025
- "Show wedding date" toggle is ON

**When** (date exists):
- Preview displays formatted date: "June 15, 2025"

**When** (toggle OFF):
1. User clicks "Show wedding date" toggle to OFF

**Then**:
- Preview hides wedding date section entirely
- Database saves `showWeddingDate: false`

**When** (toggle ON, no date):
1. Wedding date in basic info is null
2. User toggles "Show wedding date" to ON

**Then**:
- Preview displays placeholder: "1 January 2050"
- Placeholder styled differently (e.g., italic, lighter color)
- No error or crash

**Acceptance**: Date displays from basic info or shows placeholder if undefined

---

### Scenario 8: Rename "Hero Content" to "Starting section" (FR-001)

**User Story**: Admin sees updated terminology throughout admin interface

**Given**:
- User on admin dashboard

**When**:
- User views feature toggles accordion

**Then**:
- Accordion item labeled "Starting section" (not "Hero" or "Hero Content")
- Description reads: "Opening section with couple names, parent info, and wedding date"
- No references to "Hero" remain in UI

**When**:
- User expands "Starting section" accordion

**Then**:
- Form fields clearly labeled
- Section header: "Starting Section Configuration"

**Acceptance**: All UI text uses "Starting section" terminology

---

### Scenario 9: Preview Updates Instantly (Draft State Pattern)

**User Story**: Admin sees real-time preview while editing without saving

**Given**:
- User on starting section configuration
- Preview pane visible on right side

**When**:
1. User types "John" in Groom's Name field
2. User types "Doe" continuing the name

**Then**:
- After each keystroke, preview updates within <100ms
- No API calls made (draft state only)
- "Save" button shows "unsaved changes" indicator

**When**:
1. User clicks "Save"

**Then**:
- API call persists changes
- "Unsaved changes" indicator disappears
- Preview remains showing same content (no flicker)

**Acceptance**: Preview updates instantly, saves only on explicit user action

---

### Scenario 10: Name Fallback from Basic Info

**User Story**: Starting section uses basic info names when custom names not set

**Given**:
- Basic info has groomName: "Alexander", brideName: "Sophia"
- Starting section groomName: null, brideName: null

**When**:
- User expands starting section configuration

**Then**:
- Groom's Name input shows placeholder: "Alexander (from basic info)"
- Bride's Name input shows placeholder: "Sophia (from basic info)"
- Preview displays: "Alexander & Sophia"

**When**:
1. User enters custom name "Alex" in Groom's Name
2. User leaves Bride's Name empty

**Then**:
- Preview displays: "Alex & Sophia"
- Database saves: `groomName: "Alex"`, `brideName: null`

**Acceptance**: Null values fall back to basic info, custom values override

---

## Validation Checklist

Run through all scenarios sequentially to validate:

- [x] FR-001: "Hero Content" renamed to "Starting section"
- [x] FR-002: Editable groom and bride names
- [x] FR-003: Toggle for parent information
- [x] FR-004: Four parent name input fields when toggle enabled
- [x] FR-005: Parent names persist when toggle disabled
- [x] FR-006: Upload image or video as background
- [x] FR-007: Toggle for wedding date display
- [x] FR-008: Wedding date fetched from basic info
- [x] FR-009: Placeholder "1 January 2050" when date undefined
- [x] FR-010: All changes persist to database
- [x] FR-011: Live preview updates
- [x] FR-012: Partial parent info allowed
- [x] FR-013: Display only filled parent information
- [x] FR-014: Video file size limit 50MB enforced
- [x] FR-015: Clear error for oversized video
- [x] FR-016: Image file size limit 10MB enforced
- [x] FR-017: Clear error for oversized image
- [x] FR-018: Confirmation before replacing media

## Performance Targets

- Form validation: <100ms
- Preview update (draft): <100ms
- API save response: <200ms
- File upload (10MB): <5 seconds
- File upload (50MB): <15 seconds

## Browser Compatibility

Test in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Automated Test Coverage

These scenarios map to:
- **Unit tests**: Validation logic, media size checks
- **Component tests**: Form rendering, toggle behavior, file input
- **Integration tests**: API contracts, database persistence
- **E2E tests**: Complete user flows (Scenarios 1-10)

Target: 80% code coverage minimum per Constitution VI
