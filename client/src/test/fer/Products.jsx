import React, { useState, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  filterProducts,
  loadProductsFound,
} from "../../Redux/reducer/productsSlice";
import { useEffect } from "react";
import { loadProducts, addCart } from "../../Redux/reducer/cartSlice";
import Card from "../../components/Products/Card";

const Products = () => {
    const [pricesFilter, setPricesFilter] = useState({
        min: "300",
        max: "500",
    });
    const [shippingFilter, setShippingFilter] = useState(false);
    const [brandsFilter, setBrandsFilter] = useState();

    const brands = useRef();
    const dispatch = useDispatch();
    const { productsFound, productsFiltered } = useSelector(
        (state) => state.productsReducer
    );
    const cart = useSelector((state) => state.cartReducer.main);
    const whishlist = useSelector((state) => state.cartReducer.whishlist);

useEffect(() => {
  getProducts();
  // eslint-disable-next-line
}, [])

  let productsToShow;
  productsFiltered.length === 0
    ? (productsToShow = productsFound)
    : (productsToShow = productsFiltered);

  const getProducts = () => {
    axios
      .get("/product")
      .then((res) => {
        dispatch(loadProductsFound(res.data));
        brands.current = [];
        let brandsCheckbox = {};
        for (const product of res.data) {
          !brands.current.includes(product.brand) &&
            product.brand &&
            brands.current.push(product.brand);
          brandsCheckbox[product.brand] = false;
        }
        setBrandsFilter(brandsCheckbox);
        brands.current.sort();
      })
      .catch((err) => console.log(err));
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
  /*   const filterBrand = (brand) => {
    dispatch(
      filterProducts({
        source: "productsFound",
        type: "brand",
        value: [brand, true],
      })
    );
  }; */

  return (
    <div className="products-container">

      <div className="products-results-container">
        <div className="products-results-inner">
            {React.Children.toArray(
            productsToShow?.map((prod) => (
                <Card
                    img={prod.images[0].imgURL}
                    name={prod.name}
                    price={prod.price}
                    brand={prod.brand}
                    prodId={prod._id}
                    free_shipping={prod.free_shipping}
                    fav={whishlist.includes(prod._id)}
                    on_sale={prod.on_sale}
                />
            )))}
        </div>
      </div>

        <div className="products-filters">
            <h3>BRANDS</h3>
            <div className="filter-brand-checkbox-container">
                {React.Children.toArray(
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
                )}
                {/* {brands.current && (
                <button onClick={() => filterBrand(null)}>Clear</button>
                )} */}
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
                free shipping
            </label>
        </div>

    </div>
  );
};

export default Products;
