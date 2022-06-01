import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { BACK_URL } from "./constants";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const token = useSelector((state) => state.sessionReducer.token);

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
      setCart(data);
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

  return (
    <>
      <hr />
      <h2>Cart</h2>
      <button onClick={getCart}>GET CART</button>
      {React.Children.toArray(
        cart?.map((prod) => (
          <div>
                {prod.details.name} - ${prod.details.price} - 
                <button onClick={() => handleQuantity(prod.details._id, -1)}>-</button>
                <span id={prod.details._id}>{prod.quantity}</span>
                <button onClick={() => handleQuantity(prod.details._id, 1)}>+</button>
                {/*<input type="number"
                    id={prod.details._id}
                    defaultValue={prod.quantity}
                    onChange={(e) => handleQuantityEx(
                        prod.details._id,
                        e.target.value
                    )}
                     />*/}
          </div>
        ))
      )}
    </>
  );
};

export default Cart;
