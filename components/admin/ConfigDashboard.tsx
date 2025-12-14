/**
 * T065: Configuration Dashboard Interface
 *
 * Main dashboard for managing wedding configuration.
 * Includes forms for basic settings, features, and content management.
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/shadcn/button';

import LivePreview from '../LivePreview';
import FeaturesForm from './FeaturesForm';
import { DraftProvider, useDraft } from '@/context/DraftContext';
import { useWeddingDashboardData } from '@/hooks/useWeddingDashboardData';
import { usePhotoUploadHandlers } from '@/hooks/usePhotoUploadHandlers';
import { useContentHandlers } from '@/hooks/useContentHandlers';

export default function ConfigDashboard() {
  return (
    <DraftProvider>
      <div className="relative flex h-full overflow-hidden bg-gray-100">
        <ConfigDashboardContent />
      </div>
    </DraftProvider>
  );
}

function ConfigDashboardContent() {
  const [saving, setSaving] = useState(false);
  const [draftFeatures, setDraftFeatures] = useState<Record<string, boolean> | undefined>(
    undefined
  );

  // Draft hooks
  const { draft: draftStartingSection, setDraft: setDraftStartingSection } =
    useDraft('startingSection');
  const { draft: draftGroomSection, setDraft: setDraftGroomSection } = useDraft('groomSection');
  const { draft: draftBrideSection, setDraft: setDraftBrideSection } = useDraft('brideSection');
  const { draft: draftFAQs } = useDraft('faqs');

  // Data fetching hook
  const {
    config,
    startingSectionContent,
    groomSectionContent,
    brideSectionContent,
    faqSectionContent,
    loading,
    refreshTrigger,
    refetch,
    triggerRefresh,
  } = useWeddingDashboardData();

  // Content handlers hook
  const contentHandlers = useContentHandlers({
    startingSectionContent,
    groomSectionContent,
    brideSectionContent,
    faqSectionContent,
    setSaving,
    refetch,
    triggerRefresh,
  });

  // Photo upload handlers hook (replaces 4 photo handlers)
  const photoHandlers = usePhotoUploadHandlers({
    draftStartingSection,
    setDraftStartingSection,
    draftGroomSection,
    groomSectionContent,
    setDraftGroomSection,
    draftBrideSection,
    brideSectionContent,
    setDraftBrideSection,
    onRefresh: triggerRefresh,
    refetchConfig: refetch.config,
  });

  if (loading) {
    return (
      <div className="flex h-full min-h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-pink-600" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return <div className="p-8 text-center">No configuration found</div>;
  }

  return (
    <>
      {/* Left Panel - Configuration */}
      <div className="flex w-1/2 flex-col overflow-y-auto border-r bg-white">
        <div className="sticky top-0 z-10 border-b bg-white">
          <div className="p-6">
            <div className="mb-2 flex items-center justify-between">
              <h1 className="text-2xl font-bold">Wedding Configuration</h1>
              <Button asChild>
                <Link href="/preview" target="_blank">
                  View Live Site
                </Link>
              </Button>
            </div>
            <p className="text-sm text-gray-600">{config.subdomain}.oial-wedding.com</p>
          </div>
        </div>

        <FeaturesForm
          config={config}
          contentHandlers={contentHandlers}
          photoHandlers={photoHandlers}
          onRefreshPreview={triggerRefresh}
          onLocalChange={setDraftFeatures}
          saving={saving}
        />
      </div>

      {/* Right Panel - Live Preview */}
      <div className="h-full w-1/2 overflow-hidden">
        <LivePreview
          weddingConfigId={config.id}
          refreshTrigger={refreshTrigger}
          draftFeatures={draftFeatures}
          draftStartingSection={draftStartingSection}
          draftGroomSection={draftGroomSection}
          draftBrideSection={draftBrideSection}
          draftFAQs={draftFAQs}
        />
      </div>
    </>
  );
}
