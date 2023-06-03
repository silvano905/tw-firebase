import React, { useEffect, useRef, useState } from 'react';
import './carousel.css';
import Typography from "@mui/material/Typography";

const carouselContent = [
    { image: '/one.webp', text: 'Tiktok' },
    { image: '/four.webp', text: 'Teen' },
    { image: '/two.webp', text: 'Instagram' },
    { image: '/three.webp', text: 'Triller' }
    // Add more objects with image URLs and text as needed
];

const ImageCarousel = ({ onImagesLoaded }) => {
    const carouselRef = useRef();
    const [imagesLoaded, setImagesLoaded] = useState(0);

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

    useEffect(() => {
        if (imagesLoaded === carouselContent.length) {
            onImagesLoaded();
        }
    }, [imagesLoaded, onImagesLoaded]);

    return (
        <div className="carousel">
            <div className="carousel-inner" ref={carouselRef}>
                {carouselContent.map((content, index) => (
                    <div key={index} className="carousel-item">
                        <img
                            className="carousel-image"
                            src={content.image}
                            alt={content.text}
                            onLoad={() => setImagesLoaded(prev => prev + 1)}
                        />
                        <h2 className="carousel-text">{content.text}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageCarousel;