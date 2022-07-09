import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { cartTotal } from '../../Redux/reducer/cartSlice';
import './QuantityInput.css';

const QuantityInput = ({prodId: id, prodQuantity, stock, price, bnMode = false, setQ}) => {
    const [quantity, setQuantity] = useState(prodQuantity);
    const total = useSelector((state) => state.cartReducer.total);
    const dispatch = useDispatch();

    const handleQuantity = async (id, mode) => {
        !bnMode && await axios.put(`/cart/quantity/?id=${id}&mode=${mode}`);

        if (mode === 'add') {
            setQuantity(quantity+1);
            bnMode ? setQ(quantity+1) : dispatch(cartTotal(total + (price)));
        } else {
            setQuantity(quantity-1);
            bnMode ? setQ(quantity-1) : dispatch(cartTotal(total - (price)));
        }
    };

    const handleQuantityEx = async ({ target }) => { 
        const { name, value, validity } = target;
        let validatedValue;

        if (!validity.valid) {
            validatedValue = quantity[name];
        } else {
            validatedValue = value;
        }

        if (validatedValue < 1) {
            setQuantity(1);
            bnMode && setQ(1)
            validatedValue = 1;
        } else if (validatedValue > stock) {
            setQuantity(stock);
            bnMode && setQ(stock)
            validatedValue = stock;
        } else {
            !bnMode && await axios.put(`/cart/quantityEx?id=${id}&amount=${validatedValue}`);
            
            setQuantity(validatedValue);
            bnMode && setQ(validatedValue);
        }
    };

    return (
        <div className='q-input-container'>
            <div className='q-input-inner'>
                <button disabled={quantity < 2} 
                    onClick={() => handleQuantity(id, 'sub')}> - </button>
                <input type="number" 
                    min={1}
                    pattern="[1-9]"
                    id={id}
                    className={'quantityInput'}
                    value={quantity}
                    onChange={handleQuantityEx}
                />
                <button disabled={quantity >= stock} 
                    onClick={() => handleQuantity(id, 'add')}> + </button>
            </div>
            <div>
                <p>{`stock ${stock}`}</p>
            </div>
        </div>
    )
}

export default QuantityInput