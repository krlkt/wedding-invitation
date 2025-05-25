import { FC, PropsWithChildren } from 'react';

const BorderedDiv: FC<PropsWithChildren> = ({ children }) => (
    <div className="rounded-lg bg-blue-100/50 p-8">
        <div className="flex flex-col text-center justify-center relative w-full">{children}</div>
    </div>
);

export default BorderedDiv;
