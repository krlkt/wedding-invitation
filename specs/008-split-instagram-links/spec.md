# Feature Specification: Reorganize Instagram Links and Footer Text

**Feature Branch**: `OIALT-8-templating-feature`
**Created**: 2025-10-14
**Status**: Draft
**Input**: User description: "please move instagramLink and footerText out of Basic Information. instagramLink should be split into groomsInstagramLink and brideInstagramLink. Both of these information should fit more into Content section, not basic information."

## Execution Flow (main)
```
1. Parse user description from Input
   → Extract: move instagramLink and footerText from Basic Info to Content
   → Extract: split instagramLink into groomsInstagramLink and brideInstagramLink
2. Identify affected areas:
   → Database schema (wedding configuration)
   → Admin dashboard UI (Basic Info tab vs Content tab)
   → Template rendering (footer and social links)
3. Mark clarification needs for migration strategy
4. Fill User Scenarios & Testing section
5. Generate Functional Requirements
6. Identify Key Entities
7. Run Review Checklist
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

---

## Clarifications

### Session 2025-10-14
- Q: For existing configurations with a single `instagramLink` value, how should this be migrated? → A: Option D - Clear/remove and require manual re-entry (testing data only, safe to delete)
- Q: Should the existing `instagram_link` feature toggle control both links together or be split? → A: Option C - Rename to be more descriptive but maintain single control over both links

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story
As a wedding couple administrator, I want to provide separate Instagram links for both the groom and bride, and manage footer text separately from basic wedding information, so that I can better organize my wedding website's social media presence and content structure.

### Acceptance Scenarios
1. **Given** an administrator is editing wedding configuration, **When** they navigate to Basic Information tab, **Then** they should NOT see Instagram link or footer text fields
2. **Given** an administrator is editing wedding configuration, **When** they navigate to Content tab, **Then** they should see separate fields for "Groom's Instagram Link", "Bride's Instagram Link", and "Footer Text"
3. **Given** an administrator enters valid Instagram URLs for both groom and bride, **When** they save the configuration, **Then** both links should be stored and displayed correctly on the wedding website
4. **Given** an administrator has previously entered a single Instagram link, **When** they upgrade to the new system, **Then** the old instagramLink value should be cleared (not migrated) and new separate fields should be empty requiring manual entry
5. **Given** a wedding template is rendered, **When** Instagram links are available, **Then** the template should display both links appropriately (e.g., in footer or social media section)

### Edge Cases
- What happens when only one Instagram link is provided (groom or bride)? → Template displays only the provided link
- What happens when neither Instagram link is provided? → Template hides/omits Instagram section
- What happens when the Instagram link feature toggle is disabled but links are stored? → Links not displayed on template (feature toggle controls visibility)
- How does the system handle existing configurations with the old single instagramLink field during data migration? → Old instagramLink value is cleared, not migrated
- What happens when Instagram URLs are invalid or malformed? → System validates format and prevents saving invalid URLs

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: System MUST provide separate input fields for groom's Instagram link and bride's Instagram link
- **FR-002**: System MUST move Instagram link fields from Basic Information section to Content section
- **FR-003**: System MUST move footer text field from Basic Information section to Content section
- **FR-004**: System MUST allow administrators to save configuration with zero, one, or both Instagram links
- **FR-005**: System MUST validate Instagram URLs when provided (format validation)
- **FR-006**: System MUST preserve existing footer text during the reorganization
- **FR-007**: System MUST clear existing single Instagram link data during migration (no automatic migration to new fields)
- **FR-008**: Wedding templates MUST display both Instagram links when available
- **FR-009**: Wedding templates MUST handle cases where only one or neither Instagram link is provided
- **FR-010**: System MUST rename the existing instagram_link feature toggle to a more descriptive name while maintaining single control over both groom's and bride's Instagram links (both links shown/hidden together)

### Key Entities *(include if feature involves data)*
- **Wedding Configuration**: Stores core wedding information and settings
  - Attributes: groom's Instagram link, bride's Instagram link, footer text
  - Relationships: Belongs to a user account
  - Changes: Split single instagram link field into two separate fields; restructure data organization

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
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed

---

## Resolved Clarifications

All clarifications have been addressed and integrated into the specification above. See the Clarifications section for the Q&A session record.
