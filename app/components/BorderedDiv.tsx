import { FC, PropsWithChildren } from 'react';

const BorderedDiv: FC<PropsWithChildren> = ({ children }) => (
    <div className="rounded-lg bg-white p-8 shadow-lg">
        <div className="flex flex-col text-center justify-center relative w-full">{children}</div>
    </div>
);

export default BorderedDiv;
