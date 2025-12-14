/**
 * Features Form Component
 *
 * Main form for managing wedding features and their content.
 * Uses accordion UI to toggle features and configure their content.
 */

'use client'

import { useState, useEffect, useCallback, FC } from 'react'
import { Accordion, AccordionContent, AccordionItem } from '@/components/shadcn/accordion'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { Switch } from '@/components/shadcn/switch'

import { useDraft } from '@/context/DraftContext'
import { useSnackbar } from '@/context/SnackbarContext'
import { useChangeTracking } from '@/hooks/useChangeTracking'
import { FEATURE_DEFINITIONS } from '@/lib/admin/feature-definitions'
import { updateChangedFieldsSet } from '@/lib/field-validation'
import type { FAQItem } from '@/db/schema/content'

import { UnsavedChangesBar } from './UnsavedChangesBar'
import { StartingSectionForm } from './sections/StartingSectionForm'
import { GroomSectionForm } from './sections/GroomSectionForm'
import { BrideSectionForm } from './sections/BrideSectionForm'
import { FAQForm } from './sections/FAQForm'
import type {
  WeddingConfigWithFeatures,
  UseContentHandlersReturn,
  UsePhotoUploadHandlersReturn,
} from '@/lib/admin/types'

interface FeaturesFormProps {
  config: WeddingConfigWithFeatures
  contentHandlers: UseContentHandlersReturn
  photoHandlers: UsePhotoUploadHandlersReturn
  onRefreshPreview: () => void
  onLocalChange: (features: Record<string, boolean>) => void
  saving: boolean
}

const FeaturesForm: FC<FeaturesFormProps> = ({
  config,
  contentHandlers,
  photoHandlers,
  onRefreshPreview,
  onLocalChange,
  saving,
}) => {
  // Draft hooks
  const { draft: draftStartingSection, clearDraft: clearStartingSectionDraft } =
    useDraft('startingSection')
  const { draft: draftGroomSection, clearDraft: clearGroomSectionDraft } = useDraft('groomSection')
  const { draft: draftBrideSection, clearDraft: clearBrideSectionDraft } = useDraft('brideSection')
  const { draft: draftFAQs, clearDraft: clearFAQsDraft } = useDraft('faqs')

  // Change tracking hook
  const {
    changedFields,
    hasUnsavedChanges,
    totalChanges,
    setChangedFields,
    clearAllChanges,
    clearSectionChanges,
  } = useChangeTracking()

  // Local state
  const [draftFeatures, setDraftFeatures] = useState<Record<string, boolean>>(config.features)
  const { showSuccess, showError } = useSnackbar()

  // Features from constants (no hardcoding)
  const features = FEATURE_DEFINITIONS

  // Update draft state when config changes (after save)
  useEffect(() => {
    setDraftFeatures(config.features)
    clearSectionChanges('features')
  }, [config.features, clearSectionChanges])

  // Clear changed fields when section content changes (after save or discard)
  useEffect(() => {
    clearSectionChanges('startingSection')
  }, [contentHandlers.startingSection.content, clearSectionChanges])

  useEffect(() => {
    clearSectionChanges('groomSection')
  }, [contentHandlers.groomSection.content, clearSectionChanges])

  useEffect(() => {
    clearSectionChanges('brideSection')
  }, [contentHandlers.brideSection.content, clearSectionChanges])

  useEffect(() => {
    clearSectionChanges('faqs')
  }, [contentHandlers.faqSection.content, clearSectionChanges])

  // Simplified handlers
  const handleToggle = (featureName: string) => {
    const newValue = !draftFeatures[featureName]
    const newDraft = { ...draftFeatures, [featureName]: newValue }
    setDraftFeatures(newDraft)

    setChangedFields.features(
      updateChangedFieldsSet(
        featureName,
        newValue,
        config.features[featureName],
        changedFields.features
      )
    )

    // Update parent component for LivePreview
    onLocalChange(newDraft)
  }

  async function handleSave() {
    try {
      // Save changed features
      if (changedFields.features.size > 0) {
        const featuresToUpdate: Record<string, boolean> = {}
        changedFields.features.forEach((featureName) => {
          featuresToUpdate[featureName] = draftFeatures[featureName]
        })
        await contentHandlers.features.batchUpdate(featuresToUpdate)
      }

      // Save changed starting section content
      if (changedFields.startingSection.size > 0 && draftStartingSection) {
        await contentHandlers.startingSection.update(draftStartingSection)
        clearStartingSectionDraft()
      }

      // Save changed groom section content
      if (changedFields.groomSection.size > 0 && draftGroomSection) {
        await contentHandlers.groomSection.update(draftGroomSection)
        clearGroomSectionDraft()
      }

      // Save changed bride section content
      if (changedFields.brideSection.size > 0 && draftBrideSection) {
        await contentHandlers.brideSection.update(draftBrideSection)
        clearBrideSectionDraft()
      }

      // Save changed FAQ content
      if (changedFields.faqs.size > 0 && draftFAQs) {
        const savedIds = new Set(
          (contentHandlers.faqSection.content ?? [])
            .map((faq: FAQItem) => faq.id)
            .filter((id): id is string => id !== undefined)
        )
        const draftIds = new Set(
          draftFAQs
            .filter(
              (faq): faq is typeof faq & { id: string } =>
                !!faq.id && faq.weddingConfigId !== 'TEMP'
            )
            .map((faq) => faq.id)
        )
        const deletedIds = Array.from(savedIds).filter((id) => !draftIds.has(id))

        await contentHandlers.faqSection.update({
          updated: draftFAQs,
          deleted: deletedIds,
        })
        clearFAQsDraft()
      }

      showSuccess('Changes has been saved')
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to save changes')
    }

    onRefreshPreview()
  }

  const handleDiscard = async () => {
    setDraftFeatures(config.features)
    clearAllChanges()

    // Update parent component for LivePreview
    onLocalChange(config.features)

    clearStartingSectionDraft()
    clearGroomSectionDraft()
    clearBrideSectionDraft()
    clearFAQsDraft()

    await Promise.all([
      contentHandlers.startingSection.refetch(),
      contentHandlers.groomSection.refetch(),
      contentHandlers.brideSection.refetch(),
      contentHandlers.faqSection.refetch(),
    ])

    // Trigger preview refresh to show discarded changes
    onRefreshPreview()
  }

  // Simplified change tracking callbacks (no manual Set management)
  const handleStartingSectionChange = useCallback(
    (hasChanges: boolean, fields: Set<string>) => {
      setChangedFields.startingSection(fields)
    },
    [setChangedFields]
  )

  const handleGroomSectionChange = useCallback(
    (hasChanges: boolean, fields: Set<string>) => {
      setChangedFields.groomSection(fields)
    },
    [setChangedFields]
  )

  const handleBrideSectionChange = useCallback(
    (hasChanges: boolean, fields: Set<string>) => {
      setChangedFields.brideSection(fields)
    },
    [setChangedFields]
  )

  const handleFAQSectionChange = useCallback(
    (hasChanges: boolean, fields: Set<string>) => {
      setChangedFields.faqs(fields)
    },
    [setChangedFields]
  )

  // Render feature content (cleaner with contentHandlers)
  const renderFeatureContent = useCallback(
    (featureName: string) => {
      switch (featureName) {
        case 'hero':
          return (
            <StartingSectionForm
              weddingConfig={config}
              startingSectionContent={contentHandlers.startingSection.content}
              onUpdate={contentHandlers.startingSection.update}
              onChangeTracking={handleStartingSectionChange}
              onBackgroundUpload={photoHandlers.handleBackgroundUpload}
              onMonogramUpload={photoHandlers.handleMonogramUpload}
            />
          )

        case 'groom_and_bride':
          return (
            <div className="space-y-6">
              <div>
                <h4 className="mb-3 font-semibold text-gray-800">Groom Section</h4>
                <GroomSectionForm
                  weddingConfig={config}
                  groomSectionContent={contentHandlers.groomSection.content}
                  onUpdate={contentHandlers.groomSection.update}
                  onChangeTracking={handleGroomSectionChange}
                  onPhotoUpload={photoHandlers.handleGroomPhotoUpload}
                />
              </div>
              <div className="border-t pt-6">
                <h4 className="mb-3 font-semibold text-gray-800">Bride Section</h4>
                <BrideSectionForm
                  weddingConfig={config}
                  brideSectionContent={contentHandlers.brideSection.content}
                  onUpdate={contentHandlers.brideSection.update}
                  onChangeTracking={handleBrideSectionChange}
                  onPhotoUpload={photoHandlers.handleBridePhotoUpload}
                />
              </div>
            </div>
          )

        case 'faqs':
          return (
            <FAQForm
              weddingConfig={config}
              faqSectionContent={contentHandlers.faqSection.content}
              onChangeTracking={handleFAQSectionChange}
            />
          )

        default:
          return (
            <div className="text-sm italic text-gray-500">Content configuration coming soon...</div>
          )
      }
    },
    [
      config,
      contentHandlers,
      photoHandlers,
      handleStartingSectionChange,
      handleGroomSectionChange,
      handleBrideSectionChange,
      handleFAQSectionChange,
    ]
  )

  return (
    <>
      <div className="flex-1 overflow-y-auto p-6">
        <Accordion type="multiple" className="space-y-2">
          {features.map((feature) => {
            const isChanged = changedFields.features.has(feature.name)
            return (
              <AccordionItem
                key={feature.name}
                value={feature.name}
                className={`rounded-lg border transition-colors ${isChanged ? 'border-yellow-300 bg-yellow-50' : ''}`}
              >
                <AccordionPrimitive.Header className="relative px-4">
                  <AccordionPrimitive.Trigger className="flex w-full items-center gap-3 py-4 pl-14 text-left transition-all hover:no-underline [&[data-state=open]>svg]:rotate-180">
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{feature.label}</h3>
                        {isChanged && (
                          <span className="inline-flex items-center rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                            Modified
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-normal text-gray-500">{feature.description}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                  </AccordionPrimitive.Trigger>

                  <Switch
                    checked={draftFeatures[feature.name]}
                    onCheckedChange={() => handleToggle(feature.name)}
                    className="absolute left-4 top-1/2 z-10 -translate-y-1/2"
                  />
                </AccordionPrimitive.Header>
                <AccordionContent className="px-4 pb-4">
                  {renderFeatureContent(feature.name)}
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>

      {hasUnsavedChanges && (
        <UnsavedChangesBar
          totalChanges={totalChanges}
          onSave={handleSave}
          onDiscard={handleDiscard}
          saving={saving}
        />
      )}
    </>
  )
}

export default FeaturesForm
