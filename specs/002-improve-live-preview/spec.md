# Feature Specification: Improve Live Preview with Full-Screen View and Subdomain Uniqueness Validation

**Feature Branch**: `002-improve-live-preview`
**Created**: 2025-10-10
**Status**: Draft
**Input**: User description: "Improve live preview with full-screen view and subdomain uniqueness validation"

## Execution Flow (main)
```
1. Parse user description from Input
   → Feature involves preview improvements and subdomain validation
2. Extract key concepts from description
   → Actors: Couples using admin dashboard
   → Actions: View wedding site preview, register with unique subdomain
   → Data: Wedding configuration, subdomain URLs
   → Constraints: Subdomain must be unique across all couples
3. For each unclear aspect:
   → Custom domain setup: Resolved - will be purchased later after core features complete
4. Fill User Scenarios & Testing section
   → Clear user flows for preview and registration identified
5. Generate Functional Requirements
   → All requirements are testable
6. Identify Key Entities
   → Wedding configuration with subdomain field
7. Run Review Checklist
   → Spec ready for planning
8. Return: SUCCESS (spec ready for planning)
```

---

## Clarifications

### Session 2025-10-10
- Q: What is the status of custom domain (oialt.com) availability for this feature release? → A: Custom domain NOT available now - will be purchased/configured later after most features are complete
- Q: What should happen when a user clicks "View Live Site" before their wedding configuration is fully saved or is incomplete? → A: Show error message - "Please save your configuration first" and prevent preview
- Q: When clicking "View Live Site" button, how should the preview page open? → A: New browser tab (target="_blank") - user can switch between admin and preview

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story
As a couple managing their wedding invitation site, I want to see a full-screen preview of how my wedding site will look to guests, so that I can verify the design and content before publishing. Additionally, when registering, I want to ensure my chosen subdomain is unique and won't conflict with other couples' sites.

### Acceptance Scenarios

#### Preview Improvements
1. **Given** I am logged into the admin dashboard, **When** I view the live preview section, **Then** I should see a visual preview of my wedding site with accurate content
2. **Given** I want to see my wedding site in full screen, **When** I click a "View Live Site" button, **Then** I should see my complete wedding site in a new browser tab without admin interface elements, allowing me to switch between admin and preview
3. **Given** I am viewing the preview, **When** I look at the subdomain URL display, **Then** I should see a clear message about custom domain availability instead of a non-functional URL

#### Subdomain Uniqueness
4. **Given** I am registering a new wedding site, **When** the system generates a subdomain from my and my partner's names, **Then** the system must ensure the subdomain is unique across all registered couples
5. **Given** a subdomain collision occurs during generation, **When** the system detects this, **Then** the system must automatically retry with a different variation until a unique subdomain is found
6. **Given** the system cannot generate a unique subdomain after multiple attempts, **When** registration fails, **Then** I should receive a clear error message asking me to try again

### Edge Cases
- What happens when two couples have identical names (e.g., John & Mary)? → System generates unique subdomain via random suffix
- How does the system handle special characters in names that could create invalid subdomains? → Strip special characters, keep only alphanumeric and hyphens
- What happens if the preview button is clicked before configuration is saved? → Show error message "Please save your configuration first" and prevent preview
- How does the system prevent infinite retry loops during subdomain generation? → Maximum 5 retry attempts, then fail with clear error message

## Requirements *(mandatory)*

### Functional Requirements

#### Preview Enhancements
- **FR-001**: System MUST provide a full-screen preview option that displays the complete wedding site without admin interface elements
- **FR-002**: System MUST show couples their wedding site preview using their actual configuration data (names, dates, features, content)
- **FR-003**: System MUST display message indicating shared domain is current, custom subdomain available after domain purchase (e.g., "Your wedding site - Custom subdomain available after domain setup" or "Currently on shared domain: oialt.vercel.app")
- **FR-004**: Couples MUST be able to access the full-screen preview through a dedicated button in the admin dashboard that opens preview in a new browser tab (target="_blank")
- **FR-004a**: System MUST validate configuration is saved before allowing preview access; show error "Please save your configuration first" if unsaved changes exist
- **FR-005**: Preview MUST reflect the current state of the couple's configuration in real-time

#### Subdomain Uniqueness Validation
- **FR-006**: System MUST enforce subdomain uniqueness across all wedding configurations
- **FR-007**: System MUST automatically generate unique subdomains from couple names during registration
- **FR-008**: System MUST retry subdomain generation with variations when collisions are detected
- **FR-009**: System MUST prevent registration if a unique subdomain cannot be generated after reasonable retry attempts
- **FR-010**: System MUST provide clear error messages to users when subdomain generation fails
- **FR-011**: System MUST validate subdomain availability before attempting database insertion

#### Data Integrity
- **FR-012**: System MUST maintain database constraint that prevents duplicate subdomains at the storage level
- **FR-013**: System MUST handle subdomain collision errors gracefully without exposing technical details to users

### Key Entities

- **Wedding Configuration**: Represents a couple's wedding site setup, including subdomain (must be unique), couple names, wedding date, and feature toggles
- **Preview Session**: Represents a couple's authenticated preview viewing session that displays their wedding site configuration without admin interface

---

## Review & Acceptance Checklist
*GATE: Automated checks run during main() execution*

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
*Updated by main() during processing*

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked (custom domain timeline)
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed (pending one clarification)

---
