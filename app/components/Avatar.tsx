import { FC } from 'react';
import Image from 'next/image';

interface AvatarProps {
    src: string;
}

const Avatar: FC<AvatarProps> = ({ src }) => {
    return (
        <div className="relative max-w-[8rem]">
            <div className="grid aspect-[1/1.6] items-end rounded-[0_0_100vw_100vw] overflow-hidden hover:scale-110 transition-transform duration-200 group">
                <Image
                    src="/images/blue_background.webp"
                    alt="blue background"
                    className="absolute aspect-square cover w-full rounded-full"
                    width={1000}
                    height={1000}
                />
                <Image
                    src={src}
                    alt="Husband to be"
                    width={1000}
                    height={1000}
                    className="relative z-10 scale-110 top-[2rem] transition-transform duration-200 group-hover:translate-y-[-0.5rem] group-hover:scale-110"
                />
            </div>
        </div>
    );
};

export default Avatar;
