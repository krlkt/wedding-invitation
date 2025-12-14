/**
 * Photo Upload Handlers Hook
 *
 * Centralizes all photo upload handling logic for the dashboard.
 * Manages background, monogram, groom photos, and bride photos.
 */

import { useCallback } from 'react'
import type { StartingSectionContent } from '@/db/schema/starting-section'
import type { GroomSectionContent } from '@/db/schema/groom-section'
import type { BrideSectionContent } from '@/db/schema/bride-section'
import { parsePhotos, stringifyPhotos, upsertPhoto } from '@/lib/section-photos'
import { GroomBrideSectionPhoto } from '@/db/schema/section-photo-types'

interface UsePhotoUploadHandlersOptions {
  draftStartingSection: Partial<StartingSectionContent> | undefined
  setDraftStartingSection: (data: any) => void
  draftGroomSection: Partial<GroomSectionContent> | undefined
  groomSectionContent: GroomSectionContent | null
  setDraftGroomSection: (data: any) => void
  draftBrideSection: Partial<BrideSectionContent> | undefined
  brideSectionContent: BrideSectionContent | null
  setDraftBrideSection: (data: any) => void
  onRefresh: () => void
  refetchConfig: () => Promise<void>
}

export function usePhotoUploadHandlers({
  draftStartingSection,
  setDraftStartingSection,
  draftGroomSection,
  groomSectionContent,
  setDraftGroomSection,
  draftBrideSection,
  brideSectionContent,
  setDraftBrideSection,
  onRefresh,
  refetchConfig,
}: UsePhotoUploadHandlersOptions) {
  const handleBackgroundUpload = useCallback(
    (backgroundData: {
      backgroundFilename: string
      backgroundOriginalName: string
      backgroundType: 'image' | 'video'
      backgroundMimeType: string
      backgroundFileSize: number
    }) => {
      // Update draft state with new background
      setDraftStartingSection({
        ...(draftStartingSection ?? {}),
        ...backgroundData,
      })
      // Trigger preview refresh to show new background immediately
      onRefresh()
    },
    [draftStartingSection, setDraftStartingSection, onRefresh]
  )

  const handleMonogramUpload = useCallback(async () => {
    // Monogram is saved to config, so refetch config to get updated monogram
    await refetchConfig()
    // Trigger preview refresh to show new monogram
    onRefresh()
  }, [refetchConfig, onRefresh])

  const handleGroomPhotoUpload = useCallback(
    (photoSlot: number, photoData: { filename: string; fileSize: number; mimeType: string }) => {
      // Get existing photos from draft or saved content
      const existingPhotosJson = draftGroomSection?.photos ?? groomSectionContent?.photos ?? '[]'
      const existingPhotos = parsePhotos(existingPhotosJson)

      // Create new photo object
      const newPhoto: GroomBrideSectionPhoto = {
        filename: photoData.filename,
        fileSize: photoData.fileSize,
        mimeType: photoData.mimeType as any,
        slot: photoSlot,
        uploadedAt: new Date().toISOString(),
      }

      // Upsert photo into array
      const updatedPhotos = upsertPhoto(existingPhotos, newPhoto)

      // Update draft state with new photos
      setDraftGroomSection({
        ...(draftGroomSection ?? {}),
        photos: stringifyPhotos(updatedPhotos),
      })

      // Trigger preview refresh to show new photo immediately
      onRefresh()
    },
    [draftGroomSection, groomSectionContent, setDraftGroomSection, onRefresh]
  )

  const handleBridePhotoUpload = useCallback(
    (photoSlot: number, photoData: { filename: string; fileSize: number; mimeType: string }) => {
      // Get existing photos from draft or saved content
      const existingPhotosJson = draftBrideSection?.photos ?? brideSectionContent?.photos ?? '[]'
      const existingPhotos = parsePhotos(existingPhotosJson)

      // Create new photo object
      const newPhoto: GroomBrideSectionPhoto = {
        filename: photoData.filename,
        fileSize: photoData.fileSize,
        mimeType: photoData.mimeType as any,
        slot: photoSlot,
        uploadedAt: new Date().toISOString(),
      }

      // Upsert photo into array
      const updatedPhotos = upsertPhoto(existingPhotos, newPhoto)

      // Update draft state with new photos
      setDraftBrideSection({
        ...(draftBrideSection ?? {}),
        photos: stringifyPhotos(updatedPhotos),
      })

      // Trigger preview refresh to show new photo immediately
      onRefresh()
    },
    [draftBrideSection, brideSectionContent, setDraftBrideSection, onRefresh]
  )

  return {
    handleBackgroundUpload,
    handleMonogramUpload,
    handleGroomPhotoUpload,
    handleBridePhotoUpload,
  }
}
