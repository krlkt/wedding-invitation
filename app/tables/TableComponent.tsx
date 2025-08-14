'use client';

import { useRef, useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { moveGuestToTable, updateTableName, updateTableMaxGuests, deleteTable } from './actions';
import { Locations } from '../components/LocationComponent';
import { VirtualizedGuestList } from './VirtualizedGuestList';
import { Table } from '../models/table';
import { Guest } from '../models/guest';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Button,
    TextField,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface TableComponentProps {
    table: Table;
    tables: Table[];
    location: Locations;
    onOpenMoveModal: (guest: Guest) => void;
    tableSearchTerm: string;
}

export const TableComponent = ({ table, tables, location, onOpenMoveModal, tableSearchTerm }: TableComponentProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(table.name);
    const [maxGuests, setMaxGuests] = useState(table.max_guests);
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

    const handleSave = async () => {
        await updateTableName(table.id, name, location);
        await updateTableMaxGuests(table.id, maxGuests, location);
        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete table ${table.name}?`)) {
            await deleteTable(table.id, location);
        }
    };

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
        <div ref={ref} className="min-w-[20rem] rounded-lg">
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
                    {isEditing ? (
                        <div className="flex justify-between items-center w-full">
                            <TextField
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border p-1 rounded-md w-full mr-2"
                                size="small"
                                variant="outlined"
                                onClick={(e) => e.stopPropagation()}
                            />
                            <TextField
                                type="number"
                                value={maxGuests}
                                onChange={(e) => setMaxGuests(parseInt(e.target.value))}
                                className="border p-1 rounded-md w-28"
                                size="small"
                                variant="outlined"
                                onClick={(e) => e.stopPropagation()}
                            />
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSave();
                                }}
                                className="ml-2"
                                variant="contained"
                                size="small"
                            >
                                Save
                            </Button>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEditing(false);
                                }}
                                className="ml-2"
                                variant="outlined"
                                size="small"
                            >
                                Cancel
                            </Button>
                        </div>
                    ) : (
                        <div className="flex justify-between items-center w-full">
                            <Typography sx={{ fontWeight: 'bold' }}>
                                {getHighlightedText(table.name, tableSearchTerm)} ({table.guests.length}/
                                {table.max_guests})
                            </Typography>
                            <div className="flex items-center">
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsEditing(true);
                                    }}
                                    className="ml-2 p-1 cursor-pointer"
                                >
                                    <EditIcon fontSize="small" />
                                </div>
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete();
                                    }}
                                    className="ml-2 p-1 cursor-pointer"
                                >
                                    <DeleteIcon fontSize="small" />
                                </div>
                            </div>
                        </div>
                    )}
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
