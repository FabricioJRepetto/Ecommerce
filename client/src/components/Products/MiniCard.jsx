import React from 'react'
import { useNavigate } from 'react-router-dom'
import { resizer } from '../../helpers/resizer';
import './MiniCard.css'

const Card = ({ img, name, price, prodId, free_shipping, fav, on_sale}) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/details/${prodId}`)}
            className='product-mini-card'>
            <p>{fav ? '💛' : '🖤'}</p>
            <img src={resizer(img, 180)} alt="product" />
            <div>
                <p>${price}</p>
                <p>{on_sale && '💯'}</p>
                <p>{free_shipping && 'envio gratis'}</p>
                <p className={'visible'}>{name}</p>
            </div>
        </div>
    )
}

export default Card