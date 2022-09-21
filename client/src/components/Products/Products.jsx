import React, { useState, useEffect, useRef } from "react";
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
import Checkbox from "../common/Checkbox";
import ModalAdminProducts from "../Admin/ModalAdminProducts";
import WishlistCard from "../Profile/WishlistCard";
import FunnelButton from "../common/FunnelButton";
import { useModal } from "../../hooks/useModal";
import { ReactComponent as Close } from "../../assets/svg/close.svg";
import { ReactComponent as ChevronRight } from "../../assets/svg/chevron-right.svg";
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
  const [priceFilterRender, setPriceFilterRender] = useState("");
  const [priceWarn, setPriceWarn] = useState(false);
  const [showFiltersMenu, setShowFiltersMenu] = useState(false);
  const [filtersContainerHeight, setFiltersContainerHeight] = useState(0);
  const [widnowHeight, setWindowHeight] = useState(window.innerHeight);
  const [widnowWidth, setWindowWidth] = useState(window.innerWidth);
  const [filtersContainerDisplay, setFiltersContainerDisplay] = useState(null);
  const filtersContainerMobile = useRef(null);
  const filtersMenuMobile = useRef(null);

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
      //console.log("aca debe limpiar redux");
      clearFilters();
      handleClearSearch();
      getProducts();
    }
    dispatch(changeReloadFlag(false));
    setLoading(false);

    const handleWindowSize = () => {
      setWindowHeight(window.innerHeight);
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleWindowSize);

    return () => {
      //clearFilters();
      dispatch(clearProducts());
      window.removeEventListener("resize", handleWindowSize);
      document.documentElement.style.overflowY = "auto";
      /* document.documentElement.style.overflowX = "hidden"; */
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

  useEffect(() => {
    if (productsOwnFiltersApplied.price) {
      let priceToRenderArray = productsOwnFiltersApplied.price.split("-");
      let priceToRender = `$${priceToRenderArray[0]} - $${priceToRenderArray[1]}`;
      setPriceFilterRender(priceToRender);
    }
  }, [productsOwnFiltersApplied.price]);

  //! 1.5
  const getProducts = () => {
    //  console.log("1.5 getProducts");
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
    //  console.log("4 applyFilters");
    // console.log("filtersApplied", filtersApplied);
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
      //  console.log("1 reloadFlag ef");
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
      //  console.log("3 getProductsFlag ef");
      applyFilters();
    } // eslint-disable-next-line
  }, [getProductsFlag]);

  //! 2
  const setBrands = (products) => {
    //  console.log("2 setBrands");
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

  useEffect(() => {
    if (
      pricesFilter.min &&
      pricesFilter.max &&
      pricesFilter.min >= pricesFilter.max
    ) {
      setPriceWarn(true);
    } else {
      setPriceWarn(false);
    }
  }, [pricesFilter.min, pricesFilter.max]);

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

  /* const [windowScroll, setWindowScroll] = useState(0);
  const [relativeContainer, setRelativeContainer] = useState(false);

  useEffect(() => {
    const controlWindowScroll = () => {
      if (window.scrollY < windowScroll) {
        setRelativeContainer(false);
      } else {
        setRelativeContainer(true);
      }

      setWindowScroll(window.scrollY);
    };

    window.addEventListener("scroll", controlWindowScroll);

    return () => {
      window.removeEventListener("scroll", controlWindowScroll);
    };
  }, []); */

  useEffect(() => {
    filtersMenuMobile.current &&
      setFiltersContainerHeight(
        widnowHeight - filtersMenuMobile.current.offsetTop - window.scrollY - 70
      );

    // eslint-disable-next-line
  }, [
    filtersMenuMobile.current,
    filtersMenuMobile?.current?.offsetTop,
    widnowHeight,
  ]);

  useEffect(() => {
    if (filtersContainerMobile.current) {
      let menuContainerDisplay = window
        .getComputedStyle(filtersContainerMobile.current)
        .getPropertyValue("display");

      filtersContainerDisplay !== menuContainerDisplay &&
        setFiltersContainerDisplay(menuContainerDisplay);
    }
    // eslint-disable-next-line
  }, [filtersContainerMobile.current, widnowWidth]);

  useEffect(() => {
    if (filtersContainerDisplay === "inline" && showFiltersMenu) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflowY = "auto";
    }
  }, [filtersContainerDisplay, showFiltersMenu]);

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
          {/*  {productToSearch && (
            <div
            className="g-input-icon-container g-input-x-button"
            onClick={handleClearSearch}
            >
            <CloseIcon />
            </div>
          )} */}
        </span>

        <div className="products-filters-mobile" ref={filtersContainerMobile}>
          <div
            onClick={() => setShowFiltersMenu(false)}
            className={`products-filters-mobile-background${
              !showFiltersMenu ? " products-filters-mobile-background-hide" : ""
            }`}
          ></div>

          <FunnelButton
            setShowMenu={setShowFiltersMenu}
            showMenu={showFiltersMenu}
          />

          <div
            ref={filtersMenuMobile}
            className={`products-filters-menu${
              showFiltersMenu
                ? " products-filters-menu-open"
                : " products-filters-menu-close"
            }`}
            style={{
              height: filtersContainerHeight,
            }}
          >
            <div className="products-filters-middle">
              <div className="products-filters-inner">
                {productsFound[0] === null ? (
                  <></>
                ) : (
                  <>
                    <div className="products-filters-price-container">
                      <h3>PRECIO</h3>
                      <>
                        {productsOwnFiltersApplied.price ? (
                          <>
                            <div className="products-filters-price-applied">
                              <div>
                                <p>{priceFilterRender}</p>
                              </div>
                              <span onClick={handleClearPrices}>
                                <Close />
                                <div className="close-gradient"></div>
                              </span>
                            </div>
                            <p className="g-hidden-placeholder">hidden</p>
                            <p className="g-hidden-placeholder">hidden</p>
                          </>
                        ) : (
                          <>
                            <form onSubmit={filterPrices}>
                              <div className="products-filters-input-container">
                                <input
                                  type="text"
                                  pattern="[0-9]*"
                                  placeholder="Mínimo"
                                  name="min"
                                  onChange={handlePrices}
                                  value={pricesFilter.min}
                                />
                              </div>
                              <div className="products-filters-price-separator">
                                _
                              </div>
                              <div className="products-filters-input-container">
                                <input
                                  type="text"
                                  pattern="[0-9]*"
                                  placeholder="Máximo"
                                  name="max"
                                  onChange={handlePrices}
                                  value={pricesFilter.max}
                                />
                              </div>
                              <label
                                className={`price-filter-submit${
                                  pricesFilter.max &&
                                  pricesFilter.min &&
                                  !priceWarn
                                    ? " price-filter-input-full"
                                    : ""
                                }`}
                                htmlFor="price-filter-submit"
                              >
                                <ChevronRight />
                                <div className="chevron-right-gradient"></div>
                              </label>
                              <input
                                type="submit"
                                value="filter"
                                id="price-filter-submit"
                              />
                            </form>
                            {priceWarn ? (
                              <p className="g-error-input">
                                El precio mínimo debe ser mayor al precio máximo
                              </p>
                            ) : (
                              <>
                                <p className="g-hidden-placeholder">hidden</p>
                                <p className="g-hidden-placeholder">hidden</p>
                              </>
                            )}
                          </>
                        )}
                      </>
                    </div>

                    <div className="products-filters-shipping-container">
                      <label className="products-shipping-label">
                        <h3 className="products-shipping-text">ENVÍO GRATIS</h3>
                        {/* <h3 className="g-gradient-text">ENVÍO GRATIS</h3> */}
                        <Checkbox
                          isChecked={shippingFilter}
                          extraStyles={{
                            border: true,
                            rounded: true,
                            innerBorder: true,
                            margin: ".05rem",
                            size: "1.2",
                          }}
                        />
                        <input
                          type="checkbox"
                          name="free_shipping"
                          checked={shippingFilter}
                          onChange={filterShipping}
                        />
                      </label>
                    </div>

                    <div className="products-filters-brand-container">
                      <h3>MARCA</h3>
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
                                  <span className="product-checkbox-brand">
                                    {brand}
                                  </span>
                                  <span className="g-gradient-text">
                                    {brand}
                                  </span>
                                </label>
                              ))
                            )
                        }
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {stateProductsReducer[productsToShowReference] &&
        stateProductsReducer[productsToShowReference][0] === null ? (
          <h2 className="products-no-coincidences">
            No hubieron coincidencias
          </h2>
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

      <div className="products-filters-outer">
        <div className="products-filters-middle">
          <div
            className="products-filters-inner"
            /* ref={filtersContainer}
            style={{
              position: !relativeContainer ? "sticky" : "relative",
              top:
                windowScroll === 0 ||
                filtersContainerHeight - window.innerHeight + 106 < windowScroll
                  ? "-160px"
                  : "0",
              marginTop:
                windowScroll === 0 ||
                filtersContainerHeight - window.innerHeight + 106 < windowScroll
                  ? "2px"
                  : "5px",
            }} */
          >
            {productsFound[0] === null ? (
              <></>
            ) : (
              <>
                <div className="products-filters-price-container">
                  <h3>PRECIO</h3>
                  <>
                    {productsOwnFiltersApplied.price ? (
                      <>
                        <div className="products-filters-price-applied">
                          <div>
                            <p>{priceFilterRender}</p>
                          </div>
                          <span onClick={handleClearPrices}>
                            <Close />
                            <div className="close-gradient"></div>
                          </span>
                        </div>
                        <p className="g-hidden-placeholder">hidden</p>
                        <p className="g-hidden-placeholder">hidden</p>
                      </>
                    ) : (
                      <>
                        <form onSubmit={filterPrices}>
                          <div className="products-filters-input-container">
                            <input
                              type="text"
                              pattern="[0-9]*"
                              placeholder="Mínimo"
                              name="min"
                              onChange={handlePrices}
                              value={pricesFilter.min}
                            />
                          </div>
                          <div className="products-filters-price-separator">
                            _
                          </div>
                          <div className="products-filters-input-container">
                            <input
                              type="text"
                              pattern="[0-9]*"
                              placeholder="Máximo"
                              name="max"
                              onChange={handlePrices}
                              value={pricesFilter.max}
                            />
                          </div>
                          <label
                            className={`price-filter-submit${
                              pricesFilter.max && pricesFilter.min && !priceWarn
                                ? " price-filter-input-full"
                                : ""
                            }`}
                            htmlFor="price-filter-submit"
                          >
                            <ChevronRight />
                            <div className="chevron-right-gradient"></div>
                          </label>
                          <input
                            type="submit"
                            value="filter"
                            id="price-filter-submit"
                          />
                        </form>
                        {priceWarn ? (
                          <p className="g-error-input">
                            El precio mínimo debe ser mayor al precio máximo
                          </p>
                        ) : (
                          <>
                            <p className="g-hidden-placeholder">hidden</p>
                            <p className="g-hidden-placeholder">hidden</p>
                          </>
                        )}
                      </>
                    )}
                  </>
                </div>

                <div className="products-filters-shipping-container">
                  <label className="products-shipping-label">
                    <h3 className="products-shipping-text">ENVÍO GRATIS</h3>
                    {/* <h3 className="g-gradient-text">ENVÍO GRATIS</h3> */}
                    <Checkbox
                      isChecked={shippingFilter}
                      extraStyles={{
                        border: true,
                        rounded: true,
                        innerBorder: true,
                        margin: ".05rem",
                        size: "1.2",
                      }}
                    />
                    <input
                      type="checkbox"
                      name="free_shipping"
                      checked={shippingFilter}
                      onChange={filterShipping}
                    />
                  </label>
                </div>

                <div className="products-filters-brand-container">
                  <h3>MARCA</h3>
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
                              <span className="product-checkbox-brand">
                                {brand}
                              </span>
                              <span className="g-gradient-text">{brand}</span>
                            </label>
                          ))
                        )
                    }
                  </div>
                </div>
              </>
            )}
            {/* <div className="dumb-box"></div> */}
          </div>
        </div>
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
