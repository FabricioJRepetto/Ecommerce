import React from 'react'
import { useNavigate } from 'react-router-dom'
import { resizer } from '../../helpers/resizer';
import QuantityInput from '../Cart/QuantityInput';
import './CartCard.css'

const CartCard = ({ img, name, price, brand, prodId, free_shipping, on_cart, stock, prodQuantity, deleteP}) => {
    const navigate = useNavigate();

  return (
    <div
        className='cart-card-container'>
        <div className='product-cart-card-head'>
            <div className='product-cart-image-container'>
                <img src={resizer(img)} alt="product" />
            </div>
            <div className='cart-prod-details'>
                <div className='cart-main-details'>
                    <p 
                        className='pointer bold'
                        onClick={() => navigate(`/details/${prodId}`)} >{name}</p>
                    <div>{brand && brand.toUpperCase()}</div>
                    <div>{free_shipping && 'envio gratis'}</div>
                </div>
                <div className='cart-product-options'>
                    <p 
                        className='pointer'
                        onClick={() => deleteP(prodId)}>Delete</p>
                    <p className='pointer'>Buy later</p>
                </div>
            </div>
        </div>
        {on_cart && <QuantityInput 
            prodId={prodId}
            price={price}
            stock={stock}
            prodQuantity={prodQuantity}
            className='quantity-input'
        />}
        <div className='cart-card-price'>
            <h2>${price}</h2>
        </div>
    </div>
  )
}

export default CartCard