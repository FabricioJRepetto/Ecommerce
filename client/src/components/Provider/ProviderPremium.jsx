import axios from "axios";
import React, { useState, useEffect } from "react";
import Footer from "../common/Footer";
import LoaderBars from "../common/LoaderBars";
import PremiumCard from "./PremiumCard";
import "./ProviderPremium.css";

const ProviderPremium = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState(false);
  const [scrollP, setScrollP] = useState(0)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
    const scrollPercent = () => { 
        let scrollTop = window.scrollY;
        let docHeight = document.body.offsetHeight;
        let winHeight = window.innerHeight;
        let scrollPercent = scrollTop / (docHeight - winHeight);
        let scrollPercentRounded = Math.round(scrollPercent * 100);
        setScrollP(scrollPercentRounded);
        console.log(scrollTop);
        console.log(docHeight);
        console.log(winHeight);
    }

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
    window.addEventListener("scroll", scrollPercent);

    return () => {
        window.removeEventListener("resize", handleWindowWidth);
        window.removeEventListener("scroll", scrollPercent);
    }
  }, []);

//???????????????????????????????????
    console.log(windowWidth);
    const displayMaker = (divisor, mode) => {
        let num = mode === 'column' ? windowWidth / divisor : (windowWidth / divisor) * (windowWidth < 1024 ? 0.535 : 0.285)
        let aux = Array.from(Array(Math.ceil(num)).keys()).map(() => ' 15px')
        console.log(mode+aux.length);
        return "".concat(aux)
     }
    const displayFiller = (param) => {
        let amount = param || Math.ceil(windowWidth / 16) * Math.ceil((windowWidth / 16) * (windowWidth < 1024 ? 0.535 : 0.285));
        console.log('area: '+amount);
        let aux = Array.from(Array(amount).keys()).map(() => '· ' )
        return aux
     }
    let extraStyle = {
        display: 'grid',
        gridTemplateColumns: displayMaker(15, 'column'),
        gridTemplateRows: displayMaker(15, 'r'),
    }
//????????????????????????????????????

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
          <span className={`providerstore-title ${scrollP > 12 && 'invisible'}`}>PREMIUM</span>
          <span className={`providerstore-title-text ${scrollP > 12 && 'invisible'}`}>
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
          <span className={`providerstore-title-mobile ${scrollP > 20 && 'invisible'}`}>PROVIDER</span>
          <span className={`providerstore-title-text-mobile ${scrollP > 20 && 'invisible'}`}>
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
        
      <div className="providerpremium-header" style={extraStyle}>{displayFiller()}</div>
     
      <div className="providerstore-background"></div>

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
