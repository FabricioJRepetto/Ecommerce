import React from 'react';
import './Checkbox.css'

const Checkbox = ({ isChecked = false, extraStyles = {} }) => {

    const color = extraStyles.color || 'white', 
        icon = extraStyles.icon || false, 
        border = extraStyles.border ? '1px' : '0px',
        innerBorder = extraStyles.innerBorder,
        borderColor = extraStyles.borderColor || 'white',
        margin = extraStyles.margin || '0 0 0 0',
        size = extraStyles.size || '1',
        rounded = extraStyles.rounded ? '50%' : '0%';

  return (
    <div className='checkbox-container' style={{
        border: border ? `${border} solid ${borderColor}` : 'none',
        'border-radius': rounded,
        margin: margin,
        transform: `scale(${size})`
     }}>
        {icon}
        <div className='checkbox-inner' style={{transform: isChecked ? 'rotate(0deg)': 'rotate(-180deg)'}}>
            <div className={isChecked ? 'checkbox-on' : 'checkbox-off'} style={{ 
                background: color, 
                'border-radius': rounded,
                border: innerBorder ? `1px solid #000000` : 'none'
                }}></div>
        </div>
    </div>
  )
}

export default Checkbox
