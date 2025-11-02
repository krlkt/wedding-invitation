/**
 * Reusable Media Upload Hook
 *
 * Provides a consistent pattern for uploading media files (images/videos)
 * with progress tracking, validation, and state management.
 *
 * Usage:
 * const { uploadMedia, isUploading, progress, error } = useMediaUpload({
 *   apiEndpoint: '/api/wedding/config/monogram',
 *   onSuccess: (result) => { ... },
 *   validateFile: validateImageFile,
 * })
 */

import { useState, useCallback } from 'react'

export type MediaUploadConfig = {
  /** API endpoint to upload to */
  apiEndpoint: string
  /** Callback when upload succeeds */
  onSuccess?: (result: any) => void | Promise<void>
  /** File validation function */
  validateFile?: (file: File) => { valid: boolean; error?: string }
  /** Whether to show confirmation dialog when replacing existing media */
  confirmReplacement?: boolean
  /** Existing media filename (for replacement check) */
  existingMedia?: string | null
}

export type UploadProgress = {
  /** Whether upload is in progress */
  isUploading: boolean
  /** Upload progress percentage (0-100) */
  progress: number
  /** Error message if upload failed */
  error: string | null
}

export function useMediaUpload(config: MediaUploadConfig) {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const uploadMedia = useCallback(
    async (file: File): Promise<{ success: boolean; data?: any; error?: string }> => {
      try {
        setError(null)

        // Validate file if validator provided
        if (config.validateFile) {
          const validation = config.validateFile(file)
          if (!validation.valid) {
            setError(validation.error || 'Invalid file')
            return { success: false, error: validation.error }
          }
        }

        setIsUploading(true)
        setProgress(0)

        // Simulate progress
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return 90
            }
            return prev + 10
          })
        }, 200)

        // Upload file
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch(config.apiEndpoint, {
          method: 'POST',
          body: formData,
        })

        clearInterval(progressInterval)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Upload failed')
        }

        const result = await response.json()
        setProgress(100)

        // Call success callback
        if (config.onSuccess) {
          await config.onSuccess(result)
        }

        // Reset after short delay
        setTimeout(() => {
          setIsUploading(false)
          setProgress(0)
        }, 500)

        return { success: true, data: result.data }
      } catch (err: any) {
        setIsUploading(false)
        setProgress(0)
        const errorMessage = err.message || 'Upload failed'
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }
    },
    [config]
  )

  const reset = useCallback(() => {
    setIsUploading(false)
    setProgress(0)
    setError(null)
  }, [])

  return {
    uploadMedia,
    isUploading,
    progress,
    error,
    reset,
  }
}
