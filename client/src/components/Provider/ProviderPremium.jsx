import axios from "axios";
import React, { useState, useEffect } from "react";
import Footer from "../common/Footer";
import LoaderBars from "../common/LoaderBars";
import PremiumCard from "./PremiumCard";
import "./ProviderPremium.css";

const ProviderPremium = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    (async () => {
      const { data } = await axios("/product/premium");
      data && setProducts(data);

      setLoading(false);
    })();
    window.addEventListener("resize", handleWindowWidth);

    return () => window.removeEventListener("resize", handleWindowWidth);
  }, []);

  return (
    <div className="providerstore-container">
      {windowWidth >= 1024 && (
        <>
          <div className="providerstore-echo-inner">
            <span>PROVIDER</span>
            <br />
            PROVIDER <br />
            PROVIDER
          </div>
          <span className="providerstore-title">PREMIUM</span>
          <span className="providerstore-title-text">
            /DELUXE
            <br />
            /UNICOS
            <br />
            /TUYOS
          </span>
        </>
      )}
      {windowWidth < 1023 && (
        <>
          <span className="providerstore-title-mobile">PROVIDER</span>
          <span className="providerstore-title-text-mobile">
            /DELUXE
            <br />
            /UNICOS
            <br />
            /TUYOS
          </span>
          <div className="providerpremium-echo-inner-mobile">
            <span>PREMIUM</span>
            <br />
            PREMIUM <br />
            PREMIUM
          </div>
        </>
      )}

      <div className="providerpremium-header"></div>

      <div className="providerpremium-background"></div>

      <div className="providerpremium-cardscontainer">
        {loading || !products ? (
          <LoaderBars />
        ) : (
          React.Children.toArray(
            products.map((e, index) => (
              <PremiumCard
                productData={e}
                direction={index % 2 === 0 ? true : false}
              />
            ))
          )
        )}

        <Footer />
      </div>
    </div>
  );
};

export default ProviderPremium;
