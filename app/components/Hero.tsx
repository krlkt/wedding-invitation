import Image from 'next/image';
import Overlay from './Overlay';
import KnotIcon from '../icons/KnotIcon';

const Hero = () => (
    <div className="w-full h-full relative">
        <Overlay />
        <Image src={'/images/hero.png'} alt={'Couple Image'} className="-z-10 object-cover" fill />
        <div className="absolute bottom-0 text-white p-10">
            <div className="flex gap-3 items-end">
                <h1 className="text-[5rem] leading-[90px] drop-shadow-2xl">Tying</h1>
                <div className="w-20 h-16">
                    <KnotIcon />
                </div>
            </div>
            <h1 className="text-[5rem] leading-[90px] drop-shadow-2xl">The Knot</h1>
            <p className="text-sm drop-shadow-lg font-sans">
                &quot;And over all these virtues put on love, which binds them all together in perfect unity.&quot; —
                Colossians 3:14
            </p>
        </div>
        <div className="absolute top-0 right-0">
            <h4 className="text-white drop-shadow-md p-2">&quot;Two souls, one heart&quot;</h4>
        </div>
    </div>
);

export default Hero;
