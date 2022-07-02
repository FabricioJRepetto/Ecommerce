import React from 'react'
import { useNavigate } from 'react-router-dom'
import { resizer } from '../../helpers/resizer';
import QuantityInput from '../Cart/QuantityInput';
import './CartCard.css'

const CartCard = ({ img, name, price, sale_price, on_sale, discount, brand, prodId, free_shipping, on_cart, stock, prodQuantity, deleteP}) => {
    const navigate = useNavigate();
    console.log(img);

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
                        className='cart-card-name pointer'
                        onClick={() => navigate(`/details/${prodId}`)} >{name}</p>
                    <div>{brand && brand.toUpperCase()}</div>
                    {free_shipping && <div className='free-shipping'>envío gratis</div>}
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
            price={on_sale ? sale_price : price}
            stock={stock}
            prodQuantity={prodQuantity}
            className='quantity-input'
        />}

        <div className='cart-card-price'>
            {on_sale && <div className='cart-card-price-discount'>
                <div>{discount}%</div>
                <del>${price}</del>
            </div>}
            <h2>{on_sale ? '$'+sale_price : '$'+price}</h2>
        </div>

    </div>
  )
}

export default CartCard