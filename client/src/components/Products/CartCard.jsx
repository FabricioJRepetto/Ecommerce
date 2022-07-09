import React from 'react'
import { useNavigate } from 'react-router-dom'
import { priceFormat } from '../../helpers/priceFormat';
import { resizer } from '../../helpers/resizer';
import QuantityInput from '../Cart/QuantityInput';
import './CartCard.css'

const CartCard = ({ img, name, price, sale_price, on_sale, discount, brand, prodId, free_shipping, on_cart, stock, prodQuantity, deleteP, buyLater, buyNow, source}) => {
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
                    <div 
                        className='cart-card-name pointer'
                        onClick={() => navigate(`/details/${prodId}`)} >{name}</div>
                    <div>{brand && brand.toUpperCase()}</div>
                    {free_shipping && <div className='free-shipping'>envío gratis</div>}
                </div>
                <div className='cart-product-options'>
                    <p className='pointer'
                        onClick={() => deleteP(prodId, source)}>Delete</p>
                    <p className='pointer'
                        onClick={() => buyLater(prodId)}>{source === 'buyLater' ? 'Add to cart' : 'Buy later'}</p>
                    <p className='pointer'
                        onClick={() => buyNow(prodId, source)}>Buy Now</p>
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
                <div>-{discount}%</div>
                <del>${priceFormat(price).int}</del>
            </div>}
            <div className='cart-card-price-inner'>
                <h2>${priceFormat(on_sale ? sale_price : price).int}</h2>
                <p>{priceFormat(on_sale ? sale_price : price)?.cents}</p>
            </div>
        </div>

    </div>
  )
}

export default CartCard