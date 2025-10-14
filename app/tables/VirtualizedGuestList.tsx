'use client'

import { useVirtualizer } from '@tanstack/react-virtual'
import { GuestComponent } from './GuestComponent'
import { Locations } from '../components/LocationComponent'
import { useRef } from 'react'
import { Guest } from '../models/guest'
import { Table } from '../models/table'

interface VirtualizedGuestListProps {
  guests: Guest[]
  tables: Table[]
  location: Locations
  onOpenMoveModal: (guest: Guest) => void
  tableSearchTerm: string
}

export const VirtualizedGuestList = ({
  guests,
  tables,
  location,
  onOpenMoveModal,
  tableSearchTerm,
}: VirtualizedGuestListProps) => {
  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: guests.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 58, // Estimate the size of each guest component + 8px padding
    overscan: 5,
  })

  return (
    <div ref={parentRef} style={{ height: '100%', overflow: 'auto' }}>
      <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
        {rowVirtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={guests[virtualItem.index].id}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
              paddingBottom: '8px',
            }}
          >
            <GuestComponent
              key={guests[virtualItem.index].id}
              guest={guests[virtualItem.index]}
              tables={tables}
              location={location}
              onOpenMoveModal={onOpenMoveModal}
              tableSearchTerm={tableSearchTerm}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
