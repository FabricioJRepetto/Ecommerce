import React, { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import './Checkout.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { BACK_URL } from '../../constants';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

//esto deberia estar en todas las paginas para detectar comportamientos extraños
const stripePromise = loadStripe('pk_test_51L5zx4CyWZVtXgfrkpwfv0WgFKi326kk8x8U1D7xCKUAQ9pX67C52EZm7aY6yxWTLOyd8q8rzSO8lmJebxskBYlY0051pV1GsW');

const CheckoutForm =  () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const token = useSelector((state) => state.sessionReducer.token);
    const [order, setOrder] = useState(null);
    const { id: orderId } = useParams();
    
    useEffect(() => {
      const mountPetition = async () => {
        const { data } = await axios({
            method: "GET",
            withCredentials: true,
            url: `${BACK_URL}/order/${orderId}`,
            headers: {
                Authorization: `token ${token}`,
            }
        });
        console.log(data);
        setOrder(data)
    };
    mountPetition();
    // eslint-disable-next-line
    }, [])
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        // prepara el pago
        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement)
        });
        if (!error) {
            // intenta el pago
            const { id } = paymentMethod;
            const { data } = await axios.post(`${BACK_URL}/checkout/`, 
            {
                id,
                description: order.description,
                amount: order.total * 100
            }, {
                    withCredentials: true,
                    headers: {
                        Authorization: `token ${token}`,
                    }
            });            
            console.log(data);

            //? cambiar orden a pagada            
            const { data: orderUpdt } = await axios({ 
                method: "PUT",
                withCredentials: true,
                url: `${BACK_URL}/order/${orderId}`,
                headers: {
                    Authorization: `token ${token}`,
                }
             });
            console.log(orderUpdt);

            //? vaciar carrito
            const { data: cartEmpty } = await axios.delete(`${BACK_URL}/cart/empty`, { 
            headers: {
                    Authorization: `token ${token}`,
                }
             });
            console.log(cartEmpty);
            //: restar unidades de cada stock

            //: muestra mensaje de exito y redirecciona
            navigate(`/`);
            
        } else {
            console.error(error);
        }
    };

    return (
        <>
            <h1>Checkout</h1>
            <p><b>Order summary</b></p>
            <ul>
                {order?.products.map(e =>
                    <li key={e._id} >{`${e.product_name} (x${e.quantity}): ${e.price * e.quantity}`}</li>
                )} 
            </ul>
            <p><b>TOTAL: {order?.total}</b></p>
            <form onSubmit={handleSubmit}>
                <CardElement/>
                <button>BUY</button>
            </form>
        </>
    )
};


const Checkout = () => {
    return (
        <div>
            <Elements stripe={stripePromise}>
                <CheckoutForm />
            </Elements>
        </div>
    )
}

export default Checkout