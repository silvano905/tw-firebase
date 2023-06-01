import React, { useEffect, useRef } from 'react';
import './carousel.css';
import { Helmet } from 'react-helmet';

const carouselContent = [
    { image: '/gh.jpg', text: 'Tiktok' },
    { image: '/lk.jpg', text: 'Teen' },
    { image: '/hn.jpg', text: 'Instagram' },
    { image: '/jk.jpg', text: 'Triller' }
];

const ImageCarousel = () => {
    const carouselRef = useRef();

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
                        <img className="carousel-image" src={content.image} alt={content.text} loading="lazy" />
                        <h2 className="carousel-text">{content.text}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageCarousel;
