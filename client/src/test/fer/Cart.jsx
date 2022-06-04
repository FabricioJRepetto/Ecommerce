//: handleQuantityEx crear el input para mostrar/modificar la cantidad de unidades
//: investigar withCredentials: true
//: checkear 'cart' al crear orden

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BACK_URL } from "../../constants";

const Cart = () => {
    const [cart, setCart] = useState(null);
    const token = useSelector((state) => state.sessionReducer.token);
    const navigate = useNavigate();

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
        //! crea la order       
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
      <hr />
      <h2>Cart</h2>
      <button onClick={getCart}>GET CART</button>
      {React.Children.toArray(
        cart?.map((prod) => (
          <div>
                {prod.product_name} - ${prod.price} - 
                <button onClick={() => handleQuantity(prod.product_id, -1)}>-</button>
                <span id={prod.product_id}>{prod.quantity}</span>
                <button onClick={() => handleQuantity(prod.product_id, 1)}>+</button>
          </div>
        ))
      )}
      <br />
      <button onClick={goCheckout}>Proceed to checkout</button>
    </>
  );
};

export default Cart;
