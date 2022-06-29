import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadIdProductToEdit } from "../../Redux/reducer/productsSlice";
import axios from "axios";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import "./ProductForm.css";
import {
  validateImgs,
  validationProductFormSchema,
} from "../../helpers/validators";

const ProductForm = () => {
  const [productImg, setProductImg] = useState([]);
  const [productImgUrls, setProductImgUrls] = useState([]);
  const [featuresQuantity, setFeaturesQuantity] = useState(1);
  const [attributesQuantity, setAttributesQuantity] = useState(1);
  const { idProductToEdit } = useSelector((state) => state.productsReducer);
  const dispatch = useDispatch();
  const [warn, setWarn] = useState({
    main_features: "",
    attributes: "",
    image: "",
  });
  let timeoutId = useRef();
  const [productToEdit, setProductToEdit] = useState(null);
  const [imgsToEdit, setImgsToEdit] = useState([]);

  const warnTimer = (key, message) => {
    clearTimeout(timeoutId.current);
    setWarn({
      ...warn,
      [key]: message,
    });
    let timeout = () => setTimeout(() => setWarn({}), 5000);
    timeoutId.current = timeout();
  };

  const formOptions = { resolver: yupResolver(validationProductFormSchema) };
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm(formOptions);

  const {
    fields: fieldsFeatures,
    append: appendFeature,
    remove: removeFeature,
    replace: replaceFeature,
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
      warnTimer(
        "main_features",
        "Completa este campo antes de agregar uno nuevo"
      );
    }
  };

  const handleRemoveFeature = (i) => {
    if (featuresQuantity > 1) {
      removeFeature(i);
      setFeaturesQuantity(featuresQuantity - 1);
    } else {
      warnTimer("main_features", "Debes agregar al menos una característica");
    }
  };

  const {
    fields: fieldsAttributes,
    append: appendAttribute,
    remove: removeAttribute,
    replace: replaceAttribute,
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
      warnTimer(
        "attributes",
        "Completa estos campos antes de agregar uno nuevo"
      );
    }
  };

  const handleRemoveAttribute = (i) => {
    if (attributesQuantity > 1) {
      removeAttribute(i);
      setAttributesQuantity(attributesQuantity - 1);
    } else {
      warnTimer("attributes", "Debes agregar al menos un atributo");
    }
  };

  const loadInputs = (data) => {
    setValue("name", data.name);
    setValue("price", data.price);
    setValue("brand", data.brand);
    setValue("available_quantity", data.available_quantity);
    setValue("description", data.description);
    setValue("free_shipping", data.free_shipping);
    replaceFeature([...data.main_features]);
    replaceAttribute([...data.attributes]);
    setImgsToEdit(data.images);
  };

  useEffect(() => {
    if (idProductToEdit) {
      axios(`/product/${idProductToEdit}`).then(({ data }) => {
        console.log(data);
        setProductToEdit(idProductToEdit);
        dispatch(loadIdProductToEdit(null));
        loadInputs(data);
      });
    } else {
      appendAttribute({ name: "", value_name: "" });
      appendFeature("");
    }
    // eslint-disable-next-line
  }, []);

  const handleAddImg = (e) => {
    const fileListArrayImg = Array.from(e.target.files);
    console.log(fileListArrayImg);
    validateImgs(fileListArrayImg, warnTimer);
    setProductImg([...productImg, ...fileListArrayImg]);
  };

  const handleRemoveImg = (i) => {
    setProductImg(productImg.filter((_, index) => index !== i));
  };
  const handleRemoveImgToEdit = (_id) => {
    setImgsToEdit(imgsToEdit.filter((img) => img._id !== _id));
  };

  useEffect(() => {
    const newImageUrls = [];
    for (const image of productImg) {
      newImageUrls.push(URL.createObjectURL(image));
    }
    setProductImgUrls(newImageUrls);
  }, [productImg]);

  const submitProduct = async (productData) => {
    console.log(productData);
    if (!productToEdit && productImg.length === 0) {
      return warnTimer("image", "Debes subir al menos una imágen");
    }
    if (productToEdit && productImg.length === 0 && imgsToEdit.length === 0) {
      return warnTimer("image", "Debes subir al menos una imágen");
    }

    let formData = new FormData();

    // agarra las images
    const fileListArrayImg = Array.from(productImg);
    validateImgs(fileListArrayImg);

    fileListArrayImg.forEach((pic) => {
      formData.append("images", pic);
    });
    // formData.append("images", fileListArrayImg);

    let imgURL;
    if (productToEdit) {
      let data = { ...productData, imgsToEdit };
      formData.append("data", JSON.stringify(data));
      //  formData.append("imgsToEdit", imgsToEdit);

      imgURL = await axios.put(`/product/${productToEdit}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } else {
      formData.append("data", JSON.stringify(productData));
      imgURL = await axios.post(`/product/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }
    console.log(imgURL);

    console.log("enviado");
    // clearInputs();
  };

  const clearInputs = () => {
    reset();
    setWarn({});
    setProductImg([]);
    setImgsToEdit([]);
    setAttributesQuantity(1);
    appendAttribute({ name: "", value_name: "" });
    setFeaturesQuantity(1);
    appendFeature("");
  };

  return (
    <div>
      <hr />
      <h2>Product {productToEdit ? "EDIT" : "CREATION"}</h2>
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
              //  id="name_id"
              {...register("name")}
            />
            <div>{errors.name?.message}</div>

            <input
              type="text"
              placeholder="Precio"
              autoComplete="off"
              //   id="price_id"
              {...register("price")}
            />
            <div>{errors.price?.message}</div>

            <input
              type="text"
              placeholder="Marca"
              autoComplete="off"
              //  id="brand_id"
              {...register("brand")}
            />
            <div>{errors.brand?.message}</div>

            <input
              type="text"
              placeholder="Stock"
              autoComplete="off"
              //  id="stock_id"
              {...register("available_quantity", {
                required: true,
                pattern: /^[0-9]*$/,
              })}
            />
            <div>{errors.available_quantity?.message}</div>

            <label>
              <input
                type="checkbox"
                //  id="free_shipping_id"
                {...register("free_shipping")}
              />
              Envío gratis
            </label>
            <div>{errors.free_shipping?.message}</div>
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
            {warn.main_features && <p>{warn.main_features}</p>}
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
            {warn.attributes && <p>{warn.attributes}</p>}
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
              //   id="description_id"
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
        {warn.image && <p>{warn.image}</p>}

        {imgsToEdit &&
          React.Children.toArray(
            imgsToEdit.map(({ imgURL, _id }) => (
              <>
                <img src={imgURL} alt={`img_${_id}`} className="imgs-product" />
                <span onClick={() => handleRemoveImgToEdit(_id)}> X</span>
              </>
            ))
          )}
        {React.Children.toArray(
          productImgUrls.map((imageURL, i) => (
            <>
              <img src={imageURL} alt={`img_${i}`} className="imgs-product" />
              <span onClick={() => handleRemoveImg(i)}> X</span>
            </>
          ))
        )}

        <input
          type="submit"
          value={productToEdit ? "Editar producto" : "Crear producto"}
        />
      </form>
      <button onClick={clearInputs}>RESETEAR</button>
    </div>
  );
};

export default ProductForm;
