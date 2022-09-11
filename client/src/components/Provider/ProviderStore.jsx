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
  const [countdown, setCountdown] = useState("");
  const [products, setProducts] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hover, setHover] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const { wishlist } = useSelector((state) => state.cartReducer);


    const handleWindowWidth = () => {
        setWindowWidth(window.innerWidth);
    };

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

    window.addEventListener("resize", handleWindowWidth);

    (async () => {
      const { data } = await axios("/sales");
      setProducts(data);
      setLoading(false);
    })();

    return () => {
        clearInterval(countdownInterv);
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

        <div className="providerstore-flashsales">
          <h2>Flash sales! ⏱ {countdown}</h2>
          <div className="providerstore-flashsales-container">
            {Array.from(Array(5).keys()).map((_, index) => (
              <MiniCard
                key={`specials ${index}`}
                img={products[index]?.thumbnail}
                name={products[index]?.name}
                price={products[index]?.price}
                premium={products[index]?.premium}
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
