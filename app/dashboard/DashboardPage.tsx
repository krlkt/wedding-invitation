'use client';

import '../globals.css';
import * as XLSX from 'xlsx';
import { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridActionsCellItem } from '@mui/x-data-grid';
import { TextField, Button, Box, Stack, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import { RSVP, RSVPForm } from '../models/rsvp';
import { addParticipant, getParticipants, deleteParticipant, importDataFromExcel } from './action';

const DashboardPage = () => {
    const [data, setData] = useState<RSVP[]>([]);
    const [isImporting, setIsImporting] = useState(false);
    const [form, setForm] = useState<RSVPForm>({
        name: '',
        attend: undefined,
        guest_number: undefined,
        notes: undefined,
        location: 'jakarta',
    });

    const fetchData = async () => {
        const participants = await getParticipants();
        setData(participants);
    };

    const addRow = async (data: RSVPForm) => {
        await addParticipant(data);
        setForm({ name: '', attend: undefined, guest_number: undefined, notes: undefined });
        fetchData();
    };

    const deleteRow = async (id: string) => {
        await deleteParticipant(id);
        fetchData();
    };

    const processRowUpdate = async (newRow: RSVP, oldRow: RSVP) => {
        try {
            await addParticipant(newRow);
            return newRow;
        } catch (error) {
            console.error('Update failed:', error);
            return oldRow;
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsImporting(true);

        const reader = new FileReader();
        reader.onload = async (evt) => {
            const bstr = evt.target?.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data: any[] = XLSX.utils.sheet_to_json(ws, { raw: true });

            try {
                await importDataFromExcel(data);
            } catch (e: any) {
                const errorMessage = e?.message || 'Unknown error occurred during import.';
                alert(errorMessage);
                setIsImporting(false);
                fetchData();
                return;
            }

            alert('Import completed');
            setIsImporting(false);
            fetchData();
        };
        reader.readAsBinaryString(file);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'location', headerName: 'Location', width: 120, sortable: true, editable: true },
        { field: 'name', headerName: 'Name', width: 150, sortable: true, editable: true },
        { field: 'attend', headerName: 'Attend', width: 120, sortable: true, editable: true },
        { field: 'guest_number', headerName: 'Guests', type: 'number', width: 100, sortable: true, editable: true },
        { field: 'notes', headerName: 'Notes', width: 200, editable: true },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Delete',
            width: 100,
            getActions: (params) => [
                <GridActionsCellItem
                    key={params.id.toString()}
                    icon={
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    }
                    label="Delete"
                    onClick={() => deleteRow(params.id.toString())}
                />,
            ],
        },
    ];

    const rows: GridRowsProp<RSVP> = data;

    return (
        <Box p={2}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: 16 }}>Wedding Participants Dashboard</h1>

            {isImporting && (
                <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                    sx={{
                        width: '100%',
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: '#d4edda',
                        color: '#155724',
                        mb: 2,
                        flexWrap: 'wrap',
                    }}
                >
                    <Box
                        sx={{
                            width: 24,
                            height: 24,
                            border: '3px solid #c3e6cb',
                            borderTop: '3px solid #155724',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                        }}
                    />
                    <Typography sx={{ fontWeight: 500 }}>Importing data...</Typography>
                </Box>
            )}

            <Button variant="outlined" component="label" sx={{ mb: 3 }}>
                Import from Excel
                <input type="file" hidden accept=".xlsx,.xls" onChange={handleImport} />
            </Button>

            <Box component={Stack} spacing={2} direction={{ xs: 'column', sm: 'row' }} flexWrap="wrap" mb={4}>
                <FormControl sx={{ minWidth: 150, flex: 1 }}>
                    <InputLabel id="location-label">Location</InputLabel>
                    <Select
                        labelId="location-label"
                        value={form.location}
                        label="Location"
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                    >
                        <MenuItem value="bali">Bali</MenuItem>
                        <MenuItem value="malang">Malang</MenuItem>
                        <MenuItem value="jakarta">Jakarta</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    label="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    sx={{ flex: 1 }}
                />

                <TextField
                    label="Attending (yes/no)"
                    value={form.attend}
                    onChange={(e) => setForm({ ...form, attend: e.target.value })}
                    sx={{ flex: 1 }}
                />

                <TextField
                    label="Guest Number"
                    type="number"
                    value={form.guest_number || null}
                    onChange={(e) => setForm({ ...form, guest_number: Number(e.target.value) })}
                    sx={{ width: { xs: '100%', sm: 120 } }}
                />

                <TextField
                    label="Notes"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    sx={{ flex: 2 }}
                />

                <Button
                    variant="contained"
                    onClick={() => addRow(form)}
                    sx={{ mt: { xs: 1, sm: 2 }, alignSelf: 'center', width: { xs: '100%', sm: 'auto' } }}
                >
                    Add participant
                </Button>
            </Box>

            <DataGrid
                rows={rows}
                columns={columns}
                pageSizeOptions={[25, 50, 100]}
                autoHeight
                disableRowSelectionOnClick
                processRowUpdate={processRowUpdate}
            />
        </Box>
    );
};

export default DashboardPage;
