# Quickstart: Reorganize Instagram Links and Footer Text

**Feature**: 008-split-instagram-links
**Date**: 2025-10-14

## Purpose
This quickstart validates the implementation of split Instagram links (groom/bride) and reorganized UI (Content tab instead of Basic Info tab).

## Prerequisites
- Development environment running
- Database with migrations applied
- Admin account logged in
- Test wedding configuration exists

## Test Scenarios

### Scenario 1: Database Schema Validation
**Objective**: Verify new columns exist and deprecated column is marked

**Steps**:
1. Check database schema:
   ```bash
   # Using Drizzle Studio or SQL client
   DESCRIBE wedding_configurations;
   ```

**Expected Results**:
- ✅ Column `grooms_instagram_link` exists (TEXT, nullable)
- ✅ Column `bride_instagram_link` exists (TEXT, nullable)
- ✅ Column `footer_text` still exists
- ✅ Column `instagram_link` still exists (deprecated but present)

---

### Scenario 2: Admin Dashboard UI Reorganization
**Objective**: Verify fields moved from Basic Info to Content tab

**Steps**:
1. Navigate to `/admin/dashboard`
2. Open **Basic Information** tab
3. Scroll through form fields
4. Switch to **Content** tab
5. Observe form fields

**Expected Results**:
- ✅ Basic Info tab does NOT show:
  - Instagram Link field (old single field)
  - Footer Text field
- ✅ Content tab SHOWS:
  - Groom's Instagram Link field (labeled clearly)
  - Bride's Instagram Link field (labeled clearly)
  - Footer Text field (textarea)
- ✅ All three fields are optional (no required indicators)

---

### Scenario 3: Save Both Instagram Links
**Objective**: Verify both Instagram links can be saved independently

**Steps**:
1. Navigate to Content tab in dashboard
2. Enter groom's Instagram URL: `https://instagram.com/test_groom`
3. Enter bride's Instagram URL: `https://instagram.com/test_bride`
4. Enter footer text: `Test footer message`
5. Click **Save Changes**
6. Wait for success indicator
7. Refresh page
8. Check Content tab again

**Expected Results**:
- ✅ Save succeeds without errors
- ✅ After refresh, all three fields retain entered values
- ✅ Groom's link: `https://instagram.com/test_groom`
- ✅ Bride's link: `https://instagram.com/test_bride`
- ✅ Footer text: `Test footer message`

---

### Scenario 4: Save Only One Instagram Link
**Objective**: Verify partial data entry works correctly

**Steps**:
1. Clear all fields in Content tab
2. Enter ONLY groom's Instagram URL: `https://instagram.com/only_groom`
3. Leave bride's Instagram Link empty
4. Enter footer text: `Only groom has Instagram`
5. Save and refresh

**Expected Results**:
- ✅ Save succeeds
- ✅ Groom's link saved: `https://instagram.com/only_groom`
- ✅ Bride's link remains empty (null)
- ✅ Footer text saved correctly
- ✅ No validation errors about missing bride link

---

### Scenario 5: URL Validation
**Objective**: Verify Instagram URL format is validated

**Steps**:
1. Enter invalid URL in groom's Instagram Link: `not-a-url`
2. Click Save
3. Observe validation error
4. Correct to valid URL: `https://instagram.com/valid_user`
5. Save again

**Expected Results**:
- ✅ Step 2: Save fails with clear error message
- ✅ Error indicates invalid Instagram URL format
- ✅ Step 5: Save succeeds with valid URL

---

### Scenario 6: Template Rendering - Both Links
**Objective**: Verify both Instagram links display correctly on wedding template

**Steps**:
1. Set both Instagram links in dashboard:
   - Groom: `https://instagram.com/groom_display`
   - Bride: `https://instagram.com/bride_display`
2. Set groom name: "John"
3. Set bride name: "Jane"
4. Enable `instagram_links` feature toggle
5. Navigate to preview or published site
6. Scroll to footer section

**Expected Results**:
- ✅ Footer displays two separate Instagram links
- ✅ First line: "Follow John on Instagram" (links to groom's URL)
- ✅ Second line: "Follow Jane on Instagram" (links to bride's URL)
- ✅ Links open in new tab (target="_blank")
- ✅ Links have underline styling
- ✅ Footer text displays below Instagram links

---

### Scenario 7: Template Rendering - Single Link
**Objective**: Verify single Instagram link displays correctly

**Steps**:
1. Set ONLY bride's Instagram link: `https://instagram.com/bride_only`
2. Clear groom's Instagram link (null)
3. Set bride name: "Jane"
4. View template footer

**Expected Results**:
- ✅ Footer displays ONLY bride's Instagram link
- ✅ Text: "Follow Jane on Instagram"
- ✅ No text or broken link for groom
- ✅ Layout looks natural (no empty space for missing link)

---

### Scenario 8: Template Rendering - No Links
**Objective**: Verify footer handles case with no Instagram links

**Steps**:
1. Clear both Instagram links (set to null)
2. Keep footer text: "Thank you for celebrating with us"
3. View template footer

**Expected Results**:
- ✅ Instagram section does NOT display at all
- ✅ Footer text still displays correctly
- ✅ No broken elements or empty spaces

---

### Scenario 9: Feature Toggle - Instagram Links
**Objective**: Verify renamed feature toggle controls both links

**Steps**:
1. Set both Instagram links in dashboard
2. Go to Features tab
3. Find "Instagram Links" toggle (renamed from "Instagram Link")
4. Observe current state (should say "Show social media link of bride and groom")
5. Toggle OFF
6. View template footer
7. Toggle ON
8. View template footer again

**Expected Results**:
- ✅ Feature is listed as "Instagram Links" (plural)
- ✅ Description mentions both bride and groom
- ✅ When OFF: Instagram section hidden in footer
- ✅ When ON: Instagram section visible in footer
- ✅ Footer text unaffected by toggle (always shows if present)

---

### Scenario 10: Backward Compatibility
**Objective**: Verify old instagramLink column doesn't interfere

**Steps**:
1. Check database for deprecated `instagram_link` column
2. Manually set value in database: `UPDATE wedding_configurations SET instagram_link = 'https://old.link' WHERE id = '...'`
3. View admin dashboard Content tab
4. Observe Instagram link fields
5. View template footer

**Expected Results**:
- ✅ Admin dashboard shows new fields (groom/bride), ignores old column
- ✅ Template footer uses new fields only (ignores `instagram_link`)
- ✅ No errors or broken behavior
- ✅ Old column value doesn't appear anywhere in UI

---

### Scenario 11: API Contract - Update Config
**Objective**: Verify API accepts new fields and validates URLs

**Steps**:
```bash
# Test valid request
curl -X PUT http://localhost:3000/api/wedding/config \
  -H "Content-Type: application/json" \
  -H "Cookie: session=..." \
  -d '{
    "groomsInstagramLink": "https://instagram.com/test_groom",
    "brideInstagramLink": "https://instagram.com/test_bride",
    "footerText": "API test footer"
  }'

# Test invalid URL
curl -X PUT http://localhost:3000/api/wedding/config \
  -H "Content-Type: application/json" \
  -H "Cookie: session=..." \
  -d '{
    "groomsInstagramLink": "invalid-url"
  }'
```

**Expected Results**:
- ✅ First request: Returns 200 with updated config
- ✅ Response includes `groomsInstagramLink` and `brideInstagramLink` fields
- ✅ Second request: Returns 400 with validation error
- ✅ Error message clearly indicates URL format issue

---

### Scenario 12: API Contract - Feature Toggle
**Objective**: Verify feature toggle API accepts renamed feature

**Steps**:
```bash
# Test enabling instagram_links
curl -X PUT http://localhost:3000/api/wedding/config/features \
  -H "Content-Type: application/json" \
  -H "Cookie: session=..." \
  -d '{
    "featureName": "instagram_links",
    "isEnabled": true
  }'

# Test old name (should fail)
curl -X PUT http://localhost:3000/api/wedding/config/features \
  -H "Content-Type: application/json" \
  -H "Cookie: session=..." \
  -d '{
    "featureName": "instagram_link",
    "isEnabled": true
  }'
```

**Expected Results**:
- ✅ First request: Returns 200, toggle updated successfully
- ✅ Second request: Returns 400, "Invalid feature name" error
- ✅ Old feature name `instagram_link` no longer accepted

---

## Acceptance Criteria Checklist

### Database
- [ ] New columns added: `grooms_instagram_link`, `bride_instagram_link`
- [ ] Old column `instagram_link` deprecated but present
- [ ] Column `footer_text` unchanged
- [ ] Migration script runs without errors

### Admin Dashboard
- [ ] Instagram Link and Footer Text removed from Basic Info tab
- [ ] Content tab shows three new fields (groom Instagram, bride Instagram, footer text)
- [ ] All fields are optional (no required validation)
- [ ] Form submission works with all, some, or no fields filled
- [ ] URL validation prevents invalid Instagram URLs
- [ ] Success feedback after save

### Template Rendering
- [ ] Both Instagram links display with personalized names
- [ ] Single Instagram link displays correctly (no broken layout)
- [ ] No Instagram links: section hidden entirely
- [ ] Footer text displays independently of Instagram links
- [ ] Links open in new tab with proper security attributes

### Feature Toggle
- [ ] Feature renamed to "instagram_links" (plural)
- [ ] Toggle controls visibility of both links together
- [ ] Description updated to mention bride and groom
- [ ] Toggle works correctly (on/off)

### API Contracts
- [ ] PUT /api/wedding/config accepts new fields
- [ ] URL validation returns 400 for invalid URLs
- [ ] GET /api/wedding/config returns new fields
- [ ] PUT /api/wedding/config/features accepts "instagram_links"
- [ ] Old feature name "instagram_link" rejected with 400

### Backward Compatibility
- [ ] Old `instagram_link` column ignored by application
- [ ] No errors when old column has data
- [ ] Existing footer text preserved

---

## Manual Testing Checklist

**Tester**: _________________
**Date**: _________________
**Environment**: _________________

| Scenario | Pass/Fail | Notes |
|----------|-----------|-------|
| 1. Database Schema | ☐ | |
| 2. UI Reorganization | ☐ | |
| 3. Save Both Links | ☐ | |
| 4. Save One Link | ☐ | |
| 5. URL Validation | ☐ | |
| 6. Template - Both Links | ☐ | |
| 7. Template - Single Link | ☐ | |
| 8. Template - No Links | ☐ | |
| 9. Feature Toggle | ☐ | |
| 10. Backward Compatibility | ☐ | |
| 11. API - Update Config | ☐ | |
| 12. API - Feature Toggle | ☐ | |

---

## Success Criteria
All scenarios must pass for feature to be considered complete.

**Status**: ☐ Ready for Production

**Sign-off**:
- Developer: _________________
- QA: _________________
- Product Owner: _________________
