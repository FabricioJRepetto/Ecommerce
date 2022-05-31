import React, { useState } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const token = useSelector((state) => state.sessionReducer.token);

  const getCart = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:4000/cart", //! VOLVER A VER cambiar
      headers: {
        Authorization: `token ${token}`,
      },
    }).then((res) => {
      console.log(res.data);
      typeof res.data !== "string" && setCart(res.data);
    });
  };

  return (
    <>
      <hr />
      <h2>Cart</h2>
      <button onClick={getCart}>GET CART</button>
      {React.Children.toArray(
        cart?.map((prod) => (
          <div>
            {prod.name} - ${prod.price}
          </div>
        ))
      )}
    </>
  );
};

export default Cart;
