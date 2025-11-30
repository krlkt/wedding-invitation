'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { toast } from 'sonner'

interface SnackbarOptions {
  duration?: number
  /** If true, toast will not auto-dismiss and user must click close button */
  persist?: boolean
}

interface SnackbarContextValue {
  showSuccess: (message: string, options?: SnackbarOptions) => void
  showWarning: (message: string, options?: SnackbarOptions) => void
  showError: (message: string, options?: SnackbarOptions) => void
}

const SnackbarContext = createContext<SnackbarContextValue | undefined>(undefined)

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const showSuccess = (message: string, options?: SnackbarOptions) => {
    toast.success(message, {
      duration: options?.persist ? Infinity : options?.duration,
      closeButton: !!options?.persist,
    })
  }

  const showWarning = (message: string, options?: SnackbarOptions) => {
    toast.warning(message, {
      duration: options?.persist ? Infinity : options?.duration,
      closeButton: !!options?.persist,
    })
  }

  const showError = (message: string, options?: SnackbarOptions) => {
    toast.error(message, {
      duration: options?.persist ? Infinity : options?.duration,
      closeButton: !!options?.persist,
    })
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
 * // Show success notification (default duration)
 * showSuccess('Settings saved successfully!');
 *
 * // Show warning notification with custom duration (5 seconds)
 * showWarning('Please review your input.', { duration: 5000 });
 *
 * // Show error notification that stays longer (10 seconds)
 * showError('Failed to save settings. Please try again.', { duration: 10000 });
 *
 * // Show persistent notification that requires user to close
 * showError('Critical error - action required!', { persist: true });
 *
 * // Combine options
 * showWarning('Important message', { duration: 8000 });
 * ```
 */
export function useSnackbar() {
  const context = useContext(SnackbarContext)
  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider')
  }
  return context
}
