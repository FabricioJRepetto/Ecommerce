import React, { useState } from "react";
import Axios from "axios";

const Products = () => {
  const [products, setProducts] = useState(null);

  const getProducts = () => {
    Axios(`/product`).then((res) => {
      setProducts(res.data);
      console.log(res.data);
    });
  };

  const addToCart = (id) => {
    Axios.post(`/cart/${id}`).then((res) => {
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
