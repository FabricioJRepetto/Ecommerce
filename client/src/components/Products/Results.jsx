import React, { useEffect } from "react";
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
import { ReactComponent as Spinner } from "../../assets/svg/spinner.svg";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SmallCloseIcon, ChevronDownIcon } from "@chakra-ui/icons";
import LoaderBars from "../common/LoaderBars";

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
    <div className="results-container">
      {loading ? (
        <div style={{ height: "100vh" }}>
          <LoaderBars />
        </div>
      ) : (
        <div className="results-container component-fadeIn">
          <div className="bread-crumbs">
            {breadCrumbs?.length > 0 && (
              <div>
                <SmallCloseIcon
                  className="bread-crumbs-delete-icon"
                  onClick={() => removeFilter("category")}
                />
                {React.Children.toArray(
                  breadCrumbs.map((c, index) => (
                    <span
                      key={c.id}
                      onClick={() =>
                        addFilter({ filter: "category", value: c.id })
                      }
                    >
                      {(index > 0 ? " > " : "") + c.name}
                    </span>
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
                        <b>{f.name}</b>
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
              {productsFound !== "loading" &&
              (productsFound?.length > 0 || productsOwn?.length > 0) ? (
                <div>
                  {productsOwn?.length > 0 && (
                    <div className="own-products-container">
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
                    </div>
                  )}
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
                </div>
              ) : (
                <div>
                  {productsFound === "loading" ? (
                    <Spinner className="cho-svg" />
                  ) : (
                    <h1>No results</h1>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
