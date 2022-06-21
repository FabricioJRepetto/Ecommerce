import React, { useState } from "react";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState(null);

  const getProducts = () => {
    axios(`/product`).then((res) => {
      setProducts(res.data);
      console.log(res.data);
    });
  };

  const addToCart = (id) => {
    axios.post(`/cart/${id}`).then((res) => {
      console.log(res.data);
    });
  };

  const addToWL = async (id) => { 
        const {data} = await axios.post(`/whishlist/${id}`);
        console.log(data);
   };

   const removeFromWL = async (id) => { 
        const {data} = await axios.delete(`/whishlist/${id}`);
        console.log(data);
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
            <button onClick={() => addToWL(prod._id)}>💚</button>
            <button onClick={() => removeFromWL(prod._id)}>💔</button>
          </div>
        ))
      )}
    </>
  );
};

export default Products;
