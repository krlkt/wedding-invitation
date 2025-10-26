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

import { useState, useRef, useEffect, useCallback } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { startingSectionContentSchema } from '@/app/lib/validations/starting-section'
import { validateImageFile, validateVideoFile, formatFileSize } from '@/app/utils/media-validation'
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
  draftStartingSectionContent?: Partial<StartingSectionContent>
  onUpdate: (data: StartingSectionContentFormData & { file?: File }) => Promise<void>
  onLocalChange?: (draft: Partial<StartingSectionContent>) => void
  onChangeTracking?: (hasChanges: boolean, changedFields: Set<string>) => void
  changedFields?: Set<string>
  onBackgroundUpload?: (backgroundData: {
    backgroundFilename: string
    backgroundOriginalName: string
    backgroundType: 'image' | 'video'
    backgroundMimeType: string
    backgroundFileSize: number
  }) => void
}

export function StartingSectionForm({
  weddingConfig,
  startingSectionContent,
  draftStartingSectionContent,
  onUpdate,
  onLocalChange,
  onChangeTracking,
  changedFields = new Set(),
  onBackgroundUpload,
}: StartingSectionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      groomDisplayName: startingSectionContent?.groomDisplayName ?? null,
      brideDisplayName: startingSectionContent?.brideDisplayName ?? null,
      showParentInfo: startingSectionContent?.showParentInfo ?? false,
      groomFatherName: startingSectionContent?.groomFatherName ?? null,
      groomMotherName: startingSectionContent?.groomMotherName ?? null,
      brideFatherName: startingSectionContent?.brideFatherName ?? null,
      brideMotherName: startingSectionContent?.brideMotherName ?? null,
      showWeddingDate: startingSectionContent?.showWeddingDate ?? true,
    },
  })

  // Reset form when startingSectionContent changes (e.g., after save or discard)
  useEffect(() => {
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
  }, [startingSectionContent, reset])

  const showParentInfo = watch('showParentInfo')
  const showWeddingDate = watch('showWeddingDate')

  // Watch all form values using useWatch (stable references)
  const groomDisplayName = useWatch({ control, name: 'groomDisplayName' })
  const brideDisplayName = useWatch({ control, name: 'brideDisplayName' })
  const watchShowParentInfo = useWatch({ control, name: 'showParentInfo' })
  const groomFatherName = useWatch({ control, name: 'groomFatherName' })
  const groomMotherName = useWatch({ control, name: 'groomMotherName' })
  const brideFatherName = useWatch({ control, name: 'brideFatherName' })
  const brideMotherName = useWatch({ control, name: 'brideMotherName' })
  const watchShowWeddingDate = useWatch({ control, name: 'showWeddingDate' })

  // Memoize the update handlers to prevent re-renders
  const stableOnLocalChange = useCallback(
    (draft: Partial<StartingSectionContent>) => {
      if (onLocalChange) {
        onLocalChange(draft)
      }
    },
    [onLocalChange]
  )

  const stableOnChangeTracking = useCallback(
    (hasChanges: boolean, fields: Set<string>) => {
      if (onChangeTracking) {
        onChangeTracking(hasChanges, fields)
      }
    },
    [onChangeTracking]
  )

  useEffect(() => {
    // Create draft object with current form values
    const draft: Partial<StartingSectionContent> = {
      groomDisplayName: groomDisplayName ?? null,
      brideDisplayName: brideDisplayName ?? null,
      showParentInfo: watchShowParentInfo ?? false,
      groomFatherName: groomFatherName ?? null,
      groomMotherName: groomMotherName ?? null,
      brideFatherName: brideFatherName ?? null,
      brideMotherName: brideMotherName ?? null,
      showWeddingDate: watchShowWeddingDate ?? true,
    }

    // Update preview immediately
    stableOnLocalChange(draft)

    // Track which fields have changed
    const changedFields = new Set<string>()

    if (draft.groomDisplayName !== (startingSectionContent?.groomDisplayName ?? null)) {
      changedFields.add('groomDisplayName')
    }
    if (draft.brideDisplayName !== (startingSectionContent?.brideDisplayName ?? null)) {
      changedFields.add('brideDisplayName')
    }
    if (draft.showParentInfo !== (startingSectionContent?.showParentInfo ?? false)) {
      changedFields.add('showParentInfo')
    }
    if (draft.groomFatherName !== (startingSectionContent?.groomFatherName ?? null)) {
      changedFields.add('groomFatherName')
    }
    if (draft.groomMotherName !== (startingSectionContent?.groomMotherName ?? null)) {
      changedFields.add('groomMotherName')
    }
    if (draft.brideFatherName !== (startingSectionContent?.brideFatherName ?? null)) {
      changedFields.add('brideFatherName')
    }
    if (draft.brideMotherName !== (startingSectionContent?.brideMotherName ?? null)) {
      changedFields.add('brideMotherName')
    }
    if (draft.showWeddingDate !== (startingSectionContent?.showWeddingDate ?? true)) {
      changedFields.add('showWeddingDate')
    }

    stableOnChangeTracking(changedFields.size > 0, changedFields)
  }, [
    groomDisplayName,
    brideDisplayName,
    watchShowParentInfo,
    groomFatherName,
    groomMotherName,
    brideFatherName,
    brideMotherName,
    watchShowWeddingDate,
    stableOnLocalChange,
    stableOnChangeTracking,
    startingSectionContent,
  ])

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')

    let validation
    if (isImage) {
      validation = validateImageFile(file)
    } else if (isVideo) {
      validation = validateVideoFile(file)
    } else {
      setFileError('Invalid file type. Please upload an image or video.')
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    if (!validation.valid) {
      setFileError(validation.error!)
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    setFileError(null)
    setSelectedFile(file)
  }

  // Upload button clicked - check if we need confirmation
  const handleUploadBackground = async () => {
    try {
      if (!selectedFile) return

      // If there's existing media (saved or draft), show confirmation dialog
      if (
        draftStartingSectionContent?.backgroundFilename ||
        startingSectionContent?.backgroundFilename
      ) {
        setShowConfirmDialog(true)
      } else {
        // No existing media, upload directly
        await performUpload()
      }
    } catch (error) {
      console.error('Upload button error:', error)
      setFileError('Failed to initiate upload. Please try again.')
    }
  }

  // Cancel file replacement
  const handleCancelReplacement = () => {
    setShowConfirmDialog(false)
  }

  // Confirm file replacement and start upload
  const handleConfirmReplacement = async () => {
    setShowConfirmDialog(false)
    await performUpload()
  }

  // Perform the actual upload
  const performUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/wedding/starting-section/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const result = await response.json()

      // Update progress to 100%
      clearInterval(progressInterval)
      setUploadProgress(100)

      // Update local state with background data (without refetching)
      if (onBackgroundUpload && result.data) {
        onBackgroundUpload({
          backgroundFilename: result.data.backgroundFilename,
          backgroundOriginalName: selectedFile.name,
          backgroundType: result.data.mediaType,
          backgroundMimeType: selectedFile.type,
          backgroundFileSize: selectedFile.size,
        })
      }

      // Clear progress after a short delay
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
        setSelectedFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }, 500)
    } catch (error: any) {
      clearInterval(progressInterval)
      setIsUploading(false)
      setUploadProgress(0)
      setFileError(error.message || 'Upload failed. Please try again.')
      console.error('Background upload error:', error)
    }
  }

  // Form submission
  const onSubmit = async (data: StartingSectionContentFormData) => {
    setIsSubmitting(true)

    try {
      // If there's a file, simulate upload progress
      if (selectedFile) {
        setIsUploading(true)
        setUploadProgress(0)

        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return 90
            }
            return prev + 10
          })
        }, 200)

        try {
          await onUpdate({
            ...data,
            file: selectedFile,
          })
          clearInterval(progressInterval)
          setUploadProgress(100)

          // Clear progress after a short delay
          setTimeout(() => {
            setIsUploading(false)
            setUploadProgress(0)
            setSelectedFile(null)
            if (fileInputRef.current) {
              fileInputRef.current.value = ''
            }
          }, 500)
        } catch (error) {
          clearInterval(progressInterval)
          setIsUploading(false)
          setUploadProgress(0)
          throw error
        }
      } else {
        await onUpdate(data)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              id="showParentInfo"
              checked={showParentInfo}
              onCheckedChange={(checked) => setValue('showParentInfo', checked as boolean)}
            />
            <Label htmlFor="showParentInfo" className="cursor-pointer">
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

          {(draftStartingSectionContent?.backgroundFilename ||
            startingSectionContent?.backgroundFilename) && (
            <div className="rounded-md border bg-gray-50 p-4">
              <p className="mb-1 text-sm font-medium">Current Media:</p>
              <p className="text-sm text-gray-600">
                {draftStartingSectionContent?.backgroundOriginalName ||
                  startingSectionContent?.backgroundOriginalName ||
                  draftStartingSectionContent?.backgroundFilename?.split('/').pop() ||
                  startingSectionContent?.backgroundFilename?.split('/').pop()}
              </p>
              {(draftStartingSectionContent?.backgroundFileSize ||
                startingSectionContent?.backgroundFileSize) && (
                <p className="text-sm text-gray-600">
                  {formatFileSize(
                    draftStartingSectionContent?.backgroundFileSize ||
                      startingSectionContent?.backgroundFileSize ||
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
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
                onChange={handleFileChange}
                disabled={isUploading}
                selectedFile={selectedFile}
                formatFileSize={formatFileSize}
                placeholder="Choose background image or video..."
              />
              <Button
                type="button"
                onClick={handleUploadBackground}
                disabled={!selectedFile || isUploading}
                className="shrink-0"
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Images: max 10 MB (JPEG, PNG, WebP, GIF) | Videos: max 50 MB (MP4, WebM)
            </p>
            {fileError && <p className="text-sm text-red-500">{fileError}</p>}

            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="space-y-2">
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-2.5 rounded-full bg-pink-600 transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600">Uploading: {uploadProgress}%</p>
              </div>
            )}
          </div>
        </div>
      </form>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Replace Existing Media?</DialogTitle>
            <DialogDescription>
              You are about to replace the existing background media:{' '}
              <strong>
                {draftStartingSectionContent?.backgroundOriginalName ||
                  startingSectionContent?.backgroundOriginalName ||
                  draftStartingSectionContent?.backgroundFilename?.split('/').pop() ||
                  startingSectionContent?.backgroundFilename?.split('/').pop() ||
                  'current media'}
              </strong>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelReplacement}>
              Cancel
            </Button>
            <Button onClick={handleConfirmReplacement}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
