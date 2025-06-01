'use client';

import { useRef } from 'react';
// @ts-ignore splide problem
import { Splide, SplideSlide } from '@splidejs/react-splide';
import type { Splide as SplideInstance } from '@splidejs/splide';
import { Gallery, Item } from 'react-photoswipe-gallery';

import '@splidejs/react-splide/css';
import 'photoswipe/dist/photoswipe.css';
import './thumbnail-carousel.css';

const images = [
    {
        full: '/images/gallery/gal1.jpg',
        width: 3900,
        height: 2600,
    },
    {
        full: '/images/gallery/gal2.jpg',
        width: 3500,
        height: 5300,
    },
    {
        full: '/images/gallery/gal3.jpg',
        width: 5800,
        height: 3900,
    },
    {
        full: '/images/gallery/gal4.jpg',
        width: 3800,
        height: 5700,
    },
    {
        full: '/images/gallery/gal5.jpg',
        width: 4600,
        height: 7000,
    },
    {
        full: '/images/gallery/gal6.jpg',
        width: 7000,
        height: 4600,
    },
];

export default function ThumbnailCarousel() {
    const mainRef = useRef<SplideInstance | null>(null);
    const thumbsRef = useRef<SplideInstance | null>(null);

    return (
        <Gallery>
            <div className="w-full mx-auto max-w-full overflow-hidden">
                {/* Main Slider */}
                <div className="mx-4 rounded-lg overflow-clip">
                    <Splide
                        options={{
                            type: 'fade',
                            heightRatio: 1.3,
                            pagination: false,
                            arrows: false,
                            cover: true,
                        }}
                        onMounted={(splide: SplideInstance) => {
                            mainRef.current = splide;
                        }}
                        onMove={(_: SplideInstance, newIndex: number) => {
                            thumbsRef.current?.go(newIndex);
                        }}
                        aria-label="Main image slider"
                        className="mb-4 w-full"
                    >
                        {images.map((image, index) => (
                            <SplideSlide key={index}>
                                <Item
                                    original={image.full}
                                    thumbnail={image.full}
                                    width={image.width}
                                    height={image.height}
                                >
                                    {({ ref, open }) => (
                                        <div ref={ref} onClick={open} className="cursor-pointer w-full h-full">
                                            <img
                                                src={image.full}
                                                alt={`Image ${index + 1}`}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                    )}
                                </Item>
                            </SplideSlide>
                        ))}
                    </Splide>
                </div>
                {/* Thumbnail Slider */}
                <Splide
                    options={{
                        rewind: true,
                        perPage: 2.5,
                        isNavigation: true,
                        gap: '1rem',
                        focus: 'center',
                        pagination: false,
                        arrows: true,
                    }}
                    onMounted={(splide: SplideInstance) => {
                        thumbsRef.current = splide;
                        // Sync main slider when thumbnail is moved
                        splide.on('moved', (newIndex) => {
                            if (mainRef.current && mainRef.current.index !== newIndex) {
                                mainRef.current.go(newIndex);
                            }
                        });
                        splide.on('click', () => {
                            const index = splide.index;
                            mainRef.current?.go(index);
                        });
                    }}
                    aria-label="Thumbnail slider"
                    className="w-full h-full"
                >
                    {images.map((image, index) => (
                        <SplideSlide key={index}>
                            <div className="aspect-[3/3] w-full rounded-lg overflow-hidden">
                                <img
                                    src={image.full}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </SplideSlide>
                    ))}
                </Splide>
            </div>
        </Gallery>
    );
}
