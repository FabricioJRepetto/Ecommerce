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

    return () => {
        window.removeEventListener("resize", handleWindowWidth);
    }
  }, []);
    
    const displayFiller = (prop) => {        
        let amount = prop || Math.ceil(windowWidth / 12) * Math.ceil((windowWidth / 12) * (windowWidth < 1024 ? 0.535 : 0.285));
        let aux = Array.from(Array(amount).keys()).map(() => '· ' )
        return aux
     }

  return (
    <div className="providerpremium-container">
      
        <div className="providerstore-header-desktop">
            <div className="providerstore-echo-inner">
                <span>PROVIDER</span>
                <br />
                PROVIDER <br />
                PROVIDER
            </div>
            
            <div className="pro-sticky">
            <div className='providerpremium-title'>
                <div>
                    <span className="provider-premium-title">
                        <p>PREMIUM</p>
                        <span className='providerstore-title-text'>
                            /DELUXE /UNICOS /TUYOS
                        </span>
                    </span>
                </div>
            </div>
            </div>
        </div>
        

        <div className="providerstore-header-mobile">
            <div className="pro-sticky">
                <div className='providerstore-title-mobile'>
                    <div>
                        <span>PROVIDER</span>                
                        <span className={`providerstore-title-text-mobile`}>
                            /DELUXE
                            <br />
                            /UNICOS
                            <br />
                            /TUYOS
                        </span>
                        
                    </div>
                </div>
            </div>

            <div className="providerpremium-echo-inner-mobile">
                <span>PREMIUM</span>
                <br />
                PREMIUM <br />
                PREMIUM
            </div>
        </div>
        
      <div className="providerpremium-header" >{displayFiller()}</div>

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
