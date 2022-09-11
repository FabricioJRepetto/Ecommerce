import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resizer } from "../../helpers/resizer";
import { loadQuerys } from "../../Redux/reducer/productsSlice";
import Footer from "../common/Footer";
import Carousel from "../Home/Carousel/Carousel";
import MiniCard from "../Products/MiniCard";
import { SmallAddIcon } from "@chakra-ui/icons";

import "./ProviderStore.css";
import FlashSales from "../common/FlashSales";

const ProviderStore = () => {
  const images = [
    {
      img: "https://res.cloudinary.com/dsyjj0sch/image/upload/v1661287509/9750_16688_wz1frg.jpg",
      url: "",
    },
    {
      img: "https://res.cloudinary.com/dsyjj0sch/image/upload/v1661287509/8322_15233_xanjft.jpg",
      url: "",
    },
    {
      img: "https://res.cloudinary.com/dsyjj0sch/image/upload/v1661290053/9679_16615_q7wl6f.jpg",
      url: "",
    },
    {
      img: "https://res.cloudinary.com/dsyjj0sch/image/upload/v1661287509/8552_15488_r0hefx.jpg",
      url: "",
    },
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const handleWindowWidth = () => {
        setWindowWidth(window.innerWidth);
    };

  useEffect(() => {
    window.addEventListener("resize", handleWindowWidth);

    return () => {        
        window.removeEventListener("resize", handleWindowWidth);
    }
    // eslint-disable-next-line
  }, []);

  const goProducts = (code) => {
    dispatch(loadQuerys({ category: code }));
    navigate(`/results/?category=${code}`);
  };

  return (
    <div className="providerstore-container">
        { windowWidth >= 1024 && 
        <>
            <div className='providerstore-echo-inner'>
                <span>PROVIDER</span><br/>
                    PROVIDER <br/>
                    PROVIDER 
            </div>
            <span className='providerstore-title'>STORE</span>
            <span className='providerstore-title-text'>/ORIGINALES<br/>/EXCLUSIVOS<br/>/TUYOS</span>
        </>}
        { windowWidth < 1023 && 
        <>
            <span className='providerstore-title-mobile'>PROVIER</span>
            <span className='providerstore-title-text-mobile'>/DELUXE<br/>/UNICOS<br/>/TUYOS</span>
            <div className='providerstore-echo-inner-mobile'>
                <span>STORE</span><br/>
                    STORE <br/>
                    STORE 
            </div>
        </>}

      <button
        className="providerstore-title-button g-white-button"
        onClick={() => navigate("/products")}
      >
        <SmallAddIcon className="button-addicon"/>VER TODOS
      </button>

      <div className="providerstore-header"></div>

      <div className="providerstore-background"></div>

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

        <div className="providerstore-premiumbrand"></div>

        <div className="store-premium">
          <Carousel
            images={images}
            pausable
            pointer
            indicators
            width="40vw"
            height="100%"
          />
          <div className="store-premium-text">
            <div>
              <h1>Provider Premium</h1>
              <p>
                Una selección exclusiva de los mejores productos original
                Provider store.
              </p>
            </div>
            <button
              className="g-white-button"
              onClick={() => navigate("/premium")}
            >
              Ver los productos Premium
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProviderStore;
