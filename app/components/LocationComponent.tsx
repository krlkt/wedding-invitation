import { FC } from 'react'

import Image from 'next/image'

import DinnerIcon from '../icons/DinnerIcon'
import NavigationIcon from '../icons/NavigationIcon'

import Button from './Button'
import FadeIn from './FadeIn'
import GrowIn from './GrowIn'

export const locations = {
  bali: 'bali',
  jakarta: 'jakarta',
  malang: 'malang',
}

export type Locations = keyof typeof locations

interface LocationProps {
  location: Locations
}

const LocationComponent: FC<LocationProps> = ({ location }) => (
  <div className="relative z-10 flex w-full flex-col items-center justify-center py-28 text-primary-main">
    <div className="relative flex w-full flex-col items-center justify-center gap-2">
      <FadeIn className="flex w-16 items-center">
        <DinnerIcon />
      </FadeIn>
      <FadeIn className="font-heading text-4xl">Reception</FadeIn>
      <FadeIn>
        <p className="text-2xl font-semibold">
          {location === 'bali'
            ? 'Tirtha Uluwatu'
            : location === 'malang'
              ? 'KDS Restaurant'
              : 'Angke Kelapa Gading'}
        </p>
        <p className="text-md">
          {location === 'bali'
            ? '15:00 - Midnight'
            : location === 'malang'
              ? '6 PM – 10 PM'
              : '6 PM – 10 PM'}
        </p>
        <p className="text-md">
          {location === 'bali'
            ? 'Bali, Indonesia'
            : location === 'malang'
              ? 'Malang, Indonesia'
              : 'Jakarta, Indonesia'}
        </p>
      </FadeIn>
      <FadeIn>
        <Button>
          <a
            target="_blank"
            href={
              location === 'bali'
                ? 'https://maps.app.goo.gl/iu2DLDD165WpfF7PA'
                : location === 'malang'
                  ? 'https://maps.app.goo.gl/PNwWNcDREkXbNuiR7'
                  : 'https://maps.app.goo.gl/HZzTRkNjrPdh4QLj8'
            }
            rel="noreferrer"
          >
            <span className="flex items-center justify-center gap-2">
              Google maps
              <div className="h-4 w-4">
                <NavigationIcon />
              </div>
            </span>
          </a>
        </Button>
      </FadeIn>
    </div>
    <GrowIn className="absolute -z-10 h-full w-full object-contain">
      <Image src="/images/ornaments/frame/orn_frame.png" alt="Ornament Flower" fill />
    </GrowIn>
  </div>
)

export default LocationComponent
