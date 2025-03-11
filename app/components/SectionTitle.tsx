import { FC } from 'react';

interface SectionTitleProps {
    title: string;
}

const SectionTitle: FC<SectionTitleProps> = ({ title }) => (
    <h2 className="text-5xl font-cursive_nautigal text-center">{title}</h2>
);

export default SectionTitle;
