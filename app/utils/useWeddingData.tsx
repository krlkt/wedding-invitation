'use client'

import { createContext, useContext } from 'react'
import type { WeddingConfiguration, StartingSectionContent } from '@/app/db/schema'
import type { FeatureName } from '@/app/db/schema/features'

/**
 * Wedding Data Context
 *
 * Provides wedding configuration data and feature toggles throughout the component tree.
 * Similar pattern to LocationProvider for consistency.
 */

interface WeddingDataContextValue {
  config: WeddingConfiguration
  features: Record<FeatureName, boolean>
  startingSection?: StartingSectionContent | null
}

const WeddingDataContext = createContext<WeddingDataContextValue | null>(null)

export function WeddingDataProvider({
  children,
  config,
  features,
  startingSection,
}: {
  children: React.ReactNode
  config: WeddingConfiguration
  features: Record<FeatureName, boolean>
  startingSection?: StartingSectionContent | null
}) {
  return (
    <WeddingDataContext.Provider value={{ config, features, startingSection }}>
      {children}
    </WeddingDataContext.Provider>
  )
}

export function useWeddingData() {
  const context = useContext(WeddingDataContext)
  if (!context) {
    throw new Error('useWeddingData must be used within WeddingDataProvider')
  }
  return context
}
