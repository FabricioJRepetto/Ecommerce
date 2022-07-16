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
import Card from "./Card";
import { ReactComponent as Spinner } from "../../assets/svg/spinner.svg";

import "./Results.css";

const Results = () => {
  const wishlist = useSelector((state) => state.cartReducer.wishlist);
  const querys = useSelector((state) => state.productsReducer.searchQuerys);
  const productsOwn = useSelector((state) => state.productsReducer.productsOwn);
  const productsFound = useSelector(
    (state) => state.productsReducer.productsFound
  );
  const applied = useSelector(
    (state) => state.productsReducer.productsAppliedFilters
  );
  const productsFilters = useSelector(
    (state) => state.productsReducer.productsFilters
  );
  const breadCrumbs = useSelector((state) => state.productsReducer.breadCrumbs);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      let newQuery = "";
      Object.entries(querys).forEach(([key, value]) => {
        newQuery += key + "=" + value + "&";
      });

      const { data } = await axios(`/product/search/?${newQuery}`);
      dispatch(loadProductsOwn(data.db));
      dispatch(loadProductsFound(data.meli));
      dispatch(loadFilters(data.filters));
      dispatch(loadApplied(data.applied));
      dispatch(loadBreadCrumbs(data.breadCrumbs));
    })();
    // eslint-disable-next-line
  }, [querys]);

  console.log(productsOwn);

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
      <div className="results-filters">
        <h2>Filtros</h2>
        <div>
          <b>filtros aplicados</b>
          {applied.length > 0 &&
            React.Children.toArray(
              applied.map((f) => (
                <div onClick={() => removeFilter(f.id)}>{f.values[0].name}</div>
              ))
            )}
        </div>
        <hr />
        {productsFilters !== "loading" &&
          productsFilters.length > 0 &&
          React.Children.toArray(
            productsFilters?.map((f) => (
              <div key={f.id}>
                <b>{f.name}</b>
                {f.values.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => addFilter({ filter: f.id, value: v.id })}
                  >
                    <p>{`${v.name} (${v.results})`}</p>
                  </div>
                ))}
              </div>
            ))
          )}
      </div>

      <div className="results-inner">
        <h2>Results</h2>
        {/* BREAD CRUMBS */}
        <div>
          {breadCrumbs?.length > 0 &&
            React.Children.toArray(
              breadCrumbs.map((c) => (
                <span
                  key={c.id}
                  onClick={() => addFilter({ filter: "category", value: c.id })}
                >
                  {c.name + " > "}
                </span>
              ))
            )}
        </div>

        {productsFound !== "loading" &&
        (productsFound.length > 0 || productsOwn.length > 0) ? (
          <div>
            <div className="own-products-container">
              {productsOwn.length > 0 &&
                React.Children.toArray(
                  productsOwn?.map((product) => (
                    <Card
                      productData={product}
                      fav={wishlist.includes(product._id)}
                    />
                  ))
                )}
            </div>
            <br />
            {React.Children.toArray(
              productsFound?.map((product) => (
                <Card
                  productData={product}
                  fav={wishlist.includes(product._id)}
                />
              ))
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
  );
};

export default Results;
