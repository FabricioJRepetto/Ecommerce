import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import Controls from './Controls';
import Indicators from './Indicators';
import './Carousel.css'

const Slider = ({ images, interval = 5000, controls = false, indicators = false, pointer = false, width }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const slideInterval = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        startSlideTimer();
        return () => stopSlideTimer();
        // eslint-disable-next-line
    }, []);

    const startSlideTimer = () => { 
        slideInterval.current = setInterval(() => {
            // si el setCurrent no tiene una CB solo se ejecuta una vez
            setCurrentIndex(currentIndex => currentIndex < images.length-1 ? currentIndex+1 : 0 );
        }, interval);
     };

     const stopSlideTimer = () => { 
        if (slideInterval.current) clearInterval(slideInterval.current)
    };

    const prev = () => {
        stopSlideTimer();
        const index = currentIndex > 0 ? currentIndex -1 : images.length - 1;
        setCurrentIndex(index)
     }

    const next = () => {
        stopSlideTimer();
        const index = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
        setCurrentIndex(index)
     }

     const switchIndex = (index) => { 
        stopSlideTimer();
        setCurrentIndex(index);
      }

    return (
            <div className="slide_container">
                <div className="slide" style={{ maxWidth: width }}>
                    <div 
                        className="slide-inner"
                        style={{transform: `translateX(${-currentIndex * 100}%)`}}
                        onMouseEnter={stopSlideTimer}
                        onMouseLeave={startSlideTimer}>
                            {images?.map(e => (
                                <div 
                                    key={e.img}
                                    style={ pointer ? {cursor: 'pointer'} : ''}
                                    onClick={() => navigate(e.url || '')}
                                    className="slide-item">
                                    <img src={e.img} alt="img" />
                                </div>
                            ))}
                    </div>
                    {indicators && <Indicators  
                        images={images} 
                        currentIndex={currentIndex}
                        switchIndex={switchIndex}/>}
                    {controls && <Controls 
                        prev={prev} 
                        next={next} 
                        start={startSlideTimer} 
                        stop={stopSlideTimer}/>}
                </div>
            </div>
    )
}

export default Slider


// <div class="slides">
    //     <img
    //         alt='banner'
    //         src="https://http2.mlstatic.com/D_NQ_674809-MLA50293741186_062022-OO.webp" />
    //     <img
    //         alt='banner'
    //         src="https://http2.mlstatic.com/D_NQ_977617-MLA50409269868_062022-OO.webp" />
    //     <img
    //         alt='banner'
    //         src="https://http2.mlstatic.com/D_NQ_745108-MLA50330042982_062022-OO.webp" />
    //     <img
    //         alt='banner'
    //         src="https://http2.mlstatic.com/D_NQ_751727-MLA50292961776_062022-OO.webp" />
    // </div>