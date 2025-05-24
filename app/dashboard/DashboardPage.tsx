'use client';
import { useState } from 'react';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { RSVP } from '../models/rsvp';

const rows: GridRowsProp<RSVP> = [
    { id: '1', name: 'Karel', attend: 'yes', guest_number: 2, notes: '' },
    { id: '2', name: 'Aidos', attend: 'yes', guest_number: 2, notes: 'I am a vegan' },
    { id: '3', name: 'Crazy guy', attend: 'yes', guest_number: 4, notes: 'I am a vegan but I eat fish' },
];

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'name', headerName: 'Name', width: 300 },
    { field: 'attend', headerName: 'Attend?', width: 100 },
    { field: 'guest_number', headerName: 'Number of guest', width: 100 },
    { field: 'notes', headerName: 'Notes', width: 400 },
];

const DashboardPage = () => {
    const [authenticated, setAuthenticated] = useState<boolean>(true);

    return authenticated ? (
        <div style={{ height: 300, width: '100%' }}>
            <DataGrid rows={rows} columns={columns} />
        </div>
    ) : (
        <div>Login Page</div>
    );
};

export default DashboardPage;
