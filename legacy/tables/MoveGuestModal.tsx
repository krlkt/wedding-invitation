'use client';

import { FC, useState } from 'react';

import { Locations } from '@/components/LocationComponent';
import Modal from '@/components/Modal';
import { Guest } from '@/legacy/types/guest';
import { Table } from '@/legacy/types/table';

import { moveGuestToTable } from './actions';

interface MoveGuestModalProps {
  guest: Guest;
  tables: Table[];
  location: Locations;
  onClose: () => void;
}

export const MoveGuestModal: FC<MoveGuestModalProps> = ({ guest, tables, location, onClose }) => {
  const [selectedTable, setSelectedTable] = useState<number | null>(guest.table_id);
  const [searchTerm, setSearchTerm] = useState('');

  const handleMoveGuest = async () => {
    await moveGuestToTable(guest.id, selectedTable, location);
    onClose();
  };

  const filteredTables = tables.filter((table) =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal open onClose={onClose}>
      <div className="flex h-full flex-col p-4">
        <h2 className="mb-4 text-xl font-bold">Move {guest.name}</h2>
        <input
          type="text"
          placeholder="Search tables..."
          className="mb-4 w-full rounded-md border p-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex-1 space-y-2 overflow-y-auto">
          <div
            key="unassigned"
            className={`cursor-pointer rounded-md p-2 ${
              selectedTable === null ? 'bg-blue-200' : 'bg-gray-100'
            }`}
            onClick={() => setSelectedTable(null)}
          >
            Unassigned
          </div>
          {filteredTables.map((table) => (
            <div
              key={table.id}
              className={`cursor-pointer rounded-md p-2 ${
                selectedTable === table.id ? 'bg-blue-200' : 'bg-gray-100'
              }`}
              onClick={() => setSelectedTable(table.id)}
            >
              {table.name} ({table.guests.length}/{table.max_guests})
            </div>
          ))}
        </div>
        <button
          onClick={handleMoveGuest}
          className="mt-4 w-full rounded-md bg-blue-500 p-2 text-white"
        >
          Move
        </button>
      </div>
    </Modal>
  );
};
