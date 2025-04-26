//@ts-ignore
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css'; // Splide CSS
import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css'; // PhotoSwipe CSS
import { useRef, useState } from 'react';
import Image from 'next/image';

const images = [
    {
        full: '/images/ask_out.jpg',
        width: 3648,
        height: 5672,
    },
    {
        full: '/images/angke.jpg',
        width: 1300,
        height: 979,
    },
    {
        full: '/images/couple2.jpg',
        width: 2000,
        height: 3000,
    },
    {
        full: '/images/couple1.jpg',
        width: 2000,
        height: 3080,
    },
    {
        full: '/images/couple3.jpg',
        width: 5100,
        height: 3400,
    },
    {
        full: '/images/couple4.jpg',
        width: 2000,
        height: 3080,
    },
];

const ImageGallery = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const splideRef = useRef(null);

    return (
        <div>
            {/* Gallery main photo */}
            <div className="w-full h-[25rem] relative">
                <Image
                    src={images[currentIndex].full}
                    alt={'Gallery current focus'}
                    fill
                    className="object-cover p-4 rounded-[2rem]"
                />
            </div>
            {/* Photo Slider */}
            <Splide
                ref={splideRef}
                tag="section"
                options={{
                    type: 'loop',
                    height: '8rem',
                    padding: '2rem',
                    gap: '1rem',
                    focus: 'center',
                    autoWidth: true,
                }}
                aria-label="Gallery"
                onMoved={(_: any, newIndex: number) => {
                    setCurrentIndex(newIndex);
                }}
            >
                <Gallery>
                    {images.map((image, index) => (
                        <SplideSlide key={index}>
                            <Item original={image.full} width={image.width} height={image.height}>
                                {({ ref, open }) => (
                                    <img
                                        ref={ref}
                                        src={image.full}
                                        alt={`Thumbnail ${index + 1}`}
                                        onClick={open}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            cursor: 'pointer',
                                            borderRadius: '1rem',
                                        }}
                                    />
                                )}
                            </Item>
                        </SplideSlide>
                    ))}
                </Gallery>
            </Splide>
        </div>
    );
};

export default ImageGallery;
