import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  loadIdProductToEdit,
  changeReloadFlag,
} from "../../Redux/reducer/productsSlice";
import {
  validateImgs,
  validationProductFormSchema,
} from "../../helpers/validators";
import { useNotification } from "../../hooks/useNotification";
import { useModal } from "../../hooks/useModal";
import Modal from "../../components/common/Modal";
import SelectsNested from "./SelectsNested";
import "./ProductForm.css";
import "../../App.css";

const ProductForm = () => {
  const [featuresQuantity, setFeaturesQuantity] = useState(1);
  const [attributesQuantity, setAttributesQuantity] = useState(1);
  const [category, setCategory] = useState(null);
  const [categoryPath, setCategoryPath] = useState([]);
  const [productImg, setProductImg] = useState([]);
  const [productImgUrls, setProductImgUrls] = useState([]);
  const [mainImgIndex, setMainImgIndex] = useState(0);
  const [imgsToEdit, setImgsToEdit] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);
  const { idProductToEdit } = useSelector((state) => state.productsReducer);
  const dispatch = useDispatch();
  const [warn, setWarn] = useState({
    main_features: "",
    attributes: "",
    image: "",
  });
  const [imagesError, setImagesError] = useState(null);
  const [categoryError, setCategoryError] = useState(null);
  const [showCustomErrors, setShowCustomErrors] = useState(false);
  let timeoutId = useRef();
  const navigate = useNavigate();
  const [notification] = useNotification();
  const [isOpenCreateProduct, openCreateProduct, closeCreateProduct] =
    useModal();

  const warnTimer = (key, message) => {
    clearTimeout(timeoutId.current);
    setWarn({
      ...warn,
      [key]: message,
    });
    let timeout = () => setTimeout(() => setWarn({}), 7000);
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
      `main_feature_value_${featuresQuantity - 1}`
    );

    if (feature.value !== "") {
      appendFeature({ value: "" });
      setFeaturesQuantity(featuresQuantity + 1);
    } else {
      warnTimer(
        "main_features",
        "Completa este campo antes de agregar uno nuevo"
      );
    }
  };

  const handleRemoveFeature = (i) => {
    console.log("index", i);
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

  useEffect(() => {
    console.log("featuresQuantity", featuresQuantity);
    console.log("fieldsFeatures", fieldsFeatures);
  }, [fieldsFeatures]);
  /* useEffect(() => {
    console.log("attributesQuantity", attributesQuantity);
    console.log("fieldsAttributes", fieldsAttributes);
  }, [fieldsAttributes]); */

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
    setValue("category", data.category);
    setCategoryPath(data.path_from_root);
    replaceFeature([...data.main_features]);
    replaceAttribute([...data.attributes]);
    setImgsToEdit(data.images);
  };

  useEffect(() => {
    //! VOLVER A VER eliminar hasta linea 188
    setValue("brand", "marcaa1");
    setValue("name", "nombre1");
    setValue("price", 100);
    setValue("available_quantity", 10);
    setValue("description", "descripcion");
    setCategoryPath([
      {
        _id: "62e58e4177ee611ae1369fe6",
        id: "MLA5725",
        name: "Accesorios para Vehículos",
      },
      {
        _id: "62e58e4177ee611ae1369fe7",
        id: "MLA4711",
        name: "Acc. para Motos y Cuatriciclos",
      },
      {
        _id: "62e58e4177ee611ae1369fe8",
        id: "MLA86379",
        name: "Alarmas para Motos",
      },
    ]);
    if (idProductToEdit) {
      axios(`/product/${idProductToEdit}`)
        .then(({ data }) => {
          setProductToEdit(idProductToEdit);
          dispatch(loadIdProductToEdit(null));
          loadInputs(data);
        })
        .catch((err) => console.log(err)); //!VOLVER A VER manejo de errores
    } else {
      //! VOLVER A VER poner strings vacias en lineas 199 y 200
      appendAttribute({ name: "color", value_name: "amarillo" });
      appendFeature({ value: "piola" });
    }
    // eslint-disable-next-line
  }, []);

  const handleAddImg = (e) => {
    const fileListArrayImg = Array.from(e.target.files);
    validateImgs(fileListArrayImg, warnTimer, productImg);
    setProductImg([...productImg, ...fileListArrayImg]);
  };
  const handleRemoveImg = (i) => {
    setProductImg(productImg.filter((_, index) => index !== i));
    mainImgIndex === i && setMainImgIndex(0);
    mainImgIndex >= productImg.length + imgsToEdit.length - 1 &&
      setMainImgIndex(mainImgIndex - 1);
  };
  const handleRemoveImgToEdit = (_id, i) => {
    /*     console.log("mainImgIndex:", mainImgIndex);
    console.log("i:", i);
 */ setImgsToEdit(imgsToEdit.filter((img) => img._id !== _id));
    mainImgIndex === i && setMainImgIndex(0);
    mainImgIndex >= productImg.length + imgsToEdit.length - 1 &&
      setMainImgIndex(mainImgIndex - 1);
  };

  useEffect(() => {
    const newImageUrls = [];
    for (const image of productImg) {
      newImageUrls.push(URL.createObjectURL(image));
    }
    setProductImgUrls(newImageUrls);
  }, [productImg]);

  const submitProduct = async (productData, errorFlag) => {
    if (errorFlag > 0) return;
    productData = { ...productData, category: category };

    let formData = new FormData();

    const fileListArrayImg = Array.from(productImg);
    validateImgs(fileListArrayImg);
    if (!productToEdit && mainImgIndex !== 0) {
      const mainImg = fileListArrayImg.splice(mainImgIndex, 1)[0];
      fileListArrayImg.splice(0, 0, mainImg);
    }

    fileListArrayImg.forEach((pic) => {
      formData.append("images", pic);
    });
    // formData.append("images", fileListArrayImg);

    //! VOLVER A VER poner disabled el boton de submit al hacer la petición
    try {
      if (productToEdit) {
        let data = { ...productData, imgsToEdit, mainImgIndex };
        formData.append("data", JSON.stringify(data));

        await axios.put(`/admin/product/${productToEdit}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        dispatch(changeReloadFlag(true));
        notification("Producto editado exitosamente", "", "success");
        navigate("/admin/products");
      } else {
        formData.append("data", JSON.stringify(productData));

        await axios.post("/admin/product/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        dispatch(changeReloadFlag(true));
        notification("Producto creado exitosamente", "", "success");
        openCreateProduct();
      }
      clearInputs();
    } catch (error) {
      notification("Hubo un error, vuelve a intentar", "", "error");
      //!VOLVER A VER manejo de errores
      console.log(error);
    }
  };

  const clearInputs = () => {
    reset();
    setWarn({});
    setShowCustomErrors(false);
    setProductImg([]);
    setImgsToEdit([]);
    setCategoryPath([]);
    setCategory(null);
    setAttributesQuantity(1);
    appendAttribute({ name: "", value_name: "" });
    setFeaturesQuantity(1);
    appendFeature({ value: "" });
  };

  const handleModalCreateProduct = (value) => {
    //! VOLVER A VER poner notif por encima de modal
    if (value) {
      clearInputs();
      closeCreateProduct();
    } else {
      navigate("/admin/products");
    }
  };

  const isImagesEmpty = () => {
    let errorFlag = 0;

    if (!productToEdit && productImg.length === 0) {
      setImagesError("Debes subir al menos una imágen");
      errorFlag = 1;
    }
    if (productToEdit && productImg.length === 0 && imgsToEdit.length === 0) {
      setImagesError("Debes subir al menos una imágen");
      errorFlag = 1;
    }
    return errorFlag;
  };

  useEffect(() => {
    let errorFlag = isImagesEmpty();
    if (errorFlag === 0) setImagesError(null); // eslint-disable-next-line
  }, [productImg, imgsToEdit]);

  const isCategoryEmpty = () => {
    let errorFlag = 0;
    if (!category) {
      setCategoryError("Debes seleccionar la categoría");
      errorFlag = 1;
    }
    return errorFlag;
  };

  const customSubmit = (e) => {
    e.preventDefault();
    let errorFlag = isImagesEmpty() + isCategoryEmpty();
    setShowCustomErrors(true);
    handleSubmit((productData) => submitProduct(productData, errorFlag))(e);
  };

  useEffect(() => {
    let errorFlag = isCategoryEmpty();
    if (errorFlag === 0) setCategoryError(null); // eslint-disable-next-line
  }, [category]);

  const handleMainImg = (i) => {
    if (imgsToEdit) {
      i < productImg.length + imgsToEdit.length && setMainImgIndex(i);
    } else {
      i < productImg.length && setMainImgIndex(i);
    }
  };

  return (
    <div>
      <hr />
      <h2>{productToEdit ? "EDITAR" : "CREAR"} producto</h2>
      <br />
      <form encType="multipart/form-data" onSubmit={customSubmit}>
        <>
          <div>
            <input
              type="text"
              placeholder="Título/Nombre"
              autoComplete="off"
              {...register("name")}
            />
            <div>{errors.name?.message}</div>

            <SelectsNested
              setCategory={setCategory}
              category={category}
              setCategoryPath={setCategoryPath}
              categoryPath={categoryPath}
            />
            {showCustomErrors && categoryError && (
              <h3>ESTADO {categoryError}</h3>
            )}

            <input
              type="text"
              placeholder="Precio"
              autoComplete="off"
              {...register("price")}
            />
            <div>{errors.price?.message}</div>

            <input
              type="text"
              placeholder="Marca"
              autoComplete="off"
              {...register("brand")}
            />
            <div>{errors.brand?.message}</div>

            <input
              type="text"
              placeholder="Stock"
              autoComplete="off"
              {...register("available_quantity", {
                required: true,
                pattern: /^[0-9]*$/,
              })}
            />
            <div>{errors.available_quantity?.message}</div>

            <label>
              <input type="checkbox" {...register("free_shipping")} />
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
                    id={`main_feature_value_${i}`}
                    {...register(`main_features.${i}.value`)}
                  />
                  <span onClick={() => handleRemoveFeature(i)}> X</span>
                  <p>{errors.main_features?.[i]?.value.message}</p>
                </>
              ))
            )}
            {warn.main_features && <p>{warn.main_features}</p>}
            <h3 onClick={() => handleAddFeature()}>+</h3>

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
            <h3 onClick={() => handleAddAttribute()}>+</h3>
          </div>
          <br />
          <hr />
          <br />
          <div>
            <textarea placeholder="Descripción" {...register("description")} />
            <div>{errors.description?.message}</div>
          </div>
          <br />
          <hr />
          <br />
        </>

        <div>
          <label htmlFor="filesButton" className="g-white-button">
            Subir imágenes
          </label>
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
        {showCustomErrors && imagesError && <h3>{imagesError}</h3>}

        {imgsToEdit &&
          React.Children.toArray(
            imgsToEdit.map(({ imgURL, _id }, i) => (
              <>
                {mainImgIndex === i && <span>PORTADA</span>}
                <img
                  src={imgURL}
                  alt={`img_${_id}`}
                  className="imgs-product"
                  onClick={() => handleMainImg(i)}
                />
                <span onClick={() => handleRemoveImgToEdit(_id, i)}> X</span>
              </>
            ))
          )}
        {React.Children.toArray(
          productImgUrls.map((imageURL, i) => (
            <>
              {imgsToEdit ? (
                <>
                  {mainImgIndex - imgsToEdit.length === i && (
                    <span>PORTADA</span>
                  )}
                  <img
                    src={imageURL}
                    alt={`img_${i}`}
                    className="imgs-product"
                    onClick={() => handleMainImg(imgsToEdit.length + i)}
                  />
                  <span onClick={() => handleRemoveImg(i)}> X</span>
                </>
              ) : (
                <>
                  {mainImgIndex === i && <span>PORTADA</span>}
                  <img
                    src={imageURL}
                    alt={`img_${i}`}
                    className="imgs-product"
                    onClick={() => handleMainImg(i)}
                  />
                  <span onClick={() => handleRemoveImg(i)}> X</span>
                </>
              )}
            </>
          ))
        )}

        <input
          type="submit"
          value={productToEdit ? "Actualizar producto" : "Crear producto"}
          className="g-white-button"
        />
      </form>
      <button onClick={clearInputs} className="g-white-button">
        RESETEAR
      </button>
      <Modal
        isOpen={isOpenCreateProduct}
        closeModal={closeCreateProduct}
        type="warn"
      >
        <p>¿Crear otro producto?</p>
        <button
          type="button"
          onClick={() => handleModalCreateProduct(true)}
          className="g-white-button"
        >
          Aceptar
        </button>
        <button
          type="button"
          onClick={() => handleModalCreateProduct(false)}
          className="g-white-button"
        >
          Cancelar
        </button>
      </Modal>
    </div>
  );
};

export default ProductForm;
