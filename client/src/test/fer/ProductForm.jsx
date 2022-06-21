import React, { useState } from "react";
import axios from "axios";

const ProductForm = () => {
  const [product, setProduct] = useState({
    name: "",
    price: 0,
    description: "",
    attributes: ["rojo", "azul"],
    main_features: ["rojo", "azul"],
    available_quantity: 0,
  });
  const [productImg, setProductImg] = useState();

    const submitProduct = async (e) => {
        e.preventDefault();
        let formData = new FormData();
        //: verificar datos
        
       // agarra las images
        productImg.forEach(pic => {
            formData.append('images', pic)
        });
        //formData.append('images', productImg);
        formData.append('data', JSON.stringify(product));
        
        const imgURL = await axios.post(`/product/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log(imgURL);
    };
    const handleFiles = (e) => { 
        setProductImg([...e.target.files])
     }

  return (
    <div>
      <hr />
      <h2>Product CREATION</h2>
      <form encType="multipart/form-data" onSubmit={submitProduct}>
        <div>
          <input
            type="text"
            name="name"
            placeholder="Title/Name"
            onChange={(e) =>
              setProduct({
                ...product,
                [e.target.name]: e.target.value,
              })
            }
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            onChange={(e) =>
              setProduct({
                ...product,
                [e.target.name]: e.target.value,
              })
            }
          />
          <input
            type="text"
            name="brand"
            placeholder="Brand"
            onChange={(e) =>
              setProduct({
                ...product,
                [e.target.name]: e.target.value,
              })
            }
          />
          <input
            type="number"
            name="available_quantity"
            placeholder="Stock"
            onChange={(e) =>
              setProduct({
                ...product,
                [e.target.name]: e.target.value,
              })
            }
          />
        </div>
        <div>
          <input
            type="text"
            name="main_features"
            placeholder="Main features"
            onChange={(e) =>
              setProduct({
                ...product,
                [e.target.name]: [e.target.value],
              })
            }
          />
          <input
            type="text"
            name="attributes"
            placeholder="Attributes"
            onChange={(e) =>
              setProduct({
                ...product,
                [e.target.name]: [e.target.value],
              })
            }
          />
        </div>
        <div>
          <textarea
            name="description"
            placeholder="Description"
            onChange={(e) =>
              setProduct({
                ...product,
                [e.target.name]: e.target.value,
              })
            }
          />
        </div>
        <div>
          <input
            type="file"
            name="image"
            multiple
            accept=".jpeg,.jpg,.png"
            onChange={handleFiles}
          />
        </div>
        <input type="submit" value="Send" />
      </form>
    </div>
  );
};

export default ProductForm;
