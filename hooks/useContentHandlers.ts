/**
 * Content Handlers Hook
 *
 * Centralizes all content update logic for the dashboard.
 * Groups section updates and feature toggles into a clean API.
 */

import { useMemo } from 'react'
import type { StartingSectionContent } from '@/db/schema/starting-section'
import type { GroomSectionContent } from '@/db/schema/groom-section'
import type { BrideSectionContent } from '@/db/schema/bride-section'
import type { FAQItem } from '@/db/schema/content'
import { parsePhotos } from '@/lib/section-photos'
import { useSnackbar } from '@/context/SnackbarContext'

interface UseContentHandlersOptions {
  startingSectionContent: StartingSectionContent | null
  groomSectionContent: GroomSectionContent | null
  brideSectionContent: BrideSectionContent | null
  faqSectionContent: FAQItem[] | null
  setSaving: (saving: boolean) => void
  refetch: {
    all: () => Promise<void>
    config: () => Promise<void>
    startingSection: () => Promise<void>
    groomSection: () => Promise<void>
    brideSection: () => Promise<void>
    faqs: () => Promise<void>
  }
  triggerRefresh: () => void
}

export function useContentHandlers({
  startingSectionContent,
  groomSectionContent,
  brideSectionContent,
  faqSectionContent,
  setSaving,
  refetch,
  triggerRefresh,
}: UseContentHandlersOptions) {
  const { showError } = useSnackbar()

  // Starting section handlers
  const startingSection = useMemo(
    () => ({
      content: startingSectionContent,
      update: async (updates: any) => {
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
          const { _file, ...contentUpdates } = updates
          const response = await fetch('/api/wedding/starting-section', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contentUpdates),
          })

          if (response.ok) {
            await refetch.startingSection()
            triggerRefresh()
          }
        } catch (error) {
          console.error('Failed to update starting section:', error)
          showError('Failed to update starting section. Please try again.')
        } finally {
          setSaving(false)
        }
      },
      refetch: refetch.startingSection,
    }),
    [startingSectionContent, refetch, setSaving, showError, triggerRefresh]
  )

  // Groom section handlers
  const groomSection = useMemo(
    () => ({
      content: groomSectionContent,
      update: async (updates: any) => {
        try {
          setSaving(true)

          // Parse photos if it's a string (from draft/saved state)
          const dataToSend = { ...updates }
          if (dataToSend.photos && typeof dataToSend.photos === 'string') {
            dataToSend.photos = parsePhotos(dataToSend.photos)
          }

          const response = await fetch('/api/wedding/groom-section', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend),
          })

          if (response.ok) {
            await refetch.groomSection()
            triggerRefresh()
          } else {
            // Show detailed error from API
            const errorData = await response.json()
            console.error('API error:', errorData)
            showError(
              `Failed to update groom section: ${errorData.error ?? 'Unknown error'}${errorData.details ? ` - ${JSON.stringify(errorData.details)}` : ''}`
            )
          }
        } catch (error) {
          console.error('Failed to update groom section:', error)
          showError('Failed to update groom section. Please try again.')
        } finally {
          setSaving(false)
        }
      },
      refetch: refetch.groomSection,
    }),
    [groomSectionContent, refetch, setSaving, showError, triggerRefresh]
  )

  // Bride section handlers
  const brideSection = useMemo(
    () => ({
      content: brideSectionContent,
      update: async (updates: any) => {
        try {
          setSaving(true)

          // Parse photos if it's a string (from draft/saved state)
          const dataToSend = { ...updates }
          if (dataToSend.photos && typeof dataToSend.photos === 'string') {
            dataToSend.photos = parsePhotos(dataToSend.photos)
          }

          const response = await fetch('/api/wedding/bride-section', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend),
          })

          if (response.ok) {
            await refetch.brideSection()
            triggerRefresh()
          } else {
            // Show detailed error from API
            const errorData = await response.json()
            console.error('API error:', errorData)
            showError(
              `Failed to update bride section: ${errorData.error ?? 'Unknown error'}${errorData.details ? ` - ${JSON.stringify(errorData.details)}` : ''}`
            )
          }
        } catch (error) {
          console.error('Failed to update bride section:', error)
          showError('Failed to update bride section. Please try again.')
        } finally {
          setSaving(false)
        }
      },
      refetch: refetch.brideSection,
    }),
    [brideSectionContent, refetch, setSaving, showError, triggerRefresh]
  )

  // FAQ section handlers
  const faqSection = useMemo(
    () => ({
      content: faqSectionContent,
      update: async (updates: any) => {
        try {
          setSaving(true)

          const response = await fetch('/api/wedding/faqs/batch', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ updated: updates.updated, deleted: updates.deleted }),
          })

          if (response.ok) {
            await refetch.faqs()
            triggerRefresh()
          } else {
            // Show detailed error from API
            const errorData = await response.json()
            console.error('API error:', errorData)
            showError(
              `Failed to update FAQ section: ${errorData.error ?? 'Unknown error'}${errorData.details ? ` - ${JSON.stringify(errorData.details)}` : ''}`
            )
          }
        } catch (error) {
          console.error('Failed to FAQ section:', error)
          showError('Failed to update FAQ section. Please try again.')
        } finally {
          setSaving(false)
        }
      },
      refetch: refetch.faqs,
    }),
    [faqSectionContent, refetch, setSaving, showError, triggerRefresh]
  )

  // Feature toggle handlers
  const features = useMemo(
    () => ({
      toggle: async (featureName: string, isEnabled: boolean) => {
        try {
          const response = await fetch('/api/wedding/config/features', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ featureName, isEnabled }),
          })

          if (response.ok) {
            await refetch.config()
            triggerRefresh()
          }
        } catch (error) {
          console.error('Failed to toggle feature:', error)
        }
      },
      batchUpdate: async (features: Record<string, boolean>) => {
        try {
          setSaving(true)
          const response = await fetch('/api/wedding/config/features', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ features }),
          })

          if (response.ok) {
            await refetch.config()
            triggerRefresh()
          }
        } catch (error) {
          console.error('Failed to update features:', error)
        } finally {
          setSaving(false)
        }
      },
    }),
    [refetch, setSaving, triggerRefresh]
  )

  return {
    startingSection,
    groomSection,
    brideSection,
    faqSection,
    features,
  }
}
