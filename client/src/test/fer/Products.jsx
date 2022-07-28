import React, { useState, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  loadProductsOwn,
  filterProducts,
  searchProducts,
  deleteProductFromState,
} from "../../Redux/reducer/productsSlice";
import { useEffect } from "react";
import Card from "../../components/Products/Card";
import { useModal } from "../../hooks/useModal";
import Modal from "../../components/common/Modal";
import { useNotification } from "../../hooks/useNotification";

const Products = () => {
  const [pricesFilter, setPricesFilter] = useState({
    min: "",
    max: "",
  });
  const [shippingFilter, setShippingFilter] = useState(false);
  const [productToSearch, setProductToSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [brandsFilter, setBrandsFilter] = useState();
  const [brandsCheckboxes, setBrandsCheckboxes] = useState([]);
  const brands = useRef();
  const dispatch = useDispatch();
  const {
    productsOwn,
    productsFound,
    productsFiltered,
    productsOwnFiltersApplied,
  } = useSelector((state) => state.productsReducer);
  const { wishlist } = useSelector((state) => state.cartReducer);
  const location = useLocation();
  const [
    isOpenDeleteProduct,
    openDeleteProduct,
    closeDeleteProduct,
    productToDelete,
  ] = useModal();
  const [notification] = useNotification();

  useEffect(() => {
    getProducts();
    setLoading(false);
    // eslint-disable-next-line
  }, []);

  let productsToShow;
  productsFound.length === 0 && productsFiltered.length === 0
    ? (productsToShow = productsOwn)
    : productsFiltered.length === 0
    ? (productsToShow = productsFound)
    : (productsToShow = productsFiltered);

  let source;
  productsFound.length === 0
    ? (source = "productsOwn")
    : (source = "productsFound");

  useEffect(() => {
    if (productsFound[0] === null) {
      setBrandsCheckboxes([]);
    } else if (productsFound.length) {
      setBrands(productsFound);
    }
  }, [productsFound]);

  const getProducts = () => {
    axios
      .get("/product")
      .then(({ data }) => {
        dispatch(loadProductsOwn(data));
        setBrands(data);
      })
      .catch((err) => console.log(err)); //! VOLVER A VER manejo de errores
  };

  const setBrands = (products) => {
    let brands = [];
    let brandsCheckbox = {};
    for (const product of products) {
      // brands => renderiza checkboxes
      // brandsCheckbox => {BRAND: boolean}
      //      => para cargar BrandsFilter
      // brandsFilter => estado que maneja checkboxes
      if (product.brand) {
        const brandCamelCase =
          product.brand.charAt(0).toUpperCase() + product.brand.slice(1);
        !Object.keys(brandsCheckbox).includes(brandCamelCase) &&
          brands.push(brandCamelCase);
        brandsCheckbox[brandCamelCase] = false;
      }
    }
    setBrandsFilter(brandsCheckbox);
    brands.sort();
    setBrandsCheckboxes(brands);
  };

  const filterPrices = (e) => {
    e.preventDefault();
    pricesFilter.min !== "" &&
      pricesFilter.max !== "" &&
      parseInt(pricesFilter.min) < parseInt(pricesFilter.max) &&
      dispatch(
        filterProducts({
          source,
          type: "price",
          value: `${pricesFilter.min}-${pricesFilter.max}`,
        })
      );
  };

  const handlePrices = ({ target }) => {
    const { name, value, validity } = target;

    let validatedValue = validity.valid ? value : pricesFilter[name];

    setPricesFilter({
      ...pricesFilter,
      [name]: validatedValue,
    });
  };

  const filterShipping = () => {
    setShippingFilter(!shippingFilter);
    dispatch(
      filterProducts({
        source,
        type: "free_shipping",
        value: !shippingFilter,
      })
    );
  };

  const handleBrands = ({ target }) => {
    setBrandsFilter({
      ...brandsFilter,
      [target.name]: !brandsFilter[target.name],
    });

    dispatch(
      filterProducts({
        source,
        type: "brand",
        value: [target.name, !brandsFilter[target.name]],
      })
    );
  };

  const handleDeleteProduct = () => {
    deleteProduct();
    closeDeleteProduct();
  };

  const deleteProduct = () => {
    axios
      .delete(`/admin/product/${productToDelete.prodId}`)
      .then((_) => {
        dispatch(deleteProductFromState(productToDelete.prodId));
        notification("Producto eliminado exitosamente", "", "success");
      })
      .catch((err) => console.log(err)); //! VOLVER A VER manejo de errores
  };

  const handleClearPrices = () => {
    dispatch(
      filterProducts({
        source,
        type: "price",
        value: null,
      })
    );
    setPricesFilter({ min: "", max: "" });
  };

  const handleSearch = (e) => {
    handleClearPrices();
    setShippingFilter(false);
    dispatch(
      filterProducts({
        source,
        type: "free_shipping",
        value: null,
      })
    );
    setProductToSearch(e.target.value);
    dispatch(searchProducts(e.target.value));
  };

  return (
    <div className="products-container">
      <div className="products-results-container">
        <input
          type="text"
          placeholder="Buscar por nombre"
          onChange={handleSearch}
          value={productToSearch}
        />
        {productsToShow[0] === null ? (
          <h1>NO HUBIERON COINCIDENCIAS</h1>
        ) : (
          <div className="products-results-inner">
            {React.Children.toArray(
              productsToShow?.map(
                (product) =>
                  (product.available_quantity > 0 ||
                    location.pathname === "/admin/products") && (
                    <Card
                      productData={product}
                      fav={wishlist.includes(product._id)}
                      openDeleteProduct={openDeleteProduct}
                      outOfStock={product.available_quantity <= 0}
                    />
                  )
              )
            )}
          </div>
        )}
      </div>
      {pricesFilter.min && pricesFilter.max && <></>}

      <div className="products-filters">
        <h3>MARCAS</h3>
        <div className="filter-brand-checkbox-container">
          {loading ? (
            <h1>CARGANDO</h1>
          ) : (
            brandsFilter &&
            Object.keys(brandsFilter).length > 0 &&
            React.Children.toArray(
              brandsCheckboxes?.map((brand) => (
                <label>
                  <input
                    type="checkbox"
                    name={brand}
                    checked={brandsFilter[brand]}
                    onChange={handleBrands}
                  />
                  {brand}
                </label>
              ))
            )
          )}
          <br />
          <hr />
          <br />
        </div>

        <h3>RANGO DE PRECIOS</h3>
        <>
          {productsOwnFiltersApplied.price ? (
            <>
              <h4>{productsOwnFiltersApplied.price}</h4>
              <button onClick={handleClearPrices}>limpiar</button>
            </>
          ) : (
            <form onSubmit={filterPrices}>
              <div>
                <input
                  type="text"
                  pattern="[0-9]*"
                  placeholder="min"
                  name="min"
                  onChange={handlePrices}
                  value={pricesFilter.min}
                />
              </div>
              <div>
                <input
                  type="text"
                  pattern="[0-9]*"
                  placeholder="max"
                  name="max"
                  onChange={handlePrices}
                  value={pricesFilter.max}
                />
              </div>
              <input type="submit" value="filter" />
            </form>
          )}
        </>

        <br />
        <label>
          <input
            type="checkbox"
            name="free_shipping"
            checked={shippingFilter}
            onChange={filterShipping}
          />
          Envío gratis
        </label>
      </div>

      <Modal
        isOpen={isOpenDeleteProduct}
        closeModal={closeDeleteProduct}
        type="warn"
      >
        <p>{`¿Eliminar el producto ${
          productToDelete ? productToDelete.name : null
        }?`}</p>
        <button type="button" onClick={() => handleDeleteProduct()}>
          Aceptar
        </button>
        <button type="button" onClick={closeDeleteProduct}>
          Cancelar
        </button>
      </Modal>
    </div>
  );
};

export default Products;
