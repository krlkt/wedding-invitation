/**
 * T056: Tenant Context Provider
 *
 * React context for multi-tenant wedding data.
 * Provides current wedding configuration based on subdomain.
 */

'use client'

import { createContext, useContext, ReactNode } from 'react'

interface TenantContextValue {
  subdomain: string | null
  weddingConfigId: string | null
}

const TenantContext = createContext<TenantContextValue>({
  subdomain: null,
  weddingConfigId: null,
})

export function TenantProvider({
  children,
  subdomain,
  weddingConfigId,
}: {
  children: ReactNode
  subdomain: string | null
  weddingConfigId: string | null
}) {
  return (
    <TenantContext.Provider value={{ subdomain, weddingConfigId }}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider')
  }
  return context
}
