import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  loadFilters,
  loadProductsFound,
  loadProductsOwn,
  loadQuerys,
  loadApplied,
  loadBreadCrumbs,
} from "../../Redux/reducer/productsSlice";

import WishlistCard from "../Profile/WishlistCard";
import { useSearchParams } from "react-router-dom";
import {
  SmallCloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import LoaderBars from "../common/LoaderBars";
import FunnelButton from "../common/FunnelButton";

import "./Results.css";

const Results = () => {
  const [loading, setLoading] = useState(true);
  const { wishlist } = useSelector((state) => state.cartReducer);
  const querys = useSelector((state) => state.productsReducer.searchQuerys);
  const { productsOwn } = useSelector((state) => state.productsReducer);
  const { productsFound } = useSelector((state) => state.productsReducer);
  const applied = useSelector(
    (state) => state.productsReducer.productsAppliedFilters
  );
  const { productsFilters } = useSelector((state) => state.productsReducer);
  const { breadCrumbs } = useSelector((state) => state.productsReducer);

  const [params] = useSearchParams();
  const [open, setOpen] = useState("category");
  const dispatch = useDispatch();

  const [showFiltersMenu, setShowFiltersMenu] = useState(false);
  const [filtersContainerHeight, setFiltersContainerHeight] = useState(0);
  const [widnowHeight, setWindowHeight] = useState(window.innerHeight);
  const [widnowWidth, setWindowWidth] = useState(window.innerWidth);
  const [filtersContainerDisplay, setFiltersContainerDisplay] = useState(null);
  const resultsFiltersContainerMobile = useRef(null);
  const filtersMenuMobile = useRef(null);

  useEffect(() => {
    const handleWindowSize = () => {
      setWindowHeight(window.innerHeight);
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleWindowSize);

    return () => {
      window.removeEventListener("resize", handleWindowSize);
      document.documentElement.style.overflowY = "auto";
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    filtersMenuMobile.current &&
      setFiltersContainerHeight(
        widnowHeight - filtersMenuMobile.current.offsetTop - window.scrollY - 95
      );

    // eslint-disable-next-line
  }, [
    filtersMenuMobile.current,
    filtersMenuMobile?.current?.offsetTop,
    widnowHeight,
  ]);

  useEffect(() => {
    if (resultsFiltersContainerMobile.current) {
      let menuContainerDisplay = window
        .getComputedStyle(resultsFiltersContainerMobile.current)
        .getPropertyValue("display");

      filtersContainerDisplay !== menuContainerDisplay &&
        setFiltersContainerDisplay(menuContainerDisplay);
    }
    // eslint-disable-next-line
  }, [resultsFiltersContainerMobile.current, widnowWidth]);

  useEffect(() => {
    if (filtersContainerDisplay === "block" && showFiltersMenu) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflowY = "auto";
    }
  }, [filtersContainerDisplay, showFiltersMenu]);

  useEffect(() => {
    (async () => {
      const category = params.get("category");

      let newQuery = "";
      Object.entries(querys).forEach(([key, value]) => {
        newQuery += key + "=" + value + "&";
      });

      const { data } = await axios(`/product/search/?${newQuery}`);

      // const { data } = await axios(`/product/provider/?category=${category}`)
      // aux = data;

      // const { data } = await axios(`/product/promos`)

      dispatch(loadProductsOwn(data.db));
      !category && dispatch(loadProductsFound(data.meli));
      dispatch(loadFilters(data.filters));
      dispatch(loadApplied(data.applied));
      dispatch(loadBreadCrumbs(data.breadCrumbs));
      setLoading(false);
    })();

    // eslint-disable-next-line
  }, [querys]);

  const addFilter = async (obj) => {
    let filter = obj.filter;
    let value = obj.value;
    dispatch(loadQuerys({ ...querys, [filter]: value }));
  };

  const removeFilter = async (filter) => {
    let aux = { ...querys };
    delete aux[filter];
    dispatch(loadQuerys(aux));
  };

  return (
    <div
      className={`results-container component-fadeIn${
        loading || productsFound === "loading"
          ? " results-container-center"
          : ""
      }`}
    >
      {loading || productsFound === "loading" ? (
        <div className="component-fadeIn">
          <LoaderBars />
        </div>
      ) : (
        <>
          {productsFound?.length > 0 || productsOwn?.length > 0 ? (
            <>
              <FunnelButton
                setShowMenu={setShowFiltersMenu}
                showMenu={showFiltersMenu}
              />
              <div
                className="products-filters-mobile"
                ref={resultsFiltersContainerMobile}
              >
                <div
                  onClick={() => setShowFiltersMenu(false)}
                  className={`products-filters-mobile-background${
                    !showFiltersMenu
                      ? " products-filters-mobile-background-hide"
                      : ""
                  }`}
                ></div>

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
                      <div className="results-filters-mobile">
                        {applied !== "loading" && (
                          <div className="results-filters-applied">
                            {React.Children.toArray(
                              applied.map(
                                (f) =>
                                  f.id !== "category" && (
                                    <div onClick={() => removeFilter(f.id)}>
                                      <SmallCloseIcon className="bread-crumbs-delete-icon" />
                                      {f.values[0].name}
                                    </div>
                                  )
                              )
                            )}
                          </div>
                        )}

                        {productsFilters !== "loading" &&
                          productsFilters?.length > 0 &&
                          React.Children.toArray(
                            productsFilters?.map((f) => (
                              <div
                                key={f.id}
                                className={`results-filter-container ${
                                  open === f.id && "open-filter"
                                }`}
                              >
                                <div
                                  className="filter-title"
                                  onClick={() =>
                                    setOpen(open === f.id ? "" : f.id)
                                  }
                                >
                                  <h3>{f.name.toUpperCase()}</h3>
                                  <ChevronDownIcon
                                    className={`results-tab-icon ${
                                      open === f.id && "results-tab-icon-close"
                                    }`}
                                  />
                                </div>
                                {f.values.map((v) => (
                                  <div
                                    key={v.id}
                                    onClick={() =>
                                      addFilter({ filter: f.id, value: v.id })
                                    }
                                    className="results-filter-option"
                                  >
                                    <p>{`${v.name} (${v.results})`}</p>
                                  </div>
                                ))}
                              </div>
                            ))
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="results-container-middle">
                <div className="bread-crumbs">
                  {breadCrumbs?.length > 0 && (
                    <div>
                      <SmallCloseIcon
                        className="bread-crumbs-delete-icon"
                        onClick={() => removeFilter("category")}
                      />
                      {React.Children.toArray(
                        breadCrumbs.map((c, index) => (
                          <>
                            {index > 0 ? (
                              <div className="category-arrow-icon">
                                <ChevronRightIcon />
                              </div>
                            ) : (
                              <></>
                            )}
                            <span
                              key={c.id}
                              onClick={() =>
                                addFilter({ filter: "category", value: c.id })
                              }
                            >
                              {c.name}
                            </span>
                          </>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <div className="results-container-inner">
                  <div className="results-filters">
                    {applied !== "loading" && (
                      <div className="results-filters-applied">
                        {React.Children.toArray(
                          applied.map(
                            (f) =>
                              f.id !== "category" && (
                                <div onClick={() => removeFilter(f.id)}>
                                  <SmallCloseIcon className="bread-crumbs-delete-icon" />
                                  {f.values[0].name}
                                </div>
                              )
                          )
                        )}
                      </div>
                    )}

                    {productsFilters !== "loading" &&
                      productsFilters?.length > 0 &&
                      React.Children.toArray(
                        productsFilters?.map((f) => (
                          <div
                            key={f.id}
                            className={`results-filter-container ${
                              open === f.id && "open-filter"
                            }`}
                          >
                            <div
                              className="filter-title"
                              onClick={() => setOpen(open === f.id ? "" : f.id)}
                            >
                              <h3>{f.name.toUpperCase()}</h3>
                              <ChevronDownIcon
                                className={`results-tab-icon ${
                                  open === f.id && "results-tab-icon-close"
                                }`}
                              />
                            </div>
                            {f.values.map((v) => (
                              <div
                                key={v.id}
                                onClick={() =>
                                  addFilter({ filter: f.id, value: v.id })
                                }
                                className="results-filter-option"
                              >
                                <p>{`${v.name} (${v.results})`}</p>
                              </div>
                            ))}
                          </div>
                        ))
                      )}
                  </div>

                  <div className="results-inner">
                    <div className="own-products-container">
                      {(productsOwn?.length > 0 ||
                        productsFound?.length > 0) && (
                        <>
                          {productsOwn?.length > 0 && (
                            <>
                              {React.Children.toArray(
                                productsOwn?.map(
                                  (prod) =>
                                    prod.available_quantity > 0 && (
                                      <WishlistCard
                                        productData={prod}
                                        fav={wishlist.includes(prod._id)}
                                      />
                                    )
                                )
                              )}
                            </>
                          )}

                          {productsFound?.length > 0 && (
                            <>
                              {React.Children.toArray(
                                productsFound?.map(
                                  (prod) =>
                                    prod.available_quantity > 0 && (
                                      <WishlistCard
                                        productData={prod}
                                        fav={wishlist.includes(prod._id)}
                                      />
                                    )
                                )
                              )}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div>
              <h1>No hubieron resultados</h1>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Results;
