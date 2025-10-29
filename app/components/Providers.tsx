'use client'

import { ReactNode } from 'react'

import { SnackbarProvider } from 'notistack'

import { useViewportHeight } from '../utils/useViewportHeight'

const Providers = ({ children }: { children: ReactNode }) => {
  useViewportHeight()

  return (
    <SnackbarProvider autoHideDuration={2000} maxSnack={3}>
      {children}
    </SnackbarProvider>
  )
}

export default Providers
