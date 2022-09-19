import axios from "axios";
import React, { useState, useEffect } from "react";
import { useRef } from "react";
import Footer from "../common/Footer";
import LoaderBars from "../common/LoaderBars";
import PremiumCard from "./PremiumCard";

import "./ProviderPremium.css";

const ProviderPremium = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  const reference = useRef(null)
  const reference2 = useRef(null)
  const [echoText, setEchoText] = useState('PROVIDER')
  const [change, setChange] = useState(true)
  const [change2, setChange2] = useState(true)

  const handleWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  };

    useEffect(() => {
        const observer1 = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                    if (entry.isIntersecting) {
                        setChange(true)
                        setEchoText('PROVIDER')
                    } else {
                        setChange(false)
                        setEchoText('PREMIUM')
                    }                    
                },
            {
                root: null,
                rootMargin: "0px",
                threshold: 1.0,
            }
        );
        if (reference.current) observer1.observe(reference.current);

        const observer2 = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                    if (entry.isIntersecting) {
                        setChange2(true)
                    } else {
                        setChange2(false)
                    }                    
                },
            {
                root: null,
                rootMargin: "0px",
                threshold: 1.0,
            }
        );
        if (reference.current) observer2.observe(reference2.current);

        return () => {
        // eslint-disable-next-line
        if (reference.current) observer1.unobserve(reference.current);
        // eslint-disable-next-line
        if (reference2.current) observer2.unobserve(reference2.current);
        };
        // eslint-disable-next-line
    }, [reference, loading]);

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
            <div className={`providerpremium-echo-inner ${change ? 'spt-textb' : 'spt-text'}`} 
                style={{color: change ? '#fff' : '#202020'}}>
                <span>{echoText}</span>
                <br />
                {echoText} <br />
                {echoText}
            </div>            
           
            <div className='providerpremium-title'>
                <div className="provider-premium-title">
                    <p ref={reference}>PREMIUM</p>
                    <p className='providerpremium-title-text'>
                        /DELUXE /UNICOS /TUYOS
                    </p>
                </div>
            </div>
        </div>
        

        <div className="providerstore-header-mobile">
            <div className='providerpremium-title-mobile'>                    
                <span ref={reference2}>PROVIDER</span>                                   
            </div> 

            <div className={`providerpremium-title-text-mobile`}>
                DELUXE UNICOS TUYOS
            </div>
            
            {/* <span className="providerpremium-echo-head-mobile">PREMIUM</span> */}

            <div className="providerpremium-echo-inner-mobile">
                <span style={{color: change2 ? '#FFFFFF' : '#202020'}}>PREMIUM</span>
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
