'use client';

import { useRef, useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { moveGuestToTable } from './actions';
import { Locations } from '../components/LocationComponent';
import { VirtualizedGuestList } from './VirtualizedGuestList';
import { Table } from '../models/table';
import { Guest } from '../models/guest';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface TableComponentProps {
    table: Table;
    tables: Table[];
    location: Locations;
    onOpenMoveModal: (guest: Guest) => void;
    tableSearchTerm: string;
}

export const TableComponent = ({ table, tables, location, onOpenMoveModal, tableSearchTerm }: TableComponentProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if (tableSearchTerm.length > 0) {
            setExpanded(true);
        } else {
            setExpanded(false);
        }
    }, [tableSearchTerm]);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'guest',
        drop: async (item: { id: number }) => {
            await moveGuestToTable(item.id, table.id, location);
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    drop(ref);

    

    const getHighlightedText = (text: string, highlight: string) => {
        if (!highlight) {
            return <span>{text}</span>;
        }
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
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
        );
    };

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
                    <div className="flex justify-between items-center w-full">
                        <div className="flex-grow w-0 flex justify-between">
                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={table.name}>
                                {getHighlightedText(table.name, tableSearchTerm)}
                            </Typography>
                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 'bold', whiteSpace: 'nowrap'}}>
                                ({table.guests.length}/{table.max_guests})
                            </Typography>
                        </div>
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    <div className="space-y-2 mt-2 h-64 overflow-auto">
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
    );
};
