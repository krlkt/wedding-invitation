'use client';

import { SnackbarProvider } from 'notistack';

const Providers = ({ children }: { children: React.ReactNode }) => (
    <SnackbarProvider autoHideDuration={2000} maxSnack={3}>
        {children}
    </SnackbarProvider>
);

export default Providers;
