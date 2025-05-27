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
            <p className="mb-4">Click on the photo to open in fullscreen and swipe right or left</p>
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
