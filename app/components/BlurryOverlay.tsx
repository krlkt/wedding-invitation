import Image from 'next/image';
import { FC, PropsWithChildren } from 'react';

const BlurryOverlay: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="relative w-full h-dvh">
            {/* Background Image */}
            <Image
                src="/images/tirtha-bali-02.jpg"
                alt="Background"
                fill
                quality={100}
                className="-z-20 object-cover object-[45%]"
            />

            {/* Dark Blur Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-20 backdrop-blur-sm -z-10"></div>

            {/* Content */}
            {children}
        </div>
    );
};

export default BlurryOverlay;
