import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

const Products = () => {
  const [products, setProducts] = useState(null);
  const [whishlist, setWhishlist] = useState([]);

  useEffect(() => {
    (async () => {
        const { data: products } = await axios('/product');
        setProducts(products);
        const { data: wl } = await axios('/whishlist');
        let aux = wl.products.map(e => e.product_id);
        setWhishlist(aux);
    })();  
  }, []);

  const addToCart = async (id) => {
    const { data } = await axios.post(`/cart/${id}`);
    console.log(data);
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
      {React.Children.toArray(
        products?.map((prod) => (
          <div>
            {prod.name} - ${prod.price}
            {"    "}
            <button onClick={() => addToCart(prod._id)}>Add to cart</button>
            {whishlist.includes(prod._id)
                ?<button onClick={() => removeFromWL(prod._id)}>💔</button>
                :<button onClick={() => addToWL(prod._id)}>💚</button>
            }
          </div>
        ))
      )}
    </>
  );
};

export default Products;
