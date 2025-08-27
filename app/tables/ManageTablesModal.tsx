'use client';

import { FC, useState } from 'react';
import Modal from '../components/Modal';
import { Table } from '../models/table';
import { Locations } from '../components/LocationComponent';
import { Button, TextField, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { createTable, updateTableName, updateTableMaxGuests, deleteTable } from './actions';
import { naturalSort } from '../utils/sort';

interface ManageTablesModalProps {
    open: boolean;
    onClose: () => void;
    tables: Table[];
    location: Locations;
}

export const ManageTablesModal: FC<ManageTablesModalProps> = ({ open, onClose, tables, location }) => {
    const [newTableName, setNewTableName] = useState('');
    const [newTableMaxGuests, setNewTableMaxGuests] = useState(10);
    const [editingTableId, setEditingTableId] = useState<number | null>(null);
    const [editingTableName, setEditingTableName] = useState('');
    const [editingTableMaxGuests, setEditingTableMaxGuests] = useState(0);

    const handleCreateTable = async () => {
        await createTable(newTableName, newTableMaxGuests, location);
        setNewTableName('');
        setNewTableMaxGuests(10);
    };

    const handleEdit = (table: Table) => {
        setEditingTableId(table.id);
        setEditingTableName(table.name);
        setEditingTableMaxGuests(table.max_guests);
    };

    const handleCancelEdit = () => {
        setEditingTableId(null);
        setEditingTableName('');
        setEditingTableMaxGuests(0);
    };

    const handleSave = async (tableId: number) => {
        await updateTableName(tableId, editingTableName, location);
        await updateTableMaxGuests(tableId, editingTableMaxGuests, location);
        handleCancelEdit();
    };

    const sortedTables = [...tables].sort((a, b) => naturalSort(a.name, b.name));

    return (
        <Modal open={open} onClose={onClose}>
            <div className="p-4">
                <h2 className="text-2xl font-bold mb-4">Manage Tables</h2>
                <div className="space-y-4">
                    <div className="flex space-x-2">
                        <TextField
                            label="Table Name"
                            value={newTableName}
                            onChange={(e) => setNewTableName(e.target.value)}
                            fullWidth
                            size='small'
                        />
                        <TextField
                            label="Max Guests"
                            type="number"
                            value={newTableMaxGuests}
                            onChange={(e) => setNewTableMaxGuests(parseInt(e.target.value))}
                            size='small'
                        />
                        <Button onClick={handleCreateTable} variant="contained" startIcon={<AddIcon />}>
                            Add
                        </Button>
                    </div>
                    <div className="space-y-2 overflow-auto h-[calc(100vh-10rem)]">
                        {sortedTables.map((table) => (
                            <div key={table.id} className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
                                {editingTableId === table.id ? (
                                    <div className="flex-grow flex items-center space-x-2">
                                        <TextField
                                            value={editingTableName}
                                            onChange={(e) => setEditingTableName(e.target.value)}
                                            size="small"
                                            fullWidth
                                        />
                                        <TextField
                                            type="number"
                                            value={editingTableMaxGuests}
                                            onChange={(e) => setEditingTableMaxGuests(parseInt(e.target.value))}
                                            size="small"
                                        />
                                        <Button onClick={() => handleSave(table.id)} variant="contained" size="small">Save</Button>
                                        <Button onClick={handleCancelEdit} variant="outlined" size="small">Cancel</Button>
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <p className="font-bold">{table.name}</p>
                                            <p className="text-sm text-gray-600">{table.guests.length} / {table.max_guests} guests</p>
                                        </div>
                                        <div className="flex items-center">
                                            <IconButton size="small" onClick={() => handleEdit(table)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton size="small" onClick={() => deleteTable(table.id, location)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    );
};