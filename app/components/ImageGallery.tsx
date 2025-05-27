//@ts-ignore
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css'; // Splide CSS
import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css'; // PhotoSwipe CSS
import { useRef, useState } from 'react';
import Image from 'next/image';

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
    // {
    //     full: '/images/gallery/gal7.jpg',
    //     width: 4000,
    //     height: 6000,
    // },
    // {
    //     full: '/images/gallery/gal8.jpg',
    //     width: 6000,
    //     height: 4000,
    // },
    // {
    //     full: '/images/gallery/gal9.jpg',
    //     width: 4000,
    //     height: 6000,
    // },
    // {
    //     full: '/images/gallery/gal10.jpg',
    //     width: 4300,
    //     height: 6500,
    // },
    // {
    //     full: '/images/gallery/gal11.jpg',
    //     width: 2600,
    //     height: 3900,
    // },
    // {
    //     full: '/images/gallery/gal12.jpg',
    //     width: 4000,
    //     height: 6000,
    // },
    // {
    //     full: '/images/gallery/gal13.jpg',
    //     width: 4000,
    //     height: 6000,
    // },
    // {
    //     full: '/images/gallery/gal14.jpg',
    //     width: 4500,
    //     height: 6800,
    // },
    // {
    //     full: '/images/gallery/gal15.jpg',
    //     width: 7000,
    //     height: 4600,
    // },
    // {
    //     full: '/images/gallery/gal16.jpg',
    //     width: 3800,
    //     height: 5700,
    // },
];

const ImageGallery = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const splideRef = useRef(null);

    return (
        <div className="w-full overflow-hidden">
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
            <div className="w-full overflow-hidden">
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
                                        <Image
                                            ref={ref}
                                            src={image.full}
                                            alt={`Thumbnail ${index + 1}`}
                                            onClick={open}
                                            className="w-[5rem] h-[5rem] sm:w-[6rem] sm:h-[6rem] md:w-[7rem] md:h-[7rem] object-cover rounded-xl cursor-pointer"
                                            width={300}
                                            height={300}
                                        />
                                    )}
                                </Item>
                            </SplideSlide>
                        ))}
                    </Gallery>
                </Splide>
            </div>
        </div>
    );
};

export default ImageGallery;
