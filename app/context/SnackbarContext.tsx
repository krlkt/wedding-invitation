'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { toast } from 'sonner'

interface SnackbarContextValue {
  showSuccess: (message: string) => void
  showWarning: (message: string) => void
  showError: (message: string) => void
}

const SnackbarContext = createContext<SnackbarContextValue | undefined>(undefined)

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const showSuccess = (message: string) => {
    toast.success(message)
  }

  const showWarning = (message: string) => {
    toast.warning(message)
  }

  const showError = (message: string) => {
    toast.error(message)
  }

  const value: SnackbarContextValue = {
    showSuccess,
    showWarning,
    showError,
  }

  return <SnackbarContext.Provider value={value}>{children}</SnackbarContext.Provider>
}

/**
 * Custom hook to access the snackbar notification system.
 *
 * @example
 * ```tsx
 * const { showSuccess, showWarning, showError } = useSnackbar();
 *
 * // Show success notification
 * showSuccess('Settings saved successfully!');
 *
 * // Show warning notification
 * showWarning('Please review your input.');
 *
 * // Show error notification
 * showError('Failed to save settings. Please try again.');
 * ```
 */
export function useSnackbar() {
  const context = useContext(SnackbarContext)
  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider')
  }
  return context
}
