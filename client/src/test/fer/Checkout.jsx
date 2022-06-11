import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../../components/common/Modal";
import {useModal} from "../../hooks/useModal";
import { STRIPE_PKEY } from '../../constants';

const stripePromise = loadStripe(STRIPE_PKEY);

const CheckoutForm =  () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isOpen, openModal, closeModal, prop] = useModal();
    const { id: orderId } = useParams();
    
    useEffect(() => {
      (async () => {
        const { data } = await axios(`/order/${orderId}`);
        console.log(data);
        setOrder(data)
    })();

    return () => {
        //? borra orden si no se completa compra
        axios.delete('/order/');
    }
    // eslint-disable-next-line
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        //: checkear stock por ultima vez

        // prepara el pago
        setLoading(true);
        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement)
        });
        console.log(paymentMethod);
        if (!error) {
            // intenta el pago
            const { id } = paymentMethod;
            const { data } = await axios.post(`/checkout/`, 
            {
                id,
                description: order.description,
                amount: order.total * 100
            });            
            console.log(data);

            //? cambiar orden a pagada            
            const { data: orderUpdt } = await axios.put(`/order/${orderId}`);
            console.log(orderUpdt);

            //? vaciar carrito
            const { data: cartEmpty } = await axios.delete(`/cart/empty`);
            console.log(cartEmpty);

            //? restar unidades de cada stock
            let list = order.products.map(e => ({id: e.product_id, amount: e.quantity}));
            const { data: stockUpdt } = await axios.put(`/product/stock/`, list);
            console.log(stockUpdt);

            //? muestra mensaje de exito/redirecciona
            elements.getElement(CardElement).clear();
            setLoading(false);
            openModal();
            
        } else {
            console.error(error);
        }
    };

     const iframeStyles = {
        base: {
        color: "#fff",
        fontSize: "16px",
        iconColor: "#fff",
        "::placeholder": {
            color: "#fff"
        }
        },
        invalid: {
        iconColor: "#ffc7c7",
        color: "#ffc7c7"
        },
        complete: {
        iconColor: "#cbf4c9"
        }
    };

    const cardElementOpts = {
        iconStyle: "solid",
        style: iframeStyles,
        hidePostalCode: true
    };

    return (
        <>
            <Modal isOpen={isOpen} closeModal={closeModal}>
                <h1><b>Compra realizada!</b></h1>
                {order?.products.map(e =>
                    <img src={e.img[0]} width={50} alt='compra' key={e.product_id} />
                )}
                <p><b>Envío a /dirección del usuario/</b></p>
                <p>/ciudad, provincia, Nombre usuario, telefono/</p>
                <p><b>Te avisaremos cuando esté en camino</b></p>
                <button onClick={()=>navigate(`/`)}> Ver mis compras </button>
            </Modal>
            <h1>Checkout</h1>
            <p><b>Order summary</b></p>
            <ul>
                {order?.products.map(e =>
                    <li key={e._id} >{`${e.product_name} (x${e.quantity}): ${e.price * e.quantity}`}</li>
                )} 
            </ul>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder='State' />
                <input type="text" placeholder='City' />
                <input type="text" placeholder='Adress' />
                <input type="text" placeholder='Zip Code' />
                <CardElement options={cardElementOpts} />
                <button disabled={(!stripe || loading)}>{loading ? 'Loading...' : `Pay $${order?.total}`}</button>
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