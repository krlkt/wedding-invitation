'use client'

/**
 * Groom Section Form Component
 *
 * Form for managing groom section content including:
 * - Display name
 * - Parent information (optional)
 * - Instagram link
 * - Photo gallery (up to 6 photos with sorting)
 */

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { groomSectionContentSchema } from '@/app/lib/validations/groom-section'
import { validateImageFile, formatFileSize } from '@/app/utils/media-validation'
import { useDraft } from '@/app/context/DraftContext'
import { useMediaUpload } from '@/app/hooks/useMediaUpload'
import { parsePhotos } from '@/app/lib/section-photos'
import type { WeddingConfiguration } from '@/app/db/schema/weddings'
import type { GroomSectionContent } from '@/app/db/schema/groom-section'
import type { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { FileInput } from '@/components/ui/file-input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

// Types
type GroomSectionContentFormData = z.infer<typeof groomSectionContentSchema>

interface GroomSectionFormProps {
  weddingConfig: WeddingConfiguration
  groomSectionContent: GroomSectionContent | null
  onUpdate: (data: GroomSectionContentFormData) => Promise<void>
  onChangeTracking?: (hasChanges: boolean, changedFields: Set<string>) => void
  changedFields?: Set<string>
  onPhotoUpload?: (
    photoSlot: number,
    photoData: {
      filename: string
      fileSize: number
      mimeType: string
    }
  ) => void
}

type PhotoSlot = 1 | 2 | 3 | 4 | 5 | 6

export function GroomSectionForm({
  weddingConfig,
  groomSectionContent,
  onUpdate,
  onChangeTracking,
  changedFields = new Set(),
  onPhotoUpload,
}: GroomSectionFormProps) {
  // Use draft context
  const { draft: draftGroomSectionContent, setDraft: setDraftGroomSection } =
    useDraft('groomSection')

  // Photo uploads state
  const [selectedPhoto, setSelectedPhoto] = useState<{ slot: PhotoSlot; file: File } | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const photoInputRefs = useRef<Record<PhotoSlot, HTMLInputElement | null>>({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
  })

  // Photo upload hook
  const photoUpload = useMediaUpload({
    apiEndpoint: '/api/wedding/groom-section/upload',
    validateFile: validateImageFile,
    onSuccess: async (result) => {
      if (onPhotoUpload && result.data?.photo && selectedPhoto) {
        onPhotoUpload(selectedPhoto.slot, {
          filename: result.data.photo.filename,
          fileSize: result.data.photo.fileSize,
          mimeType: result.data.photo.mimeType,
        })
      }
      // Clear selection
      const slotToReset = selectedPhoto?.slot
      setSelectedPhoto(null)
      if (slotToReset) {
        const inputRef = photoInputRefs.current[slotToReset]
        if (inputRef) {
          inputRef.value = ''
        }
      }
    },
  })

  // Default placeholder text from basic info
  const groomFullName = weddingConfig.groomName

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<GroomSectionContentFormData>({
    resolver: zodResolver(groomSectionContentSchema),
    defaultValues: {
      // Initialize with draft first, then saved, then defaults
      groomDisplayName:
        draftGroomSectionContent?.groomDisplayName ?? groomSectionContent?.groomDisplayName ?? null,
      showParentInfo:
        draftGroomSectionContent?.showParentInfo ?? groomSectionContent?.showParentInfo ?? false,
      fatherName: draftGroomSectionContent?.fatherName ?? groomSectionContent?.fatherName ?? null,
      motherName: draftGroomSectionContent?.motherName ?? groomSectionContent?.motherName ?? null,
    },
  })

  // Reset form when saved content changes (after save or discard refetch)
  const prevGroomSectionContent = useRef(groomSectionContent)
  useEffect(() => {
    if (prevGroomSectionContent.current !== groomSectionContent) {
      prevGroomSectionContent.current = groomSectionContent
      reset({
        groomDisplayName: groomSectionContent?.groomDisplayName ?? null,
        showParentInfo: groomSectionContent?.showParentInfo ?? false,
        fatherName: groomSectionContent?.fatherName ?? null,
        motherName: groomSectionContent?.motherName ?? null,
      })
    }
  }, [groomSectionContent, reset])

  const showParentInfo = watch('showParentInfo')

  // Auto-save form changes to draft
  const formValues = useWatch({ control })
  useEffect(() => {
    const draft: Partial<GroomSectionContent> = {
      groomDisplayName: formValues.groomDisplayName ?? null,
      showParentInfo: formValues.showParentInfo ?? false,
      fatherName: formValues.fatherName ?? null,
      motherName: formValues.motherName ?? null,
    }

    // Track which fields changed from saved state
    const changedFieldsSet = new Set<string>()
    const fields = ['groomDisplayName', 'showParentInfo', 'fatherName', 'motherName'] as const

    fields.forEach((field) => {
      const savedValue = groomSectionContent?.[field] ?? (field === 'showParentInfo' ? false : null)
      if (draft[field] !== savedValue) {
        changedFieldsSet.add(field)
      }
    })

    // Update draft only if there are changes
    if (changedFieldsSet.size > 0) {
      setDraftGroomSection((prev) => ({ ...(prev || {}), ...draft }))
    } else {
      setDraftGroomSection(undefined)
    }

    onChangeTracking?.(changedFieldsSet.size > 0, changedFieldsSet)
  }, [formValues, groomSectionContent, setDraftGroomSection, onChangeTracking])

  // Photo file selection
  const handlePhotoChange = (slot: PhotoSlot) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Clear any previous errors
    photoUpload.reset()

    const validation = validateImageFile(file)
    if (!validation.valid) {
      // Show validation error
      alert(validation.error || 'Invalid file')
      setSelectedPhoto(null)
      const inputRef = photoInputRefs.current[slot]
      if (inputRef) {
        inputRef.value = ''
      }
      return
    }

    setSelectedPhoto({ slot, file })
  }

  // Upload button - check if replacement confirmation needed
  const handleUploadPhoto = async (slot: PhotoSlot) => {
    if (selectedPhoto?.slot !== slot) return

    // Check if photo exists in JSON array
    const existingPhoto = getPhotoFilename(slot)
    // Show confirmation if replacing existing photo
    if (existingPhoto) {
      setShowConfirmDialog(true)
    } else {
      // Create FormData with file and slot
      const formData = new FormData()
      formData.append('file', selectedPhoto.file)
      formData.append('slot', String(slot))
      await photoUpload.uploadMedia(formData)
    }
  }

  // Confirm replacement and upload
  const handleConfirmReplacement = async () => {
    setShowConfirmDialog(false)
    if (selectedPhoto) {
      const formData = new FormData()
      formData.append('file', selectedPhoto.file)
      formData.append('slot', String(selectedPhoto.slot))
      await photoUpload.uploadMedia(formData)
    }
  }

  // Form submission
  const onSubmit = async (data: GroomSectionContentFormData) => {
    try {
      // Include current photos (from draft or saved state) in the submission
      // Photos are managed separately via upload, so we need to preserve them
      const photosJson = draftGroomSectionContent?.photos ?? groomSectionContent?.photos

      // Parse photos - handle both string (from DB) and array
      let currentPhotos: any[] = []
      if (photosJson) {
        if (typeof photosJson === 'string') {
          currentPhotos = parsePhotos(photosJson)
        } else if (Array.isArray(photosJson)) {
          currentPhotos = photosJson
        }
      }

      const dataToSubmit = {
        ...data,
        ...(currentPhotos.length > 0 && { photos: currentPhotos }),
      }

      await onUpdate(dataToSubmit)
    } catch (error) {
      console.error('failed submitting form', error)
    }
  }

  // Helper to get photo filename from JSON array
  const getPhotoFilename = (slot: PhotoSlot): string | null => {
    // Try draft first, then saved
    const photosJson = draftGroomSectionContent?.photos ?? groomSectionContent?.photos
    if (!photosJson) return null

    const photos = parsePhotos(photosJson)
    const photo = photos.find((p) => p.slot === slot)
    return photo?.filename ?? null
  }

  // Helper to get photo file size from JSON array
  const getPhotoFileSize = (slot: PhotoSlot): number | null => {
    const photosJson = draftGroomSectionContent?.photos ?? groomSectionContent?.photos
    if (!photosJson) return null

    const photos = parsePhotos(photosJson)
    const photo = photos.find((p) => p.slot === slot)
    return photo?.fileSize ?? null
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Display Name Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Groom Information</h3>

          <div
            className={`space-y-2 rounded-lg transition-all ${changedFields.has('groomDisplayName') ? 'bg-yellow-50 p-2 ring-2 ring-yellow-400' : ''}`}
          >
            <Label htmlFor="groomDisplayName">Groom&apos;s Display Name</Label>
            <Input
              {...register('groomDisplayName')}
              id="groomDisplayName"
              placeholder={groomFullName}
            />
            {errors.groomDisplayName && (
              <p className="text-sm text-red-500">{errors.groomDisplayName.message}</p>
            )}
          </div>
        </div>

        {/* Instagram Link Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Instagram Link</h3>
          <div className="space-y-2">
            <Label>Groom&apos;s Instagram</Label>
            <Input
              value={weddingConfig.groomsInstagramLink || ''}
              disabled
              placeholder="Configure in Basic Info"
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500">
              Instagram link is managed in the Basic Info section
            </p>
          </div>
        </div>

        {/* Parent Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Parent Information</h3>

          <div
            className={`flex items-center space-x-2 rounded-lg transition-all ${changedFields.has('showParentInfo') ? 'bg-yellow-50 p-2 ring-2 ring-yellow-400' : ''}`}
          >
            <Checkbox
              id="groom-showParentInfo"
              checked={showParentInfo}
              onCheckedChange={(checked) => setValue('showParentInfo', checked as boolean)}
            />
            <Label htmlFor="groom-showParentInfo" className="cursor-pointer">
              Show Parent Information
            </Label>
          </div>

          {showParentInfo && (
            <div className="space-y-4 border-l-2 border-gray-200 pl-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div
                  className={`space-y-2 rounded-lg transition-all ${changedFields.has('fatherName') ? 'bg-yellow-50 p-2 ring-2 ring-yellow-400' : ''}`}
                >
                  <Label htmlFor="groom-fatherName">Father&apos;s Name</Label>
                  <Input {...register('fatherName')} id="groom-fatherName" />
                </div>

                <div
                  className={`space-y-2 rounded-lg transition-all ${changedFields.has('motherName') ? 'bg-yellow-50 p-2 ring-2 ring-yellow-400' : ''}`}
                >
                  <Label htmlFor="groom-motherName">Mother&apos;s Name</Label>
                  <Input {...register('motherName')} id="groom-motherName" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Photo Gallery Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Photo Gallery (Up to 6 Photos)</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {([1, 2, 3, 4, 5, 6] as PhotoSlot[]).map((slot) => {
              const photoFilename = getPhotoFilename(slot)
              const photoFileSize = getPhotoFileSize(slot)
              const isCurrentSelection = selectedPhoto?.slot === slot

              return (
                <div key={slot} className="space-y-2 rounded-lg border p-4">
                  <Label htmlFor={`photo${slot}`}>Photo {slot}</Label>

                  {photoFilename && (
                    <div className="rounded-md border bg-gray-50 p-2">
                      <div className="relative h-32 w-full overflow-hidden rounded">
                        <Image
                          src={photoFilename}
                          alt={`Groom ${slot}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-600">{photoFilename.split('/').pop()}</p>
                      {photoFileSize && (
                        <p className="text-xs text-gray-600">{formatFileSize(photoFileSize)}</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <FileInput
                      ref={(el) => {
                        photoInputRefs.current[slot] = el
                      }}
                      id={`groom-photo${slot}`}
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                      onChange={handlePhotoChange(slot)}
                      disabled={photoUpload.isUploading}
                      selectedFile={isCurrentSelection ? selectedPhoto.file : null}
                      formatFileSize={formatFileSize}
                      placeholder="Choose photo..."
                    />
                    <Button
                      type="button"
                      onClick={() => handleUploadPhoto(slot)}
                      disabled={!isCurrentSelection || photoUpload.isUploading}
                      size="sm"
                      className="w-full"
                    >
                      {photoUpload.isUploading && isCurrentSelection ? 'Uploading...' : 'Upload'}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          {photoUpload.error && <p className="text-sm text-red-500">{photoUpload.error}</p>}

          {/* Upload Progress Bar */}
          {photoUpload.isUploading && (
            <div className="space-y-2">
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-2.5 rounded-full bg-pink-600 transition-all duration-300 ease-out"
                  style={{ width: `${photoUpload.progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-600">Uploading: {photoUpload.progress}%</p>
            </div>
          )}

          <p className="text-xs text-gray-500">Image only: max 10 MB (JPEG, PNG, WebP, GIF)</p>
        </div>
      </form>

      {/* Photo Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Replace Existing Photo?</DialogTitle>
            <DialogDescription>
              You are about to replace the existing photo in slot {selectedPhoto?.slot}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmReplacement}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
