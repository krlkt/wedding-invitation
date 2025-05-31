'use client';

import { SnackbarProvider } from 'notistack';
import { useViewportHeight } from '../utils/useViewportHeight';
import { ReactNode } from 'react';

const Providers = ({ children }: { children: ReactNode }) => {
    useViewportHeight();

    return (
        <SnackbarProvider autoHideDuration={2000} maxSnack={3}>
            {children}
        </SnackbarProvider>
    );
};

export default Providers;
