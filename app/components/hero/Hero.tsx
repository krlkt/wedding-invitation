import Image from 'next/image';
import './hero.css';
import { useLocation } from '@/app/utils/useLocation';

const Hero = () => {
    const { location } = useLocation();
    const isJakartaOrMalang = location === 'malang' || location === 'jakarta';
    return (
        <div className="grow flex flex-col items-center justify-center w-full text-center">
            <div className="inner-wrapper max-w-[600px] flex flex-col gap-4 relative px-[25%] py-[15%] items-center">
                <div id="monogram" className="relative w-24 h-32">
                    <Image
                        src={'/images/monogram/monogram.webp'}
                        alt={'Karel & Sabrina Monogram'}
                        fill
                        className="scale-[2]"
                        loading="eager"
                    />
                </div>
                <div id="hero-text" className="text-black z-10 flex flex-col">
                    <p className="text-xl mb-4">The wedding of</p>
                    <p className="font-cursive2 text-primary-main text-5xl">Karel</p>
                    {isJakartaOrMalang && (
                        <p className="font-serif text-primary-main text-md text-gray-600">
                            Second son of Rendy Tirtanadi & Elliana Firmanto
                        </p>
                    )}
                    <p className="font-cursive2 text-primary-main text-5xl">&</p>
                    <p className="font-cursive2 text-primary-main text-5xl">Sabrina</p>
                    {isJakartaOrMalang && (
                        <p className="font-serif text-primary-main text-md text-gray-600">
                            First daughter of Hadi Budiono & Weny
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Hero;
