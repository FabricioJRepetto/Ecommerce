import React, { useState } from "react";
import axios from "axios";
//import axios from "axios";

const Authetication = () => {
  const [products, setProducts] = useState(null);
  const getProducts = () => {
    axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:4000/product", //! VOLVER A VER cambiar
    }).then((res) => {
      setProducts(res.data);
      console.log(res.data);
    });
  };

  const [product, setProduct] = useState({
    name: "",
    price: 0,
    description: "",
    attributes: ["rojo", "azul"],
    main_features: ["rojo", "azul"],
  });
  const [productImg, setProductImg] = useState();

  const submitProduct = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("image", productImg);
    formData.append("data", JSON.stringify(product));

    const imgURL = await axios.post(
      "http://localhost:4000/product/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(imgURL);
  };

  return (
    <div>
      <div>
        <button onClick={getProducts}>GET PRODUCTS</button>
        {products &&
          React.Children.toArray(
            products.map((prod) => (
              <>
                <h2>{prod.name}</h2>
                <img src={prod.imgURL} alt="producto" height={50} />
                <h3>{`$${prod.price}`}</h3>
              </>
            ))
          )}
      </div>
      <>
        <h1>Product Form</h1>
        <form encType="multipart/form-data" onSubmit={submitProduct}>
          <div>
            <input
              type="text"
              name="name"
              placeholder="Title/Name"
              onChange={(e) =>
                setProduct({ ...product, [e.target.name]: e.target.value })
              }
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              onChange={(e) =>
                setProduct({ ...product, [e.target.name]: e.target.value })
              }
            />
          </div>
          <div>
            <input
              type="text"
              name="main_features"
              placeholder="Main features"
              onChange={(e) =>
                setProduct({ ...product, [e.target.name]: [e.target.value] })
              }
            />
            <input
              type="text"
              name="attributes"
              placeholder="Attributes"
              onChange={(e) =>
                setProduct({ ...product, [e.target.name]: [e.target.value] })
              }
            />
          </div>
          <div>
            <textarea
              name="description"
              placeholder="Description"
              onChange={(e) =>
                setProduct({ ...product, [e.target.name]: e.target.value })
              }
            />
          </div>
          <div>
            <input
              type="file"
              name="image"
              onChange={(e) => setProductImg(e.target.files[0])}
            />
          </div>
          <input type="submit" value="Send" />
        </form>
      </>
    </div>
  );
};

export default Authetication;
