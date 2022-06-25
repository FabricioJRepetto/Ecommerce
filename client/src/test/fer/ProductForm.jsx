import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import "./ProductForm.css";
import { validateImgs, validationSchema } from "../../helpers/validations";

const ProductForm = () => {
  const [productImg, setProductImg] = useState([]);
  const [productImgUrls, setProductImgUrls] = useState([]);
  const [featuresQuantity, setFeaturesQuantity] = useState(1);
  const [attributesQuantity, setAttributesQuantity] = useState(1);

  const formOptions = { resolver: yupResolver(validationSchema) };
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm(formOptions);

  const {
    fields: fieldsFeatures,
    append: appendFeature,
    remove: removeFeature,
  } = useFieldArray({
    name: "main_features",
    control,
  });

  const handleAddFeature = () => {
    const feature = document.getElementById(
      `main_feature_${featuresQuantity - 1}`
    );
    if (feature.value !== "") {
      appendFeature("");
      setFeaturesQuantity(featuresQuantity + 1);
    } else {
      console.log("completa campo antes de agregar uno nuevo"); //!VOLVER A VER renderizar mensaje warn
    }
  };

  const handleRemoveFeature = (i) => {
    if (featuresQuantity > 1) {
      removeFeature(i);
      setFeaturesQuantity(featuresQuantity - 1);
    }
  };

  const {
    fields: fieldsAttributes,
    append: appendAttribute,
    remove: removeAttribute,
  } = useFieldArray({
    name: "attributes",
    control,
  });

  const handleAddAttribute = () => {
    const attribute_name = document.getElementById(
      `attribute_name_${attributesQuantity - 1}`
    );
    const attribute_value = document.getElementById(
      `attribute_value_${attributesQuantity - 1}`
    );

    if (attribute_name.value !== "" && attribute_value.value !== "") {
      appendAttribute({ name: "", value_name: "" });
      setAttributesQuantity(attributesQuantity + 1);
    } else {
      console.log("completa campos antes de agregar uno nuevo"); //!VOLVER A VER renderizar mensaje warn
    }
  };

  const handleRemoveAttribute = (i) => {
    if (attributesQuantity > 1) {
      removeAttribute(i);
      setAttributesQuantity(attributesQuantity - 1);
    }
  };

  useEffect(() => {
    appendAttribute({ name: "", value_name: "" });
    appendFeature("");
    // eslint-disable-next-line
  }, []);

  const handleAddImg = (e) => {
    const fileListArray = Array.from(e.target.files);
    validateImgs(fileListArray);
    setProductImg([...productImg, ...fileListArray]);
  };

  const handleRemoveImg = (i) => {
    setProductImg(productImg.filter((_, index) => index !== i));
  };

  useEffect(() => {
    //  if (productImg.length > 0) {
    const newImageUrls = [];
    for (const image of productImg) {
      newImageUrls.push(URL.createObjectURL(image));
    }
    setProductImgUrls(newImageUrls);
    // }
  }, [productImg]);

  const submitProduct = async (productData) => {
    if (productImg.length === 0) return console.log("subir img"); //!VOLVER A VER renderizar mensaje warn
    let formData = new FormData();

    // agarra las images
    const fileListArray = Array.from(productImg);
    validateImgs(fileListArray);

    fileListArray.forEach((pic) => {
      formData.append("images", pic);
    });
    formData.append("images", fileListArray);
    formData.append("data", JSON.stringify(productData));

    const imgURL = await axios.post(`/product/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(imgURL);

    clearInputs(
      featuresQuantity,
      setFeaturesQuantity,
      removeFeature,
      appendFeature,
      attributesQuantity,
      setAttributesQuantity,
      removeAttribute,
      appendAttribute,
      setProductImg
    );
  };

  const clearInputs = () => {
    const idsToClear = [
      "name_id",
      "price_id",
      "brand_id",
      "stock_id",
      "description_id",
    ];
    for (const id of idsToClear) {
      let input = document.getElementById(id);
      input.value = "";
    }
    if (featuresQuantity > 1) {
      removeFeature();
      setFeaturesQuantity(1);
      appendFeature("");
    } else {
      let mainFeature = document.getElementById("main_feature_0");
      mainFeature.value = "";
    }
    if (attributesQuantity > 1) {
      removeAttribute();
      setAttributesQuantity(1);
      appendAttribute({ name: "", value_name: "" });
    } else {
      let attributeName = document.getElementById("attribute_name_0");
      let attributeValue = document.getElementById("attribute_value_0");
      attributeName.value = "";
      attributeValue.value = "";
    }
    setProductImg([]);
  };

  return (
    <div>
      <hr />
      <h2>Product CREATION</h2>
      <form
        encType="multipart/form-data"
        onSubmit={handleSubmit(submitProduct)}
      >
        <>
          <div>
            <input
              type="text"
              placeholder="Título/Nombre"
              autoComplete="off"
              id="name_id"
              {...register("name")}
            />
            <div>{errors.name?.message}</div>

            <input
              type="text"
              placeholder="Precio"
              autoComplete="off"
              id="price_id"
              {...register("price")}
            />
            <div>{errors.price?.message}</div>

            <input
              type="text"
              placeholder="Marca"
              autoComplete="off"
              id="brand_id"
              {...register("brand")}
            />
            <div>{errors.brand?.message}</div>

            <input
              type="text"
              placeholder="Stock"
              autoComplete="off"
              id="stock_id"
              {...register("available_quantity", {
                required: true,
                pattern: /^[0-9]*$/,
              })}
            />
            <div>{errors.available_quantity?.message}</div>
          </div>
          <br />
          <hr />
          <br />

          <div>
            {React.Children.toArray(
              fieldsFeatures.map((_, i) => (
                <>
                  <input
                    type="text"
                    placeholder="Característica principal"
                    autoComplete="off"
                    id={`main_feature_${i}`}
                    {...register(`main_features.${i}`)}
                  />
                  <span onClick={() => handleRemoveFeature(i)}> X</span>
                  <p>{errors.main_features?.[i]?.message}</p>
                </>
              ))
            )}
            <h3 onClick={() => handleAddFeature()}>
              Agregar campo de característica
            </h3>

            <br />
            <hr />
            <br />

            {React.Children.toArray(
              fieldsAttributes.map((_, i) => (
                <>
                  <input
                    type="text"
                    placeholder="Nombre del atributo"
                    autoComplete="off"
                    id={`attribute_name_${i}`}
                    {...register(`attributes.${i}.name`)}
                  />
                  <p>{errors.attributes?.[i]?.name?.message}</p>
                  <input
                    type="text"
                    placeholder="Valor del atributo"
                    autoComplete="off"
                    id={`attribute_value_${i}`}
                    {...register(`attributes.${i}.value_name`)}
                  />
                  <span onClick={() => handleRemoveAttribute(i)}> X</span>
                  <p>{errors.attributes?.[i]?.value_name?.message}</p>
                </>
              ))
            )}
            <h3 onClick={() => handleAddAttribute()}>
              Agregar campos de atributo
            </h3>
          </div>
          <br />
          <hr />
          <br />
          <div>
            <textarea
              placeholder="Descripción"
              id="description_id"
              {...register("description")}
            />
            <div>{errors.description?.message}</div>
          </div>
          <br />
          <hr />
          <br />
        </>

        <div>
          <label htmlFor="filesButton">BOTON PARA SUBIR IMAGENES</label>
          <input
            type="file"
            name="image"
            multiple
            accept="image/png, image/jpeg"
            onChange={handleAddImg}
            style={{ visibility: "hidden" }}
            id="filesButton"
          />
        </div>

        {React.Children.toArray(
          productImgUrls.map((imageUrl, i) => (
            <>
              <img src={imageUrl} alt={`img_${i}`} className="imgs-product" />
              <span onClick={() => handleRemoveImg(i)}> X</span>
            </>
          ))
        )}

        <input type="submit" value="Crear producto" />
      </form>
      <button onClick={() => clearInputs()}>RESETEAR</button>
    </div>
  );
};

export default ProductForm;
