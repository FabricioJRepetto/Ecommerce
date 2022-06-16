import React, { useState, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  filterProducts,
  loadProductsFound,
} from "../../Redux/reducer/productsSlice";

const Products = () => {
  // const [products, setProducts] = useState(null);
  const [pricesFilter, setPricesFilter] = useState({
    min: "300",
    max: "3000",
  });
  const brands = useRef();
  const dispatch = useDispatch();
  const { productsFound, productsFiltered } = useSelector(
    (state) => state.productsReducer
  );

  let productsToShow;
  productsFiltered.length === 0
    ? (productsToShow = productsFound)
    : (productsToShow = productsFiltered);

  const getProducts = () => {
    axios.get("/product").then((res) => {
      dispatch(loadProductsFound(res.data));
      //     setProducts(res.data);
      brands.current = [];
      for (const product of res.data) {
        !brands.current.includes(product.brand) &&
          product.brand &&
          brands.current.push(product.brand);
      }
    });
  };

  const addToCart = (id) => {
    axios.post(`/cart/${id}`).then((res) => {
      console.log(res.data);
    });
  };

  const handleFilter = (brand) => {
    dispatch(
      filterProducts({
        source: "productsFound",
        type: "brand",
        value: brand,
      })
    );
  };

  const filterPrices = (e) => {
    e.preventDefault();
    console.log("entra?");
    dispatch(
      filterProducts({
        source: "productsFound",
        type: "price",
        value: `${pricesFilter.min}-${pricesFilter.max}`,
      })
    );
  };

  const handleChange = ({ target }) => {
    setPricesFilter({
      ...pricesFilter,
      [target.name]: [target.value],
    });
  };

  return (
    <>
      <hr />
      <h2>PRODUCTS</h2>
      <button onClick={getProducts}>GET ALL PRODUCTS</button>
      {React.Children.toArray(
        productsToShow?.map((prod) => (
          <div>
            {prod.name} - ${prod.price}
            {"    "}
            <button onClick={() => addToCart(prod._id)}>Add to cart</button>
          </div>
        ))
      )}
      <br />
      <hr />
      <br />
      <h3>BRANDS</h3>
      {React.Children.toArray(
        brands.current?.map((brand) => (
          <button onClick={() => handleFilter(brand)}>{brand}</button>
        ))
      )}
      {brands.current && (
        <button onClick={() => handleFilter(null)}>Clear</button>
      )}
      <br />
      <hr />
      <br />
      <h3>PRICES</h3>
      <form onSubmit={filterPrices}>
        <input
          type="number"
          placeholder="min"
          name="min"
          onChange={handleChange}
          value={pricesFilter.min}
        />
        <input
          type="number"
          placeholder="max"
          name="max"
          onChange={handleChange}
          value={pricesFilter.max}
        />
        <input type="submit" value="filter" />
      </form>
    </>
  );
};

export default Products;
