import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loadApplied,
  loadFilters,
  loadProductsFound,
  loadProductsOwn,
  loadQuerys,
} from "../../Redux/reducer/productsSlice";
import { PowerGlitch } from "powerglitch";
import Carousel from "./Carousel/Carousel";
import { IMAGES } from "../../constants";
import FlashSales from "../common/FlashSales";
import PremiumPreview from "../Provider/PremiumPreview";
import Suggestions from "../common/Suggestions";
import CategoryCard from "../Provider/CategoryCard";

import "./Home.css";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const categorySearch = (category) => {
    dispatch(loadProductsOwn("loading"));
    dispatch(loadProductsFound("loading"));
    dispatch(loadFilters("loading"));
    dispatch(loadApplied("loading"));

    navigate("/results");
    dispatch(loadQuerys({ category }));
  };

  useEffect(() => {
    const buttons = document.getElementsByName("ps-button-hover");
    buttons.forEach((b) =>
      PowerGlitch.glitch(b, {
        imageUrl:
          "https://res.cloudinary.com/dsyjj0sch/image/upload/v1663602148/glitch-03_cplipt.png",
        backgroundColor: "transparent",
        hideOverflow: false,
        timing: {
          duration: 3000,
          iterations: "Infinity",
        },
        glitchTimeSpan: {
          start: 0,
          end: 1,
        },
        shake: {
          velocity: 50,
          amplitudeX: 0.7,
          amplitudeY: 0.7,
        },
        slice: {
          count: 18,
          velocity: 15,
          minHeight: 0.03,
          maxHeight: 0.15,
          hueRotate: true,
        },
      })
    );
    // eslint-disable-next-line
  }, []);

  return (
    <div className="home-container component-fadeIn">
      <div className="home-carousel">
        <Carousel
          images={IMAGES}
          controls
          indicators
          pointer
          id="mainCarousel"
          width="100%"
        />
      </div>

    <div className="storecards-container">
      <div className="storecards-inner">
          <CategoryCard
            text="COMPUTACIÓN"
            image="https://res.cloudinary.com/dsyjj0sch/image/upload/v1663598262/computacion_iczryv.png"
            route="MLA1648"
            onClick={() => categorySearch("MLA1648")}
            hover
          />
          <CategoryCard
            text="VIDEOJUEGOS"
            image="https://res.cloudinary.com/dsyjj0sch/image/upload/v1663598262/videojuegos2_hvufj4.png"
            route="MLA1144"
            onClick={() => categorySearch("MLA1144")}
            hover
          />
          <CategoryCard
            text="AUDIO"
            image="https://res.cloudinary.com/dsyjj0sch/image/upload/v1663598262/audio_bbrp2m.png"
            route="MLA409810"
            onClick={() => categorySearch("MLA1000")}
            hover
          />
          <CategoryCard
            text="CÁMARAS"
            image="https://res.cloudinary.com/dsyjj0sch/image/upload/v1663598262/camara_epkefy.png"
            route="MLA1039"
            onClick={() => categorySearch("MLA1039")}
            hover
          />
        </div>      
    </div>

    <div className="providerstore-banner"
        onClick={() => navigate("/products")}>
        <h1>||||||PROVIDER</h1>
        <h2>VER TODOS LOS PRODUCTOS ORIGINALES</h2>
        <div className="providerstore-banner-hover-div hover-2"></div>
        <div className="providerstore-banner-hover-div">
            <h2 className="providerstore-banner-hover-h2">ORIGINALES</h2>
        </div>
        <video id="ps-header-bg-video" autoPlay loop muted>
            <source
            src={
                "https://res.cloudinary.com/dsyjj0sch/video/upload/v1664729307/videos/STORE_croped_mini_juipok.mp4"
            }
            type="video/mp4"
            />
        </video>
    </div>

      <FlashSales />

      <div className="sales-seer">          
         <h2>¿Te sientes con suerte?</h2>
          <div className="ps-button-container">
            <div name="ps-button-hover" id="ps-button02"></div>
            <button
              className="g-white-button"
              onClick={() => navigate("/sales")}
            >
              BUSCADOR DE OFERTAS
            </button>
          </div>
        </div>

      <Suggestions />

      <div className="providerpremium-banner"
            onClick={()=>navigate('/premium')}>
          <div>
            <h2 className="premium-banner-special-text">PROVIDER</h2>
            <img
              src="https://res.cloudinary.com/dsyjj0sch/image/upload/v1663041222/premium-02_ymsk9h.png"
              alt=""
            />
            <p>
              Pasamos cientos de horas diseñando, probando y perfeccionando cada
              producto especialmente para ti. <br/>Si lo que buscas es algo único... <span className="provider-text">Provider Premium</span>.
            </p>
          </div>
        </div>

      <PremiumPreview />

    </div>
  );
};

export default Home;
