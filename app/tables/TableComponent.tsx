'use client';

import { useState } from 'react';
import { useDrop } from 'react-dnd';
import { moveGuestToTable, updateTableName, updateTableMaxGuests, deleteTable } from './actions';
import { Locations } from '../components/LocationComponent';
import { VirtualizedGuestList } from './VirtualizedGuestList';
import { Table } from '../models/table';
import { Guest } from '../models/guest';

interface TableComponentProps {
    table: Table;
    tables: Table[];
    location: Locations;
    onOpenMoveModal: (guest: Guest) => void;
}

export const TableComponent = ({ table, tables, location, onOpenMoveModal }: TableComponentProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(table.name);
    const [maxGuests, setMaxGuests] = useState(table.max_guests);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'guest',
        drop: async (item: { id: number }) => {
            await moveGuestToTable(item.id, table.id, location);
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

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

    return (
        <div ref={drop} className={`min-w-[20rem] p-4 rounded-lg ${isOver ? 'bg-green-200' : 'bg-white'}`}>
            {isEditing ? (
                <div className="flex justify-between items-center mb-2">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border p-1 rounded-md w-full mr-2"
                    />
                    <input
                        type="number"
                        value={maxGuests}
                        onChange={(e) => setMaxGuests(parseInt(e.target.value))}
                        className="border p-1 rounded-md w-20"
                    />
                    <button onClick={handleSave} className="ml-2 bg-blue-500 text-white p-1 rounded-md">
                        Save
                    </button>
                    <button onClick={() => setIsEditing(false)} className="ml-2 bg-gray-200 p-1 rounded-md">
                        Cancel
                    </button>
                </div>
            ) : (
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold">
                        {table.name} ({table.guests.length}/{table.max_guests})
                    </h3>
                    <div>
                        <button onClick={() => setIsEditing(true)} className="ml-2 bg-gray-200 p-1 rounded-md">
                            Edit
                        </button>
                        <button onClick={handleDelete} className="ml-2 bg-red-500 text-white p-1 rounded-md">
                            Delete
                        </button>
                    </div>
                </div>
            )}
            <div className="space-y-2 mt-2 h-64 overflow-auto">
                <VirtualizedGuestList
                    guests={table.guests}
                    tables={tables}
                    location={location}
                    onOpenMoveModal={onOpenMoveModal}
                />
            </div>
        </div>
    );
};
