import Image from 'next/image';

const DressCode = () => (
    <div className="w-full max-w-[650px] p-2 px-4 text-center space-y-8">
        <p>Wedding vibe: Relaxed Elegant, Island Formal</p>
        <div className="space-y-4">
            <ColorPalette />
            <p>We kindly suggest our guest to dress within this color palette for our special day</p>
        </div>
        <MenWomenSection sex="women" />
        <MenWomenSection sex="men" />
    </div>
);

const colorPalettes = [
    '#D9F1FA', // lighter blue
    '#FCE0E7', // lighter pink
    '#DFF7EF', // lighter green
    '#FFF9DC', // lighter yellow
    '#FFE3D3', // lighter orange
    '#FFECEC', // lighter red
];

const ColorPalette = () => (
    <div className="flex gap-4 justify-center items-center">
        {colorPalettes.map((colorHex) => (
            <div key={colorHex} className="rounded-full p-4" style={{ backgroundColor: colorHex }}></div>
        ))}
    </div>
);

const MenWomenSection = ({ sex }: { sex: 'men' | 'women' }) => (
    <div className={`flex gap-3 items-center w-full relative ${sex === 'men' && 'flex-row-reverse'}`}>
        <div className={`w-1/2 ${sex === 'women' ? 'text-left' : 'text-right'}`}>
            <h6 className="text-2xl text-blue-800">{sex === 'women' ? 'Women' : 'Men'}</h6>
            <p className="text-sm">
                {sex === 'women'
                    ? 'Something pastel, Avoid loud prints & patterns, wedges or heels'
                    : 'Plain button shirt (blazer or coat optional) pair with Closed toe shoes. As long as its formal honestly.. 😄'}
            </p>
        </div>
        <div className="w-1/2 h-full aspect-[1/1] relative p-2 border border-primary-main rounded-lg">
            <div className="w-full h-full relative overflow-hidden">
                <Image src={'/images/galery/gal1.jpg'} alt={'Women example dresscode'} fill className="rounded-lg" />
            </div>
        </div>
    </div>
);
export default DressCode;
