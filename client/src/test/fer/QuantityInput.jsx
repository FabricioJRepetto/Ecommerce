import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { BACK_URL } from '../../constants';
import { cartTotal } from '../../Redux/reducer/cartSlice';
import './QuantityInput.css';

const QuantityInput = ({prodId: id, prodQuantity, stock}) => {
    const token = useSelector((state) => state.sessionReducer.token);
    const [quantity, setQuantity] = useState(prodQuantity);
    const total = useSelector((state) => state.cartReducer.total);
    const dispatch = useDispatch();

    const handleQuantity = async (id, mode) => {
        await axios({
            method: "PUT",
            withCredentials: true,
            url: `${BACK_URL}/cart/quantity/?id=${id}&mode=${mode}`,
            headers: {
                Authorization: `token ${token}`,
            }
        });

        mode === 'add'
        ? setQuantity(quantity+1)
        : setQuantity(quantity-1);
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
            const test = await axios({
                method: "PUT",
                withCredentials: true,
                url: `${BACK_URL}/cart/quantityEx?id=${id}&amount=${value}`,
                headers: {
                    Authorization: `token ${token}`,
                }
            });
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