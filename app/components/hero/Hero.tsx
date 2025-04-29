import Image from 'next/image';
import './hero.css';
import Link from 'next/link';
import Button from '../Button';

const Hero = () => (
    <div className="grow flex flex-col items-center justify-center w-full text-center">
        <div className="inner-wrapper max-w-[600px] flex flex-col gap-4 relative px-[25%] py-[15%]">
            <div id="monogram" className="relative w-24 h-32">
                <Image
                    src={'/images/monogram/monogram.png'}
                    alt={'Karel & Sabrina Monogram'}
                    fill
                    className="scale-[2]"
                />
            </div>
            <div id="hero-text" className="text-black z-10 flex flex-col gap-4">
                <p>The wedding of</p>
                <p className="font-cursive2 text-primary-main text-5xl">
                    Karel
                    <br />&<br />
                    Sabrina
                </p>
            </div>
            <div className="z-10">
                <Button>
                    <Link href={'#rsvp'}>RSVP</Link>
                </Button>
            </div>
        </div>
    </div>
);

export default Hero;
