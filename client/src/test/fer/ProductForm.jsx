import React, { useState } from "react";
import axios from "axios";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import "./ProductForm.css";

const validatePrice = (value) => {
  if (value === undefined) return false;
  return /^\d+(.\d{1,2})?$/.test(value);
};

const validateNumbers = (value) => {
  if (value === undefined) return false;
  return /^[0-9]*$/.test(value);
};

const clearInputs = (
  featuresQuantity,
  setFeaturesQuantity,
  removeFeature,
  appendFeature,
  attributesQuantity,
  setAttributesQuantity,
  removeAttribute,
  appendAttribute
) => {
  const ids = ["name_id", "price_id", "brand_id", "stock_id", "description_id"];
  for (const id of ids) {
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
};

const ProductForm = () => {
  const [productImg, setProductImg] = useState([]);
  const [productImgUrls, setProductImgUrls] = useState([]);
  // const [featuresQuantity, setFeaturesQuantity] = useState(1);
  // const [attributesQuantity, setAttributesQuantity] = useState(1);

  const validationSchema = yup.object().shape({
    /* name: yup.string().required("Nombre es requerido"),
    price: yup.string()
     .required("Precio es requerido")
      .test(
        "price",
        "Precio debe ser un número válido (ej: '1234.56')",
        (value) => validatePrice(value)
      ),  brand: yup.string().required("Marca es requerida"),
    available_quantity: yup
      .string()
      .required("Stock es requerido")
      .test("stock", "Stock debe ser un número", (value) =>
        validateNumbers(value)
      ),
    description: yup.string().required("Descripción es requerida"), 
    main_features: yup
      .array()
      .of(yup.string().required("Principales características requeridas")),
    attributes: yup.array().of(
      yup.object().shape({
        name: yup.string().required("Nombre de atributo es requerido"),
        value_name: yup.string().required("Valor de atributo es requerido"),
      })
    ),*/
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm(formOptions);

  /*   const {
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

  useEffect(() => {
    appendFeature("");
  }, []); */

  /*   const {
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
    // eslint-disable-next-line
  }, []); */

  const submitProduct = async (productData) => {
    if (productImg.length === 0) return console.log("subir img"); //!VOLVER A VER renderizar mensaje warn
    console.log(productData);
    let formData = new FormData();
    //: verificar datos

    // agarra las images
    productImg.forEach((pic) => {
      formData.append("images", pic);
    });
    formData.append("images", productImg);
    formData.append("data", JSON.stringify(productData));

    const imgURL = await axios.post(`/product/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(imgURL);

    /* clearInputs(
       featuresQuantity,
      setFeaturesQuantity,
      removeFeature,
      appendFeature, 
      attributesQuantity,
      setAttributesQuantity,
      removeAttribute,
      appendAttribute
    ); */
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

  const handleFiles = (e) => {
    setProductImg([...productImg, ...e.target.files]);
  };

  const handleRemoveImg = (i) => {
    setProductImg(productImg.filter((_, index) => index !== i));
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
          {/*  <div>
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
        <br /> */}
        </>

        <div>
          <label htmlFor="filesButton">BOTON PARA SUBIR IMAGENES</label>
          <input
            type="file"
            name="image"
            multiple
            accept=".jpeg,.jpg,.png"
            onChange={handleFiles}
            style={{ visibility: "hidden" }}
            id="filesButton"
          />
        </div>

        {React.Children.toArray(
          productImgUrls.map((imageUrl, i) => (
            <>
              <img
                src={imageUrl}
                alt="sd"
                className="imgs-product"
                /*  id={`product_img_${i}`} */
              />
              <span onClick={() => handleRemoveImg(i)}> X</span>
            </>
          ))
        )}

        <input type="submit" value="Crear producto" />
      </form>
      {/*  <button
        onClick={() =>
          clearInputs(
             featuresQuantity,
      setFeaturesQuantity,
      removeFeature,
      appendFeature, 
            attributesQuantity,
            setAttributesQuantity,
            removeAttribute,
            appendAttribute
          )
        }
      >
        RESETEAR
      </button> */}
    </div>
  );
};

export default ProductForm;
