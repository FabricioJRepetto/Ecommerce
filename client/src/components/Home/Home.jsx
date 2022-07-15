import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import MiniCard from "../Products/MiniCard";
import Carousel from "./Carousel/Carousel";
import { IMAGES } from "../../constants";
import Footer from "../common/Footer";
import "./Home.css";

import { ReactComponent as One } from "../../assets/svg/bloom-svgrepo-com.svg";
import { ReactComponent as Two } from "../../assets/svg/build-svgrepo-com.svg";
import { ReactComponent as Three } from "../../assets/svg/code-svgrepo-com.svg";
import { ReactComponent as Four } from "../../assets/svg/crop-svgrepo-com.svg";
import { ReactComponent as Five } from "../../assets/svg/explode-svgrepo-com.svg";
import { ReactComponent as Six } from "../../assets/svg/perform-svgrepo-com.svg";

const Home = () => {
  const [products, setProducts] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [loading, setLoading] = useState(true);
  const wishlist = useSelector((state) => state.cartReducer.wishlist);
  const session = useSelector((state) => state.sessionReducer.session);
  const [suggestion, setSuggestion] = useState(false);

  useEffect(() => {
    let countdownInterv = null;
    countdownInterv = setInterval(() => {
      let now = new Date();
      let h = 23 - now.getHours();
      let m = 59 - now.getMinutes();
      let s = 59 - now.getSeconds();
      setCountdown(
        `${h < 10 ? "0" + h : h}:${m < 10 ? "0" + m : m}:${
          s < 10 ? "0" + s : s
        }`
      );
    }, 100);

    (async () => {
      const data = await Promise.all([
        axios(`/sales/`),
        session && axios(`/history/suggestion`),
      ]);
      setProducts(data[0]?.data);
      setSuggestion(data[1]?.data || false);
      setLoading(false);
    })();

    return () => clearInterval(countdownInterv);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="home-container">
      <div>
        <Carousel images={IMAGES} controls indicators pointer width="100%" />
      </div>
      <div className="categories">
        <div>
          <One className={"svg"} />
          <p>Smartphones</p>
        </div>
        <div>
          <Two className={"svg"} />
          <p>Computers</p>
        </div>
        <div>
          <Three className={"svg"} />
          <p>Cameras</p>
        </div>
        <div>
          <Four className={"svg"} />
          <p>Audio & Video</p>
        </div>
        <div>
          <Five className={"svg"} />
          <p>Videogames</p>
        </div>
        <div>
          <Six className={"svg"} />
          <p>TVs</p>
        </div>
      </div>
      <div>
        <h2>Flash sales! ⏱ {countdown}</h2>
        <div className="random-container">
          {Array.from(Array(5).keys()).map((_, index) => (
            <MiniCard
              key={`specials ${index}`}
              img={products[index]?.thumbnail}
              name={products[index]?.name}
              price={products[index]?.price}
              sale_price={products[index]?.sale_price}
              discount={products[index]?.discount}
              prodId={products[index]?._id}
              free_shipping={products[index]?.free_shipping}
              on_sale={products[index]?.on_sale}
              fav={wishlist.includes(products[index]?._id)}
              loading={loading}
            />
          ))}
        </div>
      </div>
      <br />
      {suggestion.length > 4 && (
        <div>
          <h2>Quizás te interese...</h2>
          <div className="random-container">
            {Array.from(Array(5).keys()).map((_, index) => (
              <MiniCard
                key={`recom ${index}`}
                prodId={suggestion[index]?._id}
                name={suggestion[index]?.name}
                img={suggestion[index]?.thumbnail}
                price={suggestion[index]?.price}
                sale_price={suggestion[index]?.sale_price}
                discount={suggestion[index]?.discount}
                free_shipping={suggestion[index]?.free_shipping}
                on_sale={suggestion[index]?.on_sale}
                fav={wishlist.includes(suggestion[index]?._id)}
                loading={loading}
              />
            ))}
          </div>
        </div>
      )}
      <br />
      <Footer />
    </div>
  );
};

export default Home;
