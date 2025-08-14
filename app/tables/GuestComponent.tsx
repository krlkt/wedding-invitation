'use client';

import { useDrag } from 'react-dnd';
import { updateGuestName } from './actions';
import { useRef, useState } from 'react';
import { Locations } from '../components/LocationComponent';
import { Table } from '../models/table';
import { Guest } from '../models/guest';
import { IconButton } from '@mui/material';
import OpenWithIcon from '@mui/icons-material/OpenWith';

interface GuestComponentProps {
    guest: Guest;
    tables: Table[];
    location: Locations;
    onOpenMoveModal: (guest: Guest) => void;
    tableSearchTerm: string;
}

export const GuestComponent = ({ guest, tables, location, onOpenMoveModal, tableSearchTerm }: GuestComponentProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'guest',
        item: { id: guest.id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    drag(ref);

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(guest.name);

    const handleNameChange = async () => {
        await updateGuestName(guest.id, name, location);
        setIsEditing(false);
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
        <div ref={ref} className={`p-2 rounded-md shadow-md ${isDragging ? 'opacity-50' : 'bg-white'}`}>
            <div className="flex justify-between items-center">
                {isEditing ? (
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={handleNameChange}
                        autoFocus
                        className="border p-1 rounded-md w-full"
                    />
                ) : (
                    <span onClick={() => setIsEditing(true)}>
                        {getHighlightedText(guest.name, tableSearchTerm)}
                        {guest.name !== guest.rsvp_name && <span className="text-xs text-gray-500 ml-1">({guest.rsvp_id})</span>}
                    </span>
                )}
                <IconButton onClick={() => onOpenMoveModal(guest)} className="ml-2" size="small">
                    <OpenWithIcon />
                </IconButton>
            </div>
        </div>
    );
};
