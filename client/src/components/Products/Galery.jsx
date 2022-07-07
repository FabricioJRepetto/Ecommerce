import React from 'react';
import { useState } from 'react';
import { resizer } from '../../helpers/resizer';
import LoadingPlaceHolder from '../common/LoadingPlaceHolder';
import { ReactComponent as Arrow } from '../../assets/svg/arrow-right.svg';
import './Galery.css'

const Galery = ({ imgs }) => {
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loaded, setLoaded] = useState(1);

    const [isOpen, setIsOpen] = useState(false)

    const loadedHandler = () => { 
        setLoaded(loaded+1)
        if (loaded >= imgs.length) {
            setLoading(false)
        }
     }

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
                {imgs?.map((e, index) => 
                    <div 
                    key={e.imgURL}
                    className={`galery-selector ${(current === index) && 'selected'}`}
                    onPointerEnter={() => handleHover(index)}>
                        {loading && <LoadingPlaceHolder extraStyles={{ height: "100%" }}/>}
                        <img className={`selector-img ${!loading && 'visible'}`} src={resizer(e.imgURL, 50)} alt="controller" />
                    </div>
                )}
            </div>
            <div className='preview-container'>
                {loading && <LoadingPlaceHolder extraStyles={{ height: "100%" }}/>}
                {imgs?.map((e, index) => 
                    <img 
                    key={e.imgURL}
                    onLoad={loadedHandler}
                    onClick={open}
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
                        onLoad={loadedHandler}
                        onClick={open}
                        className={`fs-img ${(current === index) && 'fs-visible'}`}
                        src={e.imgURL} 
                        alt="img" />
                    )}
                </div>
                    <div>
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
        </div>
    )
}

export default Galery