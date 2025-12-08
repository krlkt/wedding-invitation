'use client'

import { FC, useRef, useState } from 'react'

import { useRouter } from 'next/navigation'

import CloseIcon from '@mui/icons-material/Close'
import { Button, TextField, IconButton } from '@mui/material'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { DndProvider, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { Locations } from '@/app/components/LocationComponent'
import { Guest } from '@/app/models/guest'
import { Table } from '@/app/models/table'
import { naturalSort } from '@/app/utils/sort'

import { moveGuestToTable, synchronizeGuests } from './actions'
import { ManageTablesModal } from './ManageTablesModal'
import { MoveGuestModal } from './MoveGuestModal'
import { TableComponent } from './TableComponent'
import { VirtualizedGuestList } from './VirtualizedGuestList'

interface TableManagementClientPageProps {
  initialTables: Table[]
  initialUnassignedGuests: Guest[]
  location: Locations
}

interface TableManagementLayoutProps {
  tables: Table[]
  unassignedGuests: Guest[]
  location: Locations
}

const TableManagementLayout: FC<TableManagementLayoutProps> = ({
  tables,
  unassignedGuests,
  location,
}) => {
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [tableSearchTerm, setTableSearchTerm] = useState('')
  const [movingGuest, setMovingGuest] = useState<Guest | null>(null)
  const [isUnassignedGuestsOpen, setIsUnassignedGuestsOpen] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isManageTablesModalOpen, setIsManageTablesModalOpen] = useState(false)

  const sortedTables = [...tables].sort((a, b) => naturalSort(a.name, b.name))

  const filteredUnassignedGuests = unassignedGuests.filter((guest) =>
    guest.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredTables = sortedTables.filter((table) => {
    if (tableSearchTerm.trim() === '') {
      return true
    }
    const searchTerm = tableSearchTerm.toLowerCase()
    const tableNameMatch = table.name.toLowerCase().includes(searchTerm)
    const guestNameMatch = table.guests.some((guest) =>
      guest.name.toLowerCase().includes(searchTerm)
    )
    return tableNameMatch || guestNameMatch
  })

  const handleOpenMoveModal = (guest: Guest) => setMovingGuest(guest)
  const handleCloseMoveModal = () => {
    setMovingGuest(null)
    router.refresh()
  }

  const handleExportPdf = () => {
    const doc = new jsPDF()
    const data = sortedTables.flatMap((table) =>
      table.guests.map((guest) => [table.name, guest.name])
    )

    autoTable(doc, {
      head: [['Table Name', 'Guest Name']],
      body: data,
    })

    doc.save(`tables-${location}.pdf`)
  }

  const [{ isOver: isOverUnassigned }, dropUnassigned] = useDrop(() => ({
    accept: 'guest',
    drop: async (item: { id: number }) => {
      await moveGuestToTable(item.id, null, location)
      router.refresh()
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  dropUnassigned(ref)

  return (
    <div className="p-4">
      <ManageTablesModal
        open={isManageTablesModalOpen}
        onClose={() => setIsManageTablesModalOpen(false)}
        tables={sortedTables}
        location={location}
      />
      {movingGuest && (
        <MoveGuestModal
          guest={movingGuest}
          tables={sortedTables}
          location={location}
          onClose={handleCloseMoveModal}
        />
      )}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Table Management ({location})</h1>
        <div className="flex gap-2">
          <Button variant="contained" onClick={handleExportPdf}>
            Export as PDF
          </Button>
          <Button
            variant="contained"
            onClick={async () => {
              setIsSyncing(true)
              await synchronizeGuests(location)
              router.refresh()
              setIsSyncing(false)
            }}
            disabled={isSyncing}
          >
            {isSyncing ? 'Syncing...' : 'Synchronize'}
          </Button>
          <Button variant="contained" onClick={() => setIsManageTablesModalOpen(true)}>
            Manage Tables
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 2xl:grid-cols-6">
        <div
          ref={ref}
          className={`rounded-lg bg-gray-100 p-4 md:col-span-3 2xl:col-span-1 ${
            isOverUnassigned ? 'bg-green-200' : ''
          } ${isUnassignedGuestsOpen ? 'block' : 'hidden'}`}
        >
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xl font-bold">Unassigned Guests</h2>
            <IconButton onClick={() => setIsUnassignedGuestsOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>
          <TextField
            label="Search Guests"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
            size="small"
          />
          <div className="h-[calc(100vh-260px)] space-y-2">
            <VirtualizedGuestList
              guests={filteredUnassignedGuests}
              tables={sortedTables}
              location={location}
              onOpenMoveModal={handleOpenMoveModal}
              tableSearchTerm={searchTerm}
            />
          </div>
        </div>
        <div
          className={`${
            isUnassignedGuestsOpen
              ? 'md:col-span-9 2xl:col-span-5'
              : 'md:col-span-12 2xl:col-span-6'
          } space-y-4 rounded-lg bg-gray-100 p-4`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {!isUnassignedGuestsOpen && (
                <Button
                  onClick={() => setIsUnassignedGuestsOpen(true)}
                  variant="outlined"
                  size="small"
                >
                  Show Unassigned Guests
                </Button>
              )}
              <h2 className="text-xl font-bold">Tables</h2>
            </div>
            <div className="flex items-center gap-2">
              <TextField
                label="Search Tables"
                variant="outlined"
                value={tableSearchTerm}
                onChange={(e) => setTableSearchTerm(e.target.value)}
                sx={{ mb: 2 }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {filteredTables.map((table) => (
              <TableComponent
                key={table.id}
                table={table}
                tables={tables}
                location={location}
                onOpenMoveModal={handleOpenMoveModal}
                tableSearchTerm={tableSearchTerm}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const TableManagementClientPage = ({
  initialTables,
  initialUnassignedGuests,
  location,
}: TableManagementClientPageProps) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <TableManagementLayout
        tables={initialTables}
        unassignedGuests={initialUnassignedGuests}
        location={location}
      />
    </DndProvider>
  )
}

export default TableManagementClientPage
