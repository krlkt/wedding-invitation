import { FC } from 'react';
import BlurryOverlay from './BlurryOverlay';
import DinnerIcon from '../icons/DinnerIcon';
import Button from './Button';

export const locations = {
    bali: 'bali',
    jakarta: 'jakarta',
    malang: 'malang',
};

export type Locations = keyof typeof locations;

interface LocationProps {
    location: Locations;
}

const LocationComponent: FC<LocationProps> = ({ location }) => (
    <BlurryOverlay>
        <div className="relative flex flex-col items-center justify-center text-center text-white h-full">
            {/* Round overlay */}
            <div className="bg-black bg-opacity-65 p-5 py-24 rounded-full flex flex-col items-center justify-center w-5/6 gap-4">
                {/* Location section content */}
                <div className="w-16 flex items-center">
                    <DinnerIcon />
                </div>
                <h1 className="text-4xl font-bold">Reception</h1>
                <div>
                    <p className="text-2xl font-semibold">Tirtha Uluwatu</p>
                    <p className="text-lg font-sans">15:00 WIB</p>
                </div>
                <p className="text-sm font-sans">
                    Jl. Raya Uluwatu Banjar Dinas Karang, Boma, Pecatu, South
                    Kuta, Badung Regency, Bali 80364, Indonesia
                </p>
                <Button>
                    <a href="https://maps.app.goo.gl/iu2DLDD165WpfF7PA">
                        Google maps
                    </a>
                </Button>
            </div>
        </div>
    </BlurryOverlay>
);

export default LocationComponent;
