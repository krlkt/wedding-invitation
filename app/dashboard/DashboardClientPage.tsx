'use client';

import '../globals.css';
import * as XLSX from 'xlsx';
import { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridActionsCellItem } from '@mui/x-data-grid';
import {
    TextField,
    Button,
    Box,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    IconButton,
    Tooltip,
    Autocomplete,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
} from '@mui/material';
import { RSVP, RSVPForm } from '../models/rsvp';
import { addParticipant, getParticipants, deleteParticipant, importDataFromExcel } from './action';
import { useSnackbar } from 'notistack';
import { Locations } from '../components/LocationComponent';

interface Group {
    id: number;
    name: string;
}

const DashboardClientPage = ({ initialData, location }: { initialData: RSVP[]; location?: Locations }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [data, setData] = useState<RSVP[]>(initialData);
    const [isImporting, setIsImporting] = useState(false);
    const [groups, setGroups] = useState<Group[]>([]);
    const [newGroupName, setNewGroupName] = useState('');
    const [form, setForm] = useState<RSVPForm>({
        name: '',
        attend: undefined,
        guest_number: undefined,
        max_guests: 2,
        notes: undefined,
        location: 'jakarta',
        link: '',
    });

    const fetchGroups = async () => {
        const response = await fetch('/api/groups');
        const data = await response.json();
        setGroups(data);
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchData = async () => {
        const participants = await getParticipants(location);
        setData(participants);
    };

    const addRow = async (data: RSVPForm) => {
        await addParticipant(data);
        setForm({
            name: '',
            attend: undefined,
            guest_number: undefined,
            max_guests: 2,
            notes: undefined,
            location: 'jakarta',
            link: '',
            group: undefined,
        });
        fetchData();
    };

    const deleteRow = async (id: string) => {
        await deleteParticipant(id);
        fetchData();
    };

    const processRowUpdate = async (newRow: RSVP, oldRow: RSVP) => {
        try {
            await addParticipant(newRow);
            fetchData();
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
                enqueueSnackbar(`${errorMessage}`, { variant: 'warning', persist: true });
                setIsImporting(false);
                fetchData();
                return;
            }

            enqueueSnackbar(`${data.length} participants were successfully imported!`, { variant: 'success' });
            setIsImporting(false);
            fetchData();
        };
        reader.readAsBinaryString(file);
    };

    const handleAddGroup = async () => {
        await fetch('/api/groups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newGroupName }),
        });
        setNewGroupName('');
        fetchGroups();
    };

    const handleDeleteGroup = async (id: number) => {
        await fetch('/api/groups', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        });
        fetchGroups();
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'location', headerName: 'Location', width: 120, sortable: true, editable: true },
        { field: 'name', headerName: 'Name', width: 150, sortable: true, editable: true },
        { field: 'attend', headerName: 'Attend', width: 120, sortable: true, editable: true },
        { field: 'max_guests', headerName: 'Max guest', type: 'number', width: 100, sortable: true, editable: true },
        {
            field: 'guest_number',
            headerName: 'Guest number',
            type: 'number',
            width: 100,
            sortable: true,
            editable: true,
        },
        {
            field: 'link',
            headerName: 'Link',
            width: 300,
            editable: false,
            renderCell: (params) => {
                const link = params.value || '';
                return <LinkCell link={link} />;
            },
        },
        { field: 'notes', headerName: 'Notes', width: 200, editable: true },
        { field: 'food_choice', headerName: 'Food choice', width: 120, editable: true },
        {
            field: 'group',
            headerName: 'Group',
            width: 150,
            sortable: true,
            editable: true,
            renderEditCell: (params) => (
                <Autocomplete
                    options={groups.map((group) => group.name)}
                    value={params.value}
                    onChange={(event, newValue) => {
                        params.api.setEditCellValue({ id: params.id, field: params.field, value: newValue });
                    }}
                    renderInput={(props) => <TextField {...props} />}
                    style={{ width: '100%' }}
                />
            ),
        },
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

    const filteredColumns = columns.filter((col) => {
        if (location === 'jakarta') {
            return col.field !== 'notes' && col.field !== 'food_choice' && col.field !== 'group';
        }
        if (location === 'malang') {
            return col.field !== 'notes' && col.field !== 'food_choice';
        }
        if (location === 'bali') {
            return col.field !== 'group';
        }
        return true;
    });

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

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Button variant="outlined" component="label">
                    Import from Excel
                    <input type="file" hidden accept=".xlsx,.xls" onChange={handleImport} />
                </Button>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Total Confirmed Guests:{' '}
                    {data.reduce(
                        (acc, curr) => (curr.attend?.toLowerCase() === 'yes' ? acc + curr.guest_number : acc),
                        0
                    )}
                </Typography>
            </Box>

            <Box
                component={Stack}
                spacing={2}
                direction={{ xs: 'column', sm: 'row' }}
                flexWrap="wrap"
                mb={4}
                alignItems="stretch"
            >
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

                {form.location !== 'bali' && (
                    <TextField
                        label="Group"
                        value={form.group || ''}
                        onChange={(e) => setForm({ ...form, group: e.target.value })}
                        sx={{ flex: 1 }}
                    />
                )}

                <TextField
                    label="Max guests"
                    type="number"
                    value={form.max_guests}
                    onChange={(e) => setForm({ ...form, max_guests: Number(e.target.value) })}
                    sx={{ width: { xs: '100%', sm: 120 } }}
                />

                <Button variant="contained" onClick={() => addRow(form)} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                    Add participant
                </Button>
            </Box>

            <DataGrid
                rows={rows}
                columns={filteredColumns}
                pageSizeOptions={[25, 50, 100]}
                autoHeight
                disableRowSelectionOnClick
                processRowUpdate={processRowUpdate}
                showToolbar
            />

            {(!location || location === 'malang') && (
                <Box mt={4}>
                    <Typography variant="h6" gutterBottom>
                        Manage Groups
                    </Typography>
                    <Paper elevation={2} sx={{ p: 2 }}>
                        <Stack direction="row" spacing={2} mb={2} alignItems="stretch">
                            <TextField
                                label="New Group Name"
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                                fullWidth
                            />
                            <Button variant="contained" onClick={handleAddGroup}>
                                Add Group
                            </Button>
                        </Stack>
                        <List>
                            {groups.map((group) => (
                                <ListItem key={group.id} divider>
                                    <ListItemText primary={group.name} />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() => handleDeleteGroup(group.id)}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-6 h-6 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Box>
            )}
        </Box>
    );
};

export default DashboardClientPage;

const LinkCell = ({ link }: { link: string }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <Tooltip
            title={link}
            placement="top"
            enterDelay={500}
            slotProps={{
                tooltip: {
                    sx: {
                        fontSize: '0.95rem',
                        padding: '10px 14px',
                        maxWidth: 400,
                    },
                },
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    overflow: 'hidden',
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <span
                    style={{
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {link}
                </span>
                {hovered && (
                    <Tooltip title="Copy Link">
                        <IconButton size="small" onClick={() => navigator.clipboard.writeText(link)}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <path
                                    d="M15.24 2H11.3458C9.58159 1.99999 8.18418 1.99997 7.09054 2.1476C5.96501 2.29953 5.05402 2.61964 4.33559 3.34096C3.61717 4.06227 3.29833 4.97692 3.14701 6.10697C2.99997 7.205 2.99999 8.60802 3 10.3793V16.2169C3 17.725 3.91995 19.0174 5.22717 19.5592C5.15989 18.6498 5.15994 17.3737 5.16 16.312L5.16 11.3976L5.16 11.3024C5.15993 10.0207 5.15986 8.91644 5.27828 8.03211C5.40519 7.08438 5.69139 6.17592 6.4253 5.43906C7.15921 4.70219 8.06404 4.41485 9.00798 4.28743C9.88877 4.16854 10.9887 4.1686 12.2652 4.16867L12.36 4.16868H15.24L15.3348 4.16867C16.6113 4.1686 17.7088 4.16854 18.5896 4.28743C18.0627 2.94779 16.7616 2 15.24 2Z"
                                    fill="#1C274C"
                                />
                                <path
                                    d="M6.6001 11.3974C6.6001 8.67119 6.6001 7.3081 7.44363 6.46118C8.28716 5.61426 9.64481 5.61426 12.3601 5.61426H15.2401C17.9554 5.61426 19.313 5.61426 20.1566 6.46118C21.0001 7.3081 21.0001 8.6712 21.0001 11.3974V16.2167C21.0001 18.9429 21.0001 20.306 20.1566 21.1529C19.313 21.9998 17.9554 21.9998 15.2401 21.9998H12.3601C9.64481 21.9998 8.28716 21.9998 7.44363 21.1529C6.6001 20.306 6.6001 18.9429 6.6001 16.2167V11.3974Z"
                                    fill="#1C274C"
                                />
                            </svg>
                        </IconButton>
                    </Tooltip>
                )}
            </div>
        </Tooltip>
    );
};
