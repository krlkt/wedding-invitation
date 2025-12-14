'use client';

import { createContext, useContext, RefObject } from 'react';

/**
 * ScrollContainer Context
 *
 * Provides a scroll container ref for scroll animations.
 * Used by Groom/Bride components to track scroll in embedded previews.
 * If not provided, components will use window scroll by default.
 */

interface ScrollContainerContextValue {
  containerRef?: RefObject<HTMLElement>;
  isEmbedded?: boolean; // Track if we're in embedded mode
}

const ScrollContainerContext = createContext<ScrollContainerContextValue>({});

export function ScrollContainerProvider({
  children,
  containerRef,
  isEmbedded = false,
}: {
  children: React.ReactNode;
  containerRef?: RefObject<HTMLElement>;
  isEmbedded?: boolean;
}) {
  return (
    <ScrollContainerContext.Provider value={{ containerRef, isEmbedded }}>
      {children}
    </ScrollContainerContext.Provider>
  );
}

export function useScrollContainer() {
  return useContext(ScrollContainerContext);
}
