'use client';

import { useRef } from 'react';

// @ts-ignore splide problem
import { Splide, SplideSlide } from '@splidejs/react-splide';

import type { Splide as SplideInstance } from '@splidejs/splide';

import { Gallery, Item } from 'react-photoswipe-gallery';

import '@splidejs/react-splide/css';
import 'photoswipe/dist/photoswipe.css';
import './image-gallery.css';
import FadeIn from '../FadeIn';

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
  {
    full: '/images/gallery/gal48.jpg',
    width: 1000,
    height: 1500,
  },
  {
    full: '/images/gallery/gal59.jpg',
    width: 920,
    height: 1300,
  },
  {
    full: '/images/gallery/gal68.jpg',
    width: 860,
    height: 1470,
  },
  {
    full: '/images/gallery/gal78.jpg',
    width: 1500,
    height: 750,
  },
];

export default function ImageGallery() {
  const mainRef = useRef<SplideInstance | null>(null);
  const thumbsRef = useRef<SplideInstance | null>(null);

  return (
    <Gallery>
      <div className="mx-auto w-full max-w-full overflow-hidden">
        {/* Main Slider */}
        <FadeIn className="mx-6 overflow-clip rounded-lg">
          <div className="relative">
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
                      <div ref={ref} onClick={open} className="h-full w-full cursor-pointer">
                        <img
                          src={image.full}
                          alt={`Image ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </Item>
                </SplideSlide>
              ))}
            </Splide>
            <div className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 rounded-xl bg-black bg-opacity-20 px-2 text-xs text-white">
              Click to see fullscreen!
            </div>
          </div>
        </FadeIn>
        {/* Slider */}
        <FadeIn from="left">
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
              // Sync main slider when slider is moved
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
            aria-label="Image slider"
            className="h-full w-full"
          >
            {images.map((image, index) => (
              <SplideSlide key={index}>
                <div className="aspect-[3/3] w-full overflow-hidden rounded-lg">
                  <img
                    src={image.full}
                    alt={`Slider ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </SplideSlide>
            ))}
          </Splide>
        </FadeIn>
      </div>
    </Gallery>
  );
}
