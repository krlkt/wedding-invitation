import { FC, PropsWithChildren } from 'react';

const BorderedDiv: FC<PropsWithChildren> = ({ children }) => (
    <div className="p-6 py-16 rounded-lg shadow-lg bg-white flex flex-col gap-4">{children}</div>
);

export default BorderedDiv;
