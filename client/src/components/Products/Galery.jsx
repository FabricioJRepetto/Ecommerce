import React from 'react';
import { useState } from 'react';
import { resizer } from '../../helpers/resizer';
import './Galery.css'

const Galery = ({ imgs }) => {
    const [current, setCurrent] = useState(5);

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
                        <img src={resizer(e.imgURL, 50)} alt="" />
                    </div>
                )}
            </div>
            <div className='preview-container'>
                {imgs?.map((e, index) => 
                    <img 
                    key={e.imgURL}
                    className={`galery-img ${(current === index) && 'visible'}`}
                    src={resizer(e.imgURL, 500)} 
                    alt="img" />
                )}
            </div>
        </div>
    )
}

export default Galery