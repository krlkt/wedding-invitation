'use client';

import { useDrag } from 'react-dnd';
import { updateGuestName } from './actions';
import { useRef, useState } from 'react';
import { Locations } from '../components/LocationComponent';
import { Table } from '../models/table';
import { Guest } from '../models/guest';
import { IconButton } from '@mui/material';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import { Switch } from '@mui/material';
import { updateGuestCheckinStatus } from './actions';

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
    const [isChecked, setIsChecked] = useState(guest.checked_in);

    const handleNameChange = async () => {
        await updateGuestName(guest.id, name, location);
        setIsEditing(false);
    };

    const handleCheckinToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newCheckedState = e.target.checked;
        setIsChecked(newCheckedState);
        await updateGuestCheckinStatus(guest.id, newCheckedState, location);
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
        <div ref={ref} className={`p-1 rounded-md shadow-md ${isDragging ? 'opacity-50' : 'bg-white'}`}>
            <div className="flex justify-between items-center">
                <Switch checked={isChecked} onChange={handleCheckinToggle} size="small" />
                {isEditing ? (
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={handleNameChange}
                        autoFocus
                        className="border p-1 rounded-md w-full text-sm"
                    />
                ) : (
                    <span onClick={() => setIsEditing(true)} className="flex-grow text-sm">
                        {getHighlightedText(guest.name, tableSearchTerm)}
                        {guest.name !== guest.rsvp_name && (
                            <span className="text-xs text-gray-500 ml-1">({guest.rsvp_id})</span>
                        )}
                    </span>
                )}
                <IconButton onClick={() => onOpenMoveModal(guest)} className="ml-2" size="small">
                    <OpenWithIcon fontSize='small' />
                </IconButton>
            </div>
        </div>
    );
};
