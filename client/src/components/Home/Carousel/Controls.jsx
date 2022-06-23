import React from 'react'

const Controls = ({ prev, next, start, stop }) => {
  return (
    <div>
        <button 
            onClick={prev}
            className='carousel-control left'
            onMouseEnter={stop}
            onMouseLeave={start}
            >Prev</button>
        <button 
            onClick={next}
            className='carousel-control right'
            onMouseEnter={stop}
            onMouseLeave={start}
            >Next</button>
    </div>
  )
}

export default Controls