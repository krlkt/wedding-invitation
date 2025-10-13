'use client';

import { createContext, useContext } from 'react';
import type { WeddingConfiguration } from '@/app/db/schema';

/**
 * Wedding Data Context
 *
 * Provides wedding configuration data throughout the component tree.
 * Similar pattern to LocationProvider for consistency.
 */

interface WeddingDataContextValue {
    config: WeddingConfiguration;
}

const WeddingDataContext = createContext<WeddingDataContextValue | null>(null);

export function WeddingDataProvider({
    children,
    config,
}: {
    children: React.ReactNode;
    config: WeddingConfiguration;
}) {
    return <WeddingDataContext.Provider value={{ config }}>{children}</WeddingDataContext.Provider>;
}

export function useWeddingData() {
    const context = useContext(WeddingDataContext);
    if (!context) {
        throw new Error('useWeddingData must be used within WeddingDataProvider');
    }
    return context;
}
