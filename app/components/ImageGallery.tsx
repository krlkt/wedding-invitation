//@ts-ignore
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css'; // Splide CSS
import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css'; // PhotoSwipe CSS

const ImageGallery = () => {
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

    return (
        <Splide
            tag="section"
            options={{
                type: 'loop',
                height: '30rem',
                padding: '2rem',
                gap: '1rem',
            }}
            aria-label="Gallery"
        >
            <Gallery
                options={{
                    showAnimationDuration: 0, // Disable default zoom-in animation
                    hideAnimationDuration: 0, // Disable default zoom-out animation
                }}
            >
                {images.map((image, index) => (
                    <SplideSlide key={index}>
                        <Item
                            original={image.full}
                            width={image.width}
                            height={image.height}
                        >
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
                                    }}
                                />
                            )}
                        </Item>
                    </SplideSlide>
                ))}
            </Gallery>
        </Splide>
    );
};

export default ImageGallery;
