import React, { useEffect, useRef } from 'react';
import './carousel.css';
import Typography from "@mui/material/Typography";

const carouselContent = [
    { image: '/gh.jpg', text: 'Tiktok Thots' },
    { image: '/lk.jpg', text: 'Teen Thots' },
    { image: '/hn.jpg', text: 'Instagram Thots' },
    { image: '/jk.jpg', text: 'Triller Thots' }
    // Add more objects with image URLs and text as needed
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
            <div className="carousel-inner" ref={carouselRef}>
                {carouselContent.map((content, index) => (
                    <div key={index} className="carousel-item">
                        <img className="carousel-image" src={content.image} alt={content.text} />
                        <h2 className="carousel-text">{content.text}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageCarousel;