'use client'

import { Locations } from '../components/LocationComponent'
import { createContext, ReactNode, useContext, useState } from 'react'

type LocationContextType = {
  location?: Locations
}
const LocationContext = createContext<LocationContextType | undefined>(undefined)

export const LocationProvider = ({
  location,
  children,
}: {
  location: Locations
  children: ReactNode
}) => {
  const [currentLocation] = useState<Locations>(location)

  return (
    <LocationContext.Provider value={{ location: currentLocation }}>
      {children}
    </LocationContext.Provider>
  )
}

export const useLocation = () => {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
