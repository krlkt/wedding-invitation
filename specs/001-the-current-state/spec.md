# Feature Specification: Multi-Tenant Wedding Invitation Platform

**Feature Branch**: `001-the-current-state`
**Created**: 2025-09-28
**Status**: Draft
**Input**: User description: "the current state of the webapp is that it is currently a single wedding invitation for a specific person: which is karel and sabrina. the app has a couple of features: 1. It has unopened state of the invitation. 2. It has opened state of the invitation, where all of the information, rsvps, wishes, and other features inside. 3. it has administration feature locked behind a hard coded password, /dashboard for dashboard and /tables for table managements (if it is a wedding with a set of tables, not buffet). 4. The wedding invitation is divided into \"locations\" as karel and sabrina had 3 weddings in 3 different locations. The webapp handles 3 locations as 3 different weddings, therefore having 3 dashboards, even though it uses the same database, just with a different \"location\" in each rows. Now, what I wanted to do is, that this web application to scale so that user who uses this web application can customize groom and bride names, wedding date, monogram, child of x and y, instagram link, love story segments, love story icons, love story dates and descriptions, add to calendar link, wedding location, google map link for the location, wedding time, gallery photos, prewedding video link, FAQs question and answers, dresscode photo and texts, bank details for gift/money transfers, footer text. user should be able to toggle on and off some optional features, such as love story, rsvp, gallery, prewedding videos, FAQs, dress code, instagram link. User should be able to live edit and results should be previewed directly in desktop browser, there will be no live preview in mobile view, rather only show the preview at the end after user is done editing."

---

## Clarifications

### Session 2025-09-28
- Q: How should couples create and access their wedding configuration? → A: Account registration with email/password
- Q: How should guests access different couples' wedding invitations? → A: Subdomain per wedding (john-jane.weddingsite.com) - no extra domain costs
- Q: What are the size and format limits for uploaded content? → A: Vercel-friendly (images: 4MB, JPEG/PNG/WebP; external storage for videos)
- Q: How should the system handle weddings with multiple locations/events? → A: Single invitation with multiple location sections (like current Karel/Sabrina setup)
- Q: What validation is required before a wedding invitation goes live? → A: Manual publish button - couples control when changes go live

---

## User Scenarios & Testing

### Primary User Story
A couple wants to create their own customized wedding invitation website by editing content fields, toggling features on/off, and seeing live preview results. They fill in their personal details (names, dates, locations), customize their love story, upload photos, set up banking details for gifts, and configure which sections appear on their invitation. The system generates a fully functional wedding invitation website that guests can visit, RSVP to, and interact with.

### Acceptance Scenarios
1. **Given** an empty wedding invitation setup, **When** a user enters groom/bride names and wedding date, **Then** the invitation preview updates to show the personalized names and date
2. **Given** a wedding invitation in edit mode, **When** a user toggles off the "love story" feature, **Then** the love story section disappears from the preview and will not appear on the live invitation
3. **Given** a user is editing their invitation, **When** they upload gallery photos, **Then** the photos appear in the gallery section of the preview
4. **Given** a completed invitation setup, **When** a user switches from edit mode to guest view, **Then** they see the final invitation exactly as guests will see it
5. **Given** a wedding invitation with RSVP enabled, **When** a guest submits an RSVP, **Then** the response is recorded and visible in the couple's dashboard

### Edge Cases
- What happens when a user uploads an invalid image format or file exceeding 4MB limit?
- How does the system handle publishing with incomplete or missing content?
- What occurs when a user tries to access editing features without proper authentication?
- How does the system behave when optional features are toggled while guests are actively viewing the invitation?

## Requirements

### Functional Requirements
- **FR-001**: System MUST allow users to customize basic wedding details (groom name, bride name, wedding date, monogram)
- **FR-002**: System MUST allow users to edit parent information (child of X and Y)
- **FR-003**: System MUST provide live preview of changes in desktop browser during editing (draft mode)
- **FR-023**: System MUST provide manual publish/unpublish controls for making changes live to guests
- **FR-004**: System MUST allow users to toggle optional features on/off (love story, RSVP, gallery, prewedding videos, FAQs, dress code, Instagram link)
- **FR-005**: System MUST support multiple customizable love story segments with icons, dates, and descriptions
- **FR-006**: System MUST allow users to set wedding location details with Google Maps integration
- **FR-007**: System MUST support photo gallery management with upload (max 4MB JPEG/PNG/WebP) and display capabilities
- **FR-008**: System MUST allow customization of FAQ questions and answers
- **FR-009**: System MUST support dress code customization with photos (max 4MB JPEG/PNG/WebP) and text descriptions
- **FR-010**: System MUST allow configuration of bank details for gift transfers
- **FR-011**: System MUST support footer text customization
- **FR-012**: System MUST provide calendar integration for add-to-calendar functionality
- **FR-013**: System MUST maintain existing RSVP and guest interaction functionality
- **FR-014**: System MUST support multiple wedding locations with path-based access (subdomain.com/location) and separate dashboards per location
- **FR-015**: System MUST maintain administrative dashboard access for wedding management
- **FR-016**: Users MUST be able to register accounts with email/password and authenticate to access their specific wedding configuration
- **FR-017**: System MUST prevent unauthorized access to editing features
- **FR-018**: System MUST support mobile viewing of final invitation (read-only)
- **FR-019**: System MUST allow prewedding video link configuration (external hosting) when feature is enabled
- **FR-020**: System MUST persist all customization data across sessions
- **FR-021**: System MUST generate unique subdomain URLs for each wedding (e.g., john-jane.weddingsite.com)
- **FR-022**: System MUST support future custom domain integration (deferred feature)

### Key Entities
- **Wedding Configuration**: Core wedding details including couple names, date, monogram, parent information, feature toggles, unique subdomain identifier, and publication status (draft/live)
- **Love Story Segment**: Individual story entries with icon, date, and description that combine to form the complete love story
- **Location Details**: Wedding venue information including address, Google Maps link, timing details, and unique location identifier for path-based routing
- **Gallery Item**: Individual photos in the wedding gallery with metadata and display order
- **FAQ Item**: Question and answer pairs for the wedding FAQ section
- **Dress Code**: Visual and textual dress code guidance including photos and descriptions
- **Bank Details**: Financial information for gift transfers including account details and instructions
- **Feature Toggle**: Boolean flags controlling which optional sections appear on the invitation
- **Guest Response**: RSVP and interaction data from wedding guests (existing functionality)
- **User Account**: Registered user credentials (email/password) for accessing wedding configuration
- **Admin Session**: Authentication state for accessing editing and dashboard features

---

## Review & Acceptance Checklist

### Content Quality
- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness
- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

---

## Execution Status

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed