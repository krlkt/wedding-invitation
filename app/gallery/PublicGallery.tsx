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
    { src: '/images/gallery/gal44.jpg', width: 1200, height: 680 },
    { src: '/images/gallery/gal45.jpg', width: 940, height: 580 },
    { src: '/images/gallery/gal46.jpg', width: 1400, height: 850 },
    { src: '/images/gallery/gal47.jpg', width: 1170, height: 550 },
    { src: '/images/gallery/gal48.jpg', width: 1000, height: 1500 },
    { src: '/images/gallery/gal49.jpg', width: 760, height: 1160 },
    { src: '/images/gallery/gal50.jpg', width: 1400, height: 840 },
    { src: '/images/gallery/gal51.jpg', width: 1000, height: 1380 },
    { src: '/images/gallery/gal52.jpg', width: 980, height: 1400 },
    { src: '/images/gallery/gal53.jpg', width: 820, height: 1240 },
    { src: '/images/gallery/gal54.jpg', width: 870, height: 1300 },
    { src: '/images/gallery/gal55.jpg', width: 950, height: 1400 },
    { src: '/images/gallery/gal56.jpg', width: 1360, height: 930 },
    { src: '/images/gallery/gal57.jpg', width: 1500, height: 1000 },
    { src: '/images/gallery/gal58.jpg', width: 1400, height: 850 },
    { src: '/images/gallery/gal59.jpg', width: 920, height: 1300 },
    { src: '/images/gallery/gal60.jpg', width: 900, height: 1400 },
    { src: '/images/gallery/gal61.jpg', width: 1500, height: 850 },
    { src: '/images/gallery/gal62.jpg', width: 900, height: 1100 },
    { src: '/images/gallery/gal63.jpg', width: 1400, height: 950 },
    { src: '/images/gallery/gal64.jpg', width: 1200, height: 842 },
    { src: '/images/gallery/gal65.jpg', width: 1400, height: 920 },
    { src: '/images/gallery/gal66.jpg', width: 1400, height: 940 },
    { src: '/images/gallery/gal67.jpg', width: 1400, height: 950 },
    { src: '/images/gallery/gal68.jpg', width: 860, height: 1470 },
    { src: '/images/gallery/gal69.jpg', width: 1300, height: 840 },
    { src: '/images/gallery/gal70.jpg', width: 980, height: 1200 },
    { src: '/images/gallery/gal71.jpg', width: 860, height: 1300 },
    { src: '/images/gallery/gal72.jpg', width: 1400, height: 870 },
    { src: '/images/gallery/gal73.jpg', width: 1180, height: 800 },
    { src: '/images/gallery/gal74.jpg', width: 925, height: 1400 },
    { src: '/images/gallery/gal75.jpg', width: 800, height: 1200 },
    { src: '/images/gallery/gal76.jpg', width: 1000, height: 950 },
    { src: '/images/gallery/gal77.jpg', width: 1400, height: 930 },
    { src: '/images/gallery/gal78.jpg', width: 1500, height: 750 },
    { src: '/images/gallery/gal79.jpg', width: 1000, height: 1500 },
    { src: '/images/gallery/gal80.jpg', width: 3800, height: 2500 },
    { src: '/images/gallery/gal81.jpg', width: 3900, height: 2600 },
    { src: '/images/gallery/gal82.jpg', width: 2600, height: 3900 },
    { src: '/images/gallery/gal83.jpg', width: 3500, height: 2300 },
    { src: '/images/gallery/gal84.jpg', width: 3900, height: 2600 },
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
        <div className="bg-white px-2 py-4 text-center">
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
