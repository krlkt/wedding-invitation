'use client';

import { useState, useEffect } from 'react';
import DashboardPage from './DashboardPage';
import { Box, Button, TextField, Typography } from '@mui/material';

const EXPIRY_MS = 60 * 60 * 1000; // 1 hour

const Page = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  const USERNAME = process.env.NEXT_PUBLIC_DASHBOARD_USERNAME;
  const PASSWORD = process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD;

  // Check session on mount
  useEffect(() => {
    const session = localStorage.getItem('authSession');
    if (session) {
      const { expiresAt } = JSON.parse(session);
      if (Date.now() < expiresAt) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('authSession');
      }
    }
  }, []);

  const handleLogin = () => {
    if (usernameInput === USERNAME && passwordInput === PASSWORD) {
      const expiresAt = Date.now() + EXPIRY_MS;
      localStorage.setItem('authSession', JSON.stringify({ expiresAt }));
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid username or password');
    }
  };

  if (isAuthenticated) {
    return <DashboardPage />;
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      gap={2}
      px={2}
    >
      <Typography variant="h5">Login to Dashboard</Typography>
      <TextField
        label="Username"
        value={usernameInput}
        onChange={(e) => setUsernameInput(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        value={passwordInput}
        onChange={(e) => setPasswordInput(e.target.value)}
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" onClick={handleLogin}>
        Login
      </Button>
    </Box>
  );
};

export default Page;