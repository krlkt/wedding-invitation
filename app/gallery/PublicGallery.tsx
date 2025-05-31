'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';

const images = [
    { src: '/images/gallery/gal1.jpg', width: 3900, height: 2600 },
    { src: '/images/gallery/gal2.jpg', width: 3500, height: 5300 },
    { src: '/images/gallery/gal3.jpg', width: 5800, height: 3900 },
    { src: '/images/gallery/gal4.jpg', width: 3800, height: 5700 },
    { src: '/images/gallery/gal5.jpg', width: 4600, height: 7000 },
    { src: '/images/gallery/gal6.jpg', width: 7000, height: 4600 },
    { src: '/images/gallery/gal7.jpg', width: 4000, height: 6000 },
    { src: '/images/gallery/gal8.jpg', width: 6000, height: 4000 },
    { src: '/images/gallery/gal9.jpg', width: 4000, height: 6000 },
    { src: '/images/gallery/gal10.jpg', width: 4300, height: 6500 },
    { src: '/images/gallery/gal11.jpg', width: 2600, height: 3900 },
    { src: '/images/gallery/gal12.jpg', width: 4000, height: 6000 },
    { src: '/images/gallery/gal13.jpg', width: 4000, height: 6000 },
    { src: '/images/gallery/gal14.jpg', width: 4500, height: 6800 },
    { src: '/images/gallery/gal15.jpg', width: 7000, height: 4600 },
    { src: '/images/gallery/gal16.jpg', width: 3800, height: 5700 },
    { src: '/images/gallery/gal17.jpg', width: 3500, height: 5300 },
    { src: '/images/gallery/gal18.jpg', width: 3800, height: 5700 },
    { src: '/images/gallery/gal19.jpg', width: 2600, height: 3900 },
    { src: '/images/gallery/gal20.jpg', width: 2600, height: 3900 },
    { src: '/images/gallery/gal21.jpg', width: 3900, height: 2600 },
    { src: '/images/gallery/gal22.jpg', width: 2600, height: 3900 },
    { src: '/images/gallery/gal23.jpg', width: 3900, height: 2600 },
    { src: '/images/gallery/gal24.jpg', width: 3200, height: 4900 },
    { src: '/images/gallery/gal25.jpg', width: 5800, height: 3900 },
    { src: '/images/gallery/gal26.jpg', width: 4600, height: 7000 },
    { src: '/images/gallery/gal27.jpg', width: 6000, height: 4000 },
    { src: '/images/gallery/gal28.jpg', width: 5300, height: 3500 },
    { src: '/images/gallery/gal29.jpg', width: 4600, height: 7000 },
    { src: '/images/gallery/gal30.jpg', width: 4600, height: 7000 },
    { src: '/images/gallery/gal31.jpg', width: 4600, height: 7000 },
    { src: '/images/gallery/gal32.jpg', width: 4200, height: 6400 },
    { src: '/images/gallery/gal33.jpg', width: 4600, height: 7000 },
    { src: '/images/gallery/gal34.jpg', width: 3800, height: 5700 },
    { src: '/images/gallery/gal35.jpg', width: 4600, height: 7000 },
    { src: '/images/gallery/gal36.jpg', width: 7000, height: 4600 },
    { src: '/images/gallery/gal37.jpg', width: 4600, height: 7000 },
    { src: '/images/gallery/gal38.jpg', width: 4000, height: 6000 },
    { src: '/images/gallery/gal39.jpg', width: 7000, height: 4600 },
    { src: '/images/gallery/gal40.jpg', width: 6000, height: 4000 },
    { src: '/images/gallery/gal41.jpg', width: 4000, height: 6000 },
    { src: '/images/gallery/gal42.jpg', width: 4600, height: 7000 },
    { src: '/images/gallery/gal43.jpg', width: 3000, height: 4600 },
    { src: '/images/bride/bride1.jpg', width: 2600, height: 3900 },
    { src: '/images/bride/bride2.jpg', width: 2600, height: 3900 },
    { src: '/images/bride/bride3.jpg', width: 4000, height: 6000 },
    { src: '/images/bride/bride4.jpg', width: 3800, height: 5500 },
    { src: '/images/bride/bride5.jpg', width: 2600, height: 3900 },
    { src: '/images/bride/bride6.jpg', width: 3600, height: 5500 },
    { src: '/images/groom/groom1.jpg', width: 3000, height: 4000 },
    { src: '/images/groom/groom2.jpg', width: 3900, height: 5900 },
    { src: '/images/groom/groom3.jpg', width: 4000, height: 6000 },
    { src: '/images/groom/groom4.jpg', width: 3900, height: 2600 },
    { src: '/images/groom/groom5.jpg', width: 3000, height: 4000 },
    { src: '/images/groom/groom6.jpg', width: 4000, height: 6000 },
];

export default function WeddingGallery() {
    const [isPortrait, setIsPortrait] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            setIsPortrait(window.innerHeight > window.innerWidth);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen bg-white px-2 py-4 text-center">
            <h1 className="text-4xl font-semibold text-center mb-4 font-serif">Photos of us 📸</h1>
            <p className="mb-4">Click on the photo to open in fullscreen and swipe right/left to go next/previous</p>
            <Gallery>
                <div className={`grid gap-1 transition-all duration-300 ${isPortrait ? 'grid-cols-2' : 'grid-cols-3'}`}>
                    {images.map(({ src, width, height }, idx) => (
                        <Item key={idx} original={src} thumbnail={src} width={width} height={height}>
                            {({ ref, open }) => (
                                <div
                                    ref={ref}
                                    onClick={open}
                                    className="relative overflow-hidden rounded-xl shadow-sm aspect-square cursor-pointer"
                                >
                                    <Image
                                        src={src}
                                        alt={`Wedding photo ${idx + 1}`}
                                        layout="fill"
                                        objectFit="cover"
                                        className="hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            )}
                        </Item>
                    ))}
                </div>
            </Gallery>
        </div>
    );
}
