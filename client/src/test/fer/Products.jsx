import React, { useState } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Products = () => {
  const [products, setProducts] = useState(null);
  const token = useSelector((state) => state.sessionReducer.token);

  const getProducts = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:4000/product", //! VOLVER A VER cambiar
    }).then((res) => {
      setProducts(res.data);
      console.log(res.data);
    });
  };

  const addToCart = (id) => {
    Axios({
      method: "PUT",
      /* data: { productId: id, quantity: 2 }, */
      withCredentials: true,
      url: `http://localhost:4000/cart/${id}`,
      headers: {
        Authorization: `token ${token}`,
      }, //! VOLVER A VER cambiar
    }).then((res) => {
      console.log(res.data);
    });
  };

  return (
    <>
      <hr />
      <h2>PRODUCTS</h2>
      <button onClick={getProducts}>GET ALL PRODUCTS</button>
      {React.Children.toArray(
        products?.map((prod) => (
          <div>
            {prod.name} - ${prod.price}
            {"    "}
            <button onClick={() => addToCart(prod._id)}>Add to cart</button>
          </div>
        ))
      )}
    </>
  );
};

export default Products;
