import { FC } from 'react';
import Image from 'next/image';

interface AvatarProps {
    src: string;
}

const Avatar: FC<AvatarProps> = ({ src }) => {
    return (
        <Image
            src={src}
            alt="Husband to be"
            width={500}
            height={500}
            className="w-[200px] h-[200px] object-cover rounded-full object-top"
        />
    );
};

export default Avatar;
