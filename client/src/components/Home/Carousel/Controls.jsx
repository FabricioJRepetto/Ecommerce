import React from 'react'
import { ReactComponent as Arrow } from "../../../assets/svg/arrow-right.svg";


const Controls = ({ prev, next, start, stop }) => {
  return (
    <div>
        <button 
            onClick={prev}
            className='carousel-control left'
            onMouseEnter={stop}
            onMouseLeave={start}
            ><Arrow className='arrow left-arrow'/></button>
        <button 
            onClick={next}
            className='carousel-control right'
            onMouseEnter={stop}
            onMouseLeave={start}
            ><Arrow className='arrow'/></button>
    </div>
  )
}

export default Controls