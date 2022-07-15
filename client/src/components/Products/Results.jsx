import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "./Card";
import { ReactComponent as Spinner } from "../../assets/svg/spinner.svg";

import "./Results.css";
import {
  loadFilters,
  loadProductsFound,
  loadProductsOwn,
  loadQuerys,
} from "../../Redux/reducer/productsSlice";
import { useState } from "react";
import axios from "axios";

const Results = () => {
  const wishlist = useSelector((state) => state.cartReducer.wishlist);
  const productsOwn = useSelector((state) => state.productsReducer.productsOwn);
  const productsFound = useSelector(
    (state) => state.productsReducer.productsFound
  );
  const productsFilters = useSelector(
    (state) => state.productsReducer.productsFilters
  );

  const querys = useSelector((state) => state.productsReducer.searchQuerys);
  const [applied, setApplied] = useState({});

  const dispatch = useDispatch();

  console.log(productsOwn);
  console.log(productsFound);
  console.log(productsFilters);

  const addFilter = async (f) => {
    let string = f.split("#!");
    let name = string[0];
    let filter = string[1];

    //: remplazar categorias
    let newQuery = querys + filter;

    dispatch(loadQuerys(newQuery));

    const { data } = await axios(`/product/search/?q=${newQuery}`);
    dispatch(loadProductsOwn(data.db));
    dispatch(loadProductsFound(data.meli));
    dispatch(loadFilters(data.filters));

    console.log(`name: ${name}, filter: ${filter}`);
    console.log(newQuery);
  };

  return (
    <div className="results-container">
      <div className="results-filters">
        <h2>Filtros</h2>
        <b>filtros aplicados</b>
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
                    onClick={() => addFilter(`${v.name}#!&${f.id}=${v.id}`)}
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
        {productsFound !== "loading" && productsFound.length > 0 ? (
          <div>
            <div className="own-products-container">
              {productsOwn.length > 0 &&
                React.Children.toArray(
                  productsOwn?.map((prod) => (
                    <Card
                      img={prod.thumbnail}
                      name={prod.name}
                      price={prod.price}
                      sale_price={prod.sale_price}
                      discount={prod.discount}
                      brand={prod.brand}
                      prodId={prod._id}
                      free_shipping={prod.free_shipping}
                      fav={wishlist.includes(prod._id)}
                      on_sale={prod.on_sale}
                    />
                  ))
                )}
            </div>
            <br />
            {React.Children.toArray(
              productsFound?.map((prod) => (
                <Card
                  img={prod.thumbnail}
                  name={prod.name}
                  price={prod.price}
                  sale_price={prod.sale_price}
                  discount={prod.discount}
                  brand={prod.brand}
                  prodId={prod._id}
                  free_shipping={prod.free_shipping}
                  fav={wishlist.includes(prod._id)}
                  on_sale={prod.on_sale}
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
