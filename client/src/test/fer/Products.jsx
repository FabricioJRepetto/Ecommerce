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
import { useModal } from "../../hooks/useModal";
import ModalAdminProducts from "./ModalAdminProducts";

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
  const {
    productsOwn,
    productsFound,
    productsFiltered,
    productsOwnFiltersApplied,
    productsOwnProductToSearch,
    reloadFlag,
  } = useSelector((state) => state.productsReducer);
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
    if (Object.keys(productsOwnFiltersApplied).length > 0)
      setFiltersApplied(productsOwnFiltersApplied);
    if (!reloadFlag) {
      console.log("aca debe limpiar redux");
      clearFilters();
      setProductToSearch("");
      dispatch(searchProducts(""));
    }
    getProducts();
    setLoading(false);

    return () => {
      //clearFilters();
      dispatch(clearProducts());
    };
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

  /*   useEffect(() => {
    productToSearch && productsFound.length === 0 && setProductToSearch("");
    if (productsFound[0] === null) {
      setBrandsCheckboxes([]);
    } else if (productsFound.length) {
      setBrands(productsFound);
    } else if (reloadFlag) {
      setBrands(productsOwn);
      dispatch(changeReloadFlag(false));
    } else {
      setBrands(productsOwn);
    } // eslint-disable-next-line
  }, [source, productsFound.length]); */

  const getProducts = () => {
    console.log("1.5 getProducts");
    axios
      .get("/product")
      .then(({ data }) => {
        setGetProductsFlag(!getProductsFlag);
        dispatch(loadProductsOwn(data));
        setBrands(data);
      })
      .catch((err) => console.log(err)); //! VOLVER A VER manejo de errores
  };

  const applyFilters = () => {
    console.log("4 applyFilters"); //! 4
    console.log("filtersApplied", filtersApplied);
    if (productsOwnProductToSearch) {
      clearFilters();
      setProductToSearch(productsOwnProductToSearch);
      dispatch(searchProducts(productsOwnProductToSearch));
    }

    if (filtersApplied.brand) {
      let oldBrandsFilter = {};
      for (const brand of filtersApplied.brand) {
        oldBrandsFilter = {
          ...oldBrandsFilter,
          [brand]: true,
        };
        dispatch(
          filterProducts({
            source,
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
          source,
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
          source,
          type: "price",
          value: filtersApplied.price,
        })
      );
    }

    setFiltersApplied({});
  };

  useEffect(() => {
    if (reloadFlag) {
      console.log("1 reloadFlag ef"); //! 1
      if (Object.keys(productsOwnFiltersApplied).length > 0)
        setFiltersApplied(productsOwnFiltersApplied);
      dispatch(clearProducts());
      getProducts();
      dispatch(changeReloadFlag(false));
      setLoading(false);
    } // eslint-disable-next-line
  }, [reloadFlag]);

  useEffect(() => {
    if (productsOwn.length) {
      console.log("3 getProductsFlag ef"); //! 3
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
      const brandCamelCase =
        product.brand.charAt(0).toUpperCase() + product.brand.slice(1);
      !newBrands.includes(brandCamelCase) && newBrands.push(brandCamelCase);
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

  const clearFilters = () => {
    handleClearPrices();
    setShippingFilter(false);
    dispatch(
      filterProducts({
        source,
        type: "free_shipping",
        value: null,
      })
    );
    dispatch(
      filterProducts({
        source,
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
                      openDiscountProduct={openDiscountProduct}
                      openRemoveDiscount={openRemoveDiscount}
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
        {productsFound[0] === null ? (
          <></>
        ) : (
          <>
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
