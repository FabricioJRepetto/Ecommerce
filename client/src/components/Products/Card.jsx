import React from 'react'
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { resizer } from '../../helpers/resizer';
import './Card.css'

import { ReactComponent as Sale } from '../../assets/svg/sale.svg'
import { WhishlistButton as Fav } from './WhishlistButton';

const Card = ({ img, name, price, brand, prodId, free_shipping, fav, on_sale }) => {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false)
    const session = useSelector((state) => state.sessionReducer.session);

  return (
    <div 
        key={prodId}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className='product-card'>

        {session && <Fav 
                visible={visible}
                fav={fav} prodId={prodId}/>}

        <div className='card-main-container'>
            <div 
                onClick={() => navigate(`/details/${prodId}`)}
                className='card-img-container pointer'>
                <img src={resizer(img, 180)} alt="product" />
            </div>

            <div className='card-details-container'>

                <div>{ brand && brand.toUpperCase()}</div>

                <h2 
                    className='pointer c-mrgn'
                    onClick={() => navigate(`/details/${prodId}`)}>{name}</h2>

                <div className='card-price-container c-mrgn'>
                    <div className='card-original-price'>{ on_sale && <del>${price}</del>}</div>
                    <div className='card-price-section'>
                        <h2>${price}</h2>
                        { on_sale && <div className='minicard-sale-section'>
                            <Sale className='onsale-svg'/>
                            <p>30% off</p>
                        </div>}
                    </div>
                </div>

                 <div className='free-shipping c-mrgn'>{free_shipping && 'envío gratis'}</div>

            </div>

        </div>

    </div>
  )
}

export default Card