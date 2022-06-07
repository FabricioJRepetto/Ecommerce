//: handleQuantityEx crear el input para mostrar/modificar la cantidad de unidades
//: investigar withCredentials: true
//: checkear 'cart' al crear orden

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BACK_URL } from "../../constants";
import Modal from "../../components/common/Modal";
import {useModal} from "../../hooks/useModal";

const Cart = () => {
    const [cart, setCart] = useState(null);
    const token = useSelector((state) => state.sessionReducer.token);
    const navigate = useNavigate();
    const [isOpen, openModal, closeModal, prop] = useModal();

    const getCart = async () => {
        const { data } = await axios({
        method: "GET",
        withCredentials: true,
        url: `${BACK_URL}/cart`, //! VOLVER A VER cambiar
        headers: {
            Authorization: `token ${token}`,
        },
        });
        console.log(data);
        typeof data !== 'string' &&
        setCart(data.products);
    };

    const deleteProduct = async (id) => {
        const { data } = await axios.delete(`${BACK_URL}/cart/${id}`,{
            headers: {
                Authorization: `token ${token}`,
            }
        });
        setCart(data.products)
        closeModal();
    };

    const handleQuantity = async (id, num) => {
        const { data } = await axios({
            method: "PUT",
            withCredentials: true,
            url: `${BACK_URL}/cart/quantity/?id=${id}&amount=${num}`,
            headers: {
                Authorization: `token ${token}`,
            }
        });
        console.log(data);
        num>0
        ? document.getElementById(id).innerHTML++
        : document.getElementById(id).innerHTML--;
    };

    const handleQuantityEx = async (id, num) => { 
        const { data } = await axios({
            method: "PUT",
            withCredentials: true,
            url: `${BACK_URL}/cart/quantityEx?id=${id}&amount=${num}`,
            headers: {
                Authorization: `token ${token}`,
            }
        });
        document.getElementById(id).value = data;
    }

    const goCheckout = async () => {
        // crea la order       
        const { data: id } = await axios.get(`${BACK_URL}/order/`, { 
            headers: {
                    Authorization: `token ${token}`,
                }
        });
        // con la id inicia el checkout
        navigate(`/checkout/${id}`);
    };

    return (
        <>
        <Modal isOpen={isOpen} closeModal={closeModal}>
            <h1>You want to delete this product?</h1>
            <div>
                <button onClick={closeModal}>Cancel</button>
                <button onClick={()=> deleteProduct(prop)}>Delete</button>
            </div>
        </Modal>
        <hr />
        <h2>Cart</h2>
        <button onClick={getCart}>GET CART</button>
        {
            cart?.map((prod) => (
            <div key={prod.product_id}>
                <img src={prod.img[0]} alt='product img' height={60}/>
                    {prod.product_name} - ${prod.price} - 
                    <button onClick={() => handleQuantity(prod.product_id, -1)}>-</button>
                    <span id={prod.product_id}>{prod.quantity}</span>
                    <button onClick={() => handleQuantity(prod.product_id, 1)}>+</button>
                    <p onClick={()=> openModal(prod.product_id)}><b> Delete </b></p>
            </div>
            ))
        }
        <br />
        <button onClick={goCheckout}>Proceed to checkout</button>
        </>
    );
};

export default Cart;
