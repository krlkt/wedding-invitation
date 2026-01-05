/**
 * Wedding Dashboard Data Hook
 *
 * Centralizes all data fetching logic for the wedding configuration dashboard.
 * Manages config, section content, and provides refetch actions.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { StartingSectionContent } from '@/db/schema/starting-section';
import type { GroomSectionContent } from '@/db/schema/groom-section';
import type { BrideSectionContent } from '@/db/schema/bride-section';
import type { FAQItem, LoveStorySegment } from '@/db/schema/content';
import type { WeddingConfigWithFeatures, RefetchActions } from '@/lib/admin/types';

// Return type for this hook
export interface UseWeddingDashboardDataReturn {
  config: WeddingConfigWithFeatures | null;
  startingSectionContent: StartingSectionContent | null;
  groomSectionContent: GroomSectionContent | null;
  brideSectionContent: BrideSectionContent | null;
  faqSectionContent: FAQItem[] | null;
  loveStoryContent: LoveStorySegment[] | null;
  loading: boolean;
  refreshTrigger: number;
  refetch: RefetchActions;
  triggerRefresh: () => void;
}

export function useWeddingDashboardData(): UseWeddingDashboardDataReturn {
  const [config, setConfig] = useState<WeddingConfigWithFeatures | null>(null);
  const [startingSectionContent, setStartingSectionContent] =
    useState<StartingSectionContent | null>(null);
  const [groomSectionContent, setGroomSectionContent] = useState<GroomSectionContent | null>(null);
  const [brideSectionContent, setBrideSectionContent] = useState<BrideSectionContent | null>(null);
  const [faqSectionContent, setFAQSectionContent] = useState<FAQItem[] | null>(null);
  const [loveStoryContent, setLoveStoryContent] = useState<LoveStorySegment[] | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // WIP: session check on dashboard load or time interval or user action?
  const checkSession = async () => {
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      if (!data.success) {
        window.location.href = '/login';
      }
    } catch (err) {
      console.error('Session check failed', err);
      window.location.href = '/login';
    }
  };

  const fetchConfig = useCallback(async () => {
    try {
      const response = await fetch('/api/wedding/config');
      if (response.ok) {
        const data = await response.json();
        setConfig(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch config:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStartingSection = useCallback(async () => {
    try {
      const response = await fetch('/api/wedding/starting-section');
      if (response.ok) {
        const data = await response.json();
        setStartingSectionContent(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch starting section content:', error);
    }
  }, []);

  const fetchGroomSection = useCallback(async () => {
    try {
      const response = await fetch('/api/wedding/groom-section');
      if (response.ok) {
        const data = await response.json();
        setGroomSectionContent(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch groom section content:', error);
    }
  }, []);

  const fetchBrideSection = useCallback(async () => {
    try {
      const response = await fetch('/api/wedding/bride-section');
      if (response.ok) {
        const data = await response.json();
        setBrideSectionContent(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch bride section content:', error);
    }
  }, []);

  const fetchFaqs = useCallback(async () => {
    try {
      const res = await fetch('/api/wedding/faqs');
      if (res.ok) {
        const data = await res.json();
        setFAQSectionContent(data.data);
      }
    } catch (err) {
      console.error('Error fetching FAQs', err);
    }
  }, []);

  const fetchLoveStory = useCallback(async () => {
    try {
      const res = await fetch('/api/wedding/love-story');
      if (res.ok) {
        const data = await res.json();
        setLoveStoryContent(data.data);
      }
    } catch (err) {
      console.error('Error fetching love story', err);
    }
  }, []);

  // Grouped refetch actions
  const refetch = useMemo(
    () => ({
      all: async () => {
        await Promise.all([
          fetchConfig(),
          fetchStartingSection(),
          fetchGroomSection(),
          fetchBrideSection(),
          fetchFaqs(),
          fetchLoveStory(),
        ]);
      },
      config: fetchConfig,
      startingSection: fetchStartingSection,
      groomSection: fetchGroomSection,
      brideSection: fetchBrideSection,
      faqs: fetchFaqs,
      loveStory: fetchLoveStory,
    }),
    [
      fetchConfig,
      fetchStartingSection,
      fetchGroomSection,
      fetchBrideSection,
      fetchFaqs,
      fetchLoveStory,
    ]
  );

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Initialize data on mount
  useEffect(() => {
    (async () => {
      await checkSession();
      await refetch.all();
    })().catch((error) => {
      console.error('Initialization error:', error);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    config,
    startingSectionContent,
    groomSectionContent,
    brideSectionContent,
    faqSectionContent,
    loveStoryContent,
    loading,
    refreshTrigger,
    refetch,
    triggerRefresh,
  };
}
