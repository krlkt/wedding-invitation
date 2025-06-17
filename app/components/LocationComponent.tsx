import { FC } from 'react';
import DinnerIcon from '../icons/DinnerIcon';
import Button from './Button';
import NavigationIcon from '../icons/NavigationIcon';
import Image from 'next/image';
import GrowIn from './GrowIn';
import FadeIn from './FadeIn';

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
    <div className="relative w-full py-28 flex flex-col items-center justify-center text-primary-main z-10">
        <div className="relative w-full flex flex-col gap-2 items-center justify-center">
            <FadeIn className="w-16 flex items-center">
                <DinnerIcon />
            </FadeIn>
            <FadeIn className="text-4xl font-heading">Reception</FadeIn>
            <FadeIn>
                <p className="text-2xl font-semibold">Tirtha Uluwatu</p>
                <p className="text-md">15:00 - Midnight</p>
                <p className="text-md">Bali, Indonesia</p>
            </FadeIn>
            <FadeIn>
                <Button>
                    <a target="_blank" href="https://maps.app.goo.gl/iu2DLDD165WpfF7PA">
                        <span className="flex gap-2 justify-center items-center">
                            Google maps
                            <div className="w-4 h-4">
                                <NavigationIcon />
                            </div>
                        </span>
                    </a>
                </Button>
            </FadeIn>
        </div>
        <GrowIn className="absolute object-contain w-full h-full -z-10">
            <Image src={'/images/ornaments/frame/orn_frame.png'} alt={'Ornament Flower'} fill />
        </GrowIn>
    </div>
);

export default LocationComponent;
