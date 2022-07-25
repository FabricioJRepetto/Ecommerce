import React, { useEffect } from 'react';
import { useState } from 'react';
import { resizer } from '../../helpers/resizer';
import LoadingPlaceHolder from '../common/LoadingPlaceHolder';
import { ReactComponent as Arrow } from '../../assets/svg/arrow-right.svg';
import './Galery.css'

const Galery = ({ imgs }) => {
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false)

    //? failsafe
    useEffect(() => {
      let timer = null;
        timer = setTimeout(() => {
            setLoading(false)
        }, 5000);
      return () => {
        clearTimeout(timer)
      }
    }, []);

    const open = () => { 
    setIsOpen(true)
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
            <div>
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
            <div className='preview-container'>
                {loading && <LoadingPlaceHolder extraStyles={{ height: "100%" }}/>}
                {imgs?.map((e, index) => 
                    <img 
                    key={e.imgURL}
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