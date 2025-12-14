import { FC, PropsWithChildren } from 'react';

const BorderedDiv: FC<PropsWithChildren> = ({ children }) => (
  <div className="rounded-lg bg-white p-8 shadow-lg">
    <div className="relative flex w-full flex-col justify-center text-center">{children}</div>
  </div>
);

export default BorderedDiv;
