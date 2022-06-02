import React, { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import './Checkout.css';
import axios from 'axios';
import { BACK_URL } from '../../constants';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

//esto deberia estar en todas las paginas para detectar comportamientos extraños
const stripePromise = loadStripe('pk_test_51L5zx4CyWZVtXgfrkpwfv0WgFKi326kk8x8U1D7xCKUAQ9pX67C52EZm7aY6yxWTLOyd8q8rzSO8lmJebxskBYlY0051pV1GsW');


const CheckoutForm =  () => {
    const stripe = useStripe();
    const elements = useElements();
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
            console.log(data); //: setear order
        };
        mountPetition();
        return () => {
        }
    }, [])
    

    const handleSubmit = async (e) => { 
        e.preventDefault();

        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement)
        });
        if (!error) {
            const { id } = paymentMethod;

           const { data } = await axios({
                method: "POST",
                withCredentials: true,
                url: `${BACK_URL}/checkout`,
                headers: {
                    Authorization: `token ${token}`,
                }
           }, {
               id,
               amount: 0
           });
        };
    };

    return (
            <form onSubmit={handleSubmit}>
                <CardElement/>
                <button>BUY</button>
            </form>
    )
}

const Checkout = () => {
  return (
        <div>
            <h1>Checkout</h1>
            <p><b>resumen de compra</b></p>
            <p>· item 1</p>
            <p>· item 2</p>
            <p>· item 3</p>
            <p><b>TOTAL 123</b></p>
            <Elements stripe={stripePromise}>
                <CheckoutForm />
            </Elements>
        </div>
  )
}

export default Checkout