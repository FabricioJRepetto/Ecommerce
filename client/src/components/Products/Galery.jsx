import React, { useEffect, useState } from 'react';
import { resizer } from '../../helpers/resizer';
import LoadingPlaceHolder from '../common/LoadingPlaceHolder';
import { ReactComponent as Arrow } from '../../assets/svg/arrow-right.svg';
import './Galery.css'

const Galery = ({ imgs, ripple = false }) => {
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    //? Ripple effect //
    const [coords, setCoords] = useState({ x: -1, y: -1 });
    const [isRippling, setIsRippling] = useState(false);

    useEffect(() => {
        if (coords.x !== -1 && coords.y !== -1) {
        setIsRippling(true);
        setTimeout(() => setIsRippling(false), 300);
        } else setIsRippling(false);
    }, [coords]);

    useEffect(() => {
        if (!isRippling) setCoords({ x: -1, y: -1 });
    }, [isRippling]);

    //? failsafe //
    useEffect(() => {
      let timer = null;
        timer = setTimeout(() => {
            setLoading(false)
        }, 5000);
      return () => {
        clearTimeout(timer)
      }
    }, []);

    const open = (e) => {
        if (ripple) {
            const rect = e.target.getBoundingClientRect();
            setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            setTimeout(() => {
                setIsOpen(true);                
            }, 150);
        } else {
            setIsOpen(true);
        }
    }

    const next = (e) => { 
        e.stopPropagation()
        const index = current < imgs.length - 1 ? current + 1 : 0;
        setCurrent(index)
    }
    const prev = (e) => { 
        e.stopPropagation()
        const index = current > 0 ? current -1 : imgs.length - 1;
        setCurrent(index)
    }

    const handleHover = (index) => { 
        setCurrent(index)
     };

    return (
        <div className='galery'>
            <div className='galery-selector-container'>                
                <div className='galery-selector-inner'>

                    <div className='galery-selector-imgs'>                    
                        {imgs.slice(0,8)?.map((e, index) => 
                            <div 
                            key={e.imgURL}
                            className={`galery-selector ${(current === index) && 'selected'}`}
                            onPointerEnter={() => handleHover(index)}
                            onClick={() => {(index > 6) && open()}}>
                                {loading && <LoadingPlaceHolder extraStyles={{ height: "100%" }}/>}
                                <img className={`selector-img ${!loading && 'visible'}`} src={resizer(e.imgURL, 50)} alt="controller" />
                                {index > 6 && imgs.length > 8 && !loading && <p className='galery-text'>+{imgs.length - index - 1}</p>}
                            </div>
                        )}
                    </div>
                    <div className='galery-selector-pointer' style={{ 'transform': `translateX(${current * 100}%)`}}></div>

                </div>
            </div>
            <div className='preview-container'>
                <div onClick={e => open(e)} 
                    className='ripple-container'>
                    <span className={isRippling ? "ripple" : 'content'}
                        style={{ left: coords.x, top: coords.y }}>
                    </span>
                </div>                        
                {loading && <LoadingPlaceHolder extraStyles={{ height: "100%", position: 'absolute' }}/>}
                {imgs?.map((e, index) =>                     
                    <img key={e.imgURL}
                        onClick={open}
                        onLoad={()=>{(index === imgs.length -1) && setLoading(false)}}
                        className={`galery-img ${(current === index) && !loading && 'visible'}`}
                        src={e.imgURL} 
                        alt="img" />                                      
                )}
            </div>

            <div className={`galery-fullscreen ${isOpen && 'fs-visible'}`} 
            onClick={()=>setIsOpen(false)}>
                <div className='fs-galery-container'>
                    {imgs?.map((e, index) => 
                        <img 
                        key={e.imgURL}
                        onClick={open}                        
                        className={`fs-img ${(current === index) && 'fs-visible'}`}
                        src={e.imgURL} 
                        alt="img" />
                    )}
                </div>
                    <button 
                        onClick={prev}
                        className='carousel-control left' >
                            <Arrow className='arrow left-arrow'/>
                        </button>
                    <button 
                        onClick={next}
                        className='carousel-control right' >
                            <Arrow className='arrow'/>
                    </button>
            </div>
        </div>
    )
}

export default Galery