import React from 'react'
import { useNavigate } from 'react-router-dom'
import { resizer } from '../../helpers/resizer';

const Card = ({ img, name, price, brand, prodId, free_shipping, fav, on_sale }) => {
    const navigate = useNavigate();

  return (
    <div 
        onClick={() => navigate(`/details/${prodId}`)}
        className='product-card'>
        <img src={resizer(img)} alt="product" />
        <div>
            <p>{ brand && brand.toUpperCase()}</p>
            <p>{name}</p>
            <p>${price}</p>
            <p>{free_shipping && 'envio gratis'}</p>
        </div>
        <p>{fav ? '💛' : '🖤'}</p>
        <p>{on_sale && '💯'}</p>
    </div>
  )
}

export default Card