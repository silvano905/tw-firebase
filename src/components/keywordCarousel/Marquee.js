import React, { useEffect, useRef } from "react";
import "./Marquee.css";
import FavoriteIcon from '@mui/icons-material/Favorite';

const Marquee = ({ keywords }) => {
    const marqueeRef = useRef();

    useEffect(() => {
        const marquee = marqueeRef.current;
        const marqueeContent = marquee.children[0];

        const scrollMarquee = () => {
            if (marquee.scrollLeft >= marqueeContent.scrollWidth / 2) {
                marquee.scrollLeft -= marqueeContent.scrollWidth / 2;
            } else {
                marquee.scrollLeft += 1;
            }
        };

        const intervalId = setInterval(scrollMarquee, 30);
        return () => clearInterval(intervalId);
    }, []);

    const renderKeywords = () => {
        return keywords.flatMap((keyword, index) => [
            <span key={`${keyword}-${index}`} className="keyword">
        {keyword}
      </span>,
            index !== keywords.length - 1 && (
                <span key={`separator-${index}`} className="separator">
          |{" "}
        </span>
            ),
        ]);
    };

    return (
        <div className="marquee" ref={marqueeRef}>
            <div className="marquee-content">
                {renderKeywords()}
                {renderKeywords()}
            </div>
        </div>
    );
};

export default Marquee;
