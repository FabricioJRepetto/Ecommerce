import React from 'react'
import { useState } from 'react'
import './PremiumCard.css'

const PremiumCard = ({productData, direction}) => {
    const {        
        images,
        name,
        premiumData
        } = productData;

    const [hover, setHover] = useState(false);

    return (
        <div className={`premiumcard-container ${direction ? 'premiumcard-direct-normal' : 'premiumcard-direct-reverse'}`}
            onMouseEnter={()=> setHover(true)}
            onMouseLeave={()=> setHover(false)}>

            <div className={`premiumcard-img-container ${hover && 'premiumcard-img-hover'}`}>
                <img src={images[0].imgURL} alt="" />
            </div>

            <div className='premiumcard-lateral-container'
                style={{backgroundColor: premiumData.color}}>
                <p className='premiumcard-name'>{name}</p>
                <p className='premiumcard-description'>{premiumData.miniDescription}</p>
            </div>

        </div>
    )
}

export default PremiumCard