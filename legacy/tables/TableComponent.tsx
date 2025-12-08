'use client'

import { useRef, useState, useEffect } from 'react'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material'
import { useDrop } from 'react-dnd'

import { Locations } from '@/components/LocationComponent'
import { Guest } from '@/legacy/types/guest'
import { Table } from '@/legacy/types/table'

import { moveGuestToTable } from './actions'
import { VirtualizedGuestList } from './VirtualizedGuestList'

interface TableComponentProps {
  table: Table
  tables: Table[]
  location: Locations
  onOpenMoveModal: (guest: Guest) => void
  tableSearchTerm: string
}

export const TableComponent = ({
  table,
  tables,
  location,
  onOpenMoveModal,
  tableSearchTerm,
}: TableComponentProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (tableSearchTerm.length > 0) {
      setExpanded(true)
    } else {
      setExpanded(false)
    }
  }, [tableSearchTerm])

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'guest',
    drop: async (item: { id: number }) => {
      await moveGuestToTable(item.id, table.id, location)
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  drop(ref)

  const getHighlightedText = (text: string, highlight: string) => {
    if (!highlight) {
      return <span>{text}</span>
    }
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="bg-yellow-200">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    )
  }

  return (
    <div ref={ref} className="min-w-[16rem] rounded-lg">
      <Accordion
        sx={{ backgroundColor: isOver ? '#a7f3d0' : 'white' }}
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel-${table.id}-content`}
          id={`panel-${table.id}-header`}
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex w-0 flex-grow justify-between">
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={table.name}
              >
                {getHighlightedText(table.name, tableSearchTerm)}
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                ({table.guests.length}/{table.max_guests})
              </Typography>
            </div>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="mt-2 h-64 space-y-2 overflow-auto">
            <VirtualizedGuestList
              guests={table.guests}
              tables={tables}
              location={location}
              onOpenMoveModal={onOpenMoveModal}
              tableSearchTerm={tableSearchTerm}
            />
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}
