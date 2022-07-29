import React from 'react';

const Indicators = ({images, currentIndex, switchIndex}) => {
  return (
    <div className='carousel-indicators'>
        {images.map((_, index)=> (
            <button 
                id={index}
                key={index}
                onClick={() => switchIndex(index)}
                className={`carousel-indicator-item ${currentIndex === index && 'active-indicator'}`}></button>
        ))}
    </div>
  )
};

export default Indicators;