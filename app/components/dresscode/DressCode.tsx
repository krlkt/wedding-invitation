import Image from 'next/image';
import FadeIn from '../FadeIn';

const DressCode = () => (
    <div className="w-full max-w-[650px] p-2 px-4 text-center space-y-8">
        <FadeIn>
            <p>Wedding vibe: Relaxed Formal</p>
        </FadeIn>
        <FadeIn>
            <MenWomenSection sex="women" />
        </FadeIn>
        <FadeIn>
            <MenWomenSection sex="men" />
        </FadeIn>
    </div>
);

const MenWomenSection = ({ sex }: { sex: 'men' | 'women' }) => (
    <div className={`flex gap-3 items-center w-full relative ${sex === 'men' && 'flex-row-reverse'}`}>
        <div className={`w-1/2 ${sex === 'women' ? 'text-left' : 'text-right'}`}>
            <h6 className="text-2xl text-blue-800">{sex === 'women' ? 'Women' : 'Men'}</h6>
            <p className="text-sm">
                {sex === 'women'
                    ? 'Something pastel, preferably long, no white and no black 👗'
                    : 'Suit or Blazer (any color except navy / dark blue) paired with shirt (preferably pastel colored) 🤵 '}
            </p>
        </div>
        <div className="w-1/2 h-full relative p-2 border border-blue-800 rounded-lg">
            <Image
                src={'/images/ornaments/orn7.png'}
                alt={'Blue ornament'}
                className={`absolute -top-8  ${sex === 'men' ? '-left-6' : '-right-6'}`}
                width={80}
                height={200}
            />

            <div className="w-full h-full aspect-[1/1] relative overflow-hidden">
                <Image
                    src={sex === 'women' ? '/images/dresscode/women.jpg' : '/images/dresscode/men.jpg'}
                    alt={'Women example dresscode'}
                    fill
                    className="rounded-lg object-bottom"
                />
            </div>
            <Image
                src={'/images/ornaments/baby_orn.png'}
                alt={'Blue ornament'}
                className={`absolute bottom-0  ${sex === 'men' ? '-left-12' : '-right-12'}`}
                width={100}
                height={200}
            />
        </div>
    </div>
);
export default DressCode;
