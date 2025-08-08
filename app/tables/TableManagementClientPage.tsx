'use client';

import { FC, useRef, useState } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { createTable, moveGuestToTable } from './actions';
import { TableComponent } from './TableComponent';
import { Locations } from '../components/LocationComponent';
import { Button, TextField } from '@mui/material';
import { VirtualizedGuestList } from './VirtualizedGuestList';
import { MoveGuestModal } from './MoveGuestModal';
import { Table } from '../models/table';
import { Guest } from '../models/guest';

interface TableManagementClientPageProps {
    initialTables: Table[];
    initialUnassignedGuests: Guest[];
    location: Locations;
}

interface TableManagementLayoutProps {
    tables: Table[];
    unassignedGuests: Guest[];
    location: Locations;
    onCreateTable: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

const TableManagementLayout: FC<TableManagementLayoutProps> = ({
    tables,
    unassignedGuests,
    location,
    onCreateTable,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [movingGuest, setMovingGuest] = useState<Guest | null>(null);
    const [isAddTableFormVisible, setIsAddTableFormVisible] = useState(false);

    const filteredUnassignedGuests = unassignedGuests.filter((guest) =>
        guest.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenMoveModal = (guest: Guest) => setMovingGuest(guest);
    const handleCloseMoveModal = () => setMovingGuest(null);

    const handleCreateTable = async (event: React.FormEvent<HTMLFormElement>) => {
        await onCreateTable(event);
        setIsAddTableFormVisible(false);
    };

    const [{ isOver: isOverUnassigned }, dropUnassigned] = useDrop(() => ({
        accept: 'guest',
        drop: async (item: { id: number }) => {
            await moveGuestToTable(item.id, null, location);
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    dropUnassigned(ref);

    return (
        <div className="p-4">
            {movingGuest && (
                <MoveGuestModal
                    guest={movingGuest}
                    tables={tables}
                    location={location}
                    onClose={handleCloseMoveModal}
                />
            )}
            <div className="flex items-center mb-4">
                <h1 className="text-2xl font-bold">Table Management ({location})</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div
                    ref={ref}
                    className={`md:col-span-1 bg-gray-100 p-4 rounded-lg ${isOverUnassigned ? 'bg-green-200' : ''}`}
                >
                    <h2 className="text-xl font-bold mb-2">Unassigned Guests</h2>
                    <TextField
                        label="Search Guests"
                        variant="outlined"
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <div className="space-y-2 h-[calc(100vh-260px)]">
                        <VirtualizedGuestList
                            guests={filteredUnassignedGuests}
                            tables={tables}
                            location={location}
                            onOpenMoveModal={handleOpenMoveModal}
                        />
                    </div>
                </div>
                <div className="md:col-span-5 bg-gray-100 p-4 rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold mb-2">Tables</h2>
                        {!isAddTableFormVisible && (
                            <Button
                                variant="contained"
                                onClick={() => setIsAddTableFormVisible(true)}
                                className="self-end"
                            >
                                +
                            </Button>
                        )}
                    </div>
                    {isAddTableFormVisible && (
                        <div className="flex-grow">
                            <form onSubmit={handleCreateTable} className="flex space-x-2 mt-2">
                                <TextField
                                    type="text"
                                    name="newTableName"
                                    placeholder="Table Name"
                                    className="w-full"
                                />
                                <TextField
                                    type="number"
                                    name="newTableMaxGuests"
                                    placeholder="Max Guests"
                                    defaultValue={10}
                                />
                                <Button type="submit" variant="contained">
                                    Add Table
                                </Button>
                                <Button variant="outlined" onClick={() => setIsAddTableFormVisible(false)}>
                                    Cancel
                                </Button>
                            </form>
                        </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                        {tables.map((table) => (
                            <TableComponent
                                key={table.id}
                                table={table}
                                tables={tables}
                                location={location}
                                onOpenMoveModal={handleOpenMoveModal}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const TableManagementClientPage = ({
    initialTables,
    initialUnassignedGuests,
    location,
}: TableManagementClientPageProps) => {
    const [tables, setTables] = useState<Table[]>(initialTables);
    const [unassignedGuests, setUnassignedGuests] = useState<Guest[]>(initialUnassignedGuests);

    const handleCreateTable = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const newTableName = (form.elements.namedItem('newTableName') as HTMLInputElement).value;
        const newTableMaxGuests = parseInt((form.elements.namedItem('newTableMaxGuests') as HTMLInputElement).value);
        await createTable(newTableName, newTableMaxGuests, location);
        form.reset();
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <TableManagementLayout
                tables={tables}
                unassignedGuests={unassignedGuests}
                location={location}
                onCreateTable={handleCreateTable}
            />
        </DndProvider>
    );
};

export default TableManagementClientPage;
