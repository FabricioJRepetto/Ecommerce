import React, { useState, useEffect } from 'react';
import './Checkbox.css'

const Checkbox = ({ isChecked = false, autoCheck = false,isDisabled = false, extraStyles = {}, onClick}) => {
    // const [checked, setChecked] = useState(isChecked);

    const color = extraStyles.color || 'white', 
        // icon = extraStyles.icon || false, 
        border = extraStyles.border ? '1px' : '0px',
        innerBorder = extraStyles.innerBorder,
        borderColor = extraStyles.borderColor || 'white',
        margin = extraStyles.margin || '0 0 0 0',
        size = extraStyles.size || '1',
        rounded = extraStyles.rounded ? '50%' : '0%';

    // useEffect(() => {
    //     setChecked(!checked);
    //   // eslint-disable-next-line
    // }, [isChecked])
    
    const click = () => { 
        if (!isDisabled) {
            // if (autoCheck) setChecked(!checked)
            if (onClick) onClick();
        }
     }

  return (
    <div className='checkbox-container' style={{
            border: border ? `${border} solid ${borderColor}` : 'none',
            'borderRadius': rounded,
            margin: margin,
            transform: `scale(${size})`
        }} onClick={click}>

        <div className='checkbox-inner' style={{transform: isChecked ? 'rotate(0deg)': 'rotate(-90deg)', transition: 'all .3s ease'}}>
            <div className={isChecked ? 'checkbox-on' : 'checkbox-off'} style={{ 
                background: color, 
                'borderRadius': rounded,
                border: innerBorder ? `1px solid #000000` : 'none'
                }}></div>
        </div>
    </div>
  )
}

export default Checkbox
