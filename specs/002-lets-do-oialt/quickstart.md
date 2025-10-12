# Quickstart: Template-Based Live Preview Testing

**Feature**: OIALT-8 | **Date**: 2025-10-12
**Purpose**: Manual testing guide for template-based live preview with feature toggles

---

## Prerequisites

- Development environment running (`yarn dev`)
- Authenticated admin session
- Test wedding configuration with sample data
- Browser DevTools open (Network + Console tabs)

---

## Test Scenario 1: Basic Preview Rendering

**Objective**: Verify preview displays actual template instead of placeholder text

### Steps
1. Navigate to admin dashboard at `/admin`
2. Locate the live preview panel (right side of dashboard)
3. Observe the preview content

### Expected Results
✅ Preview shows actual wedding invitation layout (not "Feature enabled ✓" text)
✅ Hero section displays couple names, date, parent names (if configured)
✅ Monogram displays if uploaded
✅ Preview header shows subdomain, browser controls, publish status
✅ Preview is scaled down and fits dashboard container
✅ Preview is scrollable

### Pass Criteria
- All hero content visible and styled correctly
- Preview matches guest-facing template styling
- No console errors

---

## Test Scenario 2: Feature Toggle - Love Story

**Objective**: Verify love story section appears/disappears based on toggle

### Steps
1. In admin dashboard, locate "Love Story" feature toggle
2. Ensure Love Story toggle is **ON**
3. Observe preview for Love Story section
4. Add 2-3 love story timeline items if empty
5. Observe preview updates
6. Toggle Love Story to **OFF**
7. Observe preview

### Expected Results
✅ **When ON**: Love Story section visible with timeline
✅ **When ON + empty**: Shows "Add your love story" empty state
✅ **When ON + data**: Timeline items display in order
✅ **When OFF**: Love Story section completely hidden
✅ Preview updates within <300ms of toggle change

### Pass Criteria
- Section visibility matches toggle state
- Timeline data renders correctly
- Empty state shown when no data
- No layout shifts or flickering

---

## Test Scenario 3: Feature Toggle - Gallery

**Objective**: Verify gallery section conditional rendering

### Steps
1. Locate "Gallery" feature toggle
2. Ensure Gallery toggle is **ON**
3. Observe preview for Gallery section
4. Upload 3-5 test photos if empty
5. Observe preview updates
6. Toggle Gallery to **OFF**
7. Observe preview

### Expected Results
✅ **When ON**: Gallery section visible with photo grid
✅ **When ON + empty**: Shows "Upload photos" empty state
✅ **When ON + photos**: Photos display in grid layout
✅ **When OFF**: Gallery section completely hidden
✅ Photos load with proper Next.js Image component optimization

### Pass Criteria
- Gallery appears/disappears based on toggle
- Photos render without layout shift
- Empty state shown when no photos
- No broken images

---

## Test Scenario 4: Feature Toggle - RSVP

**Objective**: Verify RSVP form conditional rendering

### Steps
1. Locate "RSVP" feature toggle
2. Toggle RSVP to **ON**
3. Observe preview for RSVP section
4. Toggle RSVP to **OFF**
5. Observe preview

### Expected Results
✅ **When ON**: RSVP section visible with form
✅ **When OFF**: RSVP section completely hidden
✅ Form fields display but are preview-only (not functional in admin)
✅ Form uses mock data (e.g., "Preview Guest")

### Pass Criteria
- RSVP form appears/disappears
- Form styling matches template
- No console errors about missing props

---

## Test Scenario 5: Feature Toggle - FAQs

**Objective**: Verify FAQs section conditional rendering

### Steps
1. Locate "FAQs" feature toggle
2. Ensure FAQs toggle is **ON**
3. Observe preview for FAQs section
4. Add 2-3 FAQ items if empty
5. Toggle FAQs to **OFF**
6. Observe preview

### Expected Results
✅ **When ON**: FAQs section visible
✅ **When ON + empty**: Shows "Add FAQs" empty state
✅ **When ON + data**: FAQ accordion displays
✅ **When OFF**: FAQs section completely hidden

### Pass Criteria
- FAQs visibility matches toggle
- FAQ data renders correctly
- Empty state when no data

---

## Test Scenario 6: Feature Toggle - Dress Code

**Objective**: Verify dress code section conditional rendering

### Steps
1. Locate "Dress Code" feature toggle
2. Ensure Dress Code toggle is **ON**
3. Observe preview for Dress Code section
4. Configure dress code text and upload photo if empty
5. Toggle Dress Code to **OFF**
6. Observe preview

### Expected Results
✅ **When ON**: Dress Code section visible
✅ **When ON + empty**: Shows "Configure dress code" empty state
✅ **When ON + data**: Dress code text and photo display
✅ **When OFF**: Dress Code section completely hidden

### Pass Criteria
- Dress code visibility matches toggle
- Photo renders correctly if present
- Empty state when not configured

---

## Test Scenario 7: Feature Toggle - Prewedding Video

**Objective**: Verify prewedding video section conditional rendering

### Steps
1. Locate "Prewedding Videos" feature toggle
2. Toggle Prewedding Videos to **ON**
3. Observe preview for Prewedding Video section
4. Configure YouTube video URL if empty
5. Toggle to **OFF**
6. Observe preview

### Expected Results
✅ **When ON**: Prewedding video section visible
✅ **When ON + empty**: Shows "Add video URL" empty state
✅ **When ON + URL**: YouTube embed displays
✅ **When OFF**: Video section completely hidden

### Pass Criteria
- Video section visibility matches toggle
- YouTube embed loads correctly
- Empty state when no URL

---

## Test Scenario 8: Feature Toggle - Instagram Link

**Objective**: Verify Instagram link in footer conditional rendering

### Steps
1. Locate "Instagram Link" feature toggle
2. Configure Instagram URL in wedding settings
3. Toggle Instagram Link to **ON**
4. Scroll to preview footer
5. Observe Instagram link
6. Toggle to **OFF**
7. Observe footer

### Expected Results
✅ **When ON**: Instagram link visible in footer
✅ **When ON + no URL**: No link displayed
✅ **When OFF**: Instagram link hidden
✅ Footer text still displays regardless of toggle

### Pass Criteria
- Instagram link visibility matches toggle
- Link opens in new tab
- Footer remains styled correctly

---

## Test Scenario 9: Multiple Toggles Interaction

**Objective**: Verify multiple feature toggles work together

### Steps
1. Disable ALL feature toggles
2. Observe preview (should show only Hero + Gift + Wishes + Footer)
3. Enable Love Story toggle
4. Enable Gallery toggle
5. Enable RSVP toggle
6. Observe section ordering matches template
7. Disable Gallery toggle
8. Observe Gallery disappears, other sections remain

### Expected Results
✅ All disabled: Only non-optional sections visible
✅ Progressive enabling: Sections appear in correct order
✅ Individual toggle changes don't affect other sections
✅ Section order matches InvitationPage.tsx template
✅ No layout shifts between toggle changes

### Pass Criteria
- Sections appear in template order
- Independent toggle control
- Smooth transitions
- No visual glitches

---

## Test Scenario 10: Preview Performance

**Objective**: Verify preview updates are performant

### Steps
1. Open browser DevTools Performance tab
2. Start performance recording
3. Toggle 5 different features on/off rapidly
4. Stop recording
5. Analyze toggle response time

### Expected Results
✅ Each toggle change updates preview in <300ms
✅ No layout thrashing (excessive reflows)
✅ No memory leaks (check DevTools Memory)
✅ Smooth scrolling in preview
✅ No dropped frames during updates

### Pass Criteria
- Toggle response < 300ms
- Smooth scrolling maintained
- Memory usage stable

---

## Test Scenario 11: Empty Configuration

**Objective**: Verify preview handles missing data gracefully

### Steps
1. Create new test wedding configuration
2. Do NOT add any content (love story, gallery, FAQs, etc.)
3. Navigate to admin dashboard
4. Observe preview

### Expected Results
✅ Preview displays without errors
✅ Hero section shows configured names + date
✅ Enabled features show empty state messages
✅ No broken sections or console errors
✅ Preview remains scrollable and styled

### Pass Criteria
- No JavaScript errors
- All empty states display correctly
- UI remains functional

---

## Test Scenario 12: Preview Header Information

**Objective**: Verify preview header displays correct metadata

### Steps
1. Navigate to admin dashboard
2. Observe preview header (browser window controls area)
3. Note subdomain display
4. Note publish status indicator
5. Publish wedding
6. Observe status indicator change

### Expected Results
✅ Browser window controls (red, yellow, green dots) visible
✅ Subdomain displays: `{subdomain}.yourdomain.com`
✅ Publish status shows 🔴 Draft when unpublished
✅ Publish status shows 🟢 Published when published
✅ Header styling matches current LivePreview

### Pass Criteria
- All header elements visible
- Status updates correctly
- Subdomain displays correctly

---

## Test Scenario 13: Preview Scaling & Container

**Objective**: Verify preview fits properly in dashboard

### Steps
1. Navigate to admin dashboard
2. Observe preview container
3. Resize browser window (if applicable)
4. Check preview scaling
5. Test scroll behavior

### Expected Results
✅ Preview is scaled down to fit dashboard container
✅ Preview maintains aspect ratio
✅ Preview has rounded corners and shadow (like current)
✅ Scrolling works naturally within preview
✅ Preview doesn't overflow dashboard container

### Pass Criteria
- Proper scaling applied
- Scrollable content
- No overflow issues

---

## Test Scenario 14: Real-Time Data Refresh

**Objective**: Verify preview updates when configuration changes

### Steps
1. Open admin dashboard with preview visible
2. In separate tab, modify wedding configuration (change names, date, etc.)
3. Return to dashboard
4. Observe preview (should still show old data)
5. Toggle any feature off then on (triggers refresh)
6. Observe preview updates with new data

### Expected Results
✅ Preview does not auto-update (by design)
✅ Toggling feature triggers data refresh
✅ New data displays after refresh
✅ No stale data issues

### Pass Criteria
- Refresh mechanism works
- Updated data displays correctly

---

## Test Scenario 15: Error Handling

**Objective**: Verify preview handles API errors gracefully

### Steps
1. Open DevTools Network tab
2. Throttle network to "Slow 3G"
3. Navigate to admin dashboard
4. Observe preview loading state
5. Restore network
6. Observe preview loads successfully
7. Simulate API error (modify /api/wedding/preview to return 500)
8. Refresh dashboard
9. Observe error handling

### Expected Results
✅ Loading spinner shows while fetching
✅ "Loading preview..." message displays
✅ On error: Graceful error message (not blank screen)
✅ On success: Preview displays correctly
✅ No infinite loading states

### Pass Criteria
- Loading states work
- Error states display user-friendly message
- No console spam

---

## Accessibility Testing

### Keyboard Navigation
1. Tab through preview elements
2. Verify focus indicators
3. Test interactive elements (links, buttons)

### Screen Reader
1. Use VoiceOver (Mac) or NVDA (Windows)
2. Navigate through preview
3. Verify content is announced correctly

### Color Contrast
1. Use DevTools Lighthouse
2. Run accessibility audit
3. Verify no contrast issues

---

## Browser Compatibility

Test in:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

---

## Regression Testing

Verify existing functionality still works:
- ✅ Admin dashboard loads
- ✅ Feature toggle switches work
- ✅ Wedding configuration forms work
- ✅ Other admin features unaffected

---

## Performance Benchmarks

| Metric | Target | Measurement |
|--------|--------|-------------|
| Initial preview load | < 1s | DevTools Network |
| Toggle response time | < 300ms | DevTools Performance |
| Memory usage | Stable | DevTools Memory |
| Preview scroll FPS | 60 fps | DevTools Performance |

---

## Defect Reporting Template

```
**Title**: [Brief description]
**Scenario**: [Which test scenario]
**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Expected**: [What should happen]
**Actual**: [What actually happened]
**Browser**: [Chrome/Firefox/Safari/Edge + version]
**Screenshots**: [Attach if applicable]
**Console Errors**: [Paste errors if any]
```

---

## Sign-Off Checklist

- [ ] All 15 test scenarios passed
- [ ] No console errors
- [ ] Performance benchmarks met
- [ ] Accessibility audit passed
- [ ] Browser compatibility confirmed
- [ ] No regressions in existing features
- [ ] Documentation updated

**Tested by**: _____________
**Date**: _____________
**Approved by**: _____________
