/**
 * Draft State Management Context
 *
 * Centralized draft state for all wedding configuration sections.
 * Prevents loss of unsaved changes when switching between sections.
 *
 * Features:
 * - Type-safe draft storage for all sections
 * - Per-section draft management
 * - Global draft status tracking
 * - Easy to add new sections
 */

'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { StartingSectionContent } from '@/db/schema/starting-section';
import type { GroomSectionContent } from '@/db/schema/groom-section';
import type { BrideSectionContent } from '@/db/schema/bride-section';
import { FAQItem, LoveStorySegment } from '@/db/schema/content';

// Define all section draft types here as you build them
export type DraftState = {
  startingSection?: Partial<StartingSectionContent>;
  groomSection?: Partial<GroomSectionContent>;
  brideSection?: Partial<BrideSectionContent>;
  faqs?: Partial<FAQItem>[];
  loveStory?: Partial<LoveStorySegment>[];
  // Add more sections as you implement them:
  // locations?: Partial<LocationContent>
  // rsvp?: Partial<RSVPContent>
  // gallery?: Partial<GalleryContent>
  // preweddingVideos?: Partial<PreweddingVideosContent>
  // faqs?: Partial<FAQContent>
  // dressCode?: Partial<DressCodeContent>
  // gift?: Partial<GiftContent>
  // wishes?: Partial<WishesContent>
  // footer?: Partial<FooterContent>
};

type DraftContextType = {
  drafts: DraftState;
  setDraft: <K extends keyof DraftState>(
    section: K,
    data: DraftState[K] | ((prev: DraftState[K]) => DraftState[K])
  ) => void;
  clearDraft: (section: keyof DraftState) => void;
  clearAllDrafts: () => void;
  hasDraft: (section: keyof DraftState) => boolean;
  hasAnyDrafts: () => boolean;
};

const DraftContext = createContext<DraftContextType | undefined>(undefined);

interface DraftProviderProps {
  children: ReactNode;
}

export function DraftProvider({ children }: DraftProviderProps) {
  const [drafts, setDrafts] = useState<DraftState>({});

  // Set draft for a specific section (supports functional updates)
  const setDraft = useCallback(
    <K extends keyof DraftState>(
      section: K,
      data: DraftState[K] | ((prev: DraftState[K]) => DraftState[K])
    ) => {
      setDrafts((prev) => {
        const currentValue = prev[section];
        const newValue = typeof data === 'function' ? data(currentValue) : data;
        return {
          ...prev,
          [section]: newValue,
        };
      });
    },
    []
  );

  // Clear draft for a specific section
  const clearDraft = useCallback((section: keyof DraftState) => {
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[section];
      return next;
    });
  }, []);

  // Clear all drafts (useful for global "Discard All" or after publish)
  const clearAllDrafts = useCallback(() => {
    setDrafts({});
  }, []);

  // Check if a specific section has unsaved changes
  const hasDraft = useCallback(
    (section: keyof DraftState) => {
      return drafts[section] !== undefined && drafts[section] !== null;
    },
    [drafts]
  );

  // Check if any section has unsaved changes (for global warning)
  const hasAnyDrafts = useCallback(() => {
    return Object.keys(drafts).length > 0;
  }, [drafts]);

  return (
    <DraftContext.Provider
      value={{
        drafts,
        setDraft,
        clearDraft,
        clearAllDrafts,
        hasDraft,
        hasAnyDrafts,
      }}
    >
      {children}
    </DraftContext.Provider>
  );
}

/**
 * Custom hook to access draft state for a specific section
 *
 * @example
 * const { draft, setDraft, clearDraft, hasDraft } = useDraft('startingSection')
 */
export function useDraft<K extends keyof DraftState>(section: K) {
  const context = useContext(DraftContext);

  if (!context) {
    throw new Error('useDraft must be used within a DraftProvider');
  }

  const {
    drafts,
    setDraft: setDraftGlobal,
    clearDraft: clearDraftGlobal,
    hasDraft: hasDraftGlobal,
  } = context;

  return {
    draft: drafts[section],
    setDraft: useCallback(
      (data: DraftState[K] | ((prev: DraftState[K]) => DraftState[K])) =>
        setDraftGlobal(section, data),
      [section, setDraftGlobal]
    ),
    clearDraft: useCallback(() => clearDraftGlobal(section), [section, clearDraftGlobal]),
    hasDraft: useCallback(() => hasDraftGlobal(section), [section, hasDraftGlobal]),
  };
}

/**
 * Hook to access global draft state
 * Useful for showing "You have unsaved changes" warnings
 *
 * @example
 * const { hasAnyDrafts, clearAllDrafts } = useGlobalDrafts()
 */
export function useGlobalDrafts() {
  const context = useContext(DraftContext);

  if (!context) {
    throw new Error('useGlobalDrafts must be used within a DraftProvider');
  }

  return {
    hasAnyDrafts: context.hasAnyDrafts,
    clearAllDrafts: context.clearAllDrafts,
    drafts: context.drafts,
  };
}
