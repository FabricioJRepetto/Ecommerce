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
import { avoidEnterSubmit } from "../../helpers/AvoidEnterSubmit";
import { useNotification } from "../../hooks/useNotification";
import { useModal } from "../../hooks/useModal";
import Modal from "../../components/common/Modal";
import SelectsNested from "./SelectsNested";
import { CloseIcon, AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { ReactComponent as Spinner } from "../../assets/svg/spinner.svg";
import Checkbox from "../../components/common/Checkbox";
import ReturnButton from "../../components/common/ReturnButton";
import "./ProductForm.css";
import "../../App.css";

const { REACT_APP_UPLOAD_PRESET, REACT_APP_CLOUDINARY_URL } = process.env;

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
  const [focusFlag, setFocusFlag] = useState(false);
  const [waitingResponse, setWaitingResponse] = useState(false);
  let timeoutId = useRef();
  const navigate = useNavigate();
  const notification = useNotification();
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
    watch,
    setFocus,
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
    setValue("category", data.category);
    setCategoryPath(data.path_from_root);
    //replaceFeature([...data.main_features]);
    let featuresToEdit = [];
    for (const feature of data.main_features) {
      featuresToEdit.push({ value: feature });
    }
    replaceFeature(featuresToEdit);
    replaceAttribute([...data.attributes]);
    setImgsToEdit(data.images);
  };

  useEffect(() => {
    //? autocompletados
    // setValue("brand", "marcaa1");
    // setValue("name", "nombre1");
    // setValue("price", 100);
    // setValue("available_quantity", 10);
    // setValue("description", "descripcion");
    // setCategoryPath([
    //   {
    //     _id: "62e58e4177ee611ae1369fe6",
    //     id: "MLA5725",
    //     name: "Accesorios para Vehículos",
    //   },
    //   {
    //     _id: "62e58e4177ee611ae1369fe7",
    //     id: "MLA4711",
    //     name: "Acc. para Motos y Cuatriciclos",
    //   },
    //   {
    //     _id: "62e58e4177ee611ae1369fe8",
    //     id: "MLA86379",
    //     name: "Alarmas para Motos",
    //   },
    // ]);
    if (idProductToEdit) {
      axios(`/product/${idProductToEdit}`)
        .then(({ data }) => {
          setProductToEdit(idProductToEdit);
          dispatch(loadIdProductToEdit(null));
          loadInputs(data.product);
        })
        .catch((err) => console.error(err)); //!VOLVER A VER manejo de errores
    } else {
    //   appendAttribute({ name: "color", value_name: "amarillo" });
    //   appendFeature({ value: "piola" });
    //   appendAttribute({ name: "", value_name: "" });
    //   appendFeature({ value: "" });
    }
    setFocusFlag(true);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (focusFlag === true) {
      setFocus("name");
      setFocusFlag(false);
    }
    // eslint-disable-next-line
  }, [focusFlag]);

  const handleAddImg = (e) => {
    const fileListArrayImg = Array.from(e.target.files);
    validateImgs(fileListArrayImg, warnTimer, productImg);
    setProductImg([...productImg, ...fileListArrayImg]);
  };
  const handleRemoveImg = (i) => {
    setProductImg(productImg.filter((_, index) => index !== i));
    if (mainImgIndex === i) {
      setMainImgIndex(0);
    } else if (mainImgIndex >= productImg.length + imgsToEdit.length - 1) {
      setMainImgIndex(mainImgIndex - 1);
    }
  };
  const handleRemoveImgToEdit = (_id, i) => {
    setImgsToEdit(imgsToEdit.filter((img) => img._id !== _id));
    if (mainImgIndex === i) {
      setMainImgIndex(0);
    } else if (mainImgIndex >= productImg.length + imgsToEdit.length - 1)
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

    const fileListArrayImg = Array.from(productImg);
    validateImgs(fileListArrayImg);
    if (!productToEdit && mainImgIndex !== 0) {
      const mainImg = fileListArrayImg.splice(mainImgIndex, 1)[0];
      fileListArrayImg.splice(0, 0, mainImg);
    }

    try {
      setWaitingResponse(true);

      let imagesRequests = [];

      fileListArrayImg.forEach((image) => {
        let imageFormData = new FormData();
        imageFormData.append("file", image);
        imageFormData.append("upload_preset", REACT_APP_UPLOAD_PRESET);
        imagesRequests.push(
          axios.post(REACT_APP_CLOUDINARY_URL, imageFormData)
        );
      });

      const imagesPromises = await Promise.all(imagesRequests);
      
      let images = [];

      for (const image of imagesPromises) {
        images.push({
          imgURL: image.data.secure_url,
          public_id: image.data.public_id,
        });
      }

      if (productToEdit) {
        let data = {
          ...productData,
          imgsToEdit,
          mainImgIndex,
          newImages: images,
        };
        await axios.put(`/admin/product/${productToEdit}`, data);

        dispatch(changeReloadFlag(true));
        notification("Producto editado exitosamente", "", "success");
        navigate("/admin/products");
      } else {
        await axios.post("/admin/product/", { ...productData, images });

        dispatch(changeReloadFlag(true));
        openCreateProduct();
      }
      clearInputs();
    } catch (error) {
      notification("Hubo un error, vuelve a intentar", "", "error");
      //!VOLVER A VER manejo de errores
    } finally {
      setWaitingResponse(false);
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
    setFocusFlag(true);
  };

  const handleModalCreateProduct = (value) => {
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
      setCategoryError("Selecciona la categoría");
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
    <div className="form-width-test component-fadeIn">
      <h2>{productToEdit ? "Editar" : "Publicar"} producto</h2>

      <form
        encType="multipart/form-data"
        onSubmit={customSubmit}
        onKeyDown={avoidEnterSubmit}
        className="form-width-test"
      >
        <div className="product-form-width">
          {/* TÍTULO */}
          <>
            <div className="input-title">Título</div>
            <span className="g-input-with-button">
              <input type="text" autoComplete="off" {...register("name")} />
              {watch("name") === "" || watch("name") === undefined ? null : (
                <div
                  className="g-input-icon-container g-input-x-button"
                  onClick={() => setValue("name", "")}
                >
                  <CloseIcon />
                </div>
              )}
            </span>
            <>
              {!errors.name && <p className="g-hidden-placeholder">hidden</p>}
              <p className="g-error-input">{errors.name?.message}</p>
            </>
          </>
        </div>

        {/* CATEGORÍA */}
        <div className="form-categorypath-container">
          <SelectsNested
            setCategory={setCategory}
            category={category}
            setCategoryPath={setCategoryPath}
            categoryPath={categoryPath}
          />
          <>
            {showCustomErrors && categoryError ? (
              <p className="g-error-input form-category-error">
                {categoryError}
              </p>
            ) : (
              <p className="g-hidden-placeholder">hidden</p>
            )}
          </>
        </div>

        <div className="product-form-width">
          <div className="two-inputs-container">
            {/* MARCA */}
            <div>
              <div className="input-title">Marca</div>
              <span className="g-input-with-button">
                <input type="text" autoComplete="off" {...register("brand")} />
                {watch("brand") === "" ||
                watch("brand") === undefined ? null : (
                  <div
                    className="g-input-icon-container g-input-x-button"
                    onClick={() => setValue("brand", "")}
                  >
                    <CloseIcon />
                  </div>
                )}
              </span>
              <>
                {!errors.brand && (
                  <p className="g-hidden-placeholder">hidden</p>
                )}
                <p className="g-error-input">{errors.brand?.message}</p>
              </>
            </div>

            {/* PRECIO */}
            <div>
              <div className="input-title input-title-price">Precio</div>
              <span className="price-input-container">
                <span className="dollar-sign-input">$</span>
                <span className="g-input-with-button">
                  <input
                    type="text"
                    autoComplete="off"
                    {...register("price")}
                  />
                  {watch("price") === "" ||
                  watch("price") === undefined ? null : (
                    <div
                      className="g-input-icon-container g-input-x-button"
                      onClick={() => setValue("price", "")}
                    >
                      <CloseIcon />
                    </div>
                  )}
                </span>
              </span>
              <>
                {!errors.price && (
                  <p className="g-hidden-placeholder">hidden</p>
                )}
                <p className="g-error-input form-price-error">
                  {errors.price?.message}
                </p>
              </>
            </div>
          </div>

          <div className="two-inputs-container">
            {/* STOCK */}
            <div>
              <div className="input-title">Stock</div>
              <span className="g-input-with-button">
                <input
                  type="text"
                  autoComplete="off"
                  {...register("available_quantity", {
                    required: true,
                    pattern: /^[0-9]*$/,
                  })}
                />
                {watch("available_quantity") === "" ||
                watch("available_quantity") === undefined ? null : (
                  <div
                    className="g-input-icon-container g-input-x-button"
                    onClick={() => setValue("available_quantity", "")}
                  >
                    <CloseIcon />
                  </div>
                )}
              </span>
              <>
                {!errors.available_quantity && (
                  <p className="g-hidden-placeholder">hidden</p>
                )}
                <p className="g-error-input">
                  {errors.available_quantity?.message}
                </p>
              </>
            </div>

            {/* ENVÍO GRATIS */}
            <div className="form-shipping-container">
              <div className="form-shipping-input-container">
                <label className="form-shipping-input">
                  <Checkbox
                    isChecked={watch("free_shipping")}
                    extraStyles={{
                      border: true,
                      rounded: true,
                      innerBorder: true,
                      margin: ".05rem",
                      size: "1.2",
                    }}
                  />
                  <input type="checkbox" {...register("free_shipping")} />
                  <span className="shipping-title">Envío gratis</span>
                </label>
              </div>
              <>
                {!errors.free_shipping && (
                  <p className="g-hidden-placeholder">hidden</p>
                )}
                <p className="g-error-input">{errors.free_shipping?.message}</p>
              </>
            </div>
          </div>

          {/* MAIN FEATURES */}
          <div className="form-container-border">
            <div className="input-title">Características principales</div>
            {React.Children.toArray(
              fieldsFeatures.map((_, i) => (
                <>
                  <div className="input-with-trash">
                    <div className="g-input-with-button">
                      <input
                        type="text"
                        autoComplete="off"
                        id={`main_feature_value_${i}`}
                        {...register(`main_features.${i}.value`)}
                      />
                      {watch(`main_features.${i}.value`) === "" ||
                      watch(`main_features.${i}.value`) === undefined ? null : (
                        <div
                          className="g-input-icon-container g-input-x-button"
                          onClick={() =>
                            setValue(`main_features.${i}.value`, "")
                          }
                        >
                          <CloseIcon />
                        </div>
                      )}
                    </div>

                    {featuresQuantity > 1 && (
                      <span
                        onClick={() => handleRemoveFeature(i)}
                        className="g-icon-button trash-button"
                      >
                        <DeleteIcon />
                      </span>
                    )}
                  </div>
                  <>
                    {!errors.main_features?.[i] && (
                      <p className="g-hidden-placeholder">hidden</p>
                    )}
                    <p className="g-error-input">
                      {errors.main_features?.[i]?.value.message}
                    </p>
                  </>
                </>
              ))
            )}
            <>
              {!warn.main_features && (
                <p className="g-hidden-placeholder">hidden</p>
              )}
              {warn.main_features && (
                <p className="g-warn-input">{warn.main_features}</p>
              )}
              <div
                onClick={() => handleAddFeature()}
                className="g-icon-button form-add-input"
              >
                <AddIcon /> Agregar característica
              </div>
            </>
          </div>

          {/* ATRIBUTOS */}
          <div className="form-container-border">
            <div className="input-title">Atributos</div>
            {React.Children.toArray(
              fieldsAttributes.map((_, i) => (
                <div className="form-attribute-container">
                  <div className="form-attributename-with-error">
                    <div className="g-input-with-button">
                      <input
                        type="text"
                        placeholder="Nombre del atributo"
                        autoComplete="off"
                        id={`attribute_name_${i}`}
                        {...register(`attributes.${i}.name`)}
                      />
                      {watch(`attributes.${i}.name`) === "" ||
                      watch(`attributes.${i}.name`) === undefined ? null : (
                        <div
                          className="g-input-icon-container g-input-x-button"
                          onClick={() => setValue(`attributes.${i}.name`, "")}
                        >
                          <CloseIcon />
                        </div>
                      )}
                    </div>
                    <>
                      {!errors.attributes?.[i]?.name && (
                        <p className="g-hidden-placeholder">
                          Ingresa el nombre del atributo
                        </p>
                      )}
                      <p className="g-error-input">
                        {errors.attributes?.[i]?.name?.message}
                      </p>
                    </>
                  </div>

                  <div className="form-attributevalue-with-error">
                    <div className="g-input-with-button">
                      <input
                        type="text"
                        placeholder="Valor del atributo"
                        autoComplete="off"
                        id={`attribute_value_${i}`}
                        {...register(`attributes.${i}.value_name`)}
                      />
                      {watch(`attributes.${i}.value_name`) === "" ||
                      watch(`attributes.${i}.value_name`) ===
                        undefined ? null : (
                        <div
                          className="g-input-icon-container g-input-x-button"
                          onClick={() =>
                            setValue(`attributes.${i}.value_name`, "")
                          }
                        >
                          <CloseIcon />
                        </div>
                      )}
                    </div>
                    <>
                      {!errors.attributes?.[i]?.value_name && (
                        <p className="g-hidden-placeholder">
                          Ingresa la descripción del atributo
                        </p>
                      )}
                      <p className="g-error-input">
                        {errors.attributes?.[i]?.value_name?.message}
                      </p>
                    </>
                  </div>

                  {attributesQuantity > 1 && (
                    <span
                      onClick={() => handleRemoveAttribute(i)}
                      className="g-icon-button trash-button"
                    >
                      <DeleteIcon />
                    </span>
                  )}
                </div>
              ))
            )}
            <>
              {!warn.attributes && (
                <p className="g-hidden-placeholder">hidden</p>
              )}
              {warn.attributes && (
                <p className="g-warn-input">{warn.attributes}</p>
              )}
              <div
                onClick={() => handleAddAttribute()}
                className="g-icon-button form-add-input"
              >
                <AddIcon /> Agregar atributo
              </div>
            </>
          </div>

          {/* DESCRIPCIÓN */}
          <div className="form-container-border">
            <div className="input-title">Descripción</div>
            <div className="description-container">
              <textarea {...register("description")} />
              {watch("description") === "" ||
              watch("description") === undefined ? null : (
                <div
                  className="g-input-icon-container g-input-x-button"
                  onClick={() => setValue("description", "")}
                >
                  <CloseIcon />
                </div>
              )}
              <>
                {!errors.description && (
                  <p className="g-hidden-placeholder">hidden</p>
                )}
                <p className="g-error-input">{errors.description?.message}</p>
              </>
            </div>
          </div>
        </div>

        {/* IMÁGENES */}
        <>
          <label
            htmlFor="filesButton"
            className={`g-white-button upload-images${
              productImg?.length + imgsToEdit?.length >= 8 || waitingResponse
                ? " upload-images-disabled"
                : ""
            }`}
          >
            Subir imágenes
          </label>
          <input
            type="file"
            name="image"
            multiple
            accept="image/png, image/jpeg"
            onChange={handleAddImg}
            id="filesButton"
            disabled={
              productImg?.length + imgsToEdit?.length >= 8 || waitingResponse
            }
            className="hidden-button"
          />

          <>
            {showCustomErrors && imagesError ? (
              <p className="g-error-input">{imagesError}</p>
            ) : (
              <p className="g-hidden-placeholder">hidden</p>
            )}
          </>

          {!warn.image && <p className="g-hidden-placeholder">hidden</p>}
          {warn.image && (
            <p className="g-warn-input warn-block">{warn.image}</p>
          )}

          <div className="form-all-images-container">
            {imgsToEdit &&
              React.Children.toArray(
                imgsToEdit.map(({ imgURL, _id }, i) => (
                  <div
                    className={`form-img-product-container ${
                      mainImgIndex === i ? "main-image" : "not-main-image"
                    }`}
                  >
                    {mainImgIndex === i ? (
                      <span className="main-image-text">PORTADA</span>
                    ) : (
                      <span
                        className="not-main-image-text-container"
                        onClick={() => handleMainImg(i)}
                      >
                        <span className="not-main-image-text">
                          Seleccionar portada
                        </span>
                      </span>
                    )}
                    <img
                      src={imgURL}
                      alt={`img_${_id}`}
                      className="form-img-product"
                    />
                    <span className="form-delete-image">
                      <DeleteIcon
                        onClick={() => handleRemoveImgToEdit(_id, i)}
                      />
                    </span>
                  </div>
                ))
              )}
            {React.Children.toArray(
              productImgUrls.map((imageURL, i) => (
                <>
                  {imgsToEdit ? (
                    <div
                      className={`form-img-product-container ${
                        mainImgIndex - imgsToEdit.length === i
                          ? "main-image"
                          : "not-main-image"
                      }`}
                    >
                      {mainImgIndex - imgsToEdit.length === i ? (
                        <span className="main-image-text">PORTADA</span>
                      ) : (
                        <span
                          className="not-main-image-text-container"
                          onClick={() => handleMainImg(imgsToEdit.length + i)}
                        >
                          <span className="not-main-image-text">
                            Seleccionar portada
                          </span>
                        </span>
                      )}
                      <img
                        src={imageURL}
                        alt={`img_${i}`}
                        className="form-img-product"
                      />
                      <span className="form-delete-image">
                        <DeleteIcon onClick={() => handleRemoveImg(i)} />
                      </span>
                    </div>
                  ) : (
                    <div
                      className={`form-img-product-container ${
                        mainImgIndex === i ? "main-image" : "not-main-image"
                      }`}
                    >
                      {mainImgIndex === i ? (
                        <span className="main-image-text">PORTADA</span>
                      ) : (
                        <span
                          className="not-main-image-text-container"
                          onClick={() => handleMainImg(i)}
                        >
                          <span className="not-main-image-text">
                            Seleccionar portada
                          </span>
                        </span>
                      )}
                      <img
                        src={imageURL}
                        alt={`img_${i}`}
                        className="form-img-product"
                      />
                      <span className="form-delete-image">
                        <DeleteIcon onClick={() => handleRemoveImg(i)} />
                      </span>
                    </div>
                  )}
                </>
              ))
            )}
          </div>
        </>

        {/* FORM BUTTONS */}
        <div className="product-form-width form-buttons-container">
          <button
            type="submit"
            className="g-white-button"
            disabled={waitingResponse}
          >
            {waitingResponse ? (
              <Spinner className="cho-svg" />
            ) : productToEdit ? (
              "Actualizar"
            ) : (
              "Publicar"
            )}
          </button>
          <input
            type="button"
            value="Resetear"
            onClick={clearInputs}
            className="g-white-button secondary-button"
            disabled={waitingResponse}
          />
        </div>
      </form>

      <ReturnButton to={productToEdit ? "/admin/products" : "/admin"} />

      <Modal
        isOpen={isOpenCreateProduct}
        closeModal={closeCreateProduct}
        type="warn"
      >
        <div className="create-another-container">
          <p>Producto creado exitosamente ¿Crear otro producto?</p>
          <div className="create-another-buttons-container">
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
              className="g-white-button secondary-button"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductForm;
