'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

type GuestIdContextType = {
    id?: number;
};
const GuestIdContext = createContext<GuestIdContextType | undefined>(undefined);

export const GuestIdProvider = ({ id, children }: { id: number; children: ReactNode }) => {
    const [currentGuestId] = useState<number>(id);

    return <GuestIdContext.Provider value={{ id: currentGuestId }}>{children}</GuestIdContext.Provider>;
};

export const useGuestId = () => {
    const context = useContext(GuestIdContext);
    if (!context) {
        throw new Error('useGuestId must be used within a GuestIdContext.Provider');
    }
    return context;
};
