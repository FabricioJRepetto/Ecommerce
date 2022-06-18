import React, { useState, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  filterProducts,
  loadProductsFound,
} from "../../Redux/reducer/productsSlice";

const Products = () => {
  const [pricesFilter, setPricesFilter] = useState({
    min: "300",
    max: "500",
  });
  const [shippingFilter, setShippingFilter] = useState(false);

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

  const filterShipping = ({ target }) => {
    setShippingFilter(!shippingFilter);
    dispatch(
      filterProducts({
        source: "productsFound",
        type: "free_shipping",
        value: !shippingFilter,
      })
    );
  };

  const [brandsFilter, setBrandsFilter] = useState([]);
  const filterBrand = (brand) => {
    dispatch(
      filterProducts({
        source: "productsFound",
        type: "brand",
        value: brand,
      })
    );
  };

  return (
    <>
      <hr />
      <h2>PRODUCTS</h2>
      <>
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
      </>
      <h3>BRANDS</h3>
      <>
        {React.Children.toArray(
          brands.current?.map((brand) => (
            // <button onClick={() => filterBrand(brand)}>{brand}</button>
            <label>
              <input type="checkbox" name={brand} />
              {brand}
            </label>
          ))
        )}
        {brands.current && (
          <button onClick={() => filterBrand(null)}>Clear</button>
        )}
        <br />
        <hr />
        <br />
      </>
      <h3>PRICES</h3>
      <>
        <form onSubmit={filterPrices}>
          <input
            type="text"
            pattern="[0-9]*"
            placeholder="min"
            name="min"
            onChange={handlePrices}
            value={pricesFilter.min}
          />
          <input
            type="text"
            pattern="[0-9]*"
            placeholder="max"
            name="max"
            onChange={handlePrices}
            value={pricesFilter.max}
          />
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
        free shipping
      </label>
    </>
  );
};

export default Products;
