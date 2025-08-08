'use client';

import { useDrag } from 'react-dnd';
import { updateGuestName } from './actions';
import { useRef, useState } from 'react';
import { Locations } from '../components/LocationComponent';
import { Table } from '../models/table';
import { Guest } from '../models/guest';

interface GuestComponentProps {
    guest: Guest;
    tables: Table[];
    location: Locations;
    onOpenMoveModal: (guest: Guest) => void;
}

export const GuestComponent = ({ guest, tables, location, onOpenMoveModal }: GuestComponentProps) => {
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
                    <span onClick={() => setIsEditing(true)}>{guest.name}</span>
                )}
                <button onClick={() => onOpenMoveModal(guest)} className="ml-2 bg-gray-200 p-1 rounded-md">
                    Move
                </button>
            </div>
        </div>
    );
};
