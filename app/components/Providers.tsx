'use client'

import { ReactNode } from 'react'

import { SnackbarProvider as NotistackProvider } from 'notistack'
import { SnackbarProvider } from '../context/SnackbarContext'
import { Toaster } from '@/app/components/shadcn/sonner'

import { useViewportHeight } from '../utils/useViewportHeight'

const Providers = ({ children }: { children: ReactNode }) => {
  useViewportHeight()

  return (
    <SnackbarProvider>
      <NotistackProvider autoHideDuration={2000} maxSnack={3}>
        {children}
        <Toaster />
      </NotistackProvider>
    </SnackbarProvider>
  )
}

export default Providers
