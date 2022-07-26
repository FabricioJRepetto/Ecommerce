import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import Controls from './Controls';
import Indicators from './Indicators';
import './Carousel.css'

const Slider = (prop) => {
    const { 
        images, 
        interval = 5000, 
        controls = false, 
        indicators = false, 
        pointer = false, 
        width 
    } = prop;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [move, setMove] = useState(false);
    const slideInterval = useRef(null);
    const navigate = useNavigate();
    
    const slider = document.getElementById('slider');   

    // manejador del Intervalo
    const startSlideTimer = () => {
        slideInterval.current = setInterval(() => {
            next(true);
        }, interval)
    };
     const stopSlideTimer = () => {
        // importante preguntar si hay intervalo activo
        slideInterval.current && clearInterval(slideInterval.current)
    };

    useEffect(() => {
        if (document.visibilityState === 'visible') {
            startSlideTimer();
        } else {
            stopSlideTimer();
        }
        return () => stopSlideTimer();
        // eslint-disable-next-line
    }, [document.visibilityState]);


    const prev = () => {
        stopSlideTimer();
        setMove('prev');
     }

    const next = (auto) => {
        !auto && stopSlideTimer();
        setMove('next');
     }

     const switchIndex = (index) => {
        stopSlideTimer();
        let steps = Array.from(slider.children).findIndex(e => e.id === 'img'+index);
        setMove(steps);
    
        if (steps === 6) prev();
        else {
            setCurrentIndex(index);
            slider.style.transform = `translateX(${- steps *100}%)`;
        };
      }

    // esta f se encarga de las acciones que se tienen que ejecutar DESPUES de que termine la animación
      const graber = () => {
        if (move === 'next') {
            setMove(false);            
            slider.style.transform = 'none';
            slider.style.transition = 'none';
            slider.appendChild(slider.firstElementChild);
            setTimeout(() => {
                slider.style.transition = 'all 1s ease';
            });
        } else if (typeof move === 'number') {
            for (let i = 0; i < move; i++) {
                slider.style.transform = 'none';
                slider.style.transition = 'none';
                slider.appendChild(slider.firstElementChild);
            };
            setTimeout(() => {
                slider.style.transition = 'all 1s ease';
            });
            setMove(false);
        }
       };

    // este useEffect produce la transición necesaria segun el estado move
       useEffect(() => {
            if (move === 'next') {
                let i = currentIndex < images.length-1 ? currentIndex+1 : 0;
                setCurrentIndex(i);
                slider.style.transform = 'translateX(-100%)'
            } else if (move === 'prev') {
                setMove(false);
                let i = currentIndex > 0 ? currentIndex-1 : images.length-1;
                setCurrentIndex(i);
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
            <div className="slide_container"
                onMouseEnter={stopSlideTimer}
                onMouseLeave={startSlideTimer}>
                <div className="slide" style={{ maxWidth: width }}>
                    <div 
                        id='slider'
                        className="slide-inner"
                        onTransitionEnd={graber}>
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