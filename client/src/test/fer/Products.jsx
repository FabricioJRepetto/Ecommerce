import React, { useState, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import {
  filterProducts,
  loadProductsFound,
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
  const [brandsFilter, setBrandsFilter] = useState();
  const [loading, setLoading] = useState(true);
  const brands = useRef();
  const dispatch = useDispatch();
  const { productsFound, productsFiltered } = useSelector(
    (state) => state.productsReducer
  );
  const wishlist = useSelector((state) => state.cartReducer.wishlist);
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
  productsFiltered.length === 0
    ? (productsToShow = productsFound)
    : (productsToShow = productsFiltered);

  /* let productsToShow;
      productsFiltered.length === 0
        ? location.pathname === "/admin/products"
          ? (productsToShow = productsOwn)
          : (productsToShow = productsFound)
        : (productsToShow = productsFiltered); */

  const getProducts = () => {
    axios
      .get("/product")
      .then((res) => {
        dispatch(loadProductsFound(res.data));
        brands.current = [];
        let brandsCheckbox = {};
        for (const product of res.data) {
          // brands.current => renderiza checkboxes
          // brandsCheckbox => {BRAND: boolean}
          //      => para cargar BrandsFilter
          // brandsFilter => estado que maneja checkboxes
          if (product.brand) {
            const brandCamelCase =
              product.brand.charAt(0).toUpperCase() + product.brand.slice(1);
            !Object.keys(brandsCheckbox).includes(brandCamelCase) &&
              brands.current.push(brandCamelCase);
            brandsCheckbox[brandCamelCase] = false;
          }
        }
        setBrandsFilter(brandsCheckbox);
        brands.current.sort();
      })
      .catch((err) => console.log(err)); //! VOLVER A VER manejo de errores
  };

  const filterPrices = (e) => {
    e.preventDefault();

    dispatch(
      filterProducts({
        source: "productsFound",
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
        source: "productsFound",
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
        source: "productsFound",
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

  return (
    <div className="products-container">
      <div className="products-results-container">
        {productsToShow[0] === null ? (
          <h1>NO HUBIERON COINCIDENCIAS</h1>
        ) : (
          <div className="products-results-inner">
            {React.Children.toArray(
              productsToShow?.map((product) => (
                (product.available_quantity > 0 || location.pathname === "/admin/products") &&<Card
                  productData={product}
                  fav={wishlist.includes(product._id)}
                  openDeleteProduct={openDeleteProduct}
                  outOfStock={product.available_quantity <= 0}
                />
              ))
            )}
          </div>
        )}
      </div>

      <div className="products-filters">
        <h3>BRANDS</h3>
        <div className="filter-brand-checkbox-container">
          {loading ? (
            <h1>CARGANDO</h1>
          ) : (
            brandsFilter &&
            Object.keys(brandsFilter).length > 0 &&
            React.Children.toArray(
              brands.current?.map((brand) => (
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

        <h3>PRICES</h3>
        <>
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
          <button
            onClick={() =>
              dispatch(
                filterProducts({
                  source: "productsFound",
                  type: "price",
                  value: null,
                })
              )
            }
          >
            clear
          </button>
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
