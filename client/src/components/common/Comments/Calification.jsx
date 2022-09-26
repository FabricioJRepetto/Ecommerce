import React from 'react'
import './Calification.css'

const Calification = ({ num, hover, input }) => {

    const inputStyle = {
        background: 'linear-gradient(135deg, #303030 35%, #404040 52%, #555555 60%, #303030 65%)',
        backgroundSize: '300%',
        animation: 'loaderSwipeAnim2 2s cubic-bezier(0.4, 0.0, 0.2, 1) infinite'
     };

    return (
    <div className='calification-outer'>
        {hover && num > 0 && <span className='calification-tooltip'>{num}</span>}     
        <div className='calification-container' style={input ? inputStyle : {background: 'linear-gradient(180deg, rgba(5,5,5,1) 0%, rgba(32,32,32,1) 80%)'}}>
            <div className='calification-background' style={{width: `${num*2}rem`}}></div>
        </div>
    </div>
    )
}

export default Calification