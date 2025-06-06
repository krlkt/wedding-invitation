import Image from 'next/image';
import KnotIcon from '../../icons/KnotIcon';

const Hero = () => (
    <div className="w-full h-dvh relative">
        <Image src={'/images/newspaper.png'} alt={'Newspaper Background Image'} className="-z-10 object-cover" fill />
        {/* Header */}
        <h1 className="font-newYorker text-5xl pt-6 text-center">The Berlin Times</h1>
        <h3 className="font-serif text-md mt-2 text-center bg-black text-white">
            Sport • Lifestyle • <span className="font-bold">Wedding</span> • Science • World
        </h3>
        <div className="mt-4 mx-4 h-[420px] relative shadow-lg drop-shadow-xl border-gray-600 border">
            <Image src={'/images/hero.png'} alt={'Hero Image'} className="object-cover object-[50%_20%]" fill />
        </div>
        <div className="p-4 font-serif text-justify">
            <div className="flex gap-3 items-end">
                <h1 className=" font-semibold text-3xl drop-shadow-2xl">Tying the knot</h1>
                <div className="w-6 h-6">
                    <KnotIcon />
                </div>
            </div>
            <p className="text-md leading-tight mt-1 indent-6">
                Karel Karunia & Sabrina Alvina Budiono are officially tying the knot and have signed a long-term,
                no-trade contract. Sources say the deal includes unlimited cuddles, joint Netflix accounts, and a
                lifelong supply of &quot;What do you want to eat?&quot; debates! Love experts confirm: this is not a
                drill. The wedding countdown begins! ⏳ #KarelAndSabrinasHashtag
            </p>
            <p className="text-sm absolute bottom-4">&darr; Scroll down to find out more! &darr;</p>
        </div>
    </div>
);

export default Hero;
