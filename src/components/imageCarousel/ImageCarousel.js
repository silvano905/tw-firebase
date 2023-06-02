import React, { useEffect, useRef, useState } from 'react';
import './carousel.css';
import { Helmet } from 'react-helmet';
import Skeleton from '@mui/material/Skeleton';

const carouselContent = [
    { image: '/gh.jpg', text: 'Tiktok' },
    { image: '/lk.jpg', text: 'Teen' },
    { image: '/hn.jpg', text: 'Instagram' },
    { image: '/jk.jpg', text: 'Triller' }
];

const ImageCarousel = () => {
    const carouselRef = useRef();
    const [imagesReady, setImagesReady] = useState(false);

    useEffect(() => {
        let currentIndex = 0;

        function goToNextImage() {
            currentIndex++;
            if (currentIndex >= carouselContent.length) {
                currentIndex = 0;
            }
            carouselRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        const interval = setInterval(goToNextImage, 3000);

        // Simulating image loading delay
        setTimeout(() => {
            setImagesReady(true);
        }, 2000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="carousel">
            <Helmet>
                <link rel="preload" as="image" href={carouselContent[0].image} />
            </Helmet>
            <div className="carousel-inner" ref={carouselRef}>
                {carouselContent.map((content, index) => (
                    <div key={index} className="carousel-item">
                        {imagesReady ? (
                            <>
                                <img
                                    className="carousel-image"
                                    src={content.image}
                                    alt={content.text}
                                    loading="lazy"
                                />
                                <h2 className="carousel-text">{content.text}</h2>
                            </>
                        ) : (
                            <Skeleton variant="rectangular" width={400} height={450} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageCarousel;

