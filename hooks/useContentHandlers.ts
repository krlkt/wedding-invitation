/**
 * Content Handlers Hook
 *
 * Centralizes all content update logic for the dashboard.
 * Groups section updates and feature toggles into a clean API.
 */

import { useMemo } from 'react';
import type { StartingSectionContent } from '@/db/schema/starting-section';
import type { GroomSectionContent } from '@/db/schema/groom-section';
import type { BrideSectionContent } from '@/db/schema/bride-section';
import type { FAQItem, LoveStorySegment } from '@/db/schema/content';
import type { GroomBrideSectionPhoto } from '@/db/schema/section-photo-types';
import { parsePhotos, stringifyPhotos } from '@/lib/section-photos';
import { useSnackbar } from '@/context/SnackbarContext';
import type { RefetchActions } from '@/lib/admin/types';

// Input types for handlers (forms send data in different format than DB schema)
type StartingSectionInput = Partial<
  Omit<StartingSectionContent, 'id' | 'createdAt' | 'updatedAt'>
> & {
  file?: File;
};

type GroomSectionInput = Partial<
  Omit<GroomSectionContent, 'id' | 'createdAt' | 'updatedAt' | 'photos'>
> & {
  photos?: GroomBrideSectionPhoto[] | string | null;
};

type BrideSectionInput = Partial<
  Omit<BrideSectionContent, 'id' | 'createdAt' | 'updatedAt' | 'photos'>
> & {
  photos?: GroomBrideSectionPhoto[] | string | null;
};

// Section handler structure - generic interface for all section handlers
interface SectionHandler<TContent, TInput = Partial<TContent>> {
  content: TContent | null;
  update: (updates: TInput) => Promise<void>;
  refetch: () => Promise<void>;
}

// FAQ section handler has a different update signature
interface FAQSectionHandler {
  content: FAQItem[] | null;
  update: (updates: { updated: Partial<FAQItem>[]; deleted: string[] }) => Promise<void>;
  refetch: () => Promise<void>;
}

// Love Story section handler (similar to FAQ)
interface LoveStorySectionHandler {
  content: LoveStorySegment[] | null;
  update: (updates: { updated: Partial<LoveStorySegment>[]; deleted: string[] }) => Promise<void>;
  refetch: () => Promise<void>;
}

// Features handler structure
interface FeaturesHandler {
  toggle: (featureName: string, isEnabled: boolean) => Promise<void>;
  batchUpdate: (features: Record<string, boolean>) => Promise<void>;
}

// Return type for this hook
export interface UseContentHandlersReturn {
  startingSection: SectionHandler<StartingSectionContent, StartingSectionInput>;
  groomSection: SectionHandler<GroomSectionContent, GroomSectionInput>;
  brideSection: SectionHandler<BrideSectionContent, BrideSectionInput>;
  faqSection: FAQSectionHandler;
  loveStorySection: LoveStorySectionHandler;
  features: FeaturesHandler;
}

interface UseContentHandlersOptions {
  startingSectionContent: StartingSectionContent | null;
  groomSectionContent: GroomSectionContent | null;
  brideSectionContent: BrideSectionContent | null;
  faqSectionContent: FAQItem[] | null;
  loveStoryContent: LoveStorySegment[] | null;
  setSaving: (saving: boolean) => void;
  refetch: RefetchActions;
  triggerRefresh: () => void;
}

export function useContentHandlers({
  startingSectionContent,
  groomSectionContent,
  brideSectionContent,
  faqSectionContent,
  loveStoryContent,
  setSaving,
  refetch,
  triggerRefresh,
}: UseContentHandlersOptions): UseContentHandlersReturn {
  const { showError } = useSnackbar();

  // Starting section handlers
  const startingSection = useMemo(
    () => ({
      content: startingSectionContent,
      update: async (updates: StartingSectionInput) => {
        try {
          setSaving(true);

          // Handle file upload separately if present
          if (updates.file) {
            const formData = new FormData();
            formData.append('file', updates.file);

            const uploadResponse = await fetch('/api/wedding/starting-section/upload', {
              method: 'POST',
              body: formData,
            });

            if (!uploadResponse.ok) {
              throw new Error('File upload failed');
            }
          }

          // Update text content
          const { file: _file, ...contentUpdates } = updates;
          const response = await fetch('/api/wedding/starting-section', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contentUpdates),
          });

          if (response.ok) {
            await refetch.startingSection();
            triggerRefresh();
          }
        } catch (error) {
          console.error('Failed to update starting section:', error);
          showError('Failed to update starting section. Please try again.');
        } finally {
          setSaving(false);
        }
      },
      refetch: refetch.startingSection,
    }),
    [startingSectionContent, refetch, setSaving, showError, triggerRefresh]
  );

  // Groom section handlers
  const groomSection = useMemo(
    () => ({
      content: groomSectionContent,
      update: async (updates: GroomSectionInput) => {
        try {
          setSaving(true);

          // Convert photos array to JSON string if present, or keep as-is if already string
          const dataToSend: any = { ...updates };
          if (updates.photos) {
            if (Array.isArray(updates.photos)) {
              dataToSend.photos = stringifyPhotos(updates.photos);
            } else if (typeof updates.photos === 'string') {
              dataToSend.photos = parsePhotos(updates.photos);
            }
          }

          const response = await fetch('/api/wedding/groom-section', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend),
          });

          if (response.ok) {
            await refetch.groomSection();
            triggerRefresh();
          } else {
            // Show detailed error from API
            const errorData = await response.json();
            console.error('API error:', errorData);
            showError(
              `Failed to update groom section: ${errorData.error ?? 'Unknown error'}${errorData.details ? ` - ${JSON.stringify(errorData.details)}` : ''}`
            );
          }
        } catch (error) {
          console.error('Failed to update groom section:', error);
          showError('Failed to update groom section. Please try again.');
        } finally {
          setSaving(false);
        }
      },
      refetch: refetch.groomSection,
    }),
    [groomSectionContent, refetch, setSaving, showError, triggerRefresh]
  );

  // Bride section handlers
  const brideSection = useMemo(
    () => ({
      content: brideSectionContent,
      update: async (updates: BrideSectionInput) => {
        try {
          setSaving(true);

          // Convert photos array to JSON string if present, or keep as-is if already string
          const dataToSend: any = { ...updates };
          if (updates.photos) {
            if (Array.isArray(updates.photos)) {
              dataToSend.photos = stringifyPhotos(updates.photos);
            } else if (typeof updates.photos === 'string') {
              dataToSend.photos = parsePhotos(updates.photos);
            }
          }

          const response = await fetch('/api/wedding/bride-section', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend),
          });

          if (response.ok) {
            await refetch.brideSection();
            triggerRefresh();
          } else {
            // Show detailed error from API
            const errorData = await response.json();
            console.error('API error:', errorData);
            showError(
              `Failed to update bride section: ${errorData.error ?? 'Unknown error'}${errorData.details ? ` - ${JSON.stringify(errorData.details)}` : ''}`
            );
          }
        } catch (error) {
          console.error('Failed to update bride section:', error);
          showError('Failed to update bride section. Please try again.');
        } finally {
          setSaving(false);
        }
      },
      refetch: refetch.brideSection,
    }),
    [brideSectionContent, refetch, setSaving, showError, triggerRefresh]
  );

  // FAQ section handlers
  const faqSection = useMemo(
    () => ({
      content: faqSectionContent,
      update: async (updates: { updated: Partial<FAQItem>[]; deleted: string[] }) => {
        try {
          setSaving(true);

          const response = await fetch('/api/wedding/faqs/batch', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ updated: updates.updated, deleted: updates.deleted }),
          });

          if (response.ok) {
            await refetch.faqs();
            triggerRefresh();
          } else {
            // Show detailed error from API
            const errorData = await response.json();
            console.error('API error:', errorData);
            showError(
              `Failed to update FAQ section: ${errorData.error ?? 'Unknown error'}${errorData.details ? ` - ${JSON.stringify(errorData.details)}` : ''}`
            );
          }
        } catch (error) {
          console.error('Failed to FAQ section:', error);
          showError('Failed to update FAQ section. Please try again.');
        } finally {
          setSaving(false);
        }
      },
      refetch: refetch.faqs,
    }),
    [faqSectionContent, refetch, setSaving, showError, triggerRefresh]
  );

  // Love Story section handlers
  const loveStorySection = useMemo(
    () => ({
      content: loveStoryContent,
      update: async (updates: { updated: Partial<LoveStorySegment>[]; deleted: string[] }) => {
        try {
          setSaving(true);

          const response = await fetch('/api/wedding/love-story/batch', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ updated: updates.updated, deleted: updates.deleted }),
          });

          if (response.ok) {
            await refetch.loveStory();
            triggerRefresh();
          } else {
            // Show detailed error from API
            const errorData = await response.json();
            console.error('API error:', errorData);
            showError(
              `Failed to update love story: ${errorData.error ?? 'Unknown error'}${errorData.details ? ` - ${JSON.stringify(errorData.details)}` : ''}`
            );
          }
        } catch (error) {
          console.error('Failed to update love story:', error);
          showError('Failed to update love story. Please try again.');
        } finally {
          setSaving(false);
        }
      },
      refetch: refetch.loveStory,
    }),
    [loveStoryContent, refetch, setSaving, showError, triggerRefresh]
  );

  // Feature toggle handlers
  const features = useMemo(
    () => ({
      toggle: async (featureName: string, isEnabled: boolean) => {
        try {
          const response = await fetch('/api/wedding/config/features', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ featureName, isEnabled }),
          });

          if (response.ok) {
            await refetch.config();
            triggerRefresh();
          }
        } catch (error) {
          console.error('Failed to toggle feature:', error);
        }
      },
      batchUpdate: async (features: Record<string, boolean>) => {
        try {
          setSaving(true);
          const response = await fetch('/api/wedding/config/features', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ features }),
          });

          if (response.ok) {
            await refetch.config();
            triggerRefresh();
          }
        } catch (error) {
          console.error('Failed to update features:', error);
        } finally {
          setSaving(false);
        }
      },
    }),
    [refetch, setSaving, triggerRefresh]
  );

  return {
    startingSection,
    groomSection,
    brideSection,
    faqSection,
    loveStorySection,
    features,
  };
}
