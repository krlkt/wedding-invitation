'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TextField, Button, Typography, Alert } from '@mui/material';

export default function LoginWrapper() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');

        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (res.ok) {
            const redirectUrl = searchParams.get('redirect') || '/checkin/bali';
            router.push(redirectUrl);
        } else {
            const data = await res.json();
            setError(data.message || 'Login failed');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
                <Typography
                    variant="h5"
                    component="h1"
                    className="text-center text-2xl font-semibold text-gray-800 !mb-4"
                >
                    Check-in Login
                </Typography>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="!bg-gray-50 !rounded-md"
                        InputProps={{
                            className: '!rounded-md',
                        }}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="!bg-gray-50 !rounded-md"
                        InputProps={{
                            className: '!rounded-md',
                        }}
                    />
                    {error && (
                        <Alert severity="error" className="!rounded-md">
                            {error}
                        </Alert>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        className="!bg-blue-600 !hover:bg-blue-700 !text-white !font-bold !py-3 !rounded-md !shadow-md"
                    >
                        Login
                    </Button>
                </form>
            </div>
        </div>
    );
}
