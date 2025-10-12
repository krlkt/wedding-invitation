# Research: Template-Based Live Preview with Feature Toggle Integration

**Feature**: OIALT-8 | **Date**: 2025-10-12
**Context**: Transform LivePreview from placeholder text to real template rendering with feature toggles

---

## 1. Component Reusability Pattern

### Decision
**Approach**: Create a preview-specific wrapper component (Template1Preview) that replicates the InvitationPage.tsx structure but with conditional rendering based on feature toggles. Do NOT extract/refactor existing InvitationPage components.

### Rationale
1. **Preserve Guest Experience**: InvitationPage.tsx should remain unchanged to avoid regression risks
2. **Different Data Requirements**: Preview needs to handle missing/placeholder data gracefully, while guest view expects complete data
3. **Conditional Logic**: Preview needs feature toggle logic; guest view does not
4. **Future Templates**: Clean separation allows Template1Preview to be one of many template implementations

### Implementation Pattern
```typescript
// Template1Preview.tsx
export default function Template1Preview({ config }: Template1PreviewProps) {
  const { weddingConfig, features, content } = config;

  return (
    <>
      {/* Hero - Always visible */}
      <Hero {...heroProps} />

      {/* Conditional sections based on features */}
      {features.love_story && content.loveStory && (
        <section>
          <Timeline items={content.loveStory} />
        </section>
      )}

      {features.rsvp && (
        <section>
          <RSVPForm rsvp={mockRSVP} isPreview={true} />
        </section>
      )}

      {/* ... other sections */}
    </>
  );
}
```

### Alternatives Considered
- **Extract sections from InvitationPage**: Rejected - too risky, would require refactoring production code
- **Use InvitationPage directly with mocked props**: Rejected - requires complex prop mocking and doesn't support feature toggles cleanly

---

## 2. Feature Toggle to Component Mapping

### Decision
**Approach**: Use explicit conditional rendering with TypeScript exhaustiveness checking for feature names

### Rationale
1. **Type Safety**: TypeScript ensures all feature names are handled
2. **Readability**: Clear mapping between feature flag and rendered component
3. **Maintainability**: Easy to add new features or modify existing ones
4. **Performance**: No dynamic imports needed, all components bundled

### Implementation Pattern
```typescript
type FeatureName = 'love_story' | 'rsvp' | 'gallery' | 'prewedding_videos' | 'faqs' | 'dress_code' | 'instagram_link';

interface FeatureSection {
  name: FeatureName;
  order: number;
  component: React.ReactNode;
}

// In Template1Preview
const sections: FeatureSection[] = [
  { name: 'love_story', order: 1, component: features.love_story && <LoveStorySection /> },
  { name: 'rsvp', order: 2, component: features.rsvp && <RSVPSection /> },
  // ... ordered sections
].filter(s => s.component !== false);
```

### Alternatives Considered
- **Dynamic import mapping**: Rejected - unnecessary complexity, no lazy loading benefit for preview
- **Plugin architecture**: Rejected - over-engineering for current needs

---

## 3. Preview Scaling & Styling

### Decision
**Approach**: CSS `transform: scale()` with explicit container dimensions and `overflow: auto` for scrolling

### Rationale
1. **Simplicity**: Single CSS transform, no iframe overhead
2. **Interactivity**: Maintains all event handling and interactions
3. **Consistency**: Already used in current LivePreview component
4. **Scrollability**: Users can scroll preview naturally

### Implementation Pattern
```css
.preview-container {
  transform: scale(0.65);
  transform-origin: top center;
  width: 450px; /* Match mobile width */
  overflow-y: auto;
  overflow-x: hidden;
}
```

### Alternatives Considered
- **Iframe**: Rejected - adds complexity, style isolation issues, messaging overhead
- **Viewport meta tag manipulation**: Rejected - doesn't work in dashboard context
- **Canvas rendering**: Rejected - loses interactivity

---

## 4. Template Architecture

### Decision
**Approach**: Simple strategy pattern with template ID mapping. Create `TemplateRenderer` component that accepts `templateId` prop.

### Rationale
1. **Future-Proof**: Easy to add Template 2, 3, etc. without modifying existing code
2. **Type-Safe**: TypeScript ensures valid template IDs
3. **Encapsulation**: Each template is self-contained
4. **Testing**: Easy to test individual templates

### Implementation Pattern
```typescript
// app/models/template.ts
export type TemplateId = 'template-1' | 'template-2';

export interface TemplateRegistry {
  [key: string]: React.ComponentType<TemplateProps>;
}

// app/components/preview/TemplateRenderer.tsx
const TEMPLATES: TemplateRegistry = {
  'template-1': Template1Preview,
  // Future templates added here
};

export default function TemplateRenderer({ templateId = 'template-1', config }: Props) {
  const TemplateComponent = TEMPLATES[templateId];

  if (!TemplateComponent) {
    return <div>Template not found</div>;
  }

  return <TemplateComponent config={config} />;
}
```

### Alternatives Considered
- **Plugin system with dynamic imports**: Rejected - unnecessary complexity for foreseeable future
- **Database-driven template configuration**: Rejected - templates are code, not data

---

## 5. Data Fetching for Preview Content

### Decision
**Approach**: Create new unified endpoint `/api/wedding/preview` that returns all preview data in a single request

### Rationale
1. **Performance**: Single network request vs. 7+ separate requests
2. **Atomicity**: All data fetched at once, consistent snapshot
3. **Simplicity**: Preview component makes one fetch call
4. **Optimized Payload**: Only return data needed for enabled features

### Implementation Pattern
```typescript
// GET /api/wedding/preview
// Response structure
{
  data: {
    config: WeddingConfiguration,
    features: {
      love_story: boolean,
      rsvp: boolean,
      // ... all features
    },
    content: {
      loveStory: LoveStoryItem[],      // if love_story enabled
      gallery: GalleryPhoto[],          // if gallery enabled
      faqs: FAQ[],                      // if faqs enabled
      dressCode: DressCode,             // if dress_code enabled
      locations: Location[],            // always included
      bankDetails: BankDetail[],        // always included
    }
  }
}
```

### Endpoint Logic
- Query feature_toggles table
- For each enabled feature, fetch corresponding content
- Return consolidated response
- Cache for 30 seconds (preview doesn't need real-time data)

### Alternatives Considered
- **Reuse existing /api/wedding/config + individual endpoints**: Rejected - too many requests, slower preview load
- **Client-side aggregation**: Rejected - more complex, error-prone
- **GraphQL**: Rejected - over-engineering, adds dependency

---

## 6. Handling Missing/Incomplete Data

### Decision
**Approach**: Three-tier fallback system:
1. Empty state components for missing content
2. Mock/placeholder data for required props
3. Graceful section hiding for critical failures

### Rationale
1. **User Experience**: Always show something, never blank screen
2. **Development**: Easier to identify missing data
3. **Flexibility**: Works with partial configurations

### Implementation Pattern
```typescript
// Empty state example
{features.love_story && (
  <LoveStorySection>
    {content.loveStory?.length > 0 ? (
      <Timeline items={content.loveStory} />
    ) : (
      <EmptyState message="Add your love story in the Love Story section" />
    )}
  </LoveStorySection>
)}

// Mock data for required props
const mockRSVP = {
  guestName: 'Preview Guest',
  attendance: null,
  mealPreference: null,
};
```

### Alternatives Considered
- **Error boundaries for each section**: Rejected - too heavyweight
- **Loading skeletons**: Rejected - preview should load complete data upfront

---

## 7. Smooth Scroll Handling (Lenis)

### Decision
**Approach**: Disable Lenis smooth scroll in preview context. Use native browser scrolling.

### Rationale
1. **Simplicity**: Avoid Lenis initialization overhead in preview
2. **Performance**: Native scroll is faster
3. **Dashboard Context**: Preview is scaled and contained, Lenis benefits minimal
4. **Compatibility**: Avoids scroll conflicts with dashboard layout

### Implementation Pattern
```typescript
// Template1Preview.tsx - NO Lenis initialization
// Just use CSS overflow: auto for natural scrolling
```

### Alternatives Considered
- **Initialize Lenis in preview**: Rejected - adds complexity, little benefit in scaled preview
- **Conditional Lenis init**: Rejected - unnecessary code path

---

## 8. Performance Optimizations

### Decision
**Approach**: React.memo for section components + debounced refresh trigger

### Rationale
1. **Avoid Re-renders**: Section components don't re-render unless their data changes
2. **Smooth UX**: Debounce prevents flickering during rapid toggle changes
3. **Bundle Size**: No additional dependencies needed

### Implementation Pattern
```typescript
// Memoized section components
const LoveStorySection = React.memo(({ items }: Props) => { /* ... */ });
const GallerySection = React.memo(({ photos }: Props) => { /* ... */ });

// Debounced refresh in LivePreview
const debouncedRefresh = useMemo(
  () => debounce(() => setRefreshTrigger(prev => prev + 1), 300),
  []
);
```

### Alternatives Considered
- **Virtual scrolling**: Rejected - preview height reasonable, not needed
- **Lazy loading sections**: Rejected - want instant preview update

---

## Summary of Decisions

| Area | Decision | Key Benefit |
|------|----------|-------------|
| Component Reuse | Duplicate structure, don't extract | Preserves production code stability |
| Feature Mapping | Explicit conditional rendering | Type-safe, readable |
| Scaling | CSS transform: scale() | Simple, interactive |
| Template Architecture | Strategy pattern with registry | Easy to extend |
| Data Fetching | Unified /api/wedding/preview endpoint | Single request, faster |
| Missing Data | Empty states + mocks | Graceful degradation |
| Smooth Scroll | Disable Lenis in preview | Better performance |
| Performance | React.memo + debounced refresh | Smooth UX |

---

## Next Steps (Phase 1)
1. Create data-model.md with TypeScript interfaces
2. Create API contract for /api/wedding/preview
3. Create quickstart.md with test scenarios
4. Update CLAUDE.md with new components
