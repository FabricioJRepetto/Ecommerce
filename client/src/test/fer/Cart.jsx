import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../../components/common/Modal";
import { useModal } from "../../hooks/useModal";
import { cartTotal } from "../../Redux/reducer/cartSlice";
import QuantityInput from "./QuantityInput";
import { loadMercadoPago } from "../../helpers/loadMP";

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [orderId, setOrderId] = useState('');
    const total = useSelector((state) => state.cartReducer.total);
    const [isOpen, openModal, closeModal, prop] = useModal();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        getCart();
    // eslint-disable-next-line    
    }, [])

    const getCart = async () => {
        const { data } = await axios('/cart/');

        console.log(data);
        typeof data !== 'string' &&
        setCart(data.products);
        dispatch(cartTotal(data.total));
    };

    const deleteProduct = async (id) => {
        await axios.delete(`/cart/${id}`)

        getCart();
        closeModal();
    };

    const goCheckout = async () => {
        // crea la order       
        const { data: id } = await axios.post(`/order/`);
        // con la id inicia el checkout
        navigate(`/checkout/${id}`);
    };

    const openMP = async () => { 
        // crea la order       
        const { data: id } = await axios.post(`/order/`);
        setOrderId(id);
        // crea la preferencia para mp con la order
        const { data }  = await axios.get(`/mercadopago/${id}`);
        // abre el modal de mp con la id de la preferencia
        loadMercadoPago(data.id);
     }

     const getAddress = async () => { 
        const { data } = await axios('/user/address');
        console.log(data);
    };

    return (
        <div >
            <Modal isOpen={isOpen} closeModal={closeModal}>
                <h1>You want to delete this product?</h1>
                <div>
                    <button onClick={closeModal}>Cancel</button>
                    <button onClick={()=> deleteProduct(prop)}>Delete</button>
                </div>
            </Modal>
            <hr />
            <h2>Cart</h2>
            <br />
            {(cart && cart.length > 0)
            ? <div> 
                {cart.map((prod) => (
                    <div key={prod.product_id}>
                        <img src={prod.img[0]} alt='product img' height={60}/>
                            {prod.product_name} - ${prod.price} - 
                                <QuantityInput prodId={prod.product_id} prodQuantity={prod.quantity}
                                stock={prod.stock} 
                                price={prod.price}
                            />
                            <p onClick={()=> openModal(prod.product_id)}><b> Delete </b></p>
                    </div>
                ))}
                <h2>{`Total: ${total}`}</h2>
                <div>
                    <p><b>Shipping address:</b></p>
                    <button onClick={getAddress}> get address</button>
                </div>
                {/* <select onChange={changeHandler} defaultValue={16}>
                        <option>8</option>
                        <option >16</option>
                        <option>24</option>
                        <option>32</option>
                </select> */}
            </div>
            : <h1>your cart is empty</h1>
            }
            <br />
            <br />
            <button disabled={(!cart || cart.length < 1) && true } 
            onClick={goCheckout}> Stripe checkout </button>
            <br />
            <button disabled={(!cart || cart.length < 1) && true } 
            onClick={openMP}> MercadoPago checkout </button>
            <form 
            id='checkout-container'
            method="GET"
            action={`/orders/post-sale/${orderId}`}></form>
            <br />
            <br />
            <br />
            <br />
            <hr />
            <ul>
                <br/>
                <p><b>stripe</b></p>
                <li><p>card: <i>4242 4242 4242 4242</i></p></li>
                <li><p>expiration: <i>fecha mayor a la actual</i></p></li>
                <li><p>cvc: <i>123</i></p></li>
                <br/>
                <p><b>mercadopago</b></p>
                <li><p>card: <i>5416 7526 0258 2580</i></p></li>
                <li><p>expiration: <i>11/25</i></p></li>
                <li><p>cvc: <i>123</i></p></li>
                <li><p>nombre: <i>APRO</i></p></li>
                <li><p>dni: <i>12345678</i></p></li>
            </ul>
        </div>
    );
};

export default Cart;
