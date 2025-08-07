'use client';

import { FC, useState } from 'react';
import Modal from '../components/Modal';
import { moveGuestToTable } from './actions';
import { Locations } from '../components/LocationComponent';
import { Guest } from '../models/guest';
import { Table } from '../models/table';

interface MoveGuestModalProps {
    guest: Guest;
    tables: Table[];
    location: Locations;
    onClose: () => void;
}

export const MoveGuestModal: FC<MoveGuestModalProps> = ({ guest, tables, location, onClose }) => {
    const [selectedTable, setSelectedTable] = useState<number | null>(guest.table_id);

    const handleMoveGuest = async () => {
        await moveGuestToTable(guest.id, selectedTable, location);
        onClose();
    };

    return (
        <Modal open={true} onClose={onClose}>
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Move {guest.name}</h2>
                <div className="space-y-2">
                    <div
                        key="unassigned"
                        className={`p-2 rounded-md cursor-pointer ${
                            selectedTable === null ? 'bg-blue-200' : 'bg-gray-100'
                        }`}
                        onClick={() => setSelectedTable(null)}
                    >
                        Unassigned
                    </div>
                    {tables.map((table) => (
                        <div
                            key={table.id}
                            className={`p-2 rounded-md cursor-pointer ${
                                selectedTable === table.id ? 'bg-blue-200' : 'bg-gray-100'
                            }`}
                            onClick={() => setSelectedTable(table.id)}
                        >
                            {table.name} ({table.guests.length}/{table.max_guests})
                        </div>
                    ))}
                </div>
                <button onClick={handleMoveGuest} className="mt-4 bg-blue-500 text-white p-2 rounded-md w-full">
                    Move
                </button>
            </div>
        </Modal>
    );
};
