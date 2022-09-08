import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChromaticText.css'

const ChromaticText = (props) => {
    const navigate = useNavigate();
    const [hover, setHover] = useState(false)

    const {
        text,
        size = '1rem',
        weight = '600',
        route = '',
        movementBefore = '0',
        movementAfter = '0 0 0 1rem',
        delay = 0.15,
        height = '100%',
        width = '100%',
    } = props;

    const containerStyle = {
        height: height,
        widht: width,
        fontWeight: weight,
    }
    const textStyle = {
        fontSize: size,
        margin: hover ? movementAfter : movementBefore,
        // transform: hover ? movementAfter : movementBefore
    }

  return (
    <div className='chromatic-text'
        onMouseEnter={()=>setHover(true)}
        onMouseLeave={()=>setHover(false)}
        onClick={() => navigate(route)}
        style={containerStyle}>
        <p style={{color: 'transparent'}}>{text}</p>
        <div style={{...textStyle, transitionDelay: `${(delay / 3) * 0}s`, background: `hsl(calc((3/3) * -360), 100%, 50%)`}}>{text}</div>

        <div style={{...textStyle, transitionDelay: `${(delay / 3) * 1}s`, background: `hsl(calc((2/3) * -360), 100%, 50%)`}}>{text}</div>

        <div style={{...textStyle, transitionDelay: `${(delay / 3) * 2}s`, background: `hsl(calc((1/3) * -360), 100%, 50%)`}}>{text}</div>
    </div>
  )
}

export default ChromaticText