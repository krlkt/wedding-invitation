/**
 * Change Tracking Hook
 *
 * Centralizes change tracking logic for all dashboard sections.
 * Provides single source of truth for tracking which fields have changed,
 * with auto-calculated values for unsaved changes state.
 */

import { useState, useCallback, useMemo } from 'react';

export interface ChangeTrackingState {
  features: Set<string>;
  startingSection: Set<string>;
  groomSection: Set<string>;
  brideSection: Set<string>;
  faqs: Set<string>;
}

export function useChangeTracking() {
  const [changedFields, setChangedFieldsState] = useState<ChangeTrackingState>({
    features: new Set(),
    startingSection: new Set(),
    groomSection: new Set(),
    brideSection: new Set(),
    faqs: new Set(),
  });

  // Setters for each section
  const setChangedFields = useMemo(
    () => ({
      features: (fields: Set<string>) =>
        setChangedFieldsState((prev) => ({ ...prev, features: fields })),
      startingSection: (fields: Set<string>) =>
        setChangedFieldsState((prev) => ({ ...prev, startingSection: fields })),
      groomSection: (fields: Set<string>) =>
        setChangedFieldsState((prev) => ({ ...prev, groomSection: fields })),
      brideSection: (fields: Set<string>) =>
        setChangedFieldsState((prev) => ({ ...prev, brideSection: fields })),
      faqs: (fields: Set<string>) => setChangedFieldsState((prev) => ({ ...prev, faqs: fields })),
    }),
    []
  );

  // Auto-calculated values
  const hasUnsavedChanges = useMemo(() => {
    return Object.values(changedFields).some((set) => set.size > 0);
  }, [changedFields]);

  const totalChanges = useMemo(() => {
    return Object.values(changedFields).reduce((sum, set) => sum + set.size, 0);
  }, [changedFields]);

  // Clear all changes
  const clearAllChanges = useCallback(() => {
    setChangedFieldsState({
      features: new Set(),
      startingSection: new Set(),
      groomSection: new Set(),
      brideSection: new Set(),
      faqs: new Set(),
    });
  }, []);

  // Clear specific section changes
  const clearSectionChanges = useCallback((section: keyof ChangeTrackingState) => {
    setChangedFieldsState((prev) => ({ ...prev, [section]: new Set() }));
  }, []);

  return {
    changedFields,
    hasUnsavedChanges,
    totalChanges,
    setChangedFields,
    clearAllChanges,
    clearSectionChanges,
  };
}
