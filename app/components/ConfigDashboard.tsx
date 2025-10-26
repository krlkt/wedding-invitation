/**
 * T065: Configuration Dashboard Interface
 *
 * Main dashboard for managing wedding configuration.
 * Includes forms for basic settings, features, and content management.
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import LivePreview from './LivePreview'
import { StartingSectionForm } from './admin/sections/StartingSectionForm'
import type { StartingSectionContent } from '@/app/db/schema/starting-section'

export default function ConfigDashboard() {
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [draftFeatures, setDraftFeatures] = useState<Record<string, boolean> | undefined>(undefined)
  const [startingSectionContent, setStartingSectionContent] =
    useState<StartingSectionContent | null>(null)
  const [draftStartingSection, setDraftStartingSection] = useState<
    Partial<StartingSectionContent> | undefined
  >(undefined)

  //WIP: session check on dashboard load or time interval or user action?
  const checkSession = async () => {
    try {
      const res = await fetch('/api/auth/session')
      const data = await res.json()
      if (!data.success) {
        window.location.href = '/login'
      }
    } catch (err) {
      console.error('Session check failed', err)
      window.location.href = '/login'
    }
  }

  useEffect(() => {
    fetchConfig()
    fetchStartingSectionContent()
    checkSession()
  }, [])

  async function fetchConfig() {
    try {
      const response = await fetch('/api/wedding/config')
      if (response.ok) {
        const data = await response.json()
        setConfig(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch config:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchStartingSectionContent() {
    try {
      const response = await fetch('/api/wedding/starting-section')
      if (response.ok) {
        const data = await response.json()
        setStartingSectionContent(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch starting section content:', error)
    }
  }

  async function updateStartingSectionContent(updates: any) {
    try {
      setSaving(true)

      // Handle file upload separately if present
      if (updates.file) {
        const formData = new FormData()
        formData.append('file', updates.file)

        const uploadResponse = await fetch('/api/wedding/starting-section/upload', {
          method: 'POST',
          body: formData,
        })

        if (!uploadResponse.ok) {
          throw new Error('File upload failed')
        }
      }

      // Update text content
      const { file, ...contentUpdates } = updates
      const response = await fetch('/api/wedding/starting-section', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contentUpdates),
      })

      if (response.ok) {
        await fetchStartingSectionContent()
        setRefreshTrigger((prev) => prev + 1)
      }
    } catch (error) {
      console.error('Failed to update starting section:', error)
      alert('Failed to update starting section. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function updateConfig(updates: any) {
    try {
      setSaving(true)
      const response = await fetch('/api/wedding/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const data = await response.json()
        setConfig(data.data)
        setRefreshTrigger((prev) => prev + 1)
      }
    } catch (error) {
      console.error('Failed to update config:', error)
    } finally {
      setSaving(false)
    }
  }

  async function toggleFeature(featureName: string, isEnabled: boolean) {
    try {
      const response = await fetch('/api/wedding/config/features', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featureName, isEnabled }),
      })

      if (response.ok) {
        fetchConfig()
        setRefreshTrigger((prev) => prev + 1)
      }
    } catch (error) {
      console.error('Failed to toggle feature:', error)
    }
  }

  async function batchUpdateFeatures(features: Record<string, boolean>) {
    try {
      setSaving(true)
      const response = await fetch('/api/wedding/config/features', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features }),
      })

      if (response.ok) {
        fetchConfig()
        setDraftFeatures(undefined) // Clear draft features after successful save
        setRefreshTrigger((prev) => prev + 1)
      }
    } catch (error) {
      console.error('Failed to update features:', error)
    } finally {
      setSaving(false)
    }
  }

  async function handlePublish() {
    try {
      setSaving(true)
      const response = await fetch('/api/wedding/publish', {
        method: 'POST',
      })

      if (response.ok) {
        fetchConfig()
      }
    } catch (error) {
      console.error('Failed to publish:', error)
    } finally {
      setSaving(false)
    }
  }

  async function handleUnpublish() {
    try {
      setSaving(true)
      const response = await fetch('/api/wedding/unpublish', {
        method: 'POST',
      })

      if (response.ok) {
        fetchConfig()
      }
    } catch (error) {
      console.error('Failed to unpublish:', error)
    } finally {
      setSaving(false)
    }
  }

  // Memoize callbacks to prevent infinite loops
  const handleStartingSectionLocalChange = useCallback((draft: Partial<StartingSectionContent> | undefined) => {
    if (draft === undefined) {
      setDraftStartingSection(undefined)
    } else {
      setDraftStartingSection((prev) => ({
        ...prev,
        ...draft,
      }))
    }
  }, [])

  const handleBackgroundUpload = useCallback(
    (backgroundData: {
      backgroundFilename: string
      backgroundOriginalName: string
      backgroundType: 'image' | 'video'
      backgroundMimeType: string
      backgroundFileSize: number
    }) => {
      // Only update draft state - don't update saved state yet
      // This preserves unsaved changes in the form
      setDraftStartingSection((prev) => ({
        ...prev,
        ...backgroundData,
      }))
      // Preview will update automatically via draft merge
      // Don't trigger refetch to avoid resetting the form
    },
    []
  )

  const handleMonogramUpload = useCallback(
    async (monogramData: {
      monogramFilename: string
      monogramFileSize: number
      monogramMimeType: string
    }) => {
      // Monogram is saved to config, so refetch config to get updated monogram
      await fetchConfig()
      // Trigger preview refresh to show new monogram
      setRefreshTrigger((prev) => prev + 1)
    },
    []
  )

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-pink-600" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!config) {
    return <div className="p-8 text-center">No configuration found</div>
  }

  return (
    <div className="flex h-full overflow-hidden bg-gray-100">
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
          onToggle={toggleFeature}
          onBatchSave={batchUpdateFeatures}
          saving={saving}
          onLocalChange={(features: Record<string, boolean>) => {
            // Only update draft state, don't trigger refresh/fetch
            setDraftFeatures(features)
          }}
          startingSectionContent={startingSectionContent}
          draftStartingSectionContent={draftStartingSection}
          onUpdateStartingSection={updateStartingSectionContent}
          onStartingSectionLocalChange={handleStartingSectionLocalChange}
          onRefetchStartingSection={fetchStartingSectionContent}
          onBackgroundUpload={handleBackgroundUpload}
          onMonogramUpload={handleMonogramUpload}
          onRefreshPreview={() => setRefreshTrigger((prev) => prev + 1)}
        />
      </div>

      {/* Right Panel - Live Preview */}
      <div className="h-full w-1/2 overflow-hidden">
        <LivePreview
          weddingConfigId={config.id}
          refreshTrigger={refreshTrigger}
          draftFeatures={draftFeatures}
          draftStartingSection={draftStartingSection}
        />
      </div>
    </div>
  )
}

// BasicInfoForm and ContentForm removed - features are now managed in accordions below
// API endpoints remain the same

function FeaturesForm({
  config,
  onBatchSave,
  saving,
  onLocalChange,
  startingSectionContent,
  draftStartingSectionContent,
  onUpdateStartingSection,
  onStartingSectionLocalChange,
  onRefetchStartingSection,
  onBackgroundUpload,
  onMonogramUpload,
  onRefreshPreview,
}: any) {
  const features = [
    {
      name: 'hero',
      label: 'Starting Section',
      description: 'Opening section with couple names and wedding date',
    },
    {
      name: 'groom_and_bride',
      label: 'Groom and Bride',
      description: 'Introduction of the groom and bride',
    },
    { name: 'love_story', label: 'Love Story', description: 'Timeline of your relationship' },
    {
      name: 'save_the_date',
      label: 'Save The Date',
      description: 'Save the date section with add to calendar button',
    },
    { name: 'location', label: 'Location', description: 'Event location' },
    { name: 'rsvp', label: 'RSVP', description: 'Guest response management' },
    { name: 'gallery', label: 'Gallery', description: 'Photo gallery' },
    { name: 'prewedding_videos', label: 'Pre-wedding Videos', description: 'Video embeds' },
    { name: 'faqs', label: 'FAQs', description: 'Frequently asked questions' },
    { name: 'dress_code', label: 'Dress Code', description: 'Attire guidelines' },
    {
      name: 'gift',
      label: 'Gift',
      description: 'Information for guests who want to send digital gift(s)',
    },
    { name: 'wishes', label: 'Wishes', description: 'Guest wishes and messages' },
    { name: 'footer', label: 'Footer', description: 'Closing section with thank you message' },
  ]

  // Track draft state locally (separate from saved state)
  const [draftFeatures, setDraftFeatures] = useState<Record<string, boolean>>(config.features)
  const [changedFeatures, setChangedFeatures] = useState<Set<string>>(new Set())
  const [changedStartingSectionFields, setChangedStartingSectionFields] = useState<Set<string>>(
    new Set()
  )
  const [localDraftStartingSection, setLocalDraftStartingSection] = useState<
    Partial<StartingSectionContent>
  >({})

  // Update draft state when config changes (after save)
  useEffect(() => {
    setDraftFeatures(config.features)
    setChangedFeatures(new Set())
  }, [config.features])

  // Update draft starting section when content changes (after save)
  useEffect(() => {
    setChangedStartingSectionFields(new Set())
    setLocalDraftStartingSection({})
  }, [startingSectionContent])

  // Check if there are unsaved changes
  const hasUnsavedChanges = changedFeatures.size > 0 || changedStartingSectionFields.size > 0
  const totalChanges = changedFeatures.size + changedStartingSectionFields.size

  function handleToggle(featureName: string) {
    const newValue = !draftFeatures[featureName]

    // Update local draft state
    const newDraftFeatures = {
      ...draftFeatures,
      [featureName]: newValue,
    }
    setDraftFeatures(newDraftFeatures)

    // Track which features have changed
    if (newValue !== config.features[featureName]) {
      setChangedFeatures((prev) => new Set(prev).add(featureName))
    } else {
      // If toggled back to original value, remove from changed set
      setChangedFeatures((prev) => {
        const next = new Set(prev)
        next.delete(featureName)
        return next
      })
    }

    // Update preview immediately with local state
    onLocalChange(newDraftFeatures)
  }

  async function handleSave() {
    // Save changed features
    if (changedFeatures.size > 0) {
      const featuresToUpdate: Record<string, boolean> = {}
      changedFeatures.forEach((featureName) => {
        featuresToUpdate[featureName] = draftFeatures[featureName]
      })
      await onBatchSave(featuresToUpdate)
    }

    // Save changed starting section content
    if (changedStartingSectionFields.size > 0) {
      await onUpdateStartingSection(localDraftStartingSection)
    }
  }

  async function handleDiscard() {
    // Reset features to saved state
    setDraftFeatures(config.features)
    setChangedFeatures(new Set())
    onLocalChange(config.features)

    // Reset starting section to saved state
    setLocalDraftStartingSection({})
    setChangedStartingSectionFields(new Set())
    onStartingSectionLocalChange(undefined)

    // Force re-fetch to trigger form reset and preview refresh
    if (onRefetchStartingSection) {
      await onRefetchStartingSection()
    }

    // Trigger LivePreview refresh to show actual saved state from server
    if (onRefreshPreview) {
      onRefreshPreview()
    }
  }

  const handleStartingSectionChange = useCallback((hasChanges: boolean, fields: Set<string>) => {
    setChangedStartingSectionFields(fields)
  }, [])

  const handleStartingSectionLocalChange = useCallback(
    (draft: Partial<StartingSectionContent>) => {
      setLocalDraftStartingSection((prev) => ({
        ...prev,
        ...draft,
      }))
      onStartingSectionLocalChange(draft)
    },
    [onStartingSectionLocalChange]
  )

  return (
    <>
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto p-6">
        <Accordion type="multiple" className="space-y-2">
          {features.map((feature) => {
            const isChanged = changedFeatures.has(feature.name)
            return (
              <AccordionItem
                key={feature.name}
                value={feature.name}
                className={`rounded-lg border transition-colors ${
                  isChanged ? 'border-yellow-300 bg-yellow-50' : ''
                }`}
              >
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex w-full items-center justify-between pr-4">
                    <div className="flex flex-1 items-center gap-3">
                      {/* Toggle Switch */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggle(feature.name)
                        }}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                          draftFeatures[feature.name] ? 'bg-pink-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            draftFeatures[feature.name] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      {/* Label */}
                      <div className="text-left">
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
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  {feature.name === 'hero' ? (
                    <StartingSectionForm
                      weddingConfig={config}
                      startingSectionContent={startingSectionContent}
                      draftStartingSectionContent={draftStartingSectionContent}
                      onUpdate={onUpdateStartingSection}
                      onLocalChange={handleStartingSectionLocalChange}
                      onChangeTracking={handleStartingSectionChange}
                      changedFields={changedStartingSectionFields}
                      onBackgroundUpload={onBackgroundUpload}
                      onMonogramUpload={onMonogramUpload}
                    />
                  ) : feature.name === 'groom_and_bride' ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            Groom&apos;s Instagram Link
                          </label>
                          <input
                            type="url"
                            defaultValue={config.groomsInstagramLink || ''}
                            placeholder="https://instagram.com/..."
                            className="w-full rounded-lg border px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            Bride&apos;s Instagram Link
                          </label>
                          <input
                            type="url"
                            defaultValue={config.brideInstagramLink || ''}
                            placeholder="https://instagram.com/..."
                            className="w-full rounded-lg border px-3 py-2 text-sm"
                          />
                        </div>
                      </div>
                      <p className="text-xs italic text-gray-500">
                        Note: Instagram link updates will be implemented in a future update
                      </p>
                    </div>
                  ) : (
                    <div className="text-sm italic text-gray-500">
                      Content configuration coming soon...
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>

      {/* Sticky alert at bottom - only show when there are changes */}
      {hasUnsavedChanges && (
        <div className="sticky bottom-0 z-10 border-t border-yellow-200 bg-yellow-50 px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 flex-shrink-0 text-yellow-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm font-medium text-yellow-800">
                {totalChanges} unsaved change{totalChanges !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDiscard}
                disabled={saving}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-white disabled:opacity-50"
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-pink-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-pink-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
