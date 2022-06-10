import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { cartTotal } from '../../Redux/reducer/cartSlice';
import './QuantityInput.css';

const QuantityInput = ({prodId: id, prodQuantity, stock, price}) => {
    const [quantity, setQuantity] = useState(prodQuantity);
    const total = useSelector((state) => state.cartReducer.total);
    const dispatch = useDispatch();

    const handleQuantity = async (id, mode) => {
        await axios.put(`/cart/quantity/?id=${id}&mode=${mode}`);

        if (mode === 'add') {
            setQuantity(quantity+1);
            dispatch(cartTotal(total + (price)));
        } else {
            setQuantity(quantity-1);
            dispatch(cartTotal(total - (price)));
        }
    };

    const handleQuantityEx = async (e) => { 
        let value = Number(e.target.value);
        if (value < 1) {
            setQuantity(1);
            e.target.value = 1;
        } else if (value > stock) {
            setQuantity(stock);
            e.target.value = stock;
        } else {
            const test = await axios.put(`/cart/quantityEx?id=${id}&amount=${value}`);
            console.log(test);
            setQuantity(value);
        }
    }

    return (
        <>
            <button disabled={quantity < 2 && true} 
                onClick={() => handleQuantity(id, 'sub')}> - </button>
            <input type="number" 
                id={id}
                className={'quantityInput'}
                min={1}
                value={quantity} 
                style={{width: '50px'}}
                onChange={handleQuantityEx}
            />
            <button disabled={quantity >= stock && true} 
                onClick={() => handleQuantity(id, 'add')}> + </button>
        </>        
    )
}

export default QuantityInput