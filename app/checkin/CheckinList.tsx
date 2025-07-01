'use client';

import { useState, useMemo } from 'react';
import { RSVP } from '../models/rsvp';
import { Checkin } from '../models/checkin';
import { 
    TextField, 
    List, 
    ListItem, 
    ListItemText, 
    Switch, 
    Modal,
    Button,
    Card,
    CardContent,
    Typography
} from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

type Guest = RSVP & Partial<Pick<Checkin, 'checked_in'>>;

interface CheckinListProps {
    initialGuests: Guest[];
}

export default function CheckinList({ initialGuests }: CheckinListProps) {
    const [guests, setGuests] = useState<Guest[]>(initialGuests);
    const [searchTerm, setSearchTerm] = useState('');
    const [open, setOpen] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

    const handleToggle = async (guest: Guest, checked: boolean) => {
        if (!checked) {
            setSelectedGuest(guest);
            setOpen(true);
        } else {
            await updateCheckinStatus(guest.id, checked);
        }
    };

    const handleConfirmCheckout = async () => {
        if (selectedGuest) {
            await updateCheckinStatus(selectedGuest.id, false);
            setOpen(false);
            setSelectedGuest(null);
        }
    };

    const updateCheckinStatus = async (rsvp_id: number, checked_in: boolean) => {
        await fetch('/api/checkin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rsvp_id, checked_in }),
        });
        setGuests(guests.map(g => g.id === rsvp_id ? { ...g, checked_in } : g));
    };

    const filteredGuests = guests.filter((guest) =>
        guest.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const { checkedInCount, notCheckedInCount } = useMemo(() => {
        const checkedInCount = guests.filter(g => g.checked_in).length;
        const notCheckedInCount = guests.length - checkedInCount;
        return { checkedInCount, notCheckedInCount };
    }, [guests]);

    return (
        <div className="space-y-4">
            <Card>
                <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                        Check-in Stats
                    </Typography>
                    <div className="h-64">
                        <PieChart
                            series={[
                                {
                                    data: [
                                        { id: 0, value: checkedInCount, label: 'Checked In' },
                                        { id: 1, value: notCheckedInCount, label: 'Not Checked In' },
                                    ],
                                },
                            ]}
                        />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <TextField
                        label="Search Guests"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <List>
                        {filteredGuests.map((guest) => (
                            <ListItem key={guest.id} divider>
                                <ListItemText primary={guest.name} />
                                <Switch
                                    checked={!!guest.checked_in}
                                    onChange={(e) => handleToggle(guest, e.target.checked)}
                                />
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Card>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 bg-white border-2 border-black shadow-2xl p-4">
                    <h2 className="text-xl font-bold">Confirm Checkout</h2>
                    <p className="mt-2">Are you sure you want to check out {selectedGuest?.name}?</p>
                    <div className="mt-4 flex justify-end space-x-2">
                        <Button onClick={() => setOpen(false)} variant="outlined">Cancel</Button>
                        <Button onClick={handleConfirmCheckout} variant="contained" color="primary">Confirm</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}