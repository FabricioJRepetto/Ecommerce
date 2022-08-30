import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toRGB } from '../../helpers/toRGB'
import './PremiumCard.css'

const PremiumCard = ({productData, direction}) => {
    const {
        id,
        name,
        images,
        premiumData
        } = productData;

    const [color, setColor] = useState('');
    const [hover, setHover] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        !color && setColor(toRGB(premiumData.color));
    // eslint-disable-next-line
    }, [])
    
    const gradient = `linear-gradient(-135deg, ${premiumData.color} 0%, ${premiumData.color} 40%, rgba(${color}, 0.8) 100%)`

    return (
        <div className={`premiumcard-container ${direction ? 'premiumcard-direct-normal' : 'premiumcard-direct-reverse'}`}
            onMouseEnter={()=> setHover(true)}
            onMouseLeave={()=> setHover(false)}
            onClick={()=> navigate(`/premium/${id}`)}>

            <div className={`premiumcard-img-container ${hover && 'premiumcard-img-hover'}`}>
                <img src={images[0].imgURL} alt="card product" />
            </div>

            <div className='premiumcard-lateral-container'
                style={{background: gradient, color: premiumData.textColor ? premiumData.textColor : 'white'}}>
                <p className='premiumcard-name'>{name}</p>
                <p className='premiumcard-description'>{premiumData.miniDescription}</p>
            </div>

        </div>
    )
}

export default PremiumCard