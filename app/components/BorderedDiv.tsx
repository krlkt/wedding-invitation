import { FC, PropsWithChildren } from 'react';

const BorderedDiv: FC<PropsWithChildren> = ({ children }) => (
    <div className="p-6 py-16 border rounded-lg shadow-lg bg-secondary-light flex flex-col gap-4 border-primary-main">
        {children}
    </div>
);

export default BorderedDiv;
