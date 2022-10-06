import axios from "axios";
import React, { useEffect, useState } from "react";
import MiniCard from "../Products/MiniCard";
import { useSelector } from "react-redux";
import CountDown from "./CountDown";

import "./FlashSales.css";

const FlashSales = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState(false);
  const { wishlist } = useSelector((state) => state.cartReducer);

  useEffect(() => {
    (async () => {
      const { data } = await axios("/sales");
      if (data) {
        setProducts(data);
        setLoading(false);
      }
    })();
  }, []);

  return !loading && !products ? (
    <></>
  ) : (
    <div className="flashsales-outter">
      <div className="flashsales-container">
        <div className="flashsales-header">
          <div></div>
          <p>Flash Sales</p>
          <span className="bolt-container">
            <span className="bolt-svg"></span>
          </span>
          <CountDown />
          <div></div>
        </div>

        {loading ? (
          <div className="flashsales-products-inner">
            <MiniCard loading={true} />
            <MiniCard loading={true} />
            <MiniCard loading={true} />
            <MiniCard loading={true} />
            <MiniCard loading={true} />
            <MiniCard loading={true} />
          </div>
        ) : (
          products && (
            <div className="flashsales-products-container">
              <div className="flashsales-products-inner">
                {React.Children.toArray(
                  products.map((e) => (
                    <MiniCard
                      productData={e}
                      fav={wishlist.includes(e?._id)}
                      loading={false}
                    />
                  ))
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default FlashSales;
