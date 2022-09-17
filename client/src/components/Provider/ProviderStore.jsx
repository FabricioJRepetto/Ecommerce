import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resizer } from "../../helpers/resizer";
import { loadQuerys } from "../../Redux/reducer/productsSlice";
import Footer from "../common/Footer";
import { SmallAddIcon } from "@chakra-ui/icons";

import "./ProviderStore.css";
import FlashSales from "../common/FlashSales";
import PremiumPreview from "./PremiumPreview";

const ProviderStore = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [scrollP, setScrollP] = useState(0)

  const handleWindowWidth = () => {
    setWindowWidth(window.innerWidth)
  };
  
    const scrollPercent = () => { 
        let scrollTop = window.scrollY;
        let docHeight = document.body.offsetHeight;
        let winHeight = window.innerHeight;
        let scrollPercent = scrollTop / (docHeight - winHeight);
        let scrollPercentRounded = Math.round(scrollPercent * 100);
        setScrollP(scrollPercentRounded);
    }

  useEffect(() => {
    window.addEventListener("resize", handleWindowWidth);
    window.addEventListener("scroll", scrollPercent);

    return () => {
        window.removeEventListener("resize", handleWindowWidth);
        window.removeEventListener("scroll", scrollPercent);
    }
    // eslint-disable-next-line
  }, []);

  const goProducts = (code) => {
    dispatch(loadQuerys({ category: code }));
    navigate(`/results/?category=${code}`);
  };

  return (
    <div className="providerstore-container">

      <div className="providerstore-header-desktop">
            <div className="providerstore-echo-inner">
                <span>PROVIDER</span>
                <br />
                PROVIDER <br />
                PROVIDER
            </div>
            
            <div className="pro-sticky">
                <div className='providerstore-title'>
                    <div>
                        <span className="provider-store-title">STORE</span>                        
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

            <div className="providerstore-echo-inner-mobile">
                <span>STORE</span>
                <br />
                STORE <br />
                STORE
            </div>
        </div>

      <div className="providerstore-header">
        <video id="ps-header-bg-video" autoPlay loop muted>
            <source src={'https://res.cloudinary.com/dsyjj0sch/video/upload/v1663453572/videos/production_ID_4990245_gcrvm2.mp4'} type="video/mp4"/>
        </video>
      </div>

      <div className="storecards-container">
        <div className="storecards-inner">

          <div className='storecard'
            onClick={() => goProducts(`MLA1144`)}>
            <p>Consolas</p>            
            <img src={resizer("https://res.cloudinary.com/dsyjj0sch/image/upload/v1661328214/Playdate-photo_hxdnpj.png",200)} alt="img" />
          </div>

          <div className="storecard"
            onClick={() => goProducts(`MLA1648`)}>
            <p>Computación</p>            
            <img src={resizer("https://res.cloudinary.com/dsyjj0sch/image/upload/v1661328896/RW-ZENITH-01.2020_1400x_j4iupn.webp", 200)} alt="img" />
          </div>

          <div className="storecard"
            onClick={() => goProducts(`MLA409810`)}>
            <p>Audio</p>
            <img src="https://res.cloudinary.com/dsyjj0sch/image/upload/v1662349264/5165_12022_0002_5169_12026132_dmpole.png" alt="img" />
          </div>

          <div className="storecard" 
            onClick={() => navigate("/products")}>
            <p>Todos</p>            
            <img src="https://res.cloudinary.com/dsyjj0sch/image/upload/v1659650791/PROVIDER_LOGO_glitch_aberration_kt2hyv.png" alt="img" style={{height: '50%', width: 'auto'}}/>
          </div>

        </div>

        <FlashSales/>

        <div className="providerstore-premiumbrand">
            <div>
                <h2>provider</h2>
                <img src="https://res.cloudinary.com/dsyjj0sch/image/upload/v1663041222/premium-02_ymsk9h.png" alt="" />
                <p>Pasamos cientos de horas diseñando, probando y perfeccionando cada producto Premium en nuestra sede de Atalaya City. Pero nuestros ingenieros no son los típicos técnicos corporativos que usan batas de laboratorio. Son personas con las mejores ideas para mejorar sus propios hobbies. Viven para la aventura. Y saben lo que es trabajar sobre la marcha. Probablemente muy parecido a ti.</p>
            </div>
        </div>

        <PremiumPreview />

      </div>

      <Footer />
    </div>
  );
};

export default ProviderStore;
