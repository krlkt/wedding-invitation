'use client'

/**
 * Starting Section Form Component
 *
 * Form for managing starting section content including:
 * - Display names (groom/bride)
 * - Parent information (optional)
 * - Wedding date visibility
 * - Background media (image/video)
 */

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { startingSectionContentSchema } from '@/app/lib/validations/starting-section'
import { validateImageFile, validateMediaFile, formatFileSize } from '@/app/utils/media-validation'
import { useDraft } from '@/app/context/DraftContext'
import { useMediaUpload } from '@/app/hooks/useMediaUpload'
import type { WeddingConfiguration } from '@/app/db/schema/weddings'
import type { StartingSectionContent } from '@/app/db/schema/starting-section'
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
type StartingSectionContentFormData = z.infer<typeof startingSectionContentSchema>

interface StartingSectionFormProps {
  weddingConfig: WeddingConfiguration
  startingSectionContent: StartingSectionContent | null
  onUpdate: (data: StartingSectionContentFormData & { file?: File }) => Promise<void>
  onChangeTracking?: (hasChanges: boolean, changedFields: Set<string>) => void
  changedFields?: Set<string>
  onBackgroundUpload?: (backgroundData: {
    backgroundFilename: string
    backgroundOriginalName: string
    backgroundType: 'image' | 'video'
    backgroundMimeType: string
    backgroundFileSize: number
  }) => void
  onMonogramUpload?: (monogramData: {
    monogramFilename: string
    monogramFileSize: number
    monogramMimeType: string
  }) => void
}

export function StartingSectionForm({
  weddingConfig,
  startingSectionContent,
  onUpdate,
  onChangeTracking,
  changedFields = new Set(),
  onBackgroundUpload,
  onMonogramUpload,
}: StartingSectionFormProps) {
  // Use draft context
  const { draft: draftStartingSectionContent, setDraft: setDraftStartingSection } =
    useDraft('startingSection')

  // Background media upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [validationError, _setValidationError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const backgroundUpload = useMediaUpload({
    apiEndpoint: '/api/wedding/starting-section/upload',
    validateFile: validateMediaFile, // ✅ Hook handles validation for both images and videos
    onSuccess: async (result) => {
      if (onBackgroundUpload && result.data && selectedFile) {
        onBackgroundUpload({
          backgroundFilename: result.data.backgroundFilename,
          backgroundOriginalName: selectedFile.name,
          backgroundType: result.data.mediaType,
          backgroundMimeType: selectedFile.type,
          backgroundFileSize: selectedFile.size,
        })
      }
      // Clear selection
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
  })

  // Monogram upload
  const [selectedMonogramFile, setSelectedMonogramFile] = useState<File | null>(null)
  const [showMonogramConfirmDialog, setShowMonogramConfirmDialog] = useState(false)
  const monogramFileInputRef = useRef<HTMLInputElement>(null)

  const monogramUpload = useMediaUpload({
    apiEndpoint: '/api/wedding/config/monogram',
    validateFile: validateImageFile,
    onSuccess: async (result) => {
      if (onMonogramUpload && result.data && selectedMonogramFile) {
        onMonogramUpload({
          monogramFilename: result.data.monogramFilename,
          monogramFileSize: selectedMonogramFile.size,
          monogramMimeType: selectedMonogramFile.type,
        })
      }
      // Clear selection
      setSelectedMonogramFile(null)
      if (monogramFileInputRef.current) {
        monogramFileInputRef.current.value = ''
      }
    },
  })

  // Default placeholder text from basic info
  const groomFullName = weddingConfig.groomName
  const brideFullName = weddingConfig.brideName

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<StartingSectionContentFormData>({
    resolver: zodResolver(startingSectionContentSchema),
    defaultValues: {
      // Initialize with draft first, then saved, then defaults
      groomDisplayName:
        draftStartingSectionContent?.groomDisplayName ??
        startingSectionContent?.groomDisplayName ??
        null,
      brideDisplayName:
        draftStartingSectionContent?.brideDisplayName ??
        startingSectionContent?.brideDisplayName ??
        null,
      showParentInfo:
        draftStartingSectionContent?.showParentInfo ??
        startingSectionContent?.showParentInfo ??
        false,
      groomFatherName:
        draftStartingSectionContent?.groomFatherName ??
        startingSectionContent?.groomFatherName ??
        null,
      groomMotherName:
        draftStartingSectionContent?.groomMotherName ??
        startingSectionContent?.groomMotherName ??
        null,
      brideFatherName:
        draftStartingSectionContent?.brideFatherName ??
        startingSectionContent?.brideFatherName ??
        null,
      brideMotherName:
        draftStartingSectionContent?.brideMotherName ??
        startingSectionContent?.brideMotherName ??
        null,
      showWeddingDate:
        draftStartingSectionContent?.showWeddingDate ??
        startingSectionContent?.showWeddingDate ??
        true,
    },
  })

  // Reset form when saved content changes (after save or discard refetch)
  // Always use SAVED values to prevent race condition with draft clearing
  const prevStartingSectionContent = useRef(startingSectionContent)
  useEffect(() => {
    if (prevStartingSectionContent.current !== startingSectionContent) {
      prevStartingSectionContent.current = startingSectionContent
      reset({
        groomDisplayName: startingSectionContent?.groomDisplayName ?? null,
        brideDisplayName: startingSectionContent?.brideDisplayName ?? null,
        showParentInfo: startingSectionContent?.showParentInfo ?? false,
        groomFatherName: startingSectionContent?.groomFatherName ?? null,
        groomMotherName: startingSectionContent?.groomMotherName ?? null,
        brideFatherName: startingSectionContent?.brideFatherName ?? null,
        brideMotherName: startingSectionContent?.brideMotherName ?? null,
        showWeddingDate: startingSectionContent?.showWeddingDate ?? true,
      })
    }
  }, [startingSectionContent, reset])

  const showParentInfo = watch('showParentInfo')
  const showWeddingDate = watch('showWeddingDate')

  // Auto-save form changes to draft
  const formValues = useWatch({ control })
  useEffect(() => {
    const draft: Partial<StartingSectionContent> = {
      groomDisplayName: formValues.groomDisplayName ?? null,
      brideDisplayName: formValues.brideDisplayName ?? null,
      showParentInfo: formValues.showParentInfo ?? false,
      groomFatherName: formValues.groomFatherName ?? null,
      groomMotherName: formValues.groomMotherName ?? null,
      brideFatherName: formValues.brideFatherName ?? null,
      brideMotherName: formValues.brideMotherName ?? null,
      showWeddingDate: formValues.showWeddingDate ?? true,
    }

    // Track which fields changed from saved state
    const changedFields = new Set<string>()
    const fields = [
      'groomDisplayName',
      'brideDisplayName',
      'showParentInfo',
      'groomFatherName',
      'groomMotherName',
      'brideFatherName',
      'brideMotherName',
      'showWeddingDate',
    ] as const

    fields.forEach((field) => {
      let defaultValue = null
      if (field === 'showWeddingDate') {
        defaultValue = true
      } else if (field === 'showParentInfo') {
        defaultValue = false
      }

      const savedValue = startingSectionContent?.[field] ?? defaultValue
      if (draft[field] !== savedValue) {
        changedFields.add(field)
      }
    })

    // Update draft only if there are changes
    if (changedFields.size > 0) {
      // Merge: preserve media fields from prev, update form fields from draft
      setDraftStartingSection((prev) => ({ ...(prev ?? {}), ...draft }))
    } else {
      setDraftStartingSection(undefined)
    }

    onChangeTracking?.(changedFields.size > 0, changedFields)
  }, [formValues, startingSectionContent, setDraftStartingSection, onChangeTracking])

  // Background file selection - validation handled by hook
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file) // Just set the file, hook will validate on upload
    }
  }

  // Upload button - check if replacement confirmation needed
  const handleUploadBackground = async () => {
    if (!selectedFile) return

    // Don't upload if there's a validation error
    if (validationError) return

    // Show confirmation if replacing existing media
    if (
      draftStartingSectionContent?.backgroundFilename ||
      startingSectionContent?.backgroundFilename
    ) {
      setShowConfirmDialog(true)
    } else {
      await backgroundUpload.uploadMedia(selectedFile)
    }
  }

  // Confirm replacement and upload
  const handleConfirmReplacement = async () => {
    setShowConfirmDialog(false)
    if (selectedFile && !validationError) {
      await backgroundUpload.uploadMedia(selectedFile)
    }
  }

  // Monogram file selection - validation handled by upload hook
  const handleMonogramFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedMonogramFile(file)
    }
  }

  // Monogram upload button - check if replacement confirmation needed
  const handleUploadMonogram = async () => {
    if (!selectedMonogramFile) return

    // Show confirmation if replacing existing monogram
    if (weddingConfig.monogramFilename) {
      setShowMonogramConfirmDialog(true)
    } else {
      await monogramUpload.uploadMedia(selectedMonogramFile)
    }
  }

  // Confirm replacement and upload
  const handleConfirmMonogramReplacement = async () => {
    setShowMonogramConfirmDialog(false)
    if (selectedMonogramFile) {
      await monogramUpload.uploadMedia(selectedMonogramFile)
    }
  }

  // Form submission (media uploads are handled separately)
  const onSubmit = async (data: StartingSectionContentFormData) => {
    try {
      await onUpdate(data)
    } catch (error) {
      console.error('failed submitting form', error)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Monogram Upload Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Monogram</h3>

          {weddingConfig.monogramFilename && (
            <div className="rounded-md border bg-gray-50 p-4">
              <p className="mb-1 text-sm font-medium">Current Monogram:</p>
              <div className="mt-2 flex items-center gap-4">
                <div className="relative h-20 w-16 overflow-hidden rounded border bg-white">
                  <Image
                    src={weddingConfig.monogramFilename}
                    alt="Current monogram"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {weddingConfig.monogramFilename.split('/').pop()}
                  </p>
                  {weddingConfig.monogramFileSize && (
                    <p className="text-xs text-gray-600">
                      {formatFileSize(weddingConfig.monogramFileSize)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="monogramMedia">Upload Monogram Image</Label>
            <div className="flex gap-2">
              <FileInput
                ref={monogramFileInputRef}
                id="monogramMedia"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleMonogramFileChange}
                disabled={monogramUpload.isUploading}
                selectedFile={selectedMonogramFile}
                formatFileSize={formatFileSize}
                placeholder="Choose monogram image..."
              />
              <Button
                type="button"
                onClick={handleUploadMonogram}
                disabled={!selectedMonogramFile || monogramUpload.isUploading}
                className="shrink-0"
              >
                {monogramUpload.isUploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
            <p className="text-xs text-gray-500">Image only: max 10 MB (JPEG, PNG, WebP, GIF)</p>
            {monogramUpload.error && <p className="text-sm text-red-500">{monogramUpload.error}</p>}

            {/* Upload Progress Bar */}
            {monogramUpload.isUploading && (
              <div className="space-y-2">
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-2.5 rounded-full bg-pink-600 transition-all duration-300 ease-out"
                    style={{ width: `${monogramUpload.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600">Uploading: {monogramUpload.progress}%</p>
              </div>
            )}
          </div>
        </div>

        {/* Display Names Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Display Names</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

            <div
              className={`space-y-2 rounded-lg transition-all ${changedFields.has('brideDisplayName') ? 'bg-yellow-50 p-2 ring-2 ring-yellow-400' : ''}`}
            >
              <Label htmlFor="brideDisplayName">Bride&apos;s Display Name</Label>
              <Input
                {...register('brideDisplayName')}
                id="brideDisplayName"
                placeholder={brideFullName}
              />
              {errors.brideDisplayName && (
                <p className="text-sm text-red-500">{errors.brideDisplayName.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Parent Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Parent Information</h3>

          <div
            className={`flex items-center space-x-2 rounded-lg transition-all ${changedFields.has('showParentInfo') ? 'bg-yellow-50 p-2 ring-2 ring-yellow-400' : ''}`}
          >
            <Checkbox
              id="starting-showParentInfo"
              checked={showParentInfo}
              onCheckedChange={(checked) => setValue('showParentInfo', checked as boolean)}
            />
            <Label htmlFor="starting-showParentInfo" className="cursor-pointer">
              Show Parent Information
            </Label>
          </div>

          {showParentInfo && (
            <div className="space-y-4 border-l-2 border-gray-200 pl-4">
              {/* Groom's Parents - Responsive Layout */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div
                  className={`space-y-2 rounded-lg transition-all ${changedFields.has('groomFatherName') ? 'bg-yellow-50 p-2 ring-2 ring-yellow-400' : ''}`}
                >
                  <Label htmlFor="groomFatherName">Groom&apos;s Father Name</Label>
                  <Input {...register('groomFatherName')} id="groomFatherName" />
                </div>

                <div
                  className={`space-y-2 rounded-lg transition-all ${changedFields.has('groomMotherName') ? 'bg-yellow-50 p-2 ring-2 ring-yellow-400' : ''}`}
                >
                  <Label htmlFor="groomMotherName">Groom&apos;s Mother Name</Label>
                  <Input {...register('groomMotherName')} id="groomMotherName" />
                </div>
              </div>

              {/* Bride's Parents - Responsive Layout */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div
                  className={`space-y-2 rounded-lg transition-all ${changedFields.has('brideFatherName') ? 'bg-yellow-50 p-2 ring-2 ring-yellow-400' : ''}`}
                >
                  <Label htmlFor="brideFatherName">Bride&apos;s Father Name</Label>
                  <Input {...register('brideFatherName')} id="brideFatherName" />
                </div>

                <div
                  className={`space-y-2 rounded-lg transition-all ${changedFields.has('brideMotherName') ? 'bg-yellow-50 p-2 ring-2 ring-yellow-400' : ''}`}
                >
                  <Label htmlFor="brideMotherName">Bride&apos;s Mother Name</Label>
                  <Input {...register('brideMotherName')} id="brideMotherName" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wedding Date Toggle */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Wedding Date</h3>

          <div
            className={`flex items-center space-x-2 rounded-lg transition-all ${changedFields.has('showWeddingDate') ? 'bg-yellow-50 p-2 ring-2 ring-yellow-400' : ''}`}
          >
            <Checkbox
              id="showWeddingDate"
              checked={showWeddingDate}
              onCheckedChange={(checked) => setValue('showWeddingDate', checked as boolean)}
            />
            <Label htmlFor="showWeddingDate" className="cursor-pointer">
              Show Wedding Date
            </Label>
          </div>
        </div>

        {/* Background Media Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Background Media</h3>

          {(draftStartingSectionContent?.backgroundFilename ??
            startingSectionContent?.backgroundFilename) && (
            <div className="rounded-md border bg-gray-50 p-4">
              <p className="mb-1 text-sm font-medium">Current Media:</p>
              <p className="text-sm text-gray-600">
                {draftStartingSectionContent?.backgroundOriginalName ??
                  startingSectionContent?.backgroundOriginalName ??
                  draftStartingSectionContent?.backgroundFilename?.split('/').pop() ??
                  startingSectionContent?.backgroundFilename?.split('/').pop()}
              </p>
              {(draftStartingSectionContent?.backgroundFileSize ??
                startingSectionContent?.backgroundFileSize) && (
                <p className="text-sm text-gray-600">
                  {formatFileSize(
                    draftStartingSectionContent?.backgroundFileSize ??
                      startingSectionContent?.backgroundFileSize ??
                      0
                  )}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="backgroundMedia">Upload Background Media</Label>
            <div className="flex gap-2">
              <FileInput
                ref={fileInputRef}
                id="backgroundMedia"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,video/mp4,video/webm"
                onChange={handleFileChange}
                disabled={backgroundUpload.isUploading}
                selectedFile={selectedFile}
                formatFileSize={formatFileSize}
                placeholder="Choose background image or video..."
              />
              <Button
                type="button"
                onClick={handleUploadBackground}
                disabled={!selectedFile || backgroundUpload.isUploading}
                className="shrink-0"
              >
                {backgroundUpload.isUploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Images: max 10 MB (JPEG, PNG, WebP, GIF) | Videos: max 50 MB (MP4, WebM)
            </p>
            {(validationError || backgroundUpload.error) && (
              <p className="text-sm text-red-500">{validationError || backgroundUpload.error}</p>
            )}

            {/* Upload Progress Bar */}
            {backgroundUpload.isUploading && (
              <div className="space-y-2">
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-2.5 rounded-full bg-pink-600 transition-all duration-300 ease-out"
                    style={{ width: `${backgroundUpload.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600">Uploading: {backgroundUpload.progress}%</p>
              </div>
            )}
          </div>
        </div>
      </form>

      {/* Background Media Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Replace Existing Media?</DialogTitle>
            <DialogDescription>
              You are about to replace the existing background media:{' '}
              <strong>
                {draftStartingSectionContent?.backgroundOriginalName ??
                  startingSectionContent?.backgroundOriginalName ??
                  draftStartingSectionContent?.backgroundFilename?.split('/').pop() ??
                  startingSectionContent?.backgroundFilename?.split('/').pop() ??
                  'current media'}
              </strong>
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

      {/* Monogram Confirmation Dialog */}
      <Dialog open={showMonogramConfirmDialog} onOpenChange={setShowMonogramConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Replace Existing Monogram?</DialogTitle>
            <DialogDescription>
              You are about to replace the existing monogram:{' '}
              <strong>
                {weddingConfig.monogramFilename?.split('/').pop() ?? 'current monogram'}
              </strong>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMonogramConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmMonogramReplacement}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
