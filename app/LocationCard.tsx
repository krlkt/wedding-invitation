import { FC } from 'react';
import Link from 'next/link';
import { Url } from 'next/dist/shared/lib/router/router';

interface LocationCardProps {
    imageSrc: string;
    locationName: string;
    href: Url;
}

const LocationCard: FC<LocationCardProps> = ({
    imageSrc,
    locationName,
    href,
}) => (
    <Link
        className="rounded-2xl w-full overflow-hidden shadow-xl bg-white relative"
        href={href}
    >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
            src={imageSrc}
            alt={'Location picture'}
            className="w-full h-44 bg-cover shadow-lg"
        />
        <div id="description" className="p-4 font-sans font-semibold">
            {locationName}
        </div>
    </Link>
);

export default LocationCard;
