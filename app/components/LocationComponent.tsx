import { FC } from 'react';
import BlurryOverlay from './BlurryOverlay';
import DinnerIcon from '../icons/DinnerIcon';
import Button from './Button';
import NavigationIcon from '../icons/NavigationIcon';
import { motion } from 'framer-motion';
import { Stagger } from '../utils/animation';
import Image from 'next/image';

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
    <motion.div
        variants={Stagger.containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative m-auto rounded-full flex flex-col items-center justify-center w-4/6 gap-4 bg-blue-100/50 p-12 text-center"
    >
        <div className="w-16 flex items-center">
            <DinnerIcon />
        </div>
        <motion.h1 variants={Stagger.itemVariants} className="text-4xl font-bold">
            Reception
        </motion.h1>
        <motion.div variants={Stagger.itemVariants}>
            <p className="text-2xl font-semibold">Tirtha Uluwatu</p>
            <p className="text-md">15:00 - Midnight</p>
            <p className="text-md">Bali, Indonesia</p>
        </motion.div>
        <motion.div variants={Stagger.itemVariants}>
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
        </motion.div>
    </motion.div>
);

export default LocationComponent;
