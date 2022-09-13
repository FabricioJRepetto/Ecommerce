import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  loadProductsOwn,
  filterProducts,
  searchProducts,
  changeReloadFlag,
  clearProducts,
} from "../../Redux/reducer/productsSlice";
import Card from "../../components/Products/Card";
import Checkbox from "../../components/common/Checkbox";
import ModalAdminProducts from "./ModalAdminProducts";
import WishlistCard from "../../components/Profile/WishlistCard";
import { useModal } from "../../hooks/useModal";
import { CloseIcon } from "@chakra-ui/icons";
import "../../App.css";
import "./Products.css";

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
  const [filtersApplied, setFiltersApplied] = useState({});
  const [getProductsFlag, setGetProductsFlag] = useState(false);
  const dispatch = useDispatch();
  const stateProductsReducer = useSelector((state) => state.productsReducer);
  const {
    productsOwn,
    productsFound,
    productsOwnFiltersApplied,
    productsOwnProductToSearch,
    productsToShowReference,
    reloadFlag,
    brandsFlag,
  } = stateProductsReducer;
  const { wishlist } = useSelector((state) => state.cartReducer);
  const location = useLocation();
  const [
    isOpenDeleteProduct,
    openDeleteProduct,
    closeDeleteProduct,
    productToDelete,
  ] = useModal();
  const [
    isOpenDiscountProduct,
    openDiscountProduct,
    closeDiscountProduct,
    productToDiscount,
  ] = useModal();
  const [
    isOpenRemoveDiscount,
    openRemoveDiscount,
    closeRemoveDiscount,
    productToRemoveDiscount,
  ] = useModal();

  useEffect(() => {
    reloadFunction();

    /* if (reloadFlag) {
      if (Object.keys(productsOwnFiltersApplied).length > 0)
        setFiltersApplied(productsOwnFiltersApplied);
      dispatch(clearProducts());
      getProducts();
    } */
    if (!reloadFlag) {
      console.log("aca debe limpiar redux");
      clearFilters();
      handleClearSearch();
      getProducts();
    }
    dispatch(changeReloadFlag(false));
    setLoading(false);

    return () => {
      //clearFilters();
      dispatch(clearProducts());
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    productToSearch && productsFound.length === 0 && setProductToSearch("");
    let source;
    productsFound.length === 0
      ? (source = "productsOwn")
      : (source = "productsFound");

    if (productsFound[0] === null) {
      setBrandsCheckboxes([]);
    } else if (stateProductsReducer[source].length) {
      setBrands(stateProductsReducer[source]);
    } // eslint-disable-next-line
  }, [brandsFlag]);

  //! 1.5
  const getProducts = () => {
    console.log("1.5 getProducts");
    axios
      .get("/product")
      .then((r) => {
        dispatch(loadProductsOwn(r.data));
        setBrands(r.data);
        setGetProductsFlag(!getProductsFlag);
      })
      .catch((err) => console.log(err)); //! VOLVER A VER manejo de errores
  };

  //! 4
  const applyFilters = () => {
    console.log("4 applyFilters");
    console.log("filtersApplied", filtersApplied);
    if (productsOwnProductToSearch) {
      clearFilters();
      setProductToSearch(productsOwnProductToSearch);
      dispatch(searchProducts(productsOwnProductToSearch));
    }

    if (filtersApplied.brand) {
      let oldBrandsFilter = {};
      for (const brand of filtersApplied.brand) {
        let brandCamelCase =
          brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase();
        oldBrandsFilter = {
          ...oldBrandsFilter,
          [brandCamelCase]: true,
        };
        dispatch(
          filterProducts({
            type: "brand",
            value: [brand, true],
          })
        );
      }
      setBrandsFilter({
        ...brandsFilter,
        ...oldBrandsFilter,
      });
    }

    if (filtersApplied.free_shipping) {
      setShippingFilter(filtersApplied.free_shipping);
      dispatch(
        filterProducts({
          type: "free_shipping",
          value: filtersApplied.free_shipping,
        })
      );
    }

    if (filtersApplied.price) {
      setPricesFilter({
        min: filtersApplied.price.split("-")[0],
        max: filtersApplied.price.split("-")[1],
      });
      dispatch(
        filterProducts({
          type: "price",
          value: filtersApplied.price,
        })
      );
    }

    setFiltersApplied({});
  };

  //! 1
  const reloadFunction = () => {
    if (reloadFlag) {
      console.log("1 reloadFlag ef");
      if (Object.keys(productsOwnFiltersApplied).length > 0)
        setFiltersApplied(productsOwnFiltersApplied);
      dispatch(clearProducts());
      getProducts();
    }
  };

  useEffect(() => {
    reloadFunction();
    dispatch(changeReloadFlag(false));
    setLoading(false);
    // eslint-disable-next-line
  }, [reloadFlag]);

  //! 3
  useEffect(() => {
    if (productsOwn.length) {
      console.log("3 getProductsFlag ef");
      applyFilters();
    } // eslint-disable-next-line
  }, [getProductsFlag]);

  //! 2
  const setBrands = (products) => {
    console.log("2 setBrands");
    let brandsCheckbox = {};
    let newBrands = [];
    // newBrands => para cargar brandsCheckboxes
    //      => renderiza checkboxes
    // brandsCheckbox => {BRAND: boolean}
    //      => para cargar brandsFilter
    // brandsFilter => estado que maneja checkboxes
    for (const product of products) {
      if (product.brand) {
        const brandCamelCase =
          product.brand.charAt(0).toUpperCase() + product.brand.slice(1);
        !newBrands.includes(brandCamelCase) && newBrands.push(brandCamelCase);
      }
    }
    newBrands.sort();

    if (
      newBrands.length === brandsCheckboxes.length &&
      newBrands.every((b, i) => b === brandsCheckboxes[i])
    ) {
      return;
    }
    for (const brand of newBrands) {
      brandsCheckbox[brand] = false;
    }
    setBrandsFilter(brandsCheckbox);
    setBrandsCheckboxes(newBrands);
  };

  const filterPrices = (e) => {
    e.preventDefault();
    pricesFilter.min !== "" &&
      pricesFilter.max !== "" &&
      parseInt(pricesFilter.min) < parseInt(pricesFilter.max) &&
      dispatch(
        filterProducts({
          type: "price",
          value: `${pricesFilter.min}-${pricesFilter.max}`,
        })
      );
  };

  const handlePrices = (e) => {
    const { name, value, validity } = e.target;

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
        type: "brand",
        value: [target.name, !brandsFilter[target.name]],
      })
    );
  };

  const handleClearPrices = () => {
    dispatch(
      filterProducts({
        type: "price",
        value: null,
      })
    );
    setPricesFilter({ min: "", max: "" });
  };

  const clearFilters = () => {
    handleClearPrices();
    setShippingFilter(false);
    dispatch(
      filterProducts({
        type: "free_shipping",
        value: null,
      })
    );
    dispatch(
      filterProducts({
        type: "brand",
        value: null,
      })
    );
  };

  const handleSearch = (e) => {
    clearFilters();
    setProductToSearch(e.target.value);
    dispatch(searchProducts(e.target.value));
  };
  const handleClearSearch = () => {
    setProductToSearch("");
    dispatch(searchProducts(""));
  };

  return (
    <div className="products-container">
      <div className="products-results-container">
        <span className="g-input-with-button">
          <input
            type="text"
            placeholder="Filtra por nombre"
            onChange={handleSearch}
            value={productToSearch}
          />
          {productToSearch && (
            <div
              className="g-input-icon-container g-input-x-button"
              onClick={handleClearSearch}
            >
              <CloseIcon />
            </div>
          )}
        </span>
        {stateProductsReducer[productsToShowReference] &&
        stateProductsReducer[productsToShowReference][0] === null ? (
          <h2>NO HUBIERON COINCIDENCIAS</h2>
        ) : (
          <div className="products-results-inner">
            {React.Children.toArray(
              stateProductsReducer[productsToShowReference]?.map(
                (product) =>
                  (product.available_quantity > 0 ||
                    location.pathname === "/admin/products") && (
                    <WishlistCard
                      productData={product}
                      fav={wishlist.includes(product._id)}
                      openDeleteProduct={openDeleteProduct}
                      openDiscountProduct={openDiscountProduct}
                      openRemoveDiscount={openRemoveDiscount}
                    />
                  )
              )
            )}
          </div>
        )}
      </div>
      {pricesFilter.min && pricesFilter.max && <></>}

      <div className="products-filters">
        {productsFound[0] === null ? (
          <></>
        ) : (
          <>
            <h3>MARCAS</h3>
            <div className="filter-brand-checkbox-container">
              {
                /* loading ? (
                <h1>CARGANDO</h1>
              ) : (

              ) */
                brandsFilter &&
                  Object.keys(brandsFilter).length > 0 &&
                  React.Children.toArray(
                    brandsCheckboxes?.map((brand) => (
                      <label>
                        <Checkbox
                          isChecked={brandsFilter[brand]}
                          extraStyles={{
                            border: true,
                            rounded: false,
                            innerBorder: true,
                            margin: ".05rem",
                            size: ".8",
                          }}
                        />
                        <input
                          type="checkbox"
                          name={brand}
                          checked={brandsFilter[brand]}
                          onChange={handleBrands}
                        />
                        <span className="product-checkbox-brand">{brand}</span>
                        <span className="g-gradient-text">{brand}</span>
                      </label>
                    ))
                  )
              }
            </div>

            <h3>PRECIO</h3>
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
                      placeholder="Mínimo"
                      name="min"
                      onChange={handlePrices}
                      value={pricesFilter.min}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      pattern="[0-9]*"
                      placeholder="Máximo"
                      name="max"
                      onChange={handlePrices}
                      value={pricesFilter.max}
                    />
                  </div>
                  <input type="submit" value="filter" />
                </form>
              )}
            </>

            <label className="products-shipping-label">
              <Checkbox
                isChecked={shippingFilter}
                extraStyles={{
                  border: true,
                  rounded: false,
                  innerBorder: true,
                  margin: ".05rem",
                  size: ".8",
                }}
              />
              <input
                type="checkbox"
                name="free_shipping"
                checked={shippingFilter}
                onChange={filterShipping}
              />
              <span className="products-shipping-text">Envío gratis</span>
              <span className="g-gradient-text">Envío gratis</span>
            </label>
          </>
        )}
      </div>
      <ModalAdminProducts
        isOpenDeleteProduct={isOpenDeleteProduct}
        closeDeleteProduct={closeDeleteProduct}
        isOpenDiscountProduct={isOpenDiscountProduct}
        closeDiscountProduct={closeDiscountProduct}
        isOpenRemoveDiscount={isOpenRemoveDiscount}
        closeRemoveDiscount={closeRemoveDiscount}
        productToDelete={productToDelete}
        productToDiscount={productToDiscount}
        productToRemoveDiscount={productToRemoveDiscount}
      />
    </div>
  );
};

export default Products;
