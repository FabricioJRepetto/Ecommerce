import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import Controls from './Controls';
import Indicators from './Indicators';
import './Carousel.css'

const Slider = ({ images, interval = 5000, controls = false, indicators = false, pointer = false, width }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const slideInterval = useRef(null);
    const navigate = useNavigate();
    
    const [move, setMove] = useState(false)
    const slider = document.getElementById('slider');

    

    useEffect(() => {
        startSlideTimer();
        return () => stopSlideTimer();
        // eslint-disable-next-line
    }, []);

    const startSlideTimer = () => { 
        slideInterval.current = setInterval(() => {
            next('auto');
        }, interval);
     };

     const stopSlideTimer = () => { 
        if (slideInterval.current) clearInterval(slideInterval.current)
    };

    const prev = () => {
        stopSlideTimer();
        setMove('prev');
        !move && setCurrentIndex(currentIndex => currentIndex > 0 ? currentIndex-1 : images.length-1 );
     }

    const next = (auto) => {
        !auto && stopSlideTimer();
        setMove('next');
        !move && setCurrentIndex(currentIndex => currentIndex < images.length-1 ? currentIndex+1 : 0 );
     }

     const switchIndex = (index) => { 
        stopSlideTimer();
        let steps = Array.from(slider.children).findIndex(e => e.id === 'img'+index);
        if (true) {
            if (steps === 1) {
                next();
            }
            if (steps === 6) {
                prev();
            }
            !move && (slider.style.transform = `translateX(${- steps *100}%)`);
            !move && setCurrentIndex(index);
        }
      }

      const graber = () => {
        if (move === 'next') {
            setMove(false);
            slider.style.transform = 'none';
            slider.style.transition = 'none';
            slider.appendChild(slider.firstElementChild);
            setTimeout(() => {
                slider.style.transition = 'all 1s ease';
            });
        }
       }

       useEffect(() => {
            if (move === 'next') {
                slider.style.transform = 'translateX(-100%)'
            } else if (move === 'prev') {
                setMove(false);
                slider.prepend(slider.lastElementChild)
                slider.style.transition = 'none';
                slider.style.transform = 'translateX(-100%)'
                setTimeout(() => {
                    slider.style.transition = 'all 1s ease';
                    slider.style.transform = 'translateX(0%)';
                });
            }
        // eslint-disable-next-line
       }, [move]);

    return (
            <div className="slide_container">
                <div className="slide" style={{ maxWidth: width }}>
                    <div 
                        id='slider'
                        className="slide-inner"
                        onTransitionEnd={graber}
                        onMouseEnter={stopSlideTimer}
                        onMouseLeave={startSlideTimer}>
                            {images?.map((e,index) => (
                                <div 
                                    id={'img'+index}
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